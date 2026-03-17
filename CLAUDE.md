# CLAUDE.md - MetalBrass OS

## Autonomy & Permissions (ALLOW MODE)

### DO WITHOUT ASKING - Execute autonomously:
- Run any bash/shell command (npm, git, node, tsc, vite, curl, etc.)
- Read, write, edit, create any file or directory in the project
- Install/update/remove npm packages
- Run dev server, build, preview, tests
- Git add, commit (conventional commits)
- Run TypeScript compiler, linters, formatters
- Create/modify components, views, types, configs
- Refactor code, rename files, restructure directories
- Run multiple commands in sequence without confirmation
- Access any folder on this machine related to the project
- Execute browser automation for testing

### ASK BEFORE DOING:
- `git push` to remote repository
- Deleting files or directories permanently
- Destructive git operations (reset --hard, force push, branch -D)
- Modifying .env credentials or API keys
- Any action affecting production environment

### NEVER DO:
- Push to remote without permission
- Force push to main
- Delete code without instruction
- Overwrite credentials
- Run `rm -rf` on project directories

---

## Project Overview

**Name**: MetalBrass OS (metalbras-os)
**Type**: Industrial Operating System for metalworking enterprises
**Domain**: Industrial/metalworking sector - construction, welding, heavy equipment
**Operations**: Multinational across Europe (Portugal, France, Spain, Belgium)
**Version**: 0.0.0 (development)

### What it does:
- Personnel management & compliance tracking for industrial workers
- Project portfolio management with budgets, margins & milestones
- Document OCR verification (passports, certifications, A1 forms)
- Timesheet approval with GPS location verification
- Mobile worker app (punch clock, document status, payment tracking)
- Multi-tenant company switching (Metalbras, 3DLog, Inovacar, Aço Forte)

---

## Tech Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| Framework   | React 19.2.4                  |
| Language    | TypeScript 5.8               |
| Bundler     | Vite 6.2.0                   |
| Routing     | React Router DOM 7.13.0      |
| Icons       | Lucide React 0.563.0         |
| Charts      | Recharts 3.7.0               |
| Styling     | Tailwind CSS (custom theme)  |
| OCR         | Gemini API (Google AI)        |
| Build Target| ES2022                        |

---

## Project Structure

```
/Users/macbook_pro/Documents/Metalbrass/
├── CLAUDE.md                    ← This file
├── App.tsx                      ← Main routing & company switcher (HashRouter)
├── index.tsx                    ← React root render
├── index.html                   ← HTML entry point
├── types.ts                     ← TypeScript interfaces & enums
├── vite.config.ts               ← Vite config (port 3000, Gemini API key)
├── package.json                 ← Dependencies & scripts
├── tsconfig.json                ← TypeScript config
├── metadata.json                ← App metadata & permissions
├── README.md                    ← Project readme
│
├── components/                  ← Reusable UI components
│   ├── Badge.tsx               ← Compliance status badge (VALID/EXPIRING/PENDING/CRITICAL)
│   ├── KpiCard.tsx             ← KPI metric card with trend indicator
│   └── Sidebar.tsx             ← Main navigation sidebar + company switcher
│
└── views/                       ← Route views
    ├── DashboardView.tsx        ← / - Executive overview, KPIs, charts, alerts
    ├── PersonnelView.tsx        ← /personnel - Worker roster & compliance tracking
    ├── ProjectsView.tsx         ← /projects - Project portfolio listing
    ├── ProjectDetailView.tsx    ← /projects/:id - Project cockpit, team, logistics
    ├── DocumentOcrView.tsx      ← /documents - OCR validation & document verification
    ├── TimesheetView.tsx        ← /timesheet - Time entry approval & GPS verification
    └── WorkerAppView.tsx        ← Worker mode - Mobile-first punch clock & docs
```

---

## Routing

```
HashRouter
├── /                → DashboardView
├── /personnel       → PersonnelView
├── /projects        → ProjectsView
├── /projects/:id    → ProjectDetailView
├── /documents       → DocumentOcrView
├── /timesheet       → TimesheetView
├── /settings        → (not implemented)
└── /*               → DashboardView (fallback)

Worker Mode: Toggle via Sidebar (replaces entire UI)
```

---

## Key Features

### Admin Dashboard
- Multi-tenant company switching (4 companies)
- KPI tracking: utilization, costs, compliance, allocations
- Production volume charts (Recharts)
- Compliance alerts system
- Personnel roster with NIF search & filtering (20 workers)
- Project portfolio with budgets & margins (4 projects)
- Project cockpit with milestones & geo-fencing
- Document OCR verification (Gemini API) with confidence scores
- Timesheet approval with GPS location verification
- Bulk approval workflows
- Export to Primavera

### Worker Mobile App
- Punch clock in/out with animation
- Real-time GPS location tracking
- Document status & expiry alerts
- Photo upload for certification renewal
- Hour tracking & payment visibility

---

## Design System

- **Theme**: Industrial dark (custom Tailwind colors)
- **Colors**: `industrial`, `industrial-dark`, `industrial-steel`
- **Status**: `compliance-green`, `compliance-red`, `compliance-amber`
- **Font**: Inter
- **Corners**: pills (2xl), cards (lg), buttons (md)

---

## State Management
- React hooks (useState, useEffect) - local component state
- No global state library
- Mock data hardcoded in each view (no backend)
- React Router for navigation

---

## Scripts

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run preview  # Preview production build
```

---

## Dev Server
- **URL**: http://localhost:3001 (or 3000 if available)
- **Hot reload**: Vite HMR enabled

---

## Conventions
- **Commits**: Conventional commits (feat:, fix:, refactor:, chore:, etc.)
- **Components**: PascalCase, .tsx files
- **Views**: [Name]View.tsx pattern
- **Types**: Centralized in types.ts
- **Language**: Portuguese (UI labels), English (code)

---

---

## Current State Audit (2026-03-17)

### What's Working
- All 7 views render correctly in browser
- Sidebar navigation between all routes
- Company switcher (UI only, no data isolation)
- KPI cards with mock data
- Recharts bar chart on dashboard
- Compliance alerts display
- Personnel table with search/filter by NIF/name
- Projects table with status badges & progress bars
- Project detail with tabs (cockpit/team)
- Document OCR viewer with zoom/rotate controls
- Timesheet table with GPS verification display
- Worker mobile app with punch clock animation
- Worker docs & money views

### What's NOT Functional (Mock/Placeholder Only)
- **All data is hardcoded** - zero backend/API calls
- **No authentication** - `isLoggedIn` hardcoded to `true`
- **Company switching** - UI changes but data doesn't
- **All buttons are decorative** - no CRUD operations work
- **Filters** - buttons exist but don't filter
- **OCR** - Gemini API key configured but no upload/processing
- **GPS** - fake location, no real geolocation API
- **Export to Primavera** - button only
- **Settings page** - route exists, no view
- **Logistics tab** - in ProjectDetail, not implemented
- **Timesheet actions** - approve/reject buttons hidden (opacity-0 without group hover)
- **Worker clock** - no real time tracking, just toggles state
- **No database** - no Supabase, no backend whatsoever
- **No notifications** - toast container exists but unused

### Bugs Found
1. Timesheet action buttons use `opacity-0 group-hover:opacity-100` but `<tr>` doesn't have `group` class
2. Worker app clock shows static time `08:14:42` (no live clock)
3. ProjectDetailView always shows "Renovação Central Hidrelétrica" regardless of route param `:id`

---

## Next Phase: Backend Integration

### Target Architecture
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Deploy**: VPS via OpenCloud agent
- **Repo**: github.com/geekia-pt/MetalBrass2

### Priority Order
1. Supabase setup (auth, database schema, RLS policies)
2. Replace mock data with real API calls
3. CRUD operations for all modules
4. Authentication flow
5. Multi-tenant data isolation
6. File upload for OCR documents
7. GPS integration for worker app
8. Real-time notifications

---

**Last updated**: 2026-03-17
**Status**: Frontend complete (UI only), awaiting backend integration
