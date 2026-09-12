# SkillBridge 🎓⚡🏢
### Academia–Industry Collaboration Portal for Skill Mapping, Internships & Placements

SkillBridge is an end-to-end full-stack web application designed to bridge the competency divide between university engineering curricula and modern industry hiring standards. It provides automated skill mapping, real-time Role Readiness indices, and high-velocity placement pipelines connecting Students, Academic Deans, and Enterprise Recruiters.

---

## 🏗️ Architecture & Monorepo Structure

```
skillbridge/
├── client/                     # Frontend Application (React 18 + TypeScript + Tailwind CSS)
│   ├── public/                 # Static public assets
│   ├── src/
│   │   ├── components/         # Glassmorphism UI components (Navbar, Hero, Features, AuthModal, etc.)
│   │   ├── context/            # AuthContext (Supabase Auth + Session + Sandbox Demo personas)
│   │   ├── lib/                # Supabase client singleton & configuration check
│   │   ├── App.tsx             # Main portal landing page
│   │   ├── index.css           # Tailwind + glassmorphism theme utilities
│   │   └── main.tsx            # Application root
│   ├── index.html              # HTML5 template with Inter typography
│   ├── package.json            # Client dependencies & scripts
│   ├── tailwind.config.js      # Custom navy-950, blue, violet & glass theme tokens
│   ├── tsconfig.json           # Client TypeScript configuration
│   └── vite.config.ts          # Vite bundler with @ and @skillbridge/shared aliases
│
├── server/                     # Backend API Server (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/             # Supabase & SupabaseAdmin client initialization
│   │   ├── middleware/         # requireAuth (Bearer JWT verification) & requireRole RBAC
│   │   ├── routes/             # Health check & Auth profile sync endpoints
│   │   └── index.ts            # Express server entry point with Helmet & CORS
│   ├── package.json            # Server dependencies & scripts
│   └── tsconfig.json           # Server TypeScript configuration
│
├── shared/                     # Shared TypeScript Data Models & Contracts
│   ├── src/
│   │   ├── types.ts            # UserRole, UserProfile, Skill, Opportunity, Application, etc.
│   │   └── index.ts            # Public export index
│   ├── package.json            # Shared package manifest
│   └── tsconfig.json           # Shared declaration compiler config
│
├── supabase/                   # Database Architecture & Migration Plan
│   └── schema.sql              # Complete PostgreSQL schema, RLS policies, triggers & seed skills
│
├── .env.example                # Safe environment variable configuration template
├── .gitignore                  # Git ignore rules (strict exclusion of secret files)
├── package.json                # Monorepo workspaces & concurrent script orchestration
└── README.md                   # Comprehensive portal documentation
```

---

## 🎨 Theme & Design Philosophy

SkillBridge features a **dark navy and glassmorphism design system**:
- **Base Background**: Deep Obsidian Navy (`#040914`, `#081225`, `#0F172A`)
- **Accents**: Cyber Blue (`#3B82F6`), Radiant Violet (`#8B5CF6`), and Positive Emerald (`#10B981`)
- **Glass Aesthetics**: Translucent panels with background backdrop blur (`backdrop-filter: blur(16px)`), subtle borders (`rgba(255, 255, 255, 0.08)`), and soft glowing radial spot highlights.

---

## 🔐 Authentication & Security

1. **Supabase Auth Integration**:
   - **Google OAuth**: One-click authentication with Google Workspace accounts.
   - **Email & Password**: Direct signup and signin with email verification.
   - **Role-Aware Profiles**: New signups automatically assign roles (`student`, `recruiter`, `admin`).
2. **PostgreSQL Row-Level Security (RLS)**:
   - All tables enforce strict row-level security.
   - Students can only view and update their own portfolios and applications.
   - Recruiters can only manage postings created by their authenticated user ID.
   - Public opportunities and master skill catalogs remain accessible to verified sessions.
3. **Sandbox Demo Personas**:
   - Built-in instant demo personas allow testing and evaluation of all features without needing live Supabase credentials initially:
     - **Alex Rivera** (Student — Full-Stack Cloud Engineer profile, 88% readiness)
     - **Elena Rostova** (Recruiter — Nexus Cloud Innovations)
     - **Dr. Devraj Patel** (College Admin — Apex Institute of Technology)
4. **Zero-Secret Commitment**:
   - No production secrets or live keys are tracked in git or committed to source files.
   - All configurations are loaded via environment variables (`.env`).

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js `v18.0+` or `v20.0+`
- npm `v9.0+` or `v10.0+`

### 1. Installation
Install all dependencies across the entire monorepo with a single command:
```bash
npm run install:all
```

### 2. Environment Configuration (Supabase & Backend Setup)

#### Frontend Configuration (`client/.env`)
Follow these steps to connect your frontend application to a live Supabase project:
1. **Open Supabase**: Go to [Supabase Dashboard](https://supabase.com/dashboard) → select your project → **Project Settings** → **API**.
2. **Copy Credentials**:
   - Copy the **Project URL** (e.g. `https://xyzprojectref.supabase.co`)
   - Copy the **anon / public key**
3. **Create `client/.env`**:
   - Create `client/.env` using the template in `client/.env.example`:
     ```bash
     cp client/.env.example client/.env
     ```
   - Set your copied values in `client/.env`:
     ```env
     VITE_SUPABASE_URL=https://your-project-ref.supabase.co
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key
     ```
4. **Security Notice**:
   > ⚠️ **IMPORTANT**: **Never use the `service_role` key in the frontend!** The frontend only needs the public `anon` key. The `service_role` key bypasses all Row-Level Security (RLS) policies and must strictly remain on the backend server (`server/.env`).
5. **Restart Development Server**:
   - After adding or updating values in `client/.env`, restart your dev server for Vite to pick up the new variables:
     ```bash
     npm run dev
     ```

> ⚡ **Quick Sandbox Demo Mode**: If you have not configured Supabase credentials yet, SkillBridge automatically runs in local sandbox mode without crashing! You can immediately explore all features using **"Quick Sandbox Demo Access"** on the login screen with full Student, Recruiter, and College Admin personas.

#### Root & Backend Configuration (`server/.env`)
Copy `.env.example` in the root or server directory for backend API services:
```bash
cp .env.example .env
```
Set your backend values in `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
JWT_SECRET=your-secure-jwt-secret-key-min-32-chars
```

### 3. Database Schema & Migrations Setup
1. Open your Supabase Dashboard project: [https://database.new](https://database.new)
2. Navigate to the **SQL Editor**.
3. Run the baseline schema: execute [`supabase/schema.sql`](./supabase/schema.sql).
4. If updating an existing database, run the assessment migration: [`supabase/migrations/20260911_assessments_module.sql`](./supabase/migrations/20260911_assessments_module.sql).
5. *(Optional Google OAuth)* In Supabase Dashboard, go to **Authentication > Providers > Google**, enable the toggle, and paste your Google Cloud OAuth Client ID & Client Secret. Add `https://<your-supabase-ref>.supabase.co/auth/v1/callback` to Authorized Redirect URIs in Google Cloud Console.

### 4. Student Skill Assessment & Role Readiness Flow
- **10 Assessed Skills**: HTML/CSS, JavaScript, React, Git, SQL, Python, Communication, Teamwork, Problem Solving, Adaptability.
- **Rating Scale**: 1 (Novice) to 5 (Expert).
- **Rule-Based Roles**:
  - **Frontend Developer**: Weighted heavily on React (25%), JavaScript (20%), HTML/CSS (15%), Git (10%), Problem Solving (10%), Communication (10%).
  - **Data Analyst**: Weighted heavily on SQL (25%), Python (25%), Problem Solving (15%), Communication (15%), Git (10%).
  - **Backend Developer**: Weighted heavily on SQL (20%), Python (20%), JavaScript (15%), Git (15%), Problem Solving (15%).
- **Interactive UI**: Single-question wizard ("Question X of 10"), animated circular SVG score gauge, green strength chips, red/amber gap chips, and 1-click retake.
- **Protected Student Dashboard**: 5 tabs (`Overview`, `Skill Assessment`, `Opportunities`, `Applications`, `Digital Portfolio`).

### 5. Opportunity Management & Smart Skill-Match Engine
- **5 Opportunity Categories**:
  - `internship`: Paid industrial training & pre-placement internships.
  - `job`: Full-time graduate entry & associate engineering roles.
  - `apprenticeship`: 12-month structured on-the-job training tracks.
  - `workshop`: Hands-on technical bootcamps & certification clinics.
  - `fdp`: Faculty Development Programs bridging academia and industry curricula.
- **Work Modes**: `remote`, `hybrid`, `on_site`.
- **Preloaded Indian Industry Postings**:
  - **Nexus Cloud India**: Frontend React Engineering Intern (Bengaluru, ₹45,000/mo)
  - **Razorpay Payments**: Backend Systems & API Associate (Bengaluru, ₹14,00,000/yr)
  - **Zerodha Broking**: Web Platforms & UI Apprenticeship (Remote Pan-India, ₹40,000/mo)
  - **TCS Innovation Labs**: Data Intelligence & Analytics Specialist (Hyderabad, ₹7,50,000/yr)
  - **Infosys Springboard**: Cloud Architecture & DevOps Workshop (Virtual, Merit Grant)
  - **IIT Bombay / AICTE**: Faculty Development Program in AI & Systems (Mumbai, Funded Research Grant)
  - **Flipkart Internet**: SDE Intern — Catalog & Search Platforms (Bengaluru, ₹85,000/mo)
- **Deterministic Smart Matching Engine**:
  - Rule-based competency alignment matching student's 10 assessed ratings with opportunity required skills.
  - Normalizes aliases (e.g. `html_css` maps to HTML5, CSS3, Tailwind; `react` maps to Next.js; `sql` maps to PostgreSQL).
  - Generates transparent match score (`matchPercentage`), `matchedSkills`, `missingSkills`, and prescriptive recommendation.
  - 100% deterministic and client/server agnostic without external AI dependencies.

### 6. Recruiter Dashboard Suite
- **Dedicated Recruiter Portal**: Accessible directly to recruiter persona with protected sidebar.
  - **Overview**: Talent pipeline statistics, active drives, average candidate match metrics.
  - **Post Opportunity**: Multi-field form with dynamic skill chips selector, openings count, duration, compensation, deadline, and eligibility.
  - **My Opportunities**: Complete recruiter-isolated CRUD management (View, Edit Modal, Active/Closed Status Toggle, Delete).
  - **Applicants**: Student candidate pipeline with match percentages, verified readiness badges, and action buttons.
  - **Company Profile**: Editable employer identity, headquarters, contact details, and tech stack tags.

### 7. Student Opportunities View
- **Search & Multi-Dimensional Filtering**: Search by keyword, filter across 5 opportunity types, work modes, and required skills.
- **Smart Sorting**: Sort by Highest Smart Match Score, Recently Posted, Number of Openings, or Upcoming Deadline.
- **Opportunity Detail Modal**: Rich glassmorphic modal detailing competency match breakdown, matched vs missing skills, and "Apply Now" trigger.

### 8. Application Tracking & Recruiter Shortlisting Flow
- **Fully Functional Application Flow**:
  - Clicking **"Apply Now"** opens the **Apply Confirmation Modal** displaying the live match percentage, matched skills, missing skills, and an optional message.
  - **Single Application Constraint**: Students can submit only one application per opportunity; duplicate submissions are rejected at both client and server layers.
  - **Initial Status**: New applications are always created with status `'Applied'`.
  - **Instant Redirection & Toast**: On confirmation, a success toast appears and the student is seamlessly redirected to the Applications page.
- **Interactive Application Journey Timeline**:
  - Visual 4-stage progression: `Applied → Shortlisted → Interview → Selected`.
  - Active stages feature animated glowing pulses; completed stages display verified checkmarks.
  - Custom styling for `Rejected` applications with guidance on other matching positions.
  - **Recruiter Feedback Callouts**: Private recruiter review notes and interview details appear in a dedicated glassmorphism quote banner when available.
  - Filter by status: `All`, `Applied`, `Shortlisted`, `Interview`, `Selected`, `Rejected`.
- **Recruiter Applicants Evaluation Suite**:
  - Isolated review: Recruiters only view applicants for opportunities they posted.
  - Filter applicants by specific opportunity and by status; sort by Highest Smart Match %, Recently Applied, or Highest Role Readiness.
  - **Candidate Detail Modal**: Full candidate profile displaying university, degree, bio, 10-skill assessment matrix, student projects (with GitHub links), and verified certifications.
  - **Status Change Confirmation Dialog**: Modal to advance candidates (`Applied` → `Shortlisted` → `Interview` → `Selected` / `Rejected`) with customizable private recruiter notes and quick preset templates.
- **Sandbox Demo Pre-Seeded Applications**:
  - Preloaded with realistic mock applications demonstrating all 5 statuses:
    - **Nexus Cloud India**: Frontend React Intern — `Shortlisted` (Alex Rivera, 92% Match)
    - **Zerodha Broking**: Web Platforms Apprenticeship — `Interview` (Alex Rivera, 88% Match)
    - **Razorpay Payments**: Backend Systems Associate — `Applied` (Alex Rivera, 78% Match)
    - **Infosys Springboard**: Cloud Architecture Workshop — `Selected` (Alex Rivera, 95% Match)
    - **Elena Rostova Recruiter Pipeline**: Candidates across IIT Bombay, DTU, and NIT Surathkal demonstrating `Shortlisted`, `Interview`, `Applied`, and `Rejected`.

### 9. Student Digital Portfolio & Verified Credentials
- **Student Digital Portfolio (`PortfolioTab.tsx`)**:
  - **Profile Summary Header**: Real-time display of Student Name, Branch, College, Class of 2026, Target Role, and Role Readiness score benchmark.
  - **Profile Completion Meter**: Dynamic circular gauge calculating profile completeness percentage (0–100%) with actionable tips for reaching 100%.
  - **Resume Link Manager**: Add, edit, and view verified resume links with 1-click external inspection.
  - **Engineering Projects Manager**: Full CRUD for projects with Title, Description, Technology tags (chips), Live Demo URL, and GitHub Repository URL. Displays real-time institutional status badges (`Verified ✓`, `Pending`, `Rejected`) and faculty review notes.
  - **Certifications & Credentials**: Full CRUD for industry certifications with Title, Issuer, Issue Date, and Credential verification link.
  - **Honors & Achievements**: Showcase hackathon awards, academic merit lists, and department honors.
  - **Assessed Competencies Sync**: Automatically reflects the student's 10-skill standardized benchmark ratings from the assessment module.
  - **Verified Placement Journey**: Automatically pulls active/selected internships and jobs from the student's applications.
- **Privacy-Preserving Public Portfolio**:
  - **Shareable Public Link**: `https://skillbridge.edu/?portfolio=:studentId` or direct modal preview.
  - **Strict Privacy Masking**: Strips student email, internal recruiter notes, and sensitive application data.
  - **Public Verification Showcase**: Public visitors can inspect verified projects, GitHub repositories, live demo links, institutional certificate credentials, and standardized competency benchmarks.

### 10. College Admin Analytics Dashboard & Verification Authority
- **Protected College Admin Portal (`AdminDashboard.tsx`)**:
  - Persona: **Dr. Devraj Patel (Dean of Academics & Placement Cell - Apex Institute of Technology)**.
  - 6 dedicated administrative tabs:
    1. **Overview**: Institutional command center with 6 KPI cards (Total Students, Active Drives, Total Applications, Placement Ready, Selected Candidates, Average Role Readiness), cohort placement velocity progress bar, and recent verification callouts.
    2. **Students Directory**: Searchable student roster with Branch filter and Readiness Tier filter (`Placement Ready ≥85%`, `Proficient 75-84%`, `Developing <75%`) and instant student profile inspector modal.
    3. **Campus Drives**: Overview of active campus recruitment opportunities with recruiter details and applicant counts.
    4. **Applications**: Comprehensive cohort application pipeline tracker with status filters (`Applied`, `Shortlisted`, `Interview`, `Selected`, `Rejected`) and recruiter status notes.
    5. **Verifications Authority**: Pending review queue for student projects and certificates. Admins can 1-click **Approve** (bestowing the `Verified ✓` badge) or **Reject** with custom constructive review notes.
    6. **Skill Analytics**: Interactive SVG and Tailwind visual analytics:
       - **Curriculum Skill Gaps**: Identifies competencies where students lag behind employer demands (e.g. Docker, SQL Optimization).
       - **Top In-Demand Employer Skills**: Real-time recruiter skill demand index (React, Node.js, SQL, TypeScript).
       - **Role Readiness Distribution Curve**: Segmentation of cohort readiness (<60%, 60-74%, 75-84%, 85%+).
       - **Application Conversion Funnel**: Multi-stage conversion metrics from application to offer.
       - **Branch-wise Placement Outcomes**: Comparative placement performance and placed student rates across academic departments.

### 11. Database Migrations Reference
1. **Initial Schema**: [`supabase/schema.sql`](./supabase/schema.sql)
2. **Assessments Module**: [`supabase/migrations/20260911_assessments_module.sql`](./supabase/migrations/20260911_assessments_module.sql)
3. **Opportunities Module**: [`supabase/migrations/20260911_opportunities_module.sql`](./supabase/migrations/20260911_opportunities_module.sql)
4. **Applications Module**: [`supabase/migrations/20260911_applications_module.sql`](./supabase/migrations/20260911_applications_module.sql)
5. **Portfolio & Admin Module**: [`supabase/migrations/20260911_portfolio_admin_module.sql`](./supabase/migrations/20260911_portfolio_admin_module.sql)

### 12. Running Development Servers
Start both the Vite frontend (`http://localhost:5173`) and Express backend API (`http://localhost:5000`) concurrently:
```bash
npm run dev
```

Or run them individually:
```bash
npm run dev:client    # Vite frontend only
npm run dev:server    # Express API only
```

### 13. Production Build
Compile both client and server packages:
```bash
npm run build
```

---

## 📊 Core Features & Stakeholders

| Stakeholder | Key Features |
| :--- | :--- |
| **Students** | • Standardized 10-skill assessment & Role Readiness score (0–100%)<br>• Smart Match opportunity ranking with matched vs missing skill feedback<br>• 1-Click Apply with confirmation modal & duplicate prevention<br>• Real-time Application Journey Timeline (`Applied → Shortlisted → Interview → Selected`)<br>• Student Digital Portfolio with full CRUD for projects, certificates, achievements, and resume<br>• Verified Credential Badges (`Verified ✓`) signed by campus administration<br>• Privacy-preserving Shareable Public Portfolio link |
| **Recruiters** | • Complete Opportunity Lifecycle Management (Post, Edit, Close, Delete)<br>• Skill-first candidate shortlisting with competency alignment<br>• Comprehensive Candidate Profile Modal (projects, certifications, 10-skill breakdown)<br>• Two-step Status Change confirmation dialog with private recruiter notes<br>• Real-time applicant pipeline tracking with opportunity/status filters |
| **Colleges / Deans** | • Real-time curricular demand alignment and skill gap analytics<br>• Cohort placement velocity & stipend tracking (65.5% target achieved)<br>• Digital Credential Verification Authority to approve/reject student projects & certificates<br>• Student Directory with branch & readiness tier filters and portfolio inspection<br>• Accreditation-ready reports (NBA / NAAC / NIRF compliant) |

---

## 🛡️ License
MIT License. Crafted for high-impact academia and industry partnership.