import { createClient } from "@supabase/supabase-js";
import { prisma } from "../db.js";

export function getSupabaseUrl() {
  return (
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    ""
  )
    .trim()
    .replace(/\/+(rest|auth)\/v1\/?$/i, "")
    .replace(/\/+$/, "");
}

function getSupabaseKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    ""
  ).trim();
}

export function getSupabaseServerClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  if (
    !url ||
    !key ||
    url.includes("[YOUR-PROJECT-REF]") ||
    key.includes("your-supabase-")
  ) {
    return null;
  }
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Verifies a Supabase Auth access token strictly using official Supabase Auth `auth.getUser(accessToken)`.
 */
export async function verifySupabaseAccessToken(accessToken) {
  if (!accessToken || typeof accessToken !== "string") {
    return { authenticated: false, error: "Missing access token." };
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return {
      authenticated: false,
      error: "Supabase server authentication is not configured.",
    };
  }

  try {
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data?.user?.id) {
      return {
        authenticated: false,
        error: "Invalid or expired Supabase access token.",
      };
    }

    return {
      authenticated: true,
      user: {
        id: data.user.id,
        email: data.user.email || "",
      },
    };
  } catch {
    return {
      authenticated: false,
      error: "Invalid or expired Supabase access token.",
    };
  }
}

export function extractBearerToken(req) {
  const authHeader =
    req.headers.authorization || req.headers.Authorization || "";
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  return null;
}

/**
 * Express Middleware:
 * 1. Receives the authenticated user's Supabase access token.
 * 2. Verifies the token using Supabase Auth `auth.getUser(accessToken)`.
 * 3. Retrieves the authenticated user's UUID (`data.user.id`).
 * 4. Checks whether that UUID exists in `public.admins` with `role = 'ADMIN'` and `is_active = true`.
 * 5. Returns 401 if unauthenticated, 403 if authenticated but not an authorized admin, or 500 on server error.
 */
export async function requireAdmin(req, res, next) {
  try {
    const accessToken = extractBearerToken(req);
    if (!accessToken) {
      return res.status(401).json({
        error:
          "Authentication required. Please login with your administrator account.",
      });
    }

    const verification = await verifySupabaseAccessToken(accessToken);
    if (!verification.authenticated || !verification.user?.id) {
      return res.status(401).json({
        error:
          verification.error || "Session expired or invalid. Please login again.",
      });
    }

    const adminRecord = await prisma.admin.findUnique({
      where: { authUserId: verification.user.id },
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
        error: "You are authenticated, but you do not have administrator access.",
      });
    }

    req.admin = adminRecord;
    req.authUser = verification.user;
    return next();
  } catch (error) {
    console.error("[Admin Auth Middleware Error]:", error?.message || error);
    return res.status(500).json({
      error:
        "Internal server error while verifying administrator authorization.",
    });
  }
}
