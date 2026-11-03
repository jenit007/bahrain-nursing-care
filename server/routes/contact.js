import express from "express";
import { prisma } from "../db.js";

const router = express.Router();

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PHONE_REGEX = /^[+\d][\d\s().-]{6,20}$/;

/**
 * POST /api/contact
 * Saves a customer contact enquiry to PostgreSQL.
 */
router.post("/", async (req, res, next) => {
  try {
    const body = req.body || {};
    const fullName = String(body.fullName || body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const subject = String(body.subject || body.service || "").trim();
    const message = String(body.message || "").trim();

    const errors = {};
    if (!fullName || fullName.length < 2) {
      errors.fullName = "Full name is required.";
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    const phoneDigits = phone.replace(/\D/g, "");
    if (!phone || !PHONE_REGEX.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
      errors.phone = "Please enter a valid phone number.";
    }
    if (!subject) {
      errors.subject = "Subject is required.";
    }
    if (!message || message.length < 5) {
      errors.message = "Please enter your enquiry message.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        error: "Please complete all required enquiry fields.",
        details: errors,
      });
    }

    // Prevent rapid duplicate enquiries within 2 minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const duplicate = await prisma.contactEnquiry.findFirst({
      where: {
        email,
        subject,
        createdAt: { gte: twoMinutesAgo },
      },
    });

    if (duplicate) {
      return res.status(409).json({
        error: "Your enquiry has already been received. Our team will get back to you shortly.",
      });
    }

    const enquiry = await prisma.contactEnquiry.create({
      data: {
        fullName,
        email,
        phone,
        subject,
        message,
        status: "New",
      },
    });

    return res.status(201).json({
      message: "Thank you. Your enquiry has been submitted.",
      enquiryId: enquiry.id,
      enquiry: {
        id: enquiry.id,
        fullName: enquiry.fullName,
        email: enquiry.email,
        phone: enquiry.phone,
        subject: enquiry.subject,
        status: enquiry.status,
        createdAt: enquiry.createdAt.toISOString(),
      },
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
