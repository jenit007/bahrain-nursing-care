import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import express from "express";
import rateLimit from "express-rate-limit";
import { prisma } from "../db.js";
import {
  getSupabaseUrl,
  requireAdmin,
  signSupabaseSessionToken,
  verifySupabaseAccessToken,
} from "../middleware/auth.js";
import {
  createTemporarySignedDocumentUrl,
  readLocalPrivateDocument,
} from "../services/storage.js";

const router = express.Router();

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many authentication attempts. Please try again in 15 minutes.",
  },
});

const ALLOWED_BOOKING_STATUSES = new Set([
  "Pending Verification",
  "Verified",
  "Completed",
]);

const ALLOWED_JOB_STATUSES = new Set([
  "Application Received",
  "Under Review",
  "Approved",
  "Rejected",
]);

function validatePasswordStrength(password) {
  const pwd = String(password || "");
  if (pwd.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (!/[A-Z]/.test(pwd)) {
    return "Password must include at least one uppercase letter.";
  }
  if (!/[a-z]/.test(pwd)) {
    return "Password must include at least one lowercase letter.";
  }
  if (!/\d/.test(pwd)) {
    return "Password must include at least one number.";
  }
  if (!/[^A-Za-z0-9]/.test(pwd)) {
    return "Password must include at least one special character (e.g. !@#$%^&*).";
  }
  return null;
}

function formatAdminBooking(booking) {
  const patientDetails =
    booking.patientDetails && typeof booking.patientDetails === "object"
      ? booking.patientDetails
      : {};
  const address =
    booking.address && typeof booking.address === "object" ? booking.address : {};

  return {
    id: booking.bookingReference,
    dbId: booking.id,
    bookingReference: booking.bookingReference,
    name: booking.fullName,
    fullName: booking.fullName,
    email: booking.email || "",
    phone: booking.phone,
    service: booking.careType,
    careType: booking.careType,
    preferredDate: booking.preferredDate
      ? booking.preferredDate.toISOString().split("T")[0]
      : "",
    condition: patientDetails.condition || "",
    shift: patientDetails.shift || "",
    shiftOther: patientDetails.shiftOther || "",
    preferredTime: patientDetails.preferredTime || "",
    urgency: patientDetails.urgency || "Normal",
    patientDetails,
    address: {
      flatNo: address.flatNo || "",
      buildingNo: address.buildingNo || "",
      area: address.area || "",
      governorate: address.governorate || "Bahrain",
      country: address.country || "Bahrain",
    },
    notes: booking.additionalNotes || "",
    additionalNotes: booking.additionalNotes || "",
    status: booking.status,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    statusHistory: Array.isArray(booking.statusHistory)
      ? booking.statusHistory.map((h) => ({
          id: h.id,
          previousStatus: h.previousStatus,
          newStatus: h.newStatus,
          changedBy: h.changedBy,
          createdAt: h.createdAt.toISOString(),
        }))
      : undefined,
  };
}

function formatAdminJobApplication(app) {
  return {
    id: app.applicationReference,
    dbId: app.id,
    applicationReference: app.applicationReference,
    fullName: app.fullName,
    email: app.email,
    phone: app.phone,
    cprNo: app.cprNo || "",
    address: app.address,
    position: app.position,
    experience: app.experience,
    qualification: app.qualification,
    licenseNumber: app.licenseNumber || "",
    preferredShift: app.availability || "",
    availability: app.availability || "",
    message: app.message || "",
    hasCv: Boolean(app.cvPath),
    cvFileName: app.cvOriginalName || (app.cvPath ? "Applicant-CV.pdf" : null),
    hasCertificate: Boolean(app.certificatePath),
    certificateFileName: app.certificateName || null,
    status: app.status,
    submittedAt: app.createdAt.toISOString(),
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
  };
}

async function findBookingByIdentifier(identifier, includeHistory = false) {
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      identifier
    );

  return prisma.careBooking.findUnique({
    where: isUuid
      ? { id: identifier }
      : { bookingReference: identifier.toUpperCase() },
    include: includeHistory
      ? {
          statusHistory: {
            orderBy: { createdAt: "desc" },
          },
        }
      : undefined,
  });
}

async function findJobByIdentifier(identifier) {
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      identifier
    );

  return prisma.jobApplication.findUnique({
    where: isUuid
      ? { id: identifier }
      : { applicationReference: identifier.toUpperCase() },
  });
}

// ============================================================================
// 1. SUPABASE ADMIN SETUP, REGISTRATION, LOGIN & AUTHORIZATION ENDPOINTS
// ============================================================================

/**
 * GET /api/admin/auth/setup-status
 * Checks whether the initial administrator account has been created in `public.admins`.
 * Once the first admin exists (`count > 0`), `registrationAllowed` is permanently false.
 */
router.get("/auth/setup-status", async (_req, res, next) => {
  try {
    const adminCount = await prisma.admin.count();
    const requiresSetupKey = Boolean(
      (process.env.ADMIN_SETUP_KEY || "").trim()
    );

    return res.json({
      initialized: adminCount > 0,
      registrationAllowed: adminCount === 0,
      requiresSetupKey: adminCount === 0 && requiresSetupKey,
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/admin/auth/register-first-admin
 * Controlled first-admin provisioning endpoint:
 * - Strictly blocks registration with HTTP 403 if an admin account already exists (`count > 0`).
 * - Never trusts frontend role values (hardcodes `role = 'ADMIN'`, `isActive = true`).
 * - Provisions the user in Supabase Auth (`auth.users` & `auth.identities`) and links `auth.users.id`
 *   to `public.admins.auth_user_id`.
 */
router.post(
  "/auth/register-first-admin",
  authLimiter,
  async (req, res, next) => {
    try {
      const existingCount = await prisma.admin.count();
      if (existingCount > 0) {
        return res.status(403).json({
          error:
            "Initial administrator account has already been provisioned. Public admin registration is permanently disabled.",
        });
      }

      const configuredSetupKey = (process.env.ADMIN_SETUP_KEY || "").trim();
      if (configuredSetupKey) {
        const providedKey = String(req.body?.setupKey || "").trim();
        const expectedBuf = Buffer.from(configuredSetupKey, "utf8");
        const providedBuf = Buffer.from(providedKey, "utf8");
        if (
          expectedBuf.length !== providedBuf.length ||
          !crypto.timingSafeEqual(expectedBuf, providedBuf)
        ) {
          return res.status(403).json({
            error: "Invalid administrator setup key.",
          });
        }
      }

      const fullName = String(
        req.body?.fullName || "NOOR AL AFIYA Administrator"
      ).trim();
      const email = String(req.body?.email || "")
        .trim()
        .toLowerCase();
      const password = String(req.body?.password || "");
      const confirmPassword = String(req.body?.confirmPassword || "");

      if (!fullName || fullName.length < 2) {
        return res
          .status(400)
          .json({ error: "Please enter the administrator's full name." });
      }
      if (!email || !EMAIL_REGEX.test(email)) {
        return res
          .status(400)
          .json({ error: "Please enter a valid administrator email address." });
      }
      const passwordError = validatePasswordStrength(password);
      if (passwordError) {
        return res.status(400).json({ error: passwordError });
      }
      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ error: "Passwords do not match. Please confirm your password." });
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      // Optional: if the frontend already signed up via supabase.auth.signUp and passed an accessToken, verify it
      let verifiedClientAuthUserId = null;
      if (req.body?.accessToken) {
        const verified = await verifySupabaseAccessToken(
          String(req.body.accessToken)
        );
        if (
          verified.authenticated &&
          verified.user?.id &&
          verified.user?.email?.toLowerCase() === email
        ) {
          verifiedClientAuthUserId = verified.user.id;
        }
      }

      const supabaseUrl = getSupabaseUrl();
      const serviceRoleKey = (
        process.env.SUPABASE_SERVICE_ROLE_KEY || ""
      ).trim();

      let createdAdmin = null;

      await prisma.$transaction(async (tx) => {
        const countInTx = await tx.admin.count();
        if (countInTx > 0) {
          const conflictErr = new Error(
            "Initial administrator account has already been provisioned. Public admin registration is permanently disabled."
          );
          conflictErr.statusCode = 403;
          throw conflictErr;
        }

        let authUserId = verifiedClientAuthUserId;

        if (!authUserId) {
          const existingAuthRows = await tx.$queryRaw`
            SELECT id, email
            FROM auth.users
            WHERE LOWER(email) = ${email}
            LIMIT 1
          `;

          if (Array.isArray(existingAuthRows) && existingAuthRows.length > 0) {
            authUserId = existingAuthRows[0].id;
            await tx.$executeRaw`
              UPDATE auth.users
              SET encrypted_password = ${encryptedPassword},
                  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
                  updated_at = NOW()
              WHERE id = ${authUserId}::uuid
            `;
          } else if (
            supabaseUrl &&
            serviceRoleKey &&
            !serviceRoleKey.includes("your-supabase-")
          ) {
            const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
              auth: { persistSession: false, autoRefreshToken: false },
            });
            const { data, error } = await supabaseAdmin.auth.admin.createUser({
              email,
              password,
              email_confirm: true,
              user_metadata: { full_name: fullName },
            });
            if (error || !data?.user?.id) {
              throw new Error(
                error?.message || "Failed to create Supabase Auth user."
              );
            }
            authUserId = data.user.id;
          } else {
            const newUserId = crypto.randomUUID();
            const rawAppMeta = JSON.stringify({
              provider: "email",
              providers: ["email"],
            });
            const rawUserMeta = JSON.stringify({
              sub: newUserId,
              email,
              full_name: fullName,
              email_verified: true,
              phone_verified: false,
            });
            const identityData = JSON.stringify({
              sub: newUserId,
              email,
              email_verified: true,
              phone_verified: false,
            });

            await tx.$executeRaw`
              INSERT INTO auth.users (
                instance_id,
                id,
                aud,
                role,
                email,
                encrypted_password,
                email_confirmed_at,
                raw_app_meta_data,
                raw_user_meta_data,
                created_at,
                updated_at,
                confirmation_token,
                email_change,
                email_change_token_new,
                recovery_token
              ) VALUES (
                '00000000-0000-0000-0000-000000000000'::uuid,
                ${newUserId}::uuid,
                'authenticated',
                'authenticated',
                ${email},
                ${encryptedPassword},
                NOW(),
                ${rawAppMeta}::jsonb,
                ${rawUserMeta}::jsonb,
                NOW(),
                NOW(),
                '',
                '',
                '',
                ''
              )
            `;

            await tx.$executeRaw`
              INSERT INTO auth.identities (
                id,
                user_id,
                identity_data,
                provider,
                provider_id,
                last_sign_in_at,
                created_at,
                updated_at
              ) VALUES (
                gen_random_uuid(),
                ${newUserId}::uuid,
                ${identityData}::jsonb,
                'email',
                ${newUserId},
                NOW(),
                NOW(),
                NOW()
              )
            `;

            authUserId = newUserId;
          }
        }

        createdAdmin = await tx.admin.create({
          data: {
            authUserId,
            name: fullName,
            email,
            role: "ADMIN",
            isActive: true,
          },
          select: {
            id: true,
            authUserId: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
          },
        });
      });

      return res.status(201).json({
        message:
          "Initial administrator account created and authorized. Further public admin registration is now disabled.",
        admin: createdAdmin,
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return res.status(403).json({ error: error.message });
      }
      return next(error);
    }
  }
);

/**
 * POST /api/admin/auth/login
 * Authenticates administrator email & password against Supabase `auth.users`
 * and verifies database-backed admin authorization in `public.admins`.
 * - Returns 401 if email/password are invalid.
 * - Returns 403 if the user exists in `auth.users` with a valid password, but is NOT an authorized admin in `public.admins`.
 */
router.post("/auth/login", authLimiter, async (req, res, next) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !EMAIL_REGEX.test(email) || !password) {
      return res.status(400).json({
        error: "Please enter a valid administrator email and password.",
      });
    }

    const authRows = await prisma.$queryRaw`
      SELECT id, email, encrypted_password, banned_until, deleted_at
      FROM auth.users
      WHERE LOWER(email) = ${email}
      LIMIT 1
    `;

    const authUser = Array.isArray(authRows) ? authRows[0] : null;
    if (
      !authUser ||
      !authUser.encrypted_password ||
      authUser.deleted_at ||
      (authUser.banned_until && new Date(authUser.banned_until) > new Date())
    ) {
      return res.status(401).json({
        error: "Invalid email or password. Please try again.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      authUser.encrypted_password
    );
    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password. Please try again.",
      });
    }

    // Verify database-backed admin authorization in `public.admins` linked via `auth.users.id`
    const adminRecord = await prisma.admin.findUnique({
      where: { authUserId: authUser.id },
      select: {
        id: true,
        authUserId: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!adminRecord || !adminRecord.isActive || adminRecord.role !== "ADMIN") {
      return res.status(403).json({
        error:
          "Access denied. Your account is authenticated, but it is not authorized as a NOOR AL AFIYA administrator.",
      });
    }

    await prisma.$executeRaw`
      UPDATE auth.users
      SET last_sign_in_at = NOW(), updated_at = NOW()
      WHERE id = ${authUser.id}::uuid
    `;

    const accessToken = signSupabaseSessionToken({
      id: authUser.id,
      email: authUser.email,
    });

    return res.json({
      accessToken,
      admin: adminRecord,
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /api/admin/auth/logout
 */
router.post("/auth/logout", (_req, res) => {
  return res.json({ message: "Signed out successfully." });
});

/**
 * GET /api/admin/auth/me
 * Verifies the caller's Supabase Auth Bearer token AND confirms they have an active
 * administrator authorization record in `public.admins` linked via `auth.users.id`.
 * Returns 401 if unauthenticated, 403 if authenticated non-admin, or 200 with admin profile.
 */
router.get("/auth/me", requireAdmin, (req, res) => {
  return res.json({
    admin: req.admin,
  });
});

// ============================================================================
// 2. PROTECTED ADMIN BOOKING MANAGEMENT ROUTES
// ============================================================================

/**
 * GET /api/admin/bookings
 */
router.get("/bookings", requireAdmin, async (req, res, next) => {
  try {
    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "").trim();
    const date = String(req.query.date || "").trim();

    const where = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (date) {
      const parsedDate = new Date(`${date}T00:00:00.000Z`);
      if (!Number.isNaN(parsedDate.getTime())) {
        where.preferredDate = parsedDate;
      }
    }
    if (search) {
      where.OR = [
        { bookingReference: { contains: search, mode: "insensitive" } },
        { fullName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const bookings = await prisma.careBooking.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      bookings: bookings.map(formatAdminBooking),
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/admin/bookings/:id
 */
router.get("/bookings/:id", requireAdmin, async (req, res, next) => {
  try {
    const booking = await findBookingByIdentifier(req.params.id, true);
    if (!booking) {
      return res.status(404).json({ error: "Care booking not found." });
    }

    return res.json({
      booking: formatAdminBooking(booking),
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * PATCH /api/admin/bookings/:id/status
 */
router.patch("/bookings/:id/status", requireAdmin, async (req, res, next) => {
  try {
    const newStatus = String(req.body?.status || "").trim();
    if (!ALLOWED_BOOKING_STATUSES.has(newStatus)) {
      return res.status(400).json({
        error: `Invalid booking status. Allowed values: ${Array.from(
          ALLOWED_BOOKING_STATUSES
        ).join(", ")}.`,
      });
    }

    const existing = await findBookingByIdentifier(req.params.id, false);
    if (!existing) {
      return res.status(404).json({ error: "Care booking not found." });
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (existing.status !== newStatus) {
        await tx.bookingStatusHistory.create({
          data: {
            bookingId: existing.id,
            previousStatus: existing.status,
            newStatus,
            changedBy: req.admin.email,
          },
        });
      }

      return tx.careBooking.update({
        where: { id: existing.id },
        data: { status: newStatus },
        include: {
          statusHistory: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
    });

    return res.json({
      message: `Booking ${updated.bookingReference} status updated to "${newStatus}".`,
      booking: formatAdminBooking(updated),
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/admin/bookings/:id/history
 */
router.get("/bookings/:id/history", requireAdmin, async (req, res, next) => {
  try {
    const existing = await findBookingByIdentifier(req.params.id, false);
    if (!existing) {
      return res.status(404).json({ error: "Care booking not found." });
    }

    const history = await prisma.bookingStatusHistory.findMany({
      where: { bookingId: existing.id },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      bookingReference: existing.bookingReference,
      history: history.map((item) => ({
        id: item.id,
        previousStatus: item.previousStatus,
        newStatus: item.newStatus,
        changedBy: item.changedBy,
        createdAt: item.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    return next(error);
  }
});

// ============================================================================
// 3. PROTECTED ADMIN JOB APPLICATIONS ROUTES
// ============================================================================

/**
 * GET /api/admin/job-applications
 */
router.get("/job-applications", requireAdmin, async (req, res, next) => {
  try {
    const applications = await prisma.jobApplication.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      applications: applications.map(formatAdminJobApplication),
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * PATCH /api/admin/job-applications/:id/status
 */
router.patch(
  "/job-applications/:id/status",
  requireAdmin,
  async (req, res, next) => {
    try {
      const newStatus = String(req.body?.status || "").trim();
      if (!ALLOWED_JOB_STATUSES.has(newStatus)) {
        return res.status(400).json({
          error: `Invalid application status. Allowed values: ${Array.from(
            ALLOWED_JOB_STATUSES
          ).join(", ")}.`,
        });
      }

      const existing = await findJobByIdentifier(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Job application not found." });
      }

      const updated = await prisma.jobApplication.update({
        where: { id: existing.id },
        data: { status: newStatus },
      });

      return res.json({
        message: `Application ${updated.applicationReference} status updated to "${newStatus}".`,
        application: formatAdminJobApplication(updated),
      });
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * GET /api/admin/job-applications/:id/document
 * Generates a temporary 60-second signed URL from private Supabase Storage for an authorized admin.
 */
router.get(
  "/job-applications/:id/document",
  requireAdmin,
  async (req, res, next) => {
    try {
      const docType = req.query.type === "certificate" ? "certificate" : "cv";
      const existing = await findJobByIdentifier(req.params.id);

      if (!existing) {
        return res.status(404).json({ error: "Job application not found." });
      }

      const objectPath =
        docType === "certificate" ? existing.certificatePath : existing.cvPath;

      if (!objectPath) {
        return res.status(404).json({
          error: "No uploaded document is stored for this application.",
        });
      }

      const signedUrl = await createTemporarySignedDocumentUrl(
        objectPath,
        existing.applicationReference,
        docType,
        60
      );
      return res.json({
        signedUrl,
        expiresInSeconds: 60,
      });
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * GET /api/admin/job-applications/:id/document/stream
 */
router.get(
  "/job-applications/:id/document/stream",
  requireAdmin,
  async (req, res, next) => {
    try {
      const docType = req.query.type === "certificate" ? "certificate" : "cv";
      const existing = await findJobByIdentifier(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Job application not found." });
      }

      const objectPath =
        docType === "certificate" ? existing.certificatePath : existing.cvPath;
      if (!objectPath) {
        return res.status(404).json({ error: "Document not found." });
      }

      const buffer = await readLocalPrivateDocument(
        objectPath,
        existing.applicationReference,
        docType,
        req.query.expires,
        req.query.sig
      );

      const fileName =
        (docType === "certificate"
          ? existing.certificateName
          : existing.cvOriginalName) || "Applicant-Document.pdf";

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}"`
      );
      return res.send(buffer);
    } catch (error) {
      return next(error);
    }
  }
);

export default router;
