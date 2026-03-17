# CLAUDE.md - MetalBrass OS

## Autonomy & Permissions (ALLOW MODE)

### DO WITHOUT ASKING:
- Run any bash/shell command (npm, git, node, tsc, vite, curl, etc.)
- Read, write, edit, create any file or directory
- Install/update/remove npm packages
- Run dev server, build, preview, tests
- Git add, commit (conventional commits)
- Run TypeScript compiler, linters, formatters
- Create/modify components, views, types, configs
- Refactor, rename, restructure
- Execute browser automation for testing

### ASK BEFORE:
- `git push` to remote
- Deleting files permanently
- Destructive git ops (reset --hard, force push, branch -D)
- Modifying .env credentials or API keys
- Actions affecting production

### NEVER:
- Push without permission
- Force push to main
- Delete code without instruction
- Overwrite credentials

---

## Project Overview

**Name**: MetalBrass OS (metalbras-os)
**Type**: Industrial Operating System for metalworking enterprises
**Domain**: Industrial/metalworking - construction, welding, heavy equipment
**Scale**: 700+ workers, 60+ projects, 4+ companies
**Operations**: Multinational (Portugal, France, Spain, Belgium)
**Repo**: github.com/geekia-pt/MetalBrass2
**Version**: 1.0.0-frontend (all UI complete, awaiting backend)

---

## Tech Stack

### Frontend (COMPLETE)
| Layer       | Technology              |
|-------------|-------------------------|
| Framework   | React 19.2.4            |
| Language    | TypeScript 5.8          |
| Bundler     | Vite 6.2.0              |
| Routing     | React Router DOM 7.13.0 |
| Icons       | Lucide React 0.563.0    |
| Charts      | Recharts 3.7.0          |
| Styling     | Tailwind CSS (CDN)      |
| Build       | ES2022                  |

### Backend (TO BUILD)
| Layer        | Technology                    |
|--------------|-------------------------------|
| Runtime      | Node.js or Python (FastAPI)   |
| Database     | PostgreSQL (VPS)              |
| Auth         | JWT tokens                    |
| AI/LLM       | Ollama + Qwen 2.5 (VPS)     |
| Orchestrator | Kimi Claw                     |
| WhatsApp     | OpenClaw (VPS)                |
| File Storage | Local VPS or MinIO            |
| Deploy       | OpenCloud agent               |

---

## Project Structure

```
/Users/macbook_pro/Documents/Metalbrass/
├── CLAUDE.md
├── App.tsx                          ← Main routing (HashRouter, 15 routes)
├── index.tsx                        ← React root
├── index.html                       ← Entry point + Tailwind CDN
├── types.ts                         ← TypeScript interfaces & enums
├── vite.config.ts                   ← Vite config
├── package.json
├── tsconfig.json
├── metadata.json
│
├── components/
│   ├── Badge.tsx                   ← Compliance status badge
│   ├── KpiCard.tsx                 ← KPI metric card
│   └── Sidebar.tsx                 ← Navigation (14 links + company switcher)
│
├── views/
│   ├── DashboardView.tsx           ← / (6 KPIs, projects, chart, alerts, shortcuts)
│   ├── CandidatesView.tsx          ← /candidates (bot pipeline, 10 doc types)
│   ├── PersonnelView.tsx           ← /personnel (CRUD, actions, worker URL)
│   ├── ProjectsView.tsx            ← /projects (table + create modal)
│   ├── ProjectDetailView.tsx       ← /projects/:id (cockpit, team, logistics)
│   ├── DocumentOcrView.tsx         ← /documents (list, OCR status, preview)
│   ├── TimesheetView.tsx           ← /timesheet (hours, GPS, overtime)
│   ├── AllocationsView.tsx         ← /allocations (dual view, skill matching)
│   ├── HousingsView.tsx            ← /housings (cards, detail, utilities)
│   ├── IndustryView.tsx            ← /industry (kanban 6 cols, team)
│   ├── FleetView.tsx               ← /fleet (vehicles, maintenance)
│   ├── DatabaseView.tsx            ← /database (4 tabs, import/export)
│   ├── ExportsView.tsx             ← /exports (3-step wizard)
│   ├── SettingsView.tsx            ← /settings (5 sub-pages)
│   └── WorkerAppView.tsx           ← Worker mode (login + punch clock)
│
├── services/
│   └── api.ts                      ← HTTP client ready for backend
│
└── docs/plans/
    ├── 2026-03-17-metalbras-os-prd-design.md
    ├── 2026-03-17-implementation-plan.md
    └── 2026-03-17-BIG-PRD-metalbras-os.md  ← Complete system PRD
```

---

## Routing (15 routes)

```
HashRouter
├── /                → Dashboard (KPIs, projects, shortcuts)
├── /candidates      → Candidates pipeline (bot → validation)
├── /personnel       → Active personnel (CRUD + actions)
├── /projects        → Projects list + create
├── /projects/:id    → Project detail (cockpit/team/logistics)
├── /documents       → Documents (OCR, status, preview)
├── /timesheet       → Timesheet (hours, GPS, approve)
├── /allocations     → Allocations (by project / by worker)
├── /housings        → Housings (cards, detail, utilities)
├── /industry        → Industry kanban (production orders)
├── /fleet           → Fleet (vehicles, maintenance)
├── /database        → Database (4 tabs, import/export)
├── /exports         → Exports wizard (Primavera, ONSS, SS)
├── /settings        → Settings (5 sub-pages)
└── /*               → Dashboard (fallback)

Worker App: nexus.metalbrass.com/name-surname + password
```

---

## 14 Modules (All UI Complete)

### 1. Dashboard
6 KPIs (utilization, workers, revenue, compliance, projects, payroll with day/week/month toggle), active project cards with responsible name, production chart, compliance alerts, 12 quick-link shortcuts, export modal, allocation modal

### 2. Candidatos (Bot Pipeline)
Pipeline: Bot Ativo → Dados Recebidos → Em Validação → Validado
10 document types: Passaporte, CC, A1, Seguro Saúde, Aptidão Saúde, Segurança Trabalho, Trabalho em Altura, Certidão Criminal, IBAN, Foto
Certifications + Work history. Actions: Approve/Reject/Request docs via WhatsApp

### 3. Pessoal
CRUD workers, annual revenue, worker URL (copy to clipboard), actions dropdown with blur modals: Send Message (WhatsApp/Email + templates), Update Docs (upload + WhatsApp request), Full Profile (data/skills/history), Deactivate (mandatory reason)

### 4. Projetos
Table + create modal (GPS coords, geo-fence, Primavera code, skills, dates). Detail page: cockpit KPIs, milestones, map, team management, logistics

### 5. Documentos
Chronological list, 5 status types (approved/pending/expired/processing/manual_review), filter tabs with counts, OCR in background, approve only on low confidence, document preview modal with zoom/rotate

### 6. Timesheet
Expanded: clock-in/out, overtime, cost per entry, 4 summary cards, GPS verification, Primavera export, bulk approve

### 7. Alocações
Dual view (Por Obra / Por Funcionário), skill matching %, ranked candidates, allocation modal with housing + vehicle suggestion, pipeline counters

### 8. Alojamentos
Card grid + "Novo Alojamento", detail page: occupants, capacity bar, utilities (water/electricity/gas/phone/internet), inventory, maintenance log

### 9. Indústria
Kanban 6 columns (Recebida→Preparação→Produção→Qualidade→Envio→Enviado), team sidebar with availability, order detail (tasks checklist, materials, photos), priority badges

### 10. Frota
Vehicle table (plate, model, km, driver, project, maintenance), detail page (documents/insurance/inspection, maintenance history with costs), create modal

### 11. Base de Dados
4 tabs (Obras, Funcionários, Frota, Localizações), import CSV/Excel, export, search per tab

### 12. Exportações
3-step wizard: select data (checkboxes) → select destination (Primavera/Excel/ONSS/SS/Finanças) → period + confirm. Export history table

### 13. Configurações
Side navigation: Utilizadores (CRUD + roles), Compliance (rules per country), Alojamento (rules), Templates (CRUD), Integrações (Primavera/WhatsApp/Kimi/Ollama status)

### 14. Modo Operário
Login: nexus.metalbrass.com/name + password. Punch clock, documents with status icons, weekly hours, profile page, notification badges, real-time clock

---

## Business Flow

```
CAPTAÇÃO (Bot WhatsApp)
  → CANDIDATOS (dados + docs via bot)
    → VALIDAÇÃO (equipa interna aprova)
      → DISPONÍVEL (base de dados)
        → ALOCAÇÃO (matching AI: skills + obra + alojamento + viatura)
          → INTEGRAÇÃO (training, contrato, hospedagem)
            → PESSOAL (em obra, timesheet diário)
              → ACOMPANHAMENTO (compliance, horas, faturamento)
                → EXPORT (Primavera, ONSS, SS, Finanças)
```

---

## Architecture

```
Frontend (React)  ←→  API Backend (VPS)
                          ↕
                     PostgreSQL (VPS)
                          ↕
                     Kimi Claw (orchestrator)
                     ├── Qwen 2.5 via Ollama (OCR, matching, chatbot)
                     ├── WhatsApp via OpenClaw (document capture)
                     └── Automations (compliance, declarations)
```

---

## Next Phase: Backend Development

See: docs/plans/2026-03-17-BIG-PRD-metalbras-os.md

---

## Conventions
- **Commits**: Conventional (feat:, fix:, refactor:, chore:)
- **Components**: PascalCase .tsx
- **Views**: [Name]View.tsx
- **Types**: types.ts
- **UI Language**: Portuguese
- **Code Language**: English

---

**Last updated**: 2026-03-17
**Status**: Frontend 100% complete (14 modules, 15 routes, all mock data). Ready for backend development.
