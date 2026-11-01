import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

/**
 * Secure Server-Side Admin Provisioning Script (`npm run db:seed`)
 *
 * Creates or locates the administrator user in Supabase Auth (`auth.users`)
 * and links their `auth.users.id` to `public.admins` (`auth_user_id`) with role `ADMIN`.
 * Never stores plaintext passwords in PostgreSQL.
 */
async function provisionInitialAdmin() {
  const email = (process.env.INITIAL_ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.INITIAL_ADMIN_PASSWORD || "";
  const name = (
    process.env.INITIAL_ADMIN_NAME || "NOOR AL AFIYA Administrator"
  ).trim();

  if (!email || !password) {
    console.error(
      "Error: INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD must be set in .env before running db:seed."
    );
    process.exit(1);
  }

  if (password.length < 10) {
    console.error(
      "Error: INITIAL_ADMIN_PASSWORD must be at least 10 characters long."
    );
    process.exit(1);
  }

  let authUserId = null;

  // 1. Check if the user already exists in Supabase Auth (`auth.users`)
  const existingUsers = await prisma.$queryRaw`
    SELECT id, email
    FROM auth.users
    WHERE LOWER(email) = ${email}
    LIMIT 1
  `;

  if (Array.isArray(existingUsers) && existingUsers.length > 0) {
    authUserId = existingUsers[0].id;
    console.log(`Found existing Supabase Auth user for ${email} (ID: ${authUserId})`);
  } else {
    // 2. If SUPABASE_SERVICE_ROLE_KEY is configured, provision via Supabase Auth Admin API
    const supabaseUrl = (
      process.env.SUPABASE_URL ||
      process.env.VITE_SUPABASE_URL ||
      ""
    ).trim();
    const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

    if (
      supabaseUrl &&
      serviceRoleKey &&
      !serviceRoleKey.includes("your-supabase-service-role")
    ) {
      const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: name },
      });

      if (error) {
        throw new Error(`Supabase Auth Admin createUser failed: ${error.message}`);
      }
      authUserId = data.user.id;
      console.log(`Created Supabase Auth user via Admin API for ${email} (ID: ${authUserId})`);
    } else {
      // 3. Provision directly into Supabase `auth.users` & `auth.identities` with GoTrue bcrypt hash
      const newUserId = crypto.randomUUID();
      const encryptedPassword = await bcrypt.hash(password, 10);
      const rawAppMeta = JSON.stringify({
        provider: "email",
        providers: ["email"],
      });
      const rawUserMeta = JSON.stringify({
        sub: newUserId,
        email,
        full_name: name,
        email_verified: true,
        phone_verified: false,
      });
      const identityData = JSON.stringify({
        sub: newUserId,
        email,
        email_verified: true,
        phone_verified: false,
      });

      await prisma.$transaction([
        prisma.$executeRaw`
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
        `,
        prisma.$executeRaw`
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
        `,
      ]);

      authUserId = newUserId;
      console.log(`Provisioned Supabase Auth user in auth.users for ${email} (ID: ${authUserId})`);
    }
  }

  // 4. Link the Supabase Auth user ID (`auth.users.id`) to the `public.admins` authorization record
  const admin = await prisma.admin.upsert({
    where: { authUserId },
    update: {
      name,
      email,
      role: "ADMIN",
      isActive: true,
    },
    create: {
      authUserId,
      name,
      email,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log(
    `Linked public.admins authorization record -> Admin ID: ${admin.id}, authUserId: ${admin.authUserId}, role: ${admin.role}`
  );
}

provisionInitialAdmin()
  .catch((error) => {
    console.error("Failed to provision initial admin:", error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
