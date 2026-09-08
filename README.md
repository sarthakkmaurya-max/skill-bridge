# ?? SkillBridge — Academia–Industry Collaboration Portal

SkillBridge is a modern, full-stack, enterprise-grade web application engineered to bridge the critical gap between academic curriculum and industry hiring requirements. It provides three dedicated, premium SaaS workspaces for **Students**, **Industry Recruiters**, and **College Admins**.

Now featuring **Unified Premium Dark SaaS UI**, **Framer Motion Micro-Interactions**, and **Supabase Database & Authentication Integration** alongside the resilient Mongoose/MongoDB backend.

---

## ?? Clean Project Structure

```
skillbridge/
+-- backend/                    # Node.js & Express REST API Server
¦   +-- src/
¦   ¦   +-- config/             # Supabase & DB connection logic
¦   ¦   +-- controllers/        # Business logic for auth, students, opps, etc.
¦   ¦   +-- middleware/         # JWT auth, RBAC, file uploads, error handling
¦   ¦   +-- models/             # Mongoose & data models
¦   ¦   +-- routes/             # Express API endpoint definitions
¦   ¦   +-- utils/              # Skill matcher & 10-question evaluation engine
¦   ¦   +-- seed.js             # Initial database seed script
¦   ¦   +-- server.js           # Server entry point
¦   +-- uploads/                # Local uploaded resumes and credentials
¦   +-- .env.example            # Backend environment template
¦   +-- package.json            # Backend dependencies
¦
+-- frontend/                   # React 18 + Vite + Tailwind CSS Single-Page App
¦   +-- src/
¦   ¦   +-- components/         # Navbar, LoginModal, shared UI components
¦   ¦   +-- context/            # AuthContext (Supabase + Local JWT auth)
¦   ¦   +-- pages/              # StudentDashboard, RecruiterDashboard, AdminDashboard
¦   ¦   ¦   +-- student/        # 5 Tab sub-views (Readiness, Assessment, Opps, etc.)
¦   ¦   +-- services/           # Axios API client and Supabase SDK client
¦   ¦   +-- App.jsx             # Main router and role view switch
¦   ¦   +-- index.css           # Custom dark SaaS theme, scrollbars, glowing rings
¦   ¦   +-- main.jsx            # React root mount
¦   +-- index.html              # HTML entry template for Vite
¦   +-- .env.example            # Frontend environment template
¦   +-- package.json            # Frontend dependencies
¦
+-- supabase/                   # Supabase PostgreSQL DDL & Seed Scripts
¦   +-- schema.sql              # Tables, RLS security policies, and auth triggers
¦   +-- supabase_seed.sql       # Pre-seeded PostgreSQL sample data
¦
+-- run-dev.bat                 # 1-Click Windows shortcut for full development mode
+-- start-production.bat        # 1-Click Windows shortcut for single-server production
+-- package.json                # Root automation scripts (runs both concurrently)
+-- .gitignore                  # Git ignore rules for node_modules, .env, dist
+-- README.md                   # Complete documentation and setup guide
```

---

## ? How to Run Frontend & Backend (Exact Commands)

### ?? Prerequisites
- **Node.js**: v18+ or v20+
- **npm**: v9+ or v10+

---

### Option 1: Run Both with ONE Command (Recommended) ??

From the root directory `skillbridge/`:

```powershell
# 1. Install all dependencies (Backend + Frontend)
npm run install:all

# 2. Start both Backend (5000) and Frontend (5173) together
npm run dev
```

> **On Windows**: You can also simply double-click `run-dev.bat`!

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

### Option 2: Run in Two Separate Terminals (Standard) ???

If you prefer separate terminal windows for frontend and backend:

#### Terminal 1 — Backend (Port 5000):
```powershell
cd backend
npm install
npm run dev
```
> Runs Express server on `http://localhost:5000` with auto-reload (`node --watch`).

#### Terminal 2 — Frontend (Port 5173):
```powershell
cd frontend
npm install
npm run dev
```
> Runs Vite development server on `http://localhost:5173` with instant HMR.

---

### Option 3: Single-Port Production Mode (Port 5000 Only) ??

To run the entire app from the backend server alone:

```powershell
# Step 1: Build the React frontend
npm run build

# Step 2: Start the production server
npm start
```

> **On Windows**: You can double-click `start-production.bat`!
> Visit `http://localhost:5000` — Express serves the React app and REST APIs simultaneously!

---

## ?? Pre-Seeded Demo Login Credentials

You can sign in with any of these pre-seeded accounts, or use the **1-Click Instant Demo Login** buttons on the login modal:

| Role | Email | Password | Persona & Focus |
| :--- | :--- | :--- | :--- |
| **Student** | `student@skillbridge.edu` | `Password123!` | Alex Rivera (Final year CSE, React/Node.js) |
| **Recruiter** | `recruiter@techcorp.com` | `Password123!` | Sarah Jenkins (TechCorp Labs) |
| **Recruiter 2** | `david@cloudscale.io` | `Password123!` | David Miller (CloudScale Systems) |
| **College Admin** | `admin@skillbridge.edu` | `Password123!` | Prof. Robert Vance (Advanced Tech Institute) |

---

## ?? Supabase Integration & Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Run the SQL script from [`supabase/schema.sql`](./supabase/schema.sql).
4. Configure keys in `frontend/.env` and `backend/.env`:
   - `frontend/.env`:
     ```env
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```
   - `backend/.env`:
     ```env
     SUPABASE_URL=https://your-project-id.supabase.co
     SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     ```

---

## ?? API Endpoint Overview

- `POST /api/auth/login` — Sign in with email and password
- `POST /api/auth/register` — Register a new account
- `GET /api/auth/me` — Current authenticated user
- `GET /api/students/profile` — Student profile and readiness data
- `GET /api/assessments/questions` — 10 skill assessment questions
- `POST /api/assessments/submit` — Submit quiz & recalculate readiness
- `GET /api/opportunities` — List internships and jobs
- `POST /api/opportunities` — Recruiter creates a new posting
- `POST /api/applications` — Student applies with match score
- `GET /api/applications/my-applications` — Student pipeline tracking
- `GET /api/admin/analytics` — Campus-wide placement analytics
- `PUT /api/admin/verifications/:type/:id` — Approve/Reject certificates & projects
