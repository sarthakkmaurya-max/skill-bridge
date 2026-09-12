-- ====================================================================
-- SkillBridge Migration: Opportunity Management & Smart Matching Module
-- Supports 5 opportunity types, work modes, and granular recruiter RLS
-- ====================================================================

-- 1. Ensure work_mode and openings_count exist in public.opportunities
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'opportunities' AND column_name = 'work_mode') THEN
    ALTER TABLE public.opportunities ADD COLUMN work_mode TEXT NOT NULL DEFAULT 'remote';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'opportunities' AND column_name = 'openings_count') THEN
    ALTER TABLE public.opportunities ADD COLUMN openings_count INTEGER NOT NULL DEFAULT 1;
  END IF;

  -- Ensure opportunity type supports internship, job, apprenticeship, workshop, fdp
  ALTER TABLE public.opportunities ALTER COLUMN type TYPE TEXT;
END $$;

-- 2. Indexes for fast filtering by recruiter, type, work_mode, and status
CREATE INDEX IF NOT EXISTS idx_opportunities_recruiter_id ON public.opportunities(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON public.opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_work_mode ON public.opportunities(work_mode);

-- 3. Row-Level Security (RLS) Policies
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active opportunities are viewable by all" ON public.opportunities;
DROP POLICY IF EXISTS "Students view active opportunities" ON public.opportunities;
CREATE POLICY "Students view active opportunities"
  ON public.opportunities FOR SELECT
  TO authenticated
  USING (
    status = 'active' OR 
    auth.uid() = recruiter_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Recruiters can insert own opportunities" ON public.opportunities;
CREATE POLICY "Recruiters can insert own opportunities"
  ON public.opportunities FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = recruiter_id AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('recruiter', 'admin'))
  );

DROP POLICY IF EXISTS "Recruiters can update own opportunities" ON public.opportunities;
CREATE POLICY "Recruiters can update own opportunities"
  ON public.opportunities FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = recruiter_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    auth.uid() = recruiter_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Recruiters can delete own opportunities" ON public.opportunities;
CREATE POLICY "Recruiters can delete own opportunities"
  ON public.opportunities FOR DELETE
  TO authenticated
  USING (
    auth.uid() = recruiter_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );