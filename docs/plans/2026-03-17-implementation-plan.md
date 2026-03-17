# MetalBrass OS - Implementation Plan

**Data**: 2026-03-17
**Baseado em**: 2026-03-17-metalbras-os-prd-design.md

---

## Sprint 0 - Bugfixes & Foundation (AGORA)

### Task 0.1: Fix Timesheet action buttons
- Adicionar `group` class ao `<tr>` no TimesheetView

### Task 0.2: Fix Worker App clock
- Implementar relogio em tempo real com setInterval

### Task 0.3: Fix ProjectDetailView dynamic loading
- Carregar dados do projeto baseado no `:id` da rota

### Task 0.4: Create Settings placeholder view
- Criar SettingsView.tsx basico
- Adicionar rota em App.tsx

### Task 0.5: Create new route structure
- Adicionar rotas para novos modulos: /allocations, /housings, /exports
- Criar placeholder views

### Task 0.6: Prepare API service layer
- Criar services/ directory com api client base
- Configurar env vars para API URL
- Criar types para API responses

---

## Sprint 1 - Backend Connection Layer

### Task 1.1: API client & auth service
### Task 1.2: Login/logout flow
### Task 1.3: Protected routes
### Task 1.4: Tenant context provider
### Task 1.5: Replace mock data with API calls (Dashboard)
### Task 1.6: Replace mock data with API calls (Personnel)
### Task 1.7: Replace mock data with API calls (Projects)

---

## Sprint 2 - Core CRUD

### Task 2.1: Worker CRUD (create, edit, deactivate)
### Task 2.2: Project CRUD
### Task 2.3: Document upload & validation flow
### Task 2.4: Timesheet approval flow
### Task 2.5: Worker app punch clock (real API)

---

## Sprint 3 - New Modules

### Task 3.1: Allocations module (pipeline view)
### Task 3.2: Housing module
### Task 3.3: Settings & RBAC
### Task 3.4: Exports module (Primavera)
### Task 3.5: Declarations module

---

## Sprint 4 - AI & Automation

### Task 4.1: AI matching integration
### Task 4.2: Compliance alerts engine
### Task 4.3: PWA setup for Worker App
### Task 4.4: Multi-tenant SaaS onboarding
