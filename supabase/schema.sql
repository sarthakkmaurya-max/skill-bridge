-- ==============================================================================
-- SkillBridge — Academia-Industry Collaboration Portal
-- Database Schema for Supabase (PostgreSQL with RLS & Auth Triggers)
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create User Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('student', 'recruiter', 'admin')) DEFAULT 'student',
  college TEXT DEFAULT '',
  company TEXT DEFAULT '',
  avatar TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Student Profiles Table
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  college TEXT DEFAULT '',
  branch TEXT DEFAULT '',
  graduation_year INT DEFAULT 2026,
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  bio TEXT DEFAULT '',
  resume_url TEXT DEFAULT '',
  role_readiness JSONB DEFAULT '{
    "frontend": {"percentage": 0, "strengths": [], "gaps": [], "recommendation": ""},
    "dataAnalyst": {"percentage": 0, "strengths": [], "gaps": [], "recommendation": ""},
    "backend": {"percentage": 0, "strengths": [], "gaps": [], "recommendation": ""}
  }'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Opportunities Table (Jobs and Internships)
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Internship', 'Job')) DEFAULT 'Internship',
  location TEXT NOT NULL,
  stipend_or_salary TEXT NOT NULL,
  duration TEXT DEFAULT 'Full Time',
  deadline TIMESTAMPTZ NOT NULL,
  description TEXT NOT NULL,
  required_skills TEXT[] DEFAULT '{}',
  eligibility TEXT DEFAULT 'Open to all students and graduates',
  status TEXT NOT NULL CHECK (status IN ('active', 'closed')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Applications Table (includes locked match score & skill gaps)
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  match_score INT NOT NULL DEFAULT 0 CHECK (match_score >= 0 AND match_score <= 100),
  matched_skills TEXT[] DEFAULT '{}',
  missing_skills TEXT[] DEFAULT '{}',
  recommendation_message TEXT DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected')) DEFAULT 'Applied',
  notes TEXT DEFAULT '',
  status_history JSONB DEFAULT '[]'::JSONB,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_student_opportunity UNIQUE(opportunity_id, student_id)
);

-- 6. Create 10-Question Skill Assessments Table
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  answers JSONB DEFAULT '[]'::JSONB,
  total_score INT NOT NULL DEFAULT 0,
  role_readiness JSONB NOT NULL DEFAULT '{}'::JSONB,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Certificates Table (with Admin Verification Badges)
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE DEFAULT CURRENT_DATE,
  credential_url TEXT DEFAULT '',
  verification_status TEXT NOT NULL CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create Projects Table (with Admin Verification Badges)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  repo_url TEXT DEFAULT '',
  live_url TEXT DEFAULT '',
  verification_status TEXT NOT NULL CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. Automatic Profile Creation Trigger on Supabase Auth Sign Up
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
  user_name TEXT;
  user_college TEXT;
  user_company TEXT;
BEGIN
  user_role := COALESCE(new.raw_user_meta_data->>'role', 'student');
  user_name := COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));
  user_college := COALESCE(new.raw_user_meta_data->>'college', '');
  user_company := COALESCE(new.raw_user_meta_data->>'company', '');

  -- Insert profile
  INSERT INTO public.profiles (id, name, email, role, college, company)
  VALUES (new.id, user_name, new.email, user_role, user_college, user_company)
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role;

  -- If student, initialize student profile
  IF user_role = 'student' THEN
    INSERT INTO public.student_profiles (user_id, name, email, college, skills, interests)
    VALUES (new.id, user_name, new.email, user_college, ARRAY['JavaScript', 'HTML/CSS', 'Git'], ARRAY['Web Development'])
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 10. Enable Row Level Security (RLS) on all tables
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone authenticated can view, users can update own profile
CREATE POLICY "Public profiles are viewable by authenticated users" ON public.profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Student Profiles: Authenticated users can view; students can update own
CREATE POLICY "Student profiles viewable by authenticated" ON public.student_profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Students can update own profile" ON public.student_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Opportunities: All authenticated can view active listings
CREATE POLICY "Active opportunities viewable by all authenticated" ON public.opportunities
  FOR SELECT TO authenticated USING (status = 'active' OR auth.uid() = recruiter_id);
CREATE POLICY "Recruiters can insert opportunities" ON public.opportunities
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = recruiter_id);
CREATE POLICY "Recruiters can update own opportunities" ON public.opportunities
  FOR UPDATE TO authenticated USING (auth.uid() = recruiter_id);
CREATE POLICY "Recruiters can delete own opportunities" ON public.opportunities
  FOR DELETE TO authenticated USING (auth.uid() = recruiter_id);

-- Applications: Students can view own, recruiters can view for their opportunities
CREATE POLICY "Students can view their own applications" ON public.applications
  FOR SELECT TO authenticated USING (
    auth.uid() = student_id OR
    EXISTS (SELECT 1 FROM public.opportunities WHERE opportunities.id = applications.opportunity_id AND opportunities.recruiter_id = auth.uid())
  );
CREATE POLICY "Students can insert applications" ON public.applications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Recruiters can update status of applications for their listings" ON public.applications
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.opportunities WHERE opportunities.id = applications.opportunity_id AND opportunities.recruiter_id = auth.uid())
  );

-- Certificates: Viewable by all authenticated, student manages own
CREATE POLICY "Certificates viewable by authenticated users" ON public.certificates
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Students can insert own certificates" ON public.certificates
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can delete own certificates" ON public.certificates
  FOR DELETE TO authenticated USING (auth.uid() = student_id);
CREATE POLICY "Admins can update verification status of certificates" ON public.certificates
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Projects: Viewable by all authenticated, student manages own
CREATE POLICY "Projects viewable by authenticated users" ON public.projects
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Students can insert own projects" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can delete own projects" ON public.projects
  FOR DELETE TO authenticated USING (auth.uid() = student_id);
CREATE POLICY "Admins can update verification status of projects" ON public.projects
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );