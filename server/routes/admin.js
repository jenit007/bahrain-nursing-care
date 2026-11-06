import express from "express";
import { prisma } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";
import {
  createTemporarySignedDocumentUrl,
  readLocalPrivateDocument,
} from "../services/storage.js";

const router = express.Router();

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const ALLOWED_BOOKING_STATUSES = new Set([
  "Pending Verification",
  "Verified",
  "Completed",
]);

const ALLOWED_ENQUIRY_STATUSES = new Set([
  "New",
  "In Progress",
  "Resolved",
]);

const ALLOWED_JOB_STATUSES = new Set([
  "Application Received",
  "Under Review",
  "Approved",
  "Rejected",
]);

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
    cprNumber: patientDetails.cprNumber || patientDetails.cprNo || "",
    preferredTests: patientDetails.preferredTests || "",
    urgency: patientDetails.urgency || "Normal",
    patientDetails,
    address: {
      flatNo: address.flatNo || address.blockNo || "",
      blockNo: address.blockNo || address.flatNo || "",
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

function formatAdminEnquiry(enquiry) {
  return {
    id: enquiry.id,
    fullName: enquiry.fullName,
    email: enquiry.email,
    phone: enquiry.phone,
    subject: enquiry.subject,
    message: enquiry.message,
    status: enquiry.status,
    createdAt: enquiry.createdAt.toISOString(),
    updatedAt: enquiry.updatedAt.toISOString(),
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
  const clean = String(identifier || "").trim();
  if (!clean) return null;
  const isUuid = UUID_REGEX.test(clean);

  return prisma.careBooking.findUnique({
    where: isUuid ? { id: clean } : { bookingReference: clean.toUpperCase() },
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
  const clean = String(identifier || "").trim();
  if (!clean) return null;
  const isUuid = UUID_REGEX.test(clean);

  return prisma.jobApplication.findUnique({
    where: isUuid
      ? { id: clean }
      : { applicationReference: clean.toUpperCase() },
  });
}

// ============================================================================
// 1. SUPABASE AUTHENTICATION & ADMIN AUTHORIZATION ENDPOINTS
// ============================================================================

/**
 * POST /api/admin/auth/logout
 */
router.post("/auth/logout", (_req, res) => {
  return res.json({ message: "Logged out successfully." });
});

/**
 * GET /api/admin/auth/me
 * Verifies the caller's Supabase Auth Bearer token via `supabase.auth.getUser(accessToken)`
 * AND confirms they have an active administrator authorization record in `public.admins`
 * (`role = 'ADMIN'`, `is_active = true`).
 * Returns 401 if unauthenticated, 403 if authenticated non-admin, or 200 with admin profile.
 */
router.get("/auth/me", requireAdmin, (req, res) => {
  return res.json({
    admin: req.admin,
  });
});

// ============================================================================
// 2. PROTECTED ADMIN DASHBOARD STATS & BOOKING MANAGEMENT ROUTES
// ============================================================================

async function getDashboardStatsHandler(_req, res, next) {
  try {
    const [
      totalBookings,
      pendingBookings,
      verifiedBookings,
      completedBookings,
      totalEnquiries,
      newEnquiries,
      totalApplications,
      newApplications,
    ] = await Promise.all([
      prisma.careBooking.count(),
      prisma.careBooking.count({ where: { status: "Pending Verification" } }),
      prisma.careBooking.count({ where: { status: "Verified" } }),
      prisma.careBooking.count({ where: { status: "Completed" } }),
      prisma.contactEnquiry.count(),
      prisma.contactEnquiry.count({ where: { status: "New" } }),
      prisma.jobApplication.count(),
      prisma.jobApplication.count({ where: { status: "Application Received" } }),
    ]);

    return res.json({
      stats: {
        totalBookings,
        pendingBookings,
        verifiedBookings,
        completedBookings,
        totalEnquiries,
        newEnquiries,
        totalApplications,
        newApplications,
      },
    });
  } catch (error) {
    return next(error);
  }
}

router.get("/stats", requireAdmin, getDashboardStatsHandler);
router.get("/dashboard", requireAdmin, getDashboardStatsHandler);

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
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
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
        { careType: { contains: search, mode: "insensitive" } },
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
// 3. PROTECTED ADMIN CONTACT ENQUIRIES ROUTES
// ============================================================================

async function listEnquiriesHandler(req, res, next) {
  try {
    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "").trim();

    const where = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    const enquiries = await prisma.contactEnquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      enquiries: enquiries.map(formatAdminEnquiry),
    });
  } catch (error) {
    return next(error);
  }
}

async function getEnquiryByIdHandler(req, res, next) {
  try {
    const id = String(req.params.id || "").trim();
    if (!UUID_REGEX.test(id)) {
      return res.status(400).json({ error: "Invalid enquiry ID." });
    }

    const enquiry = await prisma.contactEnquiry.findUnique({
      where: { id },
    });

    if (!enquiry) {
      return res.status(404).json({ error: "Contact enquiry not found." });
    }

    return res.json({
      enquiry: formatAdminEnquiry(enquiry),
    });
  } catch (error) {
    return next(error);
  }
}

async function updateEnquiryStatusHandler(req, res, next) {
  try {
    const id = String(req.params.id || "").trim();
    if (!UUID_REGEX.test(id)) {
      return res.status(400).json({ error: "Invalid enquiry ID." });
    }

    const newStatus = String(req.body?.status || "").trim();
    if (!ALLOWED_ENQUIRY_STATUSES.has(newStatus)) {
      return res.status(400).json({
        error: `Invalid enquiry status. Allowed values: ${Array.from(
          ALLOWED_ENQUIRY_STATUSES
        ).join(", ")}.`,
      });
    }

    const existing = await prisma.contactEnquiry.findUnique({
      where: { id },
    });
    if (!existing) {
      return res.status(404).json({ error: "Contact enquiry not found." });
    }

    const updated = await prisma.contactEnquiry.update({
      where: { id },
      data: { status: newStatus },
    });

    return res.json({
      message: `Enquiry status updated to "${newStatus}".`,
      enquiry: formatAdminEnquiry(updated),
    });
  } catch (error) {
    return next(error);
  }
}

router.get("/enquiries", requireAdmin, listEnquiriesHandler);
router.get("/contact-enquiries", requireAdmin, listEnquiriesHandler);
router.get("/enquiries/:id", requireAdmin, getEnquiryByIdHandler);
router.get("/contact-enquiries/:id", requireAdmin, getEnquiryByIdHandler);
router.patch("/enquiries/:id/status", requireAdmin, updateEnquiryStatusHandler);
router.patch(
  "/contact-enquiries/:id/status",
  requireAdmin,
  updateEnquiryStatusHandler
);

// ============================================================================
// 4. PROTECTED ADMIN JOB APPLICATIONS ROUTES
// ============================================================================

/**
 * GET /api/admin/job-applications
 */
router.get("/job-applications", requireAdmin, async (req, res, next) => {
  try {
    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "").trim();

    const where = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { applicationReference: { contains: search, mode: "insensitive" } },
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { position: { contains: search, mode: "insensitive" } },
      ];
    }

    const applications = await prisma.jobApplication.findMany({
      where,
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
 * GET /api/admin/job-applications/:id
 */
router.get("/job-applications/:id", requireAdmin, async (req, res, next) => {
  try {
    const existing = await findJobByIdentifier(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "Job application not found." });
    }

    return res.json({
      application: formatAdminJobApplication(existing),
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
