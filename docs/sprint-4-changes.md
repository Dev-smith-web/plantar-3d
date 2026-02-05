# Sprint 4 — Complete Change Log

All changes made since the last committed state (commit `06dc763`).

---

## Deleted Files

| File | Notes |
|------|-------|
| `plantar-3d/app/page.tsx` | Original root page removed; replaced by `(app)/page.tsx` route group |

---

## Modified Files

| File | Summary |
|------|---------|
| `Quiz Questions` | Minor update (2 lines) |
| `plantar-3d/.gitignore` | Expanded ignore rules (62 line diff) |
| `plantar-3d/app/layout.tsx` | Updated root layout with providers and metadata (26 line diff) |
| `plantar-3d/package.json` | Added next-auth, drizzle-orm, uploadthing, and other dependencies (22 line diff) |
| `plantar-3d/pnpm-lock.yaml` | Lockfile growth (~1900 lines added) |
| `plantar-3d/styles/globals.css` | Reworked global styles and theme tokens (128 line diff) |

---

## New Files — `plantar-3d/`

### App Routes — `app/(app)/` (8 pages + layout)

| File | Description |
|------|-------------|
| `app/(app)/layout.tsx` | Bottom nav with Home, Scan, Library items. Conditional "Manage" tab for teachers using `useSession` and role check. |
| `app/(app)/page.tsx` | Home dashboard with stats cards (quizzes, plants, avg score), quick actions, recent plants grid, and recent quiz results with color-coded percentages (green >=80%, yellow >=60%, red <60%). |
| `app/(app)/library/page.tsx` | Plant library with search. Teachers see edit (pencil) and delete (trash) buttons overlaid on card images. Delete uses `confirm()` dialog. |
| `app/(app)/quiz/page.tsx` | Quiz with name entry, multiple choice questions, and results. Teachers auto-start with "Teacher Preview" name, see a preview banner, results are NOT submitted to DB. |
| `app/(app)/scanner/page.tsx` | Camera-based plant scanner with AI identification via API. |
| `app/(app)/explorer/[id]/page.tsx` | Interactive 3D plant explorer with part selection and info display. |
| `app/(app)/settings/page.tsx` | Account settings page with sign out functionality. |
| `app/(app)/teacher/page.tsx` | Teacher dashboard with tabbed interface for Plants, Quizzes, and Results. |

### Auth Routes — `app/(auth)/`

| File | Description |
|------|-------------|
| `app/(auth)/login/page.tsx` | Login page with email/password credentials form. |
| `app/(auth)/register/page.tsx` | Registration page with name, email, password, and role selection (student/teacher). |

### API Routes — `app/api/`

| File | Description |
|------|-------------|
| `app/api/auth/[...nextauth]/route.ts` | NextAuth catch-all route handler. |
| `app/api/auth/register/route.ts` | User registration endpoint with bcrypt password hashing. |
| `app/api/identify-plant/route.ts` | AI-powered plant identification using image upload. |
| `app/api/plants/route.ts` | GET (list all plants with parts) and POST (create plant). |
| `app/api/plants/[id]/route.ts` | GET, PUT, DELETE for individual plants. |
| `app/api/plant-parts/route.ts` | GET (list parts, optionally filter by plantId) and POST (create part). |
| `app/api/plant-parts/[id]/route.ts` | GET, PUT, DELETE for individual plant parts. |
| `app/api/quiz-questions/route.ts` | GET (list questions with filtering) and POST (create question). |
| `app/api/quiz-questions/[id]/route.ts` | GET, PUT, DELETE for individual quiz questions. |
| `app/api/quiz-results/route.ts` | GET (list results by userId) and POST (submit result). |
| `app/api/quiz-results/[id]/route.ts` | GET and DELETE for individual quiz results. |
| `app/api/uploadthing/route.ts` | UploadThing file upload route handler. |

### Components

| File | Description |
|------|-------------|
| `components/providers.tsx` | App-level wrapper with `SessionProvider` and `QueryClientProvider`. |
| `components/teacher/manage-plants.tsx` | Plant CRUD form with list view. Includes "Parts" (Layers icon) button per plant that toggles `ManagePlantParts` component below the grid. Edit and delete inline. |
| `components/teacher/manage-plant-parts.tsx` | Plant parts CRUD. Form with partName (select: Roots/Stem/Leaves/Flowers/Seeds/Fruits), description (required), detailedInfo, funFact, function, and color picker. Lists existing parts with edit/delete. |
| `components/teacher/manage-quizzes.tsx` | Quiz question management with CRUD. Form for question text, options, correct answer, difficulty, and plant association. |
| `components/teacher/view-results.tsx` | Quiz results viewer showing student submissions with scores. |

### Hooks

| File | Description |
|------|-------------|
| `hooks/use-plants.ts` | React Query hooks: `usePlants`, `usePlant`, `useCreatePlant`, `useUpdatePlant`, `useDeletePlant`. |
| `hooks/use-plant-parts.ts` | React Query hooks: `usePlantParts`, `usePlantPart`, `useCreatePlantPart`, `useUpdatePlantPart`, `useDeletePlantPart`. |
| `hooks/use-quiz.ts` | React Query hooks for quiz questions (`useQuizQuestions`, CRUD) and quiz results (`useQuizResults`, `useSubmitQuizResult`). |

### Lib

| File | Description |
|------|-------------|
| `lib/api-client.ts` | Typed fetch wrapper for all API endpoints (plants, plantParts, quizQuestions, quizResults). |
| `lib/auth.ts` | NextAuth configuration with credentials provider, bcrypt, and session callbacks with user role. |
| `lib/db/schema.ts` | Drizzle ORM schema: `users`, `plants`, `plantParts`, `quizQuestions`, `quizResults` tables with relations. |
| `lib/db/index.ts` | Database connection setup (SQLite/Turso via libsql). |
| `lib/db/utils.ts` | Database utility helpers. |
| `lib/uploadthing.ts` | UploadThing file router configuration. |

### Other

| File | Description |
|------|-------------|
| `drizzle.config.ts` | Drizzle Kit migration configuration. |
| `middleware.ts` | NextAuth middleware protecting authenticated routes (excludes `/login`, `/register`, `/api`). |
| `types/next-auth.d.ts` | TypeScript type augmentation adding `role` to NextAuth session/user. |
| `.env.example` | Environment variable template (DATABASE_URL, NEXTAUTH_SECRET, etc.). |
| `scripts/seed.ts` | Database seed script with sample plants, parts, quiz questions, and default accounts. |
| `docs/product-requirements.md` | Product requirements document. |
| `models-3d/mustard.glb` | 3D mustard plant model for explorer. |
| `models-3d/sunflower.glb` | 3D sunflower model for explorer. |
| `public/manifest.json` | PWA web app manifest. |
| `public/icons/icon.svg` | App icon for PWA. |

---

## New Files — `plant-explorer-ar/` (~90 files)

The original Base44 React/Vite app preserved as migration reference. Includes all original pages (Home, PlantExplorer, PlantLibrary, PlantScanner, Quiz, Settings, TeacherDashboard), components, UI library, entity definitions, and API client.

---

## New Files — `plans/`

| File | Description |
|------|-------------|
| `plans/credentials-handoff.md` | Credentials and access handoff documentation. |
| `plans/nextjs-migration.md` | Migration plan from Base44/Vite to Next.js. |
| `plans/port-3d-viewer.md` | Plan for porting the 3D plant viewer. |

---

## Teacher/Student UI Features (Sprint 4 Focus)

These 5 features differentiate the teacher vs student experience:

### 1. Teacher Link in Bottom Nav
- **File:** `app/(app)/layout.tsx`
- Teachers see a 4th nav item "Manage" (GraduationCap icon) linking to `/teacher`
- Students see only Home, Scan, Library

### 2. Plant Parts Management in Teacher Dashboard
- **Files:** `components/teacher/manage-plant-parts.tsx` (new), `components/teacher/manage-plants.tsx` (modified)
- Teachers can manage parts (Roots, Stem, Leaves, Flowers, Seeds, Fruits) for each plant
- Accessible via Layers icon button on each plant card in the teacher dashboard

### 3. Edit/Delete on Library Cards for Teachers
- **File:** `app/(app)/library/page.tsx`
- Teachers see Pencil and Trash2 buttons overlaid on plant card images (top-right)
- Delete uses `confirm()` dialog, Edit navigates to `/teacher`
- Buttons are outside the `<Link>` wrapper to avoid navigation conflicts

### 4. Teacher Quiz Preview Mode
- **File:** `app/(app)/quiz/page.tsx`
- Teachers auto-start with name "Teacher Preview" (skip name entry screen)
- Accent-colored banner: "Preview Mode — Results will not be saved"
- `submitResult.mutate()` is skipped for teachers
- Results screen shows "This was a preview. No results were saved."

### 5. Quiz History on Home Dashboard
- **File:** `app/(app)/page.tsx`
- "Recent Results" section appears after "Recent Plants" (only when results exist)
- Shows last 5 results sorted by date descending
- Each card shows score (X/Y), date, and color-coded percentage
  - Green: >= 80%
  - Yellow: >= 60%
  - Red: < 60%
- "Take Quiz" link to `/quiz`

---

## Commit Attribution (Staging Repo)

The work was distributed across the team in `updated-plantar`:

| Member | GitHub | Role | Commits | Summary |
|--------|--------|------|---------|---------|
| Ashish | pudasainiashish | Project Lead, UI/UX | 5 | Config, env, auth pages, settings, docs |
| Yam | yamkumarkarki | Backend | 4 | DB schema, NextAuth, auth routes, seed script |
| Abhie | akoiralaa | Backend | 5 | Plants API, parts API, quiz API, uploads, API client |
| Yogesh | yogeshayer | Frontend | 6 | Providers/hooks, layout, home, library/quiz, scanner/explorer, teacher dashboard |
| Diya | chataut | UI/UX | 3 | Global styles, PWA assets, 3D models |

See `repo-distribution-guide.md` for the process used and instructions for team members.
