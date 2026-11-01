-- ============================================================================
-- Migration: Link public.admins to Supabase auth.users(id), remove plaintext/hash
-- password column from public.admins, and enable strict Row Level Security (RLS)
-- ============================================================================

-- Remove any legacy non-Supabase-Auth seed row from public.admins before adding NOT NULL auth_user_id
DELETE FROM "public"."admins";

-- AlterTable: Replace password_hash with auth_user_id linked to auth.users(id) and is_active
ALTER TABLE "public"."admins"
  DROP COLUMN IF EXISTS "password_hash",
  ADD COLUMN "auth_user_id" UUID NOT NULL,
  ADD COLUMN "is_active" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex & ForeignKey to Supabase Auth users table
CREATE UNIQUE INDEX "admins_auth_user_id_key" ON "public"."admins"("auth_user_id");
CREATE INDEX "admins_auth_user_id_idx" ON "public"."admins"("auth_user_id");

ALTER TABLE "public"."admins"
  ADD CONSTRAINT "admins_auth_user_id_fkey"
  FOREIGN KEY ("auth_user_id")
  REFERENCES "auth"."users"("id")
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) & LEAST-PRIVILEGE POLICIES
-- ============================================================================

-- 1. Enable RLS on all application tables
ALTER TABLE "public"."admins" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."care_bookings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."booking_status_history" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."contact_enquiries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."job_applications" ENABLE ROW LEVEL SECURITY;

-- 2. Revoke direct table modification privileges from public/anon/authenticated PostgREST roles
-- so users can NEVER insert/update/delete admin records or self-assign admin roles
REVOKE ALL ON "public"."admins" FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON "public"."admins" FROM authenticated;
GRANT SELECT ON "public"."admins" TO authenticated;

REVOKE ALL ON "public"."care_bookings" FROM anon, authenticated;
REVOKE ALL ON "public"."booking_status_history" FROM anon, authenticated;
REVOKE ALL ON "public"."contact_enquiries" FROM anon, authenticated;
REVOKE ALL ON "public"."job_applications" FROM anon, authenticated;

-- 3. Least-privilege RLS policy on public.admins:
-- An authenticated Supabase user may only SELECT their own active admin authorization record.
-- All writes to public.admins are strictly restricted to the backend server / postgres role.
DROP POLICY IF EXISTS "admins_select_own_active_record" ON "public"."admins";
CREATE POLICY "admins_select_own_active_record"
  ON "public"."admins"
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id AND is_active = true);
