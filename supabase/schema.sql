-- ====================================================================
-- SkillBridge — Supabase PostgreSQL Database Schema Plan
-- Production-ready schema with Row-Level Security (RLS) & Multi-Role Policies
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'recruiter', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE opportunity_type AS ENUM ('internship', 'job');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('Pending', 'Verified', 'Rejected');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 3. PROFILES TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  college TEXT DEFAULT '',
  company TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  branch TEXT DEFAULT '',
  graduation_year INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SKILLS CATALOG
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'frontend', 'backend', 'data', 'cloud', 'soft_skills'
  description TEXT,
  demand_score INTEGER DEFAULT 50 CHECK (demand_score BETWEEN 1 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. STUDENT SKILLS (Many-to-Many Mapping)
CREATE TABLE IF NOT EXISTS public.student_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency_level TEXT NOT NULL DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, skill_id)
);

-- 6. OPPORTUNITIES (Jobs, Internships & Programs posted by Industry Recruiters)
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'internship', -- 'internship', 'job', 'apprenticeship', 'workshop', 'fdp'
  work_mode TEXT NOT NULL DEFAULT 'remote', -- 'remote', 'hybrid', 'on_site'
  location TEXT NOT NULL,
  stipend_or_salary TEXT NOT NULL,
  duration TEXT DEFAULT '3 Months',
  deadline TIMESTAMPTZ NOT NULL,
  description TEXT NOT NULL,
  required_skills TEXT[] NOT NULL DEFAULT '{}',
  eligibility TEXT DEFAULT '',
  openings_count INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'closed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. APPLICATIONS (Skill Matching & Placement Pipeline)
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recruiter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  match_percentage INTEGER NOT NULL DEFAULT 0 CHECK (match_percentage BETWEEN 0 AND 100),
  matched_skills TEXT[] NOT NULL DEFAULT '{}',
  missing_skills TEXT[] NOT NULL DEFAULT '{}',
  recommendation_message TEXT DEFAULT '',
  status application_status NOT NULL DEFAULT 'Applied',
  notes TEXT DEFAULT '',
  recruiter_notes TEXT DEFAULT '',
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(opportunity_id, student_id)
);

-- 8. ASSESSMENTS (Skill Evaluation & Role Readiness Results)
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

-- 9. CERTIFICATIONS & PROJECTS (Digital Verified Portfolio)
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE NOT NULL,
  credential_url TEXT,
  status verification_status NOT NULL DEFAULT 'Pending',
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMPTZ,
  admin_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. PROJECTS (Student Digital Portfolio)
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

-- 11. ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  issuer TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone authenticated can read basic profiles, user can edit own profile
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Skills: All authenticated users can read skills catalog
CREATE POLICY "Skills are viewable by all authenticated users"
  ON public.skills FOR SELECT
  TO authenticated
  USING (true);

-- Student Skills: Students can manage own skills
CREATE POLICY "Students can manage own skills"
  ON public.student_skills FOR ALL
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Opportunities: All users can view active opportunities
CREATE POLICY "Active opportunities are viewable by all"
  ON public.opportunities FOR SELECT
  TO authenticated
  USING (status = 'active' OR auth.uid() = recruiter_id);

CREATE POLICY "Recruiters can insert own opportunities"
  ON public.opportunities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = recruiter_id);

CREATE POLICY "Recruiters can update own opportunities"
  ON public.opportunities FOR UPDATE
  TO authenticated
  USING (auth.uid() = recruiter_id);

-- Applications: Strict RBAC & Isolation
CREATE POLICY "Students can view own applications"
  ON public.applications FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students can submit application"
  ON public.applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Recruiters can view applications for their opportunities"
  ON public.applications FOR SELECT
  TO authenticated
  USING (
    auth.uid() = recruiter_id OR 
    EXISTS (SELECT 1 FROM public.opportunities o WHERE o.id = opportunity_id AND o.recruiter_id = auth.uid())
  );

CREATE POLICY "Recruiters can update status and notes for their opportunities"
  ON public.applications FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = recruiter_id OR 
    EXISTS (SELECT 1 FROM public.opportunities o WHERE o.id = opportunity_id AND o.recruiter_id = auth.uid())
  )
  WITH CHECK (
    auth.uid() = recruiter_id OR 
    EXISTS (SELECT 1 FROM public.opportunities o WHERE o.id = opportunity_id AND o.recruiter_id = auth.uid())
  );

CREATE POLICY "Admins can view all applications"
  ON public.applications FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Assessments: Students can view and record own assessments
CREATE POLICY "Students manage own assessments"
  ON public.assessments FOR ALL
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Projects: Students manage own, admins verify all, public views verified
CREATE POLICY "Students manage own projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins view and verify projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Public views verified projects"
  ON public.projects FOR SELECT
  TO anon, authenticated
  USING (status = 'Verified');

-- Certifications: Admins verify all, public views verified
CREATE POLICY "Admins view and verify certifications"
  ON public.certifications FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Public views verified certifications"
  ON public.certifications FOR SELECT
  TO anon, authenticated
  USING (status = 'Verified');

-- Achievements: Students manage own, admins view all
CREATE POLICY "Students manage own achievements"
  ON public.achievements FOR ALL
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins view all achievements"
  ON public.achievements FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));


-- ====================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SUPABASE AUTH SIGNUP
-- ====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, college, company)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'student'::public.user_role),
    COALESCE(NEW.raw_user_meta_data->>'college', ''),
    COALESCE(NEW.raw_user_meta_data->>'company', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    name = EXCLUDED.name,
    email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- SEED INITIAL SKILLS CATALOG
-- ====================================================================

INSERT INTO public.skills (name, category, demand_score, description) VALUES
  ('React', 'frontend', 95, 'Component architecture, Hooks, Context, Virtual DOM'),
  ('TypeScript', 'frontend', 92, 'Static typing, Generics, Type inference, Interfaces'),
  ('Tailwind CSS', 'frontend', 88, 'Utility-first styling, Responsive layouts, Glassmorphism'),
  ('Next.js', 'frontend', 90, 'Server components, SSR, SSG, App Router'),
  ('Node.js', 'backend', 94, 'Event loop, Asynchronous I/O, Streams, Microservices'),
  ('Express.js', 'backend', 89, 'RESTful endpoints, Middleware pipeline, Routing'),
  ('PostgreSQL', 'backend', 93, 'Relational queries, Indexing, Triggers, JSONB'),
  ('Python', 'data', 96, 'Data structures, Scripting, Automation, ML foundation'),
  ('SQL & Data Modeling', 'data', 91, 'Complex JOINs, Aggregations, Window functions'),
  ('Pandas & NumPy', 'data', 87, 'Data manipulation, Feature engineering, Numerical analysis'),
  ('Docker', 'cloud', 85, 'Containerization, Multi-stage builds, Container networks'),
  ('Git & GitHub', 'soft_skills', 95, 'Version control, Branching workflows, PR review culture'),
  ('System Design', 'backend', 89, 'Scalability, Caching, Load balancing, Message queues'),
  ('Communication & Teamwork', 'soft_skills', 90, 'Agile ceremonies, Technical writing, Cross-functional collaboration')
ON CONFLICT (name) DO NOTHING;