-- CreateTable
CREATE TABLE "admins" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "care_bookings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "booking_reference" VARCHAR(32) NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(40) NOT NULL,
    "care_type" VARCHAR(100) NOT NULL,
    "patient_details" JSONB NOT NULL,
    "preferred_date" DATE NOT NULL,
    "address" JSONB NOT NULL,
    "additional_notes" TEXT,
    "status" VARCHAR(50) NOT NULL DEFAULT 'Pending Verification',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "care_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_enquiries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "full_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(40) NOT NULL,
    "subject" VARCHAR(200) NOT NULL,
    "message" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'New',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "contact_enquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "application_reference" VARCHAR(32) NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(40) NOT NULL,
    "cpr_no" VARCHAR(40),
    "address" TEXT NOT NULL,
    "position" VARCHAR(120) NOT NULL,
    "experience" VARCHAR(80) NOT NULL,
    "qualification" VARCHAR(180) NOT NULL,
    "license_number" VARCHAR(100),
    "availability" VARCHAR(80),
    "message" TEXT,
    "cv_path" VARCHAR(500),
    "cv_original_name" VARCHAR(255),
    "certificate_path" VARCHAR(500),
    "certificate_name" VARCHAR(255),
    "status" VARCHAR(50) NOT NULL DEFAULT 'Application Received',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_status_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "booking_id" UUID NOT NULL,
    "previous_status" VARCHAR(50),
    "new_status" VARCHAR(50) NOT NULL,
    "changed_by" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE INDEX "admins_email_idx" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "care_bookings_booking_reference_key" ON "care_bookings"("booking_reference");

-- CreateIndex
CREATE INDEX "care_bookings_booking_reference_idx" ON "care_bookings"("booking_reference");

-- CreateIndex
CREATE INDEX "care_bookings_status_idx" ON "care_bookings"("status");

-- CreateIndex
CREATE INDEX "care_bookings_preferred_date_idx" ON "care_bookings"("preferred_date");

-- CreateIndex
CREATE INDEX "care_bookings_created_at_idx" ON "care_bookings"("created_at" DESC);

-- CreateIndex
CREATE INDEX "care_bookings_phone_idx" ON "care_bookings"("phone");

-- CreateIndex
CREATE INDEX "contact_enquiries_status_idx" ON "contact_enquiries"("status");

-- CreateIndex
CREATE INDEX "contact_enquiries_created_at_idx" ON "contact_enquiries"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "job_applications_application_reference_key" ON "job_applications"("application_reference");

-- CreateIndex
CREATE INDEX "job_applications_application_reference_idx" ON "job_applications"("application_reference");

-- CreateIndex
CREATE INDEX "job_applications_status_idx" ON "job_applications"("status");

-- CreateIndex
CREATE INDEX "job_applications_created_at_idx" ON "job_applications"("created_at" DESC);

-- CreateIndex
CREATE INDEX "booking_status_history_booking_id_created_at_idx" ON "booking_status_history"("booking_id", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "booking_status_history" ADD CONSTRAINT "booking_status_history_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "care_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
