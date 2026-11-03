import crypto from "node:crypto";
import express from "express";
import { prisma } from "../db.js";

const router = express.Router();

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PHONE_REGEX = /^[+\d][\d\s().-]{6,20}$/;

function generateBookingReference() {
  const num = crypto.randomInt(10000000, 99999999);
  return `REQ-${num}`;
}

async function generateUniqueBookingReference() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = generateBookingReference();
    const existing = await prisma.careBooking.findUnique({
      where: { bookingReference: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
  return `REQ-${Date.now().toString().slice(-8)}`;
}

/**
 * Formats a database CareBooking record into a safe, data-minimized public tracking response.
 */
export function formatPublicTrackingResponse(booking) {
  const patientDetails =
    booking.patientDetails && typeof booking.patientDetails === "object"
      ? booking.patientDetails
      : {};
  const address =
    booking.address && typeof booking.address === "object" ? booking.address : {};

  return {
    id: booking.bookingReference,
    bookingReference: booking.bookingReference,
    service: booking.careType,
    careType: booking.careType,
    name: booking.fullName,
    fullName: booking.fullName,
    email: booking.email || "",
    phone: booking.phone,
    preferredDate: booking.preferredDate
      ? booking.preferredDate.toISOString().split("T")[0]
      : "",
    condition: patientDetails.condition || "",
    shift: patientDetails.shift || "",
    shiftOther: patientDetails.shiftOther || "",
    preferredTime: patientDetails.preferredTime || "",
    address: {
      flatNo: address.flatNo || "",
      buildingNo: address.buildingNo || "",
      area: address.area || "",
      governorate: address.governorate || "",
      country: address.country || "Bahrain",
    },
    notes: booking.additionalNotes || "",
    status: booking.status,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    statusHistory: Array.isArray(booking.statusHistory)
      ? booking.statusHistory.map((h) => ({
          id: h.id,
          previousStatus: h.previousStatus,
          newStatus: h.newStatus,
          createdAt: h.createdAt.toISOString(),
        }))
      : undefined,
  };
}

/**
 * POST /api/bookings
 * Creates a new customer care booking in PostgreSQL.
 */
router.post("/", async (req, res, next) => {
  try {
    const body = req.body || {};

    const fullName = String(body.fullName || body.name || "").trim();
    const emailRaw = String(body.email || "").trim();
    const email = emailRaw ? emailRaw.toLowerCase() : null;
    const phone = String(body.phone || "").trim();
    const careType = String(body.careType || body.service || "").trim();
    const preferredDateRaw = String(body.preferredDate || "").trim();
    const additionalNotes = String(body.additionalNotes ?? body.notes ?? "").trim() || null;

    const rawAddress = body.address && typeof body.address === "object" ? body.address : {};
    const address = {
      flatNo: String(rawAddress.flatNo || rawAddress.flatVilla || "").trim(),
      buildingNo: String(rawAddress.buildingNo || rawAddress.buildingNumber || "").trim(),
      area: String(rawAddress.area || "").trim(),
      governorate: String(rawAddress.governorate || "").trim(),
      country: "Bahrain",
    };

    const rawPatient =
      body.patientDetails && typeof body.patientDetails === "object"
        ? body.patientDetails
        : {};
    const patientDetails = {
      condition: String(rawPatient.condition ?? body.condition ?? "").trim(),
      shift: String(rawPatient.shift ?? body.shift ?? "").trim(),
      shiftOther: String(rawPatient.shiftOther ?? body.shiftOther ?? "").trim(),
      preferredTime: String(rawPatient.preferredTime ?? body.preferredTime ?? "").trim(),
      urgency: String(rawPatient.urgency ?? body.urgency ?? "Normal").trim(),
    };

    // Validation
    const errors = {};
    if (!fullName || fullName.length < 2) {
      errors.fullName = "Full name is required.";
    }
    if (email && !EMAIL_REGEX.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    const phoneDigits = phone.replace(/\D/g, "");
    if (!phone || !PHONE_REGEX.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
      errors.phone = "Please enter a valid phone number.";
    }
    if (!careType) {
      errors.careType = "Please select a care service.";
    }
    const isIsoDate = /^\d{4}-\d{2}-\d{2}$/.test(preferredDateRaw);
    const parsedDate = isIsoDate ? new Date(`${preferredDateRaw}T00:00:00.000Z`) : null;
    if (!parsedDate || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== preferredDateRaw) {
      errors.preferredDate = "Please provide a valid preferred date.";
    }
    if (!address.flatNo || !address.buildingNo || !address.area) {
      errors.address = "Block number, building number, and area are required.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        error: "Please check the required booking fields.",
        details: errors,
      });
    }

    // Duplicate submission protection (within last 2 minutes for same phone + careType + preferredDate)
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const recentDuplicate = await prisma.careBooking.findFirst({
      where: {
        phone,
        careType,
        preferredDate: parsedDate,
        createdAt: { gte: twoMinutesAgo },
      },
    });

    if (recentDuplicate) {
      return res.status(409).json({
        error: "A matching care booking was just submitted. Please check your booking status.",
        booking: formatPublicTrackingResponse(recentDuplicate),
      });
    }

    const bookingReference = await generateUniqueBookingReference();

    const createdBooking = await prisma.$transaction(async (tx) => {
      const booking = await tx.careBooking.create({
        data: {
          bookingReference,
          fullName,
          email,
          phone,
          careType,
          patientDetails,
          preferredDate: parsedDate,
          address,
          additionalNotes,
          status: "Pending Verification",
        },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId: booking.id,
          previousStatus: null,
          newStatus: "Pending Verification",
          changedBy: "CUSTOMER_SUBMISSION",
        },
      });

      return booking;
    });

    return res.status(201).json({
      message: "Care booking submitted successfully.",
      booking: formatPublicTrackingResponse(createdBooking),
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/bookings/track/:reference
 * Retrieves public tracking status for a booking by its reference code (e.g. REQ-12345678).
 */
router.get("/track/:reference", async (req, res, next) => {
  try {
    const reference = String(req.params.reference || "").trim().toUpperCase();
    if (!reference || !/^REQ-\d{6,12}$/.test(reference)) {
      return res.status(400).json({
        error: "Please provide a valid booking reference (e.g. REQ-12345678).",
      });
    }

    const booking = await prisma.careBooking.findUnique({
      where: { bookingReference: reference },
      include: {
        statusHistory: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        error: "No care booking found with that reference.",
      });
    }

    return res.json({
      booking: formatPublicTrackingResponse(booking),
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
