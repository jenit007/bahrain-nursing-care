import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRIVATE_UPLOADS_ROOT = process.env.VERCEL
  ? path.resolve("/tmp", "noor_private_uploads")
  : path.resolve(__dirname, "..", ".private_uploads");

const ALLOWED_CV_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const ALLOWED_CERT_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const SAFE_EXTENSIONS = new Set([".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function getSupabaseAdminClient() {
  const supabaseUrl = (process.env.SUPABASE_URL || "")
    .trim()
    .replace(/\/+(rest|auth)\/v1\/?$/i, "")
    .replace(/\/+$/, "");
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

  if (
    !supabaseUrl ||
    !serviceRoleKey ||
    supabaseUrl.includes("[YOUR-PROJECT-REF]") ||
    serviceRoleKey.includes("your-supabase-service-role")
  ) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getBucketName() {
  return process.env.SUPABASE_STORAGE_BUCKET || "job-applications";
}

export function validateUploadedFile(file, kind = "cv") {
  if (!file) return { valid: true };

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: "Uploaded file exceeds the maximum allowed size of 5 MB.",
    };
  }

  const ext = path.extname(file.originalname || "").toLowerCase();
  if (!SAFE_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: "Unsupported file extension.",
    };
  }

  const allowedSet = kind === "cv" ? ALLOWED_CV_MIME_TYPES : ALLOWED_CERT_MIME_TYPES;
  if (!allowedSet.has(file.mimetype)) {
    return {
      valid: false,
      error:
        kind === "cv"
          ? "CV must be a PDF, DOC, or DOCX file."
          : "Certification must be a PDF, JPG, PNG, DOC, or DOCX file.",
    };
  }

  return { valid: true };
}

/**
 * Ensures the private Supabase Storage bucket exists and is set to private (`public: false`).
 */
export async function ensurePrivateBucket(supabase, bucketName) {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    throw new Error(`Unable to inspect storage buckets: ${listError.message}`);
  }

  const existing = (buckets || []).find((b) => b.name === bucketName);
  if (!existing) {
    const { error: createError } = await supabase.storage.createBucket(bucketName, {
      public: false,
      fileSizeLimit: MAX_FILE_SIZE_BYTES,
    });
    if (createError) {
      throw new Error(`Unable to create private bucket "${bucketName}": ${createError.message}`);
    }
  }
}

/**
 * Uploads an applicant document to private Supabase Storage (when SUPABASE_SERVICE_ROLE_KEY is configured)
 * or to the restricted private server vault (`server/.private_uploads/`) and returns its private path.
 */
export async function uploadPrivateApplicantDocument(file, folder = "cvs") {
  const ext = path.extname(file.originalname || "").toLowerCase() || ".pdf";
  const dateSegment = new Date().toISOString().slice(0, 10);
  const safeRelativePath = `${folder}/${dateSegment}/${crypto.randomUUID()}${ext}`;

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const bucketName = getBucketName();
    await ensurePrivateBucket(supabase, bucketName);

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(safeRelativePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Document upload failed: ${uploadError.message}`);
    }

    return safeRelativePath;
  }

  // Fallback private vault when SUPABASE_SERVICE_ROLE_KEY is not yet populated in .env
  const targetFile = path.resolve(PRIVATE_UPLOADS_ROOT, safeRelativePath);
  if (!targetFile.startsWith(PRIVATE_UPLOADS_ROOT)) {
    throw new Error("Invalid storage path.");
  }

  await fs.mkdir(path.dirname(targetFile), { recursive: true });
  await fs.writeFile(targetFile, file.buffer);
  return `local:${safeRelativePath}`;
}

/**
 * Creates a short-lived signed URL (default 60 seconds) for an authorized admin to view/download a private document.
 */
export async function createTemporarySignedDocumentUrl(
  objectPath,
  appId,
  docType = "cv",
  expiresInSeconds = 60
) {
  if (!objectPath) return null;

  if (!objectPath.startsWith("local:")) {
    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      throw new Error("Supabase Storage credentials are not configured.");
    }

    const bucketName = getBucketName();
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(objectPath, expiresInSeconds);

    if (error || !data?.signedUrl) {
      throw new Error(error?.message || "Failed to generate signed URL.");
    }

    return data.signedUrl;
  }

  // Generate a 60-second HMAC-signed endpoint URL for local private vault files
  const expiresAt = Date.now() + expiresInSeconds * 1000;
  const secret = process.env.SESSION_SECRET || "noor-private-doc-secret";
  const payload = `${appId}:${docType}:${objectPath}:${expiresAt}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return `/api/admin/job-applications/${encodeURIComponent(
    appId
  )}/document/stream?type=${encodeURIComponent(
    docType
  )}&expires=${expiresAt}&sig=${signature}`;
}

export async function readLocalPrivateDocument(
  objectPath,
  appId,
  docType,
  expires,
  signature
) {
  const expiresNum = Number(expires);
  if (!expiresNum || Date.now() > expiresNum) {
    throw new Error("Signed document link has expired.");
  }

  const secret = process.env.SESSION_SECRET || "noor-private-doc-secret";
  const payload = `${appId}:${docType}:${objectPath}:${expiresNum}`;
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  if (signature !== expectedSig) {
    throw new Error("Invalid signed document token.");
  }

  const relativePath = objectPath.replace(/^local:/, "");
  const fullPath = path.resolve(PRIVATE_UPLOADS_ROOT, relativePath);
  if (!fullPath.startsWith(PRIVATE_UPLOADS_ROOT)) {
    throw new Error("Invalid storage path.");
  }

  const buffer = await fs.readFile(fullPath);
  return buffer;
}
