import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

function getSupabaseAdminClient() {
  const url = (
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    ""
  )
    .trim()
    .replace(/\/+(rest|auth)\/v1\/?$/i, "")
    .replace(/\/+$/, "");
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

  if (
    !url ||
    !serviceRoleKey ||
    url.includes("[YOUR-PROJECT-REF]") ||
    serviceRoleKey.includes("your-supabase-")
  ) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function findSupabaseAuthUserByEmail(email) {
  const supabaseAdmin = getSupabaseAdminClient();
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (!error && Array.isArray(data?.users)) {
      const matched = data.users.find(
        (u) => String(u.email || "").trim().toLowerCase() === email
      );
      if (matched?.id) {
        return { id: matched.id, email: matched.email || email };
      }
    }
  }

  const existingUsers = await prisma.$queryRaw`
    SELECT id, email
    FROM auth.users
    WHERE LOWER(email) = ${email}
    LIMIT 1
  `;

  if (Array.isArray(existingUsers) && existingUsers.length > 0) {
    return existingUsers[0];
  }

  return null;
}

/**
 * Server-Side Admin Authorization Script (`npm run db:seed`)
 *
 * Locates an existing administrator user created manually in
 * Supabase Dashboard -> Authentication -> Users
 * and links their Supabase Auth UUID to `public.admins` (`auth_user_id`)
 * with `role = 'ADMIN'` and `is_active = true`.
 *
 * Never creates duplicate Supabase Auth users or stores passwords in `public.admins`.
 */
async function authorizeAdminUser() {
  const email = (process.env.INITIAL_ADMIN_EMAIL || "").trim().toLowerCase();
  const name = (
    process.env.INITIAL_ADMIN_NAME || "NOOR AL AFIYA Administrator"
  ).trim();

  if (!email) {
    console.error(
      "Error: INITIAL_ADMIN_EMAIL must be set in .env to authorize a Supabase Auth user in public.admins."
    );
    process.exit(1);
  }

  const authUser = await findSupabaseAuthUserByEmail(email);

  if (!authUser?.id) {
    console.error(
      `Error: No Supabase Auth user found for "${email}". Please create the user first in Supabase Dashboard -> Authentication -> Users.`
    );
    process.exit(1);
  }

  const authUserId = authUser.id;
  const canonicalEmail = String(authUser.email || email)
    .trim()
    .toLowerCase();

  const existingAdmin = await prisma.admin.findFirst({
    where: {
      OR: [
        { authUserId },
        { email: { equals: canonicalEmail, mode: "insensitive" } },
      ],
    },
  });

  const admin = existingAdmin
    ? await prisma.admin.update({
        where: { id: existingAdmin.id },
        data: {
          authUserId,
          name,
          email: canonicalEmail,
          role: "ADMIN",
          isActive: true,
        },
      })
    : await prisma.admin.create({
        data: {
          authUserId,
          name,
          email: canonicalEmail,
          role: "ADMIN",
          isActive: true,
        },
      });

  console.log(
    `Authorized Supabase Auth user in public.admins -> Admin ID: ${admin.id}, authUserId: ${admin.authUserId}, email: ${admin.email}, role: ${admin.role}, isActive: ${admin.isActive}`
  );
}

authorizeAdminUser()
  .catch((error) => {
    console.error("Failed to authorize admin user:", error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
