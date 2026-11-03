-- ============================================================================
-- Migration: Complete Row Level Security (RLS) Policies & Admin Authorization
-- Non-destructive security policies for all Noor Al Afiya public tables
-- ============================================================================

-- 1. Enable RLS on all public tables (including _prisma_migrations)
ALTER TABLE "public"."_prisma_migrations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."admins" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."care_bookings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."booking_status_history" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."contact_enquiries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."job_applications" ENABLE ROW LEVEL SECURITY;

-- 2. Lock down _prisma_migrations completely from public/PostgREST roles
REVOKE ALL ON "public"."_prisma_migrations" FROM anon, authenticated;

-- 3. Define server-side helper function to verify active ADMIN authorization
CREATE OR REPLACE FUNCTION "public"."is_authorized_admin"()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM "public"."admins"
    WHERE "auth_user_id" = auth.uid()
      AND "is_active" = true
      AND UPPER("role") = 'ADMIN'
  );
$$;

REVOKE ALL ON FUNCTION "public"."is_authorized_admin"() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION "public"."is_authorized_admin"() TO anon, authenticated;

-- 4. Define secure RPC for public booking tracking by exact booking reference
-- Never exposes full customer list or sensitive address details
CREATE OR REPLACE FUNCTION "public"."track_booking_by_reference"(p_reference text)
RETURNS TABLE (
  booking_reference varchar,
  full_name varchar,
  care_type varchar,
  preferred_date date,
  status varchar,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    cb."booking_reference",
    cb."full_name",
    cb."care_type",
    cb."preferred_date",
    cb."status",
    cb."created_at",
    cb."updated_at"
  FROM "public"."care_bookings" cb
  WHERE UPPER(TRIM(cb."booking_reference")) = UPPER(TRIM(COALESCE(p_reference, '')))
    AND LENGTH(TRIM(COALESCE(p_reference, ''))) >= 6
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION "public"."track_booking_by_reference"(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION "public"."track_booking_by_reference"(text) TO anon, authenticated;

-- 5. Configure table-level PostgREST role privileges to match RLS policies
REVOKE ALL ON "public"."admins" FROM anon, authenticated;
GRANT SELECT ON "public"."admins" TO authenticated;

REVOKE ALL ON "public"."care_bookings" FROM anon, authenticated;
GRANT INSERT ON "public"."care_bookings" TO anon, authenticated;
GRANT SELECT, UPDATE ON "public"."care_bookings" TO authenticated;

REVOKE ALL ON "public"."booking_status_history" FROM anon, authenticated;
GRANT SELECT, INSERT ON "public"."booking_status_history" TO authenticated;

REVOKE ALL ON "public"."contact_enquiries" FROM anon, authenticated;
GRANT INSERT ON "public"."contact_enquiries" TO anon, authenticated;
GRANT SELECT, UPDATE ON "public"."contact_enquiries" TO authenticated;

REVOKE ALL ON "public"."job_applications" FROM anon, authenticated;
GRANT INSERT ON "public"."job_applications" TO anon, authenticated;
GRANT SELECT, UPDATE ON "public"."job_applications" TO authenticated;

-- 6. RLS Policies for public.admins
-- Authenticated users may only read their own active admin row; no client writes allowed.
DROP POLICY IF EXISTS "admins_select_own_active_record" ON "public"."admins";
CREATE POLICY "admins_select_own_active_record"
  ON "public"."admins"
  FOR SELECT
  TO authenticated
  USING (auth.uid() = "auth_user_id" AND "is_active" = true);

-- 7. RLS Policies for public.care_bookings
-- Public users can only insert new bookings in initial 'Pending Verification' state.
-- Only authorized admins can SELECT or UPDATE bookings.
DROP POLICY IF EXISTS "care_bookings_public_insert" ON "public"."care_bookings";
CREATE POLICY "care_bookings_public_insert"
  ON "public"."care_bookings"
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    "status" = 'Pending Verification'
    AND LENGTH(TRIM("booking_reference")) > 0
    AND LENGTH(TRIM("full_name")) > 0
    AND LENGTH(TRIM("phone")) > 0
    AND LENGTH(TRIM("care_type")) > 0
  );

DROP POLICY IF EXISTS "care_bookings_admin_select" ON "public"."care_bookings";
CREATE POLICY "care_bookings_admin_select"
  ON "public"."care_bookings"
  FOR SELECT
  TO authenticated
  USING ("public"."is_authorized_admin"());

DROP POLICY IF EXISTS "care_bookings_admin_update" ON "public"."care_bookings";
CREATE POLICY "care_bookings_admin_update"
  ON "public"."care_bookings"
  FOR UPDATE
  TO authenticated
  USING ("public"."is_authorized_admin"())
  WITH CHECK ("public"."is_authorized_admin"());

-- 8. RLS Policies for public.booking_status_history
-- Only authorized admins can view or record status transitions.
DROP POLICY IF EXISTS "booking_status_history_admin_select" ON "public"."booking_status_history";
CREATE POLICY "booking_status_history_admin_select"
  ON "public"."booking_status_history"
  FOR SELECT
  TO authenticated
  USING ("public"."is_authorized_admin"());

DROP POLICY IF EXISTS "booking_status_history_admin_insert" ON "public"."booking_status_history";
CREATE POLICY "booking_status_history_admin_insert"
  ON "public"."booking_status_history"
  FOR INSERT
  TO authenticated
  WITH CHECK ("public"."is_authorized_admin"());

-- 9. RLS Policies for public.contact_enquiries
-- Public users can only insert new contact enquiries with 'New' status.
-- Only authorized admins can SELECT or UPDATE enquiries.
DROP POLICY IF EXISTS "contact_enquiries_public_insert" ON "public"."contact_enquiries";
CREATE POLICY "contact_enquiries_public_insert"
  ON "public"."contact_enquiries"
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    "status" = 'New'
    AND LENGTH(TRIM("full_name")) > 0
    AND LENGTH(TRIM("email")) > 0
    AND LENGTH(TRIM("phone")) > 0
    AND LENGTH(TRIM("subject")) > 0
    AND LENGTH(TRIM("message")) > 0
  );

DROP POLICY IF EXISTS "contact_enquiries_admin_select" ON "public"."contact_enquiries";
CREATE POLICY "contact_enquiries_admin_select"
  ON "public"."contact_enquiries"
  FOR SELECT
  TO authenticated
  USING ("public"."is_authorized_admin"());

DROP POLICY IF EXISTS "contact_enquiries_admin_update" ON "public"."contact_enquiries";
CREATE POLICY "contact_enquiries_admin_update"
  ON "public"."contact_enquiries"
  FOR UPDATE
  TO authenticated
  USING ("public"."is_authorized_admin"())
  WITH CHECK ("public"."is_authorized_admin"());

-- 10. RLS Policies for public.job_applications
-- Public users can only insert new job applications with 'Application Received' status.
-- Only authorized admins can SELECT or UPDATE job applications.
DROP POLICY IF EXISTS "job_applications_public_insert" ON "public"."job_applications";
CREATE POLICY "job_applications_public_insert"
  ON "public"."job_applications"
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    "status" = 'Application Received'
    AND LENGTH(TRIM("application_reference")) > 0
    AND LENGTH(TRIM("full_name")) > 0
    AND LENGTH(TRIM("email")) > 0
    AND LENGTH(TRIM("phone")) > 0
    AND LENGTH(TRIM("position")) > 0
  );

DROP POLICY IF EXISTS "job_applications_admin_select" ON "public"."job_applications";
CREATE POLICY "job_applications_admin_select"
  ON "public"."job_applications"
  FOR SELECT
  TO authenticated
  USING ("public"."is_authorized_admin"());

DROP POLICY IF EXISTS "job_applications_admin_update" ON "public"."job_applications";
CREATE POLICY "job_applications_admin_update"
  ON "public"."job_applications"
  FOR UPDATE
  TO authenticated
  USING ("public"."is_authorized_admin"())
  WITH CHECK ("public"."is_authorized_admin"());
