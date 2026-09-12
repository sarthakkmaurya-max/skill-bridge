-- ====================================================================
-- SkillBridge Migration: Application Tracking & Recruiter Shortlisting
-- File: supabase/migrations/20260911_applications_module.sql
-- Date: 2026-09-11
-- ====================================================================

-- 1. Ensure application_status enum or constraint contains all 5 required statuses
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
    CREATE TYPE application_status AS ENUM ('Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected');
  ELSE
    -- In case type exists, ensure all enum values are present
    BEGIN
      ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'Interview';
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
    BEGIN
      ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'Selected';
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
    BEGIN
      ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'Rejected';
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;

-- 2. Ensure applications table exists and has all required columns
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recruiter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  match_percentage INTEGER NOT NULL DEFAULT 0 CHECK (match_percentage BETWEEN 0 AND 100),
  matched_skills TEXT[] NOT NULL DEFAULT '{}',
  missing_skills TEXT[] NOT NULL DEFAULT '{}',
  status application_status NOT NULL DEFAULT 'Applied',
  notes TEXT DEFAULT '',
  recruiter_notes TEXT DEFAULT '',
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(opportunity_id, student_id)
);

-- Add columns if table already existed without them
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS recruiter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS match_percentage INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS recruiter_notes TEXT DEFAULT '';
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Ensure unique constraint on (opportunity_id, student_id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'applications_opportunity_student_unique'
  ) THEN
    BEGIN
      ALTER TABLE public.applications ADD CONSTRAINT applications_opportunity_student_unique UNIQUE (opportunity_id, student_id);
    EXCEPTION
      WHEN duplicate_table OR duplicate_object THEN NULL;
    END;
  END IF;
END $$;

-- 3. Useful Performance Indexes
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON public.applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_opportunity_id ON public.applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_applications_recruiter_id ON public.applications(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);

-- 4. Enable Row-Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Drop prior policies to guarantee clean update
DROP POLICY IF EXISTS "Students can view and create own applications" ON public.applications;
DROP POLICY IF EXISTS "Students can submit application" ON public.applications;
DROP POLICY IF EXISTS "Recruiters can update application status" ON public.applications;
DROP POLICY IF EXISTS "Students can view own applications" ON public.applications;
DROP POLICY IF EXISTS "Recruiters can view applications for their opportunities" ON public.applications;
DROP POLICY IF EXISTS "Recruiters can update status and notes for their opportunities" ON public.applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can update all applications" ON public.applications;

-- Policy 1: Students can view only their own applications
CREATE POLICY "Students can view own applications"
  ON public.applications FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

-- Policy 2: Students can insert only their own applications
CREATE POLICY "Students can submit application"
  ON public.applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

-- Policy 3: Recruiters can view applications only for their own opportunities
CREATE POLICY "Recruiters can view applications for their opportunities"
  ON public.applications FOR SELECT
  TO authenticated
  USING (
    auth.uid() = recruiter_id OR 
    EXISTS (
      SELECT 1 FROM public.opportunities o 
      WHERE o.id = opportunity_id AND o.recruiter_id = auth.uid()
    )
  );

-- Policy 4: Recruiters can update status and notes only for their own opportunities
CREATE POLICY "Recruiters can update status and notes for their opportunities"
  ON public.applications FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = recruiter_id OR 
    EXISTS (
      SELECT 1 FROM public.opportunities o 
      WHERE o.id = opportunity_id AND o.recruiter_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() = recruiter_id OR 
    EXISTS (
      SELECT 1 FROM public.opportunities o 
      WHERE o.id = opportunity_id AND o.recruiter_id = auth.uid()
    )
  );

-- Policy 5: Admins can view all applications
CREATE POLICY "Admins can view all applications"
  ON public.applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Policy 6: Admins can update all applications
CREATE POLICY "Admins can update all applications"
  ON public.applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
