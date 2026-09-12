-- ====================================================================
-- SkillBridge Migration: Assessments & Role Readiness Module
-- Adds full support for 10-skill confidence scoring & role calculations
-- ====================================================================

-- 1. Ensure public.assessments has all required columns
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_score INTEGER NOT NULL DEFAULT 0,
  max_score INTEGER NOT NULL DEFAULT 50,
  percentage INTEGER NOT NULL DEFAULT 0,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  skill_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  role_readiness JSONB NOT NULL DEFAULT '{}'::jsonb,
  recommended_role TEXT DEFAULT '',
  recommendation_message TEXT DEFAULT '',
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- In case table already existed from baseline, alter columns gracefully
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'answers') THEN
    ALTER TABLE public.assessments ADD COLUMN answers JSONB NOT NULL DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'skill_scores') THEN
    ALTER TABLE public.assessments ADD COLUMN skill_scores JSONB NOT NULL DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'recommended_role') THEN
    ALTER TABLE public.assessments ADD COLUMN recommended_role TEXT DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'recommendation_message') THEN
    ALTER TABLE public.assessments ADD COLUMN recommendation_message TEXT DEFAULT '';
  END IF;

  ALTER TABLE public.assessments ALTER COLUMN max_score SET DEFAULT 50;
END $$;

-- 2. Indexes for high-performance lookup
CREATE INDEX IF NOT EXISTS idx_assessments_student_id ON public.assessments(student_id);
CREATE INDEX IF NOT EXISTS idx_assessments_completed_at ON public.assessments(completed_at DESC);

-- 3. Row Level Security (RLS)
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students manage own assessments" ON public.assessments;
CREATE POLICY "Students manage own assessments"
  ON public.assessments FOR ALL
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Staff and recruiters can view student assessments" ON public.assessments;
CREATE POLICY "Staff and recruiters can view student assessments"
  ON public.assessments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('recruiter', 'admin')
    )
  );