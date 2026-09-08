-- ==============================================================================
-- SkillBridge — Sample Seed Data for Supabase SQL Editor
-- Run this AFTER executing schema.sql
-- ==============================================================================

-- Note: When signing up users via Supabase Auth, pass:
-- { "data": { "name": "...", "role": "student"|"recruiter"|"admin", "college": "...", "company": "..." } }

-- Example demo user profiles (UUIDs are generated for reference)
DO $$
DECLARE
  v_admin_id UUID := '11111111-1111-1111-1111-111111111111'::UUID;
  v_recruiter_id UUID := '22222222-2222-2222-2222-222222222222'::UUID;
  v_student_id UUID := '33333333-3333-3333-3333-333333333333'::UUID;
  v_opp1_id UUID := gen_random_uuid();
  v_opp2_id UUID := gen_random_uuid();
BEGIN
  -- Insert Mock Profiles if not exists
  INSERT INTO public.profiles (id, name, email, role, college, company)
  VALUES
    (v_admin_id, 'Prof. Robert Vance', 'admin@skillbridge.edu', 'admin', 'Institute of Advanced Technology', ''),
    (v_recruiter_id, 'Sarah Jenkins', 'recruiter@techcorp.com', 'recruiter', '', 'TechCorp Labs'),
    (v_student_id, 'Alex Rivera', 'student@skillbridge.edu', 'student', 'Institute of Advanced Technology', '')
  ON CONFLICT (id) DO NOTHING;

  -- Insert Student Profile
  INSERT INTO public.student_profiles (user_id, name, email, college, branch, graduation_year, skills, interests, bio, role_readiness)
  VALUES (
    v_student_id,
    'Alex Rivera',
    'student@skillbridge.edu',
    'Institute of Advanced Technology',
    'Computer Science & Engineering',
    2026,
    ARRAY['React', 'JavaScript', 'HTML/CSS', 'Git', 'Tailwind CSS', 'Node.js'],
    ARRAY['Frontend Engineering', 'Full Stack Architecture'],
    'Enthusiastic final-year CSE undergraduate passionate about building scalable, accessible web applications.',
    '{
      "frontend": {"percentage": 85, "strengths": ["React & State Management", "Modern JavaScript (ES6+)", "Git & Version Control"], "gaps": ["TypeScript", "Testing"], "recommendation": "You are 85% ready for Frontend Developer. Improve TypeScript and Testing."},
      "dataAnalyst": {"percentage": 50, "strengths": ["Problem Solving"], "gaps": ["SQL", "Python"], "recommendation": "You are 50% ready for Data Analyst. Improve SQL and Python."},
      "backend": {"percentage": 70, "strengths": ["RESTful API Architecture", "Node.js & Express"], "gaps": ["Database Indexing"], "recommendation": "You are 70% ready for Backend Developer. Improve Database Indexing."}
    }'::JSONB
  ) ON CONFLICT (user_id) DO NOTHING;

  -- Insert Sample Opportunities
  INSERT INTO public.opportunities (id, recruiter_id, title, company, type, location, stipend_or_salary, duration, deadline, description, required_skills, eligibility)
  VALUES
    (v_opp1_id, v_recruiter_id, 'Frontend Engineering Intern', 'TechCorp Labs', 'Internship', 'Remote', '₹35,000 / month', '6 Months', NOW() + INTERVAL '30 days', 'Join our design systems engineering squad building next-generation web portals in React.', ARRAY['React', 'JavaScript', 'Tailwind CSS', 'Git'], 'Pre-final or final year B.Tech / MCA students'),
    (v_opp2_id, v_recruiter_id, 'Junior Full Stack Developer', 'TechCorp Labs', 'Job', 'Bangalore, India', '₹10 - 14 LPA', 'Full Time', NOW() + INTERVAL '45 days', 'Develop end-to-end cloud platforms with React and Node.js.', ARRAY['React', 'Node.js', 'MongoDB', 'JavaScript', 'REST APIs'], 'B.Tech / MCA batch of 2025/2026')
  ON CONFLICT (id) DO NOTHING;

  -- Insert Sample Application
  INSERT INTO public.applications (opportunity_id, student_id, match_score, matched_skills, missing_skills, recommendation_message, status, notes)
  VALUES (
    v_opp1_id,
    v_student_id,
    100,
    ARRAY['React', 'JavaScript', 'Tailwind CSS', 'Git'],
    ARRAY[]::TEXT[],
    'Outstanding match! You possess 100% of the required skills. We strongly recommend applying.',
    'Interview',
    'I have extensive experience building React portals with Tailwind CSS and Git.'
  ) ON CONFLICT ON CONSTRAINT unique_student_opportunity DO NOTHING;

  -- Insert Sample Verified Certificate
  INSERT INTO public.certificates (student_id, title, issuer, credential_url, verification_status, verified_by, verified_at, notes)
  VALUES (
    v_student_id,
    'Meta Front-End Developer Professional Certificate',
    'Coursera / Meta',
    'https://coursera.org/verify/META-FE-99201',
    'verified',
    v_admin_id,
    NOW(),
    'Verified via official Meta certification registry.'
  );

  -- Insert Sample Verified Project
  INSERT INTO public.projects (student_id, title, description, technologies, repo_url, live_url, verification_status, verified_by, verified_at, notes)
  VALUES (
    v_student_id,
    'DevConnect - Developer Collaboration Network',
    'A full-stack social portal for developers featuring markdown article publishing and real-time discussions.',
    ARRAY['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    'https://github.com/alexrivera/devconnect',
    'https://devconnect-demo.example.com',
    'verified',
    v_admin_id,
    NOW(),
    'Capstone engineering project verified by Department Board.'
  );
END $$;