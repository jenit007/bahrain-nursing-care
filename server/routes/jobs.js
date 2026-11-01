import crypto from "node:crypto";
import express from "express";
import multer from "multer";
import { prisma } from "../db.js";
import {
  uploadPrivateApplicantDocument,
  validateUploadedFile,
} from "../services/storage.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max per file
    files: 2,
  },
});

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PHONE_REGEX = /^[+\d][\d\s().-]{6,20}$/;

async function generateUniqueApplicationReference() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = `JOB-${crypto.randomInt(10000000, 99999999)}`;
    const existing = await prisma.jobApplication.findUnique({
      where: { applicationReference: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
  return `JOB-${Date.now().toString().slice(-8)}`;
}

/**
 * POST /api/jobs/apply
 * Accepts multipart/form-data or JSON job applications, uploads CV/certificate to private Supabase Storage if provided,
 * and saves the application record in PostgreSQL.
 */
router.post(
  "/apply",
  (req, res, next) => {
    const contentType = req.headers["content-type"] || "";
    if (contentType.includes("multipart/form-data")) {
      const handler = upload.fields([
        { name: "cv", maxCount: 1 },
        { name: "certificate", maxCount: 1 },
      ]);
      return handler(req, res, (err) => {
        if (err) {
          return res.status(400).json({
            error:
              err.code === "LIMIT_FILE_SIZE"
                ? "File size exceeds the 5 MB limit."
                : "Invalid file upload.",
          });
        }
        return next();
      });
    }
    return next();
  },
  async (req, res, next) => {
    try {
      const body = req.body || {};

      const fullName = String(body.fullName || "").trim();
      const email = String(body.email || "").trim().toLowerCase();
      const phone = String(body.phone || "").trim();
      const cprNo = String(body.cprNo || "").trim() || null;
      const address = String(body.address || "").trim();
      const position = String(body.position || "").trim();
      const experience = String(body.experience || "").trim();
      const qualification = String(body.qualification || "").trim();
      const licenseNumber = String(body.licenseNumber || "").trim() || null;
      const availability = String(body.availability || "").trim() || null;
      const message = String(body.message || "").trim() || null;

      const errors = {};
      if (!fullName) errors.fullName = "Full name is required.";
      if (!email || !EMAIL_REGEX.test(email)) {
        errors.email = "Please enter a valid email address.";
      }
      if (!phone || !PHONE_REGEX.test(phone)) {
        errors.phone = "Please enter a valid phone number.";
      }
      if (!cprNo) errors.cprNo = "CPR No. is required.";
      if (!address) errors.address = "Address is required.";
      if (!position) errors.position = "Please select a position.";
      if (!experience) errors.experience = "Please select your experience level.";
      if (!qualification) {
        errors.qualification = "Professional qualification is required.";
      }
      if (!availability) {
        errors.availability = "Please select your availability.";
      }

      const cvFile = req.files?.cv?.[0] || null;
      const certFile = req.files?.certificate?.[0] || null;

      if (cvFile) {
        const cvCheck = validateUploadedFile(cvFile, "cv");
        if (!cvCheck.valid) errors.cv = cvCheck.error;
      }
      if (certFile) {
        const certCheck = validateUploadedFile(certFile, "certificate");
        if (!certCheck.valid) errors.certificate = certCheck.error;
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          error: "Please check the required application fields.",
          details: errors,
        });
      }

      // Duplicate submission protection within 2 minutes
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
      const duplicate = await prisma.jobApplication.findFirst({
        where: {
          email,
          position,
          createdAt: { gte: twoMinutesAgo },
        },
      });

      if (duplicate) {
        return res.status(409).json({
          error: "Your application for this position was just received.",
        });
      }

      let cvPath = null;
      let cvOriginalName = null;
      let certificatePath = null;
      let certificateName = null;

      if (cvFile) {
        cvPath = await uploadPrivateApplicantDocument(cvFile, "cvs");
        cvOriginalName = cvFile.originalname;
      }
      if (certFile) {
        certificatePath = await uploadPrivateApplicantDocument(certFile, "certificates");
        certificateName = certFile.originalname;
      }

      const applicationReference = await generateUniqueApplicationReference();

      const application = await prisma.jobApplication.create({
        data: {
          applicationReference,
          fullName,
          email,
          phone,
          cprNo,
          address,
          position,
          experience,
          qualification,
          licenseNumber,
          availability,
          message,
          cvPath,
          cvOriginalName,
          certificatePath,
          certificateName,
          status: "Application Received",
        },
      });

      return res.status(201).json({
        message: "Job application submitted successfully.",
        application: {
          id: application.applicationReference,
          applicationReference: application.applicationReference,
          status: application.status,
          submittedAt: application.createdAt.toISOString(),
        },
      });
    } catch (error) {
      return next(error);
    }
  }
);

export default router;
