-- ====================================================================
-- SkillBridge Migration: Student Digital Portfolio & Admin Verification
-- File: supabase/migrations/20260911_portfolio_admin_module.sql
-- ====================================================================

-- 1. Ensure verification_status enum exists
DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('Pending', 'Verified', 'Rejected');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. Add target_role and resume_url to profiles if not present
DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_role TEXT DEFAULT 'Software Engineer';
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS resume_url TEXT DEFAULT '';
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;

-- 3. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  project_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  status verification_status NOT NULL DEFAULT 'Pending',
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMPTZ,
  admin_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  issuer TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Ensure certifications has admin_notes and verified_by
DO $$ BEGIN
  ALTER TABLE public.certifications ADD COLUMN IF NOT EXISTS admin_notes TEXT DEFAULT '';
  ALTER TABLE public.certifications ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES public.profiles(id);
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;

-- 6. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES FOR PROJECTS
CREATE POLICY "Students manage own projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins can view and verify all cohort projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Public can view verified projects"
  ON public.projects FOR SELECT
  TO anon, authenticated
  USING (status = 'Verified');

-- 8. RLS POLICIES FOR ACHIEVEMENTS
CREATE POLICY "Students manage own achievements"
  ON public.achievements FOR ALL
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins can view all achievements"
  ON public.achievements FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- 9. RLS POLICIES FOR CERTIFICATIONS ADMIN VERIFICATION
CREATE POLICY "Admins can view and verify all certifications"
  ON public.certifications FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Public can view verified certifications"
  ON public.certifications FOR SELECT
  TO anon, authenticated
  USING (status = 'Verified');

-- 10. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_projects_student_id ON public.projects(student_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_achievements_student_id ON public.achievements(student_id);
CREATE INDEX IF NOT EXISTS idx_certifications_status ON public.certifications(status);
