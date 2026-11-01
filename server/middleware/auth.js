import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import { prisma } from "../db.js";

let cachedJwks = null;
let cachedJwksFetchedAt = 0;
const JWKS_TTL_MS = 10 * 60 * 1000; // 10 minutes

export function getSupabaseUrl() {
  return (
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    ""
  )
    .trim()
    .replace(/\/$/, "");
}

function getSupabaseKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    ""
  ).trim();
}

export function getJwtSigningSecret() {
  return (
    process.env.SUPABASE_JWT_SECRET ||
    process.env.SESSION_SECRET ||
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

async function getJwksPublicKey(kid, supabaseUrl) {
  const now = Date.now();
  if (!cachedJwks || now - cachedJwksFetchedAt > JWKS_TTL_MS) {
    const response = await fetch(`${supabaseUrl}/auth/v1/.well-known/jwks.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Supabase JWKS (${response.status})`);
    }
    cachedJwks = await response.json();
    cachedJwksFetchedAt = now;
  }

  const keys = Array.isArray(cachedJwks?.keys) ? cachedJwks.keys : [];
  const matchingJwk = kid ? keys.find((k) => k.kid === kid) : keys[0];
  if (!matchingJwk) {
    throw new Error("Matching JWK not found in Supabase JWKS.");
  }

  return crypto.createPublicKey({ key: matchingJwk, format: "jwk" });
}

/**
 * Signs a Supabase-compatible access token for an authenticated `auth.users` account
 * when authenticating through the backend Supabase PostgreSQL `auth.users` bridge.
 */
export function signSupabaseSessionToken(authUser) {
  const supabaseUrl = getSupabaseUrl();
  const secret = getJwtSigningSecret();
  if (!secret || !supabaseUrl) {
    throw new Error("Server authentication secret is not configured.");
  }

  return jwt.sign(
    {
      sub: authUser.id,
      email: authUser.email,
      role: "authenticated",
      aud: "authenticated",
    },
    secret,
    {
      algorithm: "HS256",
      issuer: `${supabaseUrl}/auth/v1`,
      expiresIn: "8h",
    }
  );
}

/**
 * Verifies a Supabase Auth access token using Supabase's server-side verification (`auth.getUser`)
 * or cryptographic JWKS / JWT secret signature verification. Never trusts unverified tokens.
 */
export async function verifySupabaseAccessToken(accessToken) {
  if (!accessToken || typeof accessToken !== "string") {
    return { authenticated: false, error: "Missing access token." };
  }

  const supabaseUrl = getSupabaseUrl();
  if (!supabaseUrl) {
    return { authenticated: false, error: "SUPABASE_URL is not configured." };
  }

  // 1. Primary verification: Official Supabase Auth server-side getUser(token)
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (!error && data?.user?.id) {
      return {
        authenticated: true,
        user: {
          id: data.user.id,
          email: data.user.email || "",
        },
      };
    }
  }

  // 2. Cryptographic signature verification via Supabase JWKS (ES256/RS256) or JWT secret (HS256)
  try {
    const decodedHeader = jwt.decode(accessToken, { complete: true });
    if (!decodedHeader?.header?.alg) {
      return { authenticated: false, error: "Malformed access token." };
    }

    const { alg, kid } = decodedHeader.header;
    let verificationKey = null;

    if (alg === "ES256" || alg === "RS256") {
      verificationKey = await getJwksPublicKey(kid, supabaseUrl);
    } else if (alg === "HS256") {
      verificationKey = getJwtSigningSecret();
    }

    if (!verificationKey) {
      return {
        authenticated: false,
        error: "Unable to verify token signature without Supabase API key or JWT secret.",
      };
    }

    const verifiedPayload = jwt.verify(accessToken, verificationKey, {
      algorithms: [alg],
      issuer: `${supabaseUrl}/auth/v1`,
    });

    if (!verifiedPayload?.sub) {
      return { authenticated: false, error: "Invalid token subject." };
    }

    // Verify the user still exists and is active in Supabase `auth.users`
    const authUserRows = await prisma.$queryRaw`
      SELECT id, email, banned_until, deleted_at
      FROM auth.users
      WHERE id = ${verifiedPayload.sub}::uuid
      LIMIT 1
    `;
    const authUser = Array.isArray(authUserRows) ? authUserRows[0] : null;
    if (
      !authUser ||
      authUser.deleted_at ||
      (authUser.banned_until && new Date(authUser.banned_until) > new Date())
    ) {
      return { authenticated: false, error: "User account is no longer active." };
    }

    return {
      authenticated: true,
      user: {
        id: authUser.id,
        email: authUser.email || verifiedPayload.email || "",
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
  const authHeader = req.headers.authorization || req.headers.Authorization || "";
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  return null;
}

/**
 * Express Middleware:
 * 1. Receives the authenticated user's Supabase access token.
 * 2. Verifies the token signature and expiration using Supabase's server-side verification.
 * 3. Retrieves the authenticated user's identity (`auth.users.id`).
 * 4. Checks whether that user has an active admin authorization record in `public.admins`.
 * 5. Returns 401 if not authenticated, 403 if authenticated but not an authorized admin, or 500 on server error.
 */
export async function requireAdmin(req, res, next) {
  try {
    const accessToken = extractBearerToken(req);
    if (!accessToken) {
      return res.status(401).json({
        error: "Authentication required. Please sign in with your administrator account.",
      });
    }

    const verification = await verifySupabaseAccessToken(accessToken);
    if (!verification.authenticated || !verification.user?.id) {
      return res.status(401).json({
        error: verification.error || "Session expired or invalid. Please sign in again.",
      });
    }

    // Database-backed Admin Authorization check linked via auth.users.id (`authUserId`)
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
        error:
          "Access denied. Your account is authenticated, but it is not authorized as a NOOR AL AFIYA administrator.",
      });
    }

    req.admin = adminRecord;
    req.authUser = verification.user;
    return next();
  } catch (error) {
    console.error("[Admin Auth Middleware Error]:", error?.message || error);
    return res.status(500).json({
      error: "Internal server error while verifying administrator authorization.",
    });
  }
}
