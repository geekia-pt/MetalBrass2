# MetalBrass OS - PRD & System Design

**Data**: 2026-03-17
**Status**: Draft - Aguardando aprovacao
**Versao**: 1.0

---

## 1. Visao Geral

MetalBrass OS e um sistema operacional industrial para gestao de mao-de-obra metalurgica/construcao, com operacoes multinacionais (Portugal, Franca, Espanha, Belgica).

### Escala
- **700+ funcionarios** ativos
- **60+ obras** simultaneas
- **4+ empresas** do grupo (Metalbras, 3DLog, Inovacar, Aco Forte)
- **Multi-tenant SaaS** - grupo interno + empresas externas

### Arquitetura Central
- **VPS**: Infraestrutura centralizada (PostgreSQL, Ollama/Qwen 2.5, OpenCloud)
- **Cerebro**: Kimi Claw como orquestrador central
- **WhatsApp**: Integrado via OpenClaw (captacao de documentos)
- **AI Local**: Ollama + Qwen 2.5 para OCR, chatbot, matching
- **Frontend**: React + TypeScript + Vite (este projeto)
- **Deploy**: OpenCloud agent na VPS

---

## 2. Fluxo Principal do Negocio

```
CAPTACAO → VALIDACAO → ALOCACAO → INTEGRACAO → FORMALIZACAO → ACOMPANHAMENTO
```

### 2.1 Captacao & Validacao
- Candidato entra no sistema (cadastro manual ou via WhatsApp)
- Documentos enviados via WhatsApp → OpenClaw processa → armazena na DB
- OCR via Qwen 2.5 extrai dados dos documentos
- Dashboard mostra documentos pendentes de validacao manual
- Validador aprova/rejeita com dados pre-extraidos

### 2.2 Alocacao (Matching Operario-Obra)
- Quando surge vaga, sistema sugere operarios compativeis baseado em:
  - Competencias/skills (soldador TIG, ponte rolante, etc.)
  - Disponibilidade atual
  - Localizacao/proximidade
  - Historico de compliance
  - Custo/hora
- Kimi Claw orquestra o matching inteligente via Qwen 2.5
- Dashboard mostra sugestoes ranked para o gestor aprovar

### 2.3 Integracao
- Operario alocado recebe informacoes automaticas:
  - Local da obra
  - Endereco de hospedagem / apartamento disponivel
  - Treinamentos necessarios
  - Condicoes contratuais
- Sistema gere stock de alojamentos por cidade/obra

### 2.4 Formalizacao
- Assinatura de documentacao online via Modo Operario
- Ou presencialmente no escritorio
- Sistema gera automaticamente declaracoes para:
  - **ONSS** (Belgica)
  - **Seguranca Social** (Portugal)
  - **Financas** (Portugal)

### 2.5 Acompanhamento
- Operario faz input de horas diario via Modo Operario (URL dedicado)
- Sistema monitora em tempo real:
  - Compliance documental (validade A1, passaporte, certificacoes)
  - Horas trabalhadas vs. previstas
  - GPS/localizacao (opcional)
  - Faturamento por obra/funcionario
- Export automatico para **Primavera** (ERP Portugal)

---

## 3. Modelo de Dados (PostgreSQL)

### 3.1 Multi-Tenant

```
tenants
├── id (UUID, PK)
├── name (VARCHAR) -- "Metalbras Industria", "3DLog", cliente externo...
├── slug (VARCHAR, UNIQUE) -- URL-safe identifier
├── plan (ENUM: internal, basic, pro, enterprise)
├── settings (JSONB) -- configuracoes especificas do tenant
├── created_at / updated_at
```

**Estrategia**: Isolamento por `tenant_id` em todas as tabelas (coluna + RLS). Para o futuro SaaS com clientes grandes, migrar para schema separado.

### 3.2 Utilizadores & Auth

```
users
├── id (UUID, PK)
├── tenant_id (FK → tenants)
├── email (VARCHAR, UNIQUE per tenant)
├── password_hash (VARCHAR)
├── role (ENUM: admin, manager, validator, viewer, worker)
├── name (VARCHAR)
├── phone (VARCHAR) -- para WhatsApp
├── avatar_url (VARCHAR)
├── is_active (BOOLEAN)
├── last_login (TIMESTAMP)
├── created_at / updated_at
```

### 3.3 Operarios (Workers)

```
workers
├── id (UUID, PK)
├── tenant_id (FK → tenants)
├── user_id (FK → users, NULLABLE) -- link ao login do Modo Operario
├── nif (VARCHAR) -- numero fiscal
├── name (VARCHAR)
├── nationality (VARCHAR)
├── phone (VARCHAR)
├── email (VARCHAR)
├── role_title (VARCHAR) -- "Soldador TIG", "Eng. Mecanica"
├── skills (TEXT[]) -- array de competencias
├── hourly_cost (DECIMAL)
├── availability_status (ENUM: available, allocated, on_leave, inactive)
├── compliance_score (INTEGER) -- 0-100, calculado
├── current_project_id (FK → projects, NULLABLE)
├── current_housing_id (FK → housings, NULLABLE)
├── notes (TEXT)
├── created_at / updated_at
```

### 3.4 Documentos

```
documents
├── id (UUID, PK)
├── tenant_id (FK → tenants)
├── worker_id (FK → workers)
├── type (ENUM: passport, citizen_card, a1_cert, welding_cert, contract, medical, training, other)
├── document_number (VARCHAR)
├── issuing_country (VARCHAR)
├── issue_date (DATE)
├── expiry_date (DATE)
├── status (ENUM: pending_upload, pending_ocr, pending_validation, valid, rejected, expired)
├── file_url (VARCHAR) -- path no storage da VPS
├── file_source (ENUM: upload, whatsapp, scan, email)
├── ocr_data (JSONB) -- dados extraidos pelo Qwen 2.5
├── ocr_confidence (DECIMAL)
├── validated_by (FK → users, NULLABLE)
├── validated_at (TIMESTAMP)
├── rejection_reason (TEXT)
├── created_at / updated_at
```

### 3.5 Projetos / Obras

```
projects
├── id (UUID, PK)
├── tenant_id (FK → tenants)
├── name (VARCHAR)
├── client_name (VARCHAR)
├── client_contact (JSONB)
├── country (VARCHAR)
├── city (VARCHAR)
├── address (TEXT)
├── geo_lat / geo_lng (DECIMAL) -- para geo-fence
├── geo_fence_radius_m (INTEGER)
├── budget (DECIMAL)
├── status (ENUM: planning, active, paused, completed, cancelled)
├── start_date / end_date (DATE)
├── completion_pct (DECIMAL)
├── margin_pct (DECIMAL)
├── required_skills (TEXT[])
├── max_team_size (INTEGER)
├── primavera_code (VARCHAR) -- codigo no ERP Primavera
├── notes (TEXT)
├── created_at / updated_at
```

### 3.6 Alocacoes (Worker ↔ Project)

```
allocations
├── id (UUID, PK)
├── tenant_id (FK → tenants)
├── worker_id (FK → workers)
├── project_id (FK → projects)
├── start_date / end_date (DATE)
├── status (ENUM: proposed, confirmed, active, completed, cancelled)
├── proposed_by (ENUM: system_ai, manual) -- quem sugeriu
├── approved_by (FK → users, NULLABLE)
├── hourly_rate (DECIMAL) -- pode variar por alocacao
├── notes (TEXT)
├── created_at / updated_at
```

### 3.7 Hospedagem / Alojamento

```
housings
├── id (UUID, PK)
├── tenant_id (FK → tenants)
├── name (VARCHAR) -- "Apt. Lyon Centro #3"
├── address (TEXT)
├── city (VARCHAR)
├── country (VARCHAR)
├── capacity (INTEGER) -- max ocupantes
├── current_occupants (INTEGER) -- calculado
├── monthly_cost (DECIMAL)
├── status (ENUM: available, full, maintenance, inactive)
├── linked_project_id (FK → projects, NULLABLE) -- obra proxima
├── notes (TEXT)
├── created_at / updated_at

housing_occupants
├── id (UUID, PK)
├── housing_id (FK → housings)
├── worker_id (FK → workers)
├── check_in / check_out (DATE)
├── status (ENUM: active, checked_out)
```

### 3.8 Timesheet / Horas

```
time_entries
├── id (UUID, PK)
├── tenant_id (FK → tenants)
├── worker_id (FK → workers)
├── project_id (FK → projects)
├── date (DATE)
├── hours (DECIMAL)
├── overtime_hours (DECIMAL)
├── location_lat / location_lng (DECIMAL)
├── location_verified (BOOLEAN)
├── status (ENUM: pending, approved, disputed, rejected)
├── approved_by (FK → users, NULLABLE)
├── approved_at (TIMESTAMP)
├── notes (TEXT)
├── created_at / updated_at
```

### 3.9 Compliance & Alertas

```
compliance_alerts
├── id (UUID, PK)
├── tenant_id (FK → tenants)
├── worker_id (FK → workers)
├── document_id (FK → documents, NULLABLE)
├── type (ENUM: doc_expiring, doc_expired, doc_missing, gps_alert, hours_mismatch)
├── severity (ENUM: info, warning, critical)
├── message (TEXT)
├── is_resolved (BOOLEAN)
├── resolved_by (FK → users, NULLABLE)
├── resolved_at (TIMESTAMP)
├── created_at
```

### 3.10 Integracoes Externas

```
primavera_exports
├── id (UUID, PK)
├── tenant_id (FK → tenants)
├── export_type (ENUM: timesheet, invoice, worker_register)
├── period_start / period_end (DATE)
├── status (ENUM: pending, processing, completed, failed)
├── file_url (VARCHAR)
├── records_count (INTEGER)
├── created_at

government_declarations
├── id (UUID, PK)
├── tenant_id (FK → tenants)
├── worker_id (FK → workers)
├── declaration_type (ENUM: onss, seguranca_social, financas)
├── country (VARCHAR)
├── status (ENUM: draft, submitted, confirmed, rejected)
├── reference_number (VARCHAR)
├── submitted_at (TIMESTAMP)
├── data (JSONB)
├── created_at
```

---

## 4. Modulos do Dashboard (Features)

### 4.1 Dashboard Principal (/)
**Estado atual**: KPIs mock, grafico mock, alertas mock
**Para ficar funcional**:
- KPIs calculados em tempo real da DB (utilizacao, custos, compliance, alocacoes)
- Grafico de producao com dados reais agregados
- Alertas de compliance vindos da tabela `compliance_alerts`
- Filtro por periodo (semana, mes, trimestre)
- Dados isolados por tenant

### 4.2 Pessoal (/personnel)
**Estado atual**: Tabela mock com 20 workers, busca funciona localmente
**Para ficar funcional**:
- CRUD completo de operarios (criar, editar, desativar)
- Listagem paginada da DB com busca server-side
- Ficha completa do operario (click na linha → modal/pagina):
  - Dados pessoais
  - Documentos associados + status
  - Historico de alocacoes/obras
  - Historico de horas
  - Compliance score
  - Hospedagem atual
- Import em massa (CSV/Excel)
- Filtros: por status, skill, projeto, compliance

### 4.3 Projetos (/projects)
**Estado atual**: 4 projetos mock
**Para ficar funcional**:
- CRUD de projetos/obras
- Listagem paginada da DB
- Vista de detalhe funcional (/projects/:id carrega dados reais)
- Tab Cockpit: KPIs calculados, marcos editaveis, mapa real (Leaflet/Mapbox)
- Tab Equipe: gestao de alocacoes (adicionar/remover operarios)
- Tab Logistica: gestao de alojamentos vinculados a obra
- Matching AI: botao "Sugerir Operarios" → Qwen 2.5 analisa e sugere

### 4.4 Documentos (/documents)
**Estado atual**: Viewer mock com dados fake
**Para ficar funcional**:
- Fila de documentos pendentes de validacao (vindos do WhatsApp/upload)
- Viewer real com PDF/imagem do documento
- Dados pre-extraidos pelo OCR (Qwen 2.5)
- Aprovar/Rejeitar atualiza status na DB
- Navegacao entre documentos da fila (anterior/proximo)
- Historico de validacoes

### 4.5 Timesheet (/timesheet)
**Estado atual**: Tabela mock com 5 entries
**Para ficar funcional**:
- Listagem real de horas pendentes de aprovacao
- Aprovar/Rejeitar individual e em massa
- Filtros por periodo, obra, operario
- Verificacao GPS real (comparar coordenadas com geo-fence do projeto)
- Calculos automaticos: custo total, horas extras
- Export para Primavera (gera ficheiro no formato correto)

### 4.6 Modo Operario (/worker)
**Estado atual**: App mobile mock com punch clock fake
**Para ficar funcional**:
- **URL dedicado por operario** (ex: app.metalbras.pt/worker/login)
- Login com credenciais proprias (email/phone + password)
- Punch clock real:
  - Regista hora + GPS no momento do clock-in/out
  - Envia para `time_entries` na DB
- Documentos: ve status dos seus docs, alerta de vencimento
- Horas: ve historico e status de aprovacao
- Relogio em tempo real (corrigir bug atual)
- PWA-ready (installavel no telemovel sem app store)

### 4.7 Configuracoes (/settings) - NOVO
**Estado atual**: Nao implementado
**Para criar**:
- Gestao do tenant (nome, logo, dados da empresa)
- Gestao de utilizadores e permissoes (RBAC)
- Configuracoes de compliance (quais docs sao obrigatorios por pais)
- Configuracoes de integracao Primavera (codigos, mapeamentos)
- Templates de declaracoes governamentais
- Configuracoes de alojamento

### 4.8 Alocacoes - NOVO
**Para criar**:
- Vista dedicada para gestao de alocacoes
- Pipeline visual: Proposta → Confirmado → Ativo → Concluido
- Matching AI integrado
- Vista calendario de alocacoes por obra/operario

### 4.9 Hospedagem - NOVO
**Para criar**:
- Gestao de apartamentos/alojamentos
- Ocupacao atual vs capacidade
- Vinculacao a obras
- Mapa de alojamentos

### 4.10 Exportacoes & Declaracoes - NOVO
**Para criar**:
- Painel de exports para Primavera
- Status de declaracoes ONSS/SS/Financas
- Historico de submissoes
- Re-submissao em caso de falha

---

## 5. API Backend (VPS)

### Stack recomendado
- **Runtime**: Node.js ou Python (FastAPI)
- **ORM**: Prisma (Node) ou SQLAlchemy (Python)
- **Auth**: JWT tokens
- **File Storage**: Local na VPS (ou MinIO self-hosted)
- **API Style**: REST com endpoints por modulo

### Endpoints principais

```
AUTH
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

WORKERS
GET    /api/workers?tenant_id=&search=&status=&page=
POST   /api/workers
GET    /api/workers/:id
PUT    /api/workers/:id
DELETE /api/workers/:id (soft delete)
GET    /api/workers/:id/documents
GET    /api/workers/:id/allocations
GET    /api/workers/:id/time-entries

PROJECTS
GET    /api/projects?tenant_id=&status=&page=
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
GET    /api/projects/:id/team
POST   /api/projects/:id/allocations
GET    /api/projects/:id/time-entries

DOCUMENTS
GET    /api/documents?status=pending_validation&tenant_id=
POST   /api/documents (upload)
PUT    /api/documents/:id/validate
PUT    /api/documents/:id/reject

TIME ENTRIES
GET    /api/time-entries?status=pending&project_id=
POST   /api/time-entries (worker clock-in/out)
PUT    /api/time-entries/:id/approve
PUT    /api/time-entries/:id/reject
POST   /api/time-entries/bulk-approve

ALLOCATIONS
GET    /api/allocations?project_id=&worker_id=
POST   /api/allocations
PUT    /api/allocations/:id
POST   /api/allocations/suggest (AI matching via Qwen)

HOUSINGS
GET    /api/housings?city=&status=
POST   /api/housings
PUT    /api/housings/:id
GET    /api/housings/:id/occupants

EXPORTS
POST   /api/exports/primavera
GET    /api/exports/:id/download
POST   /api/declarations/generate

DASHBOARD
GET    /api/dashboard/kpis?tenant_id=
GET    /api/dashboard/charts?type=production&period=
GET    /api/dashboard/alerts?tenant_id=

TENANTS (super-admin)
GET    /api/tenants
POST   /api/tenants
PUT    /api/tenants/:id
```

---

## 6. Integracao com Kimi Claw / OpenCloud

O dashboard e o frontend. Toda a inteligencia reside na VPS:

```
Dashboard (React) ←→ API Backend (VPS)
                         ↕
                    PostgreSQL (VPS)
                         ↕
                    Kimi Claw (orquestrador)
                    ├── Qwen 2.5 via Ollama (OCR, matching, chatbot)
                    ├── WhatsApp via OpenClaw (captacao de docs)
                    └── Automacoes (compliance alerts, declaracoes)
```

O dashboard **consome** a API. Nao precisa de saber como o Kimi/Qwen funcionam internamente - recebe dados prontos.

---

## 7. Permissoes (RBAC)

| Role       | Dashboard | Pessoal | Projetos | Docs | Timesheet | Config | Worker App |
|------------|-----------|---------|----------|------|-----------|--------|------------|
| admin      | Full      | Full    | Full     | Full | Full      | Full   | -          |
| manager    | Full      | Full    | Full     | Full | Full      | View   | -          |
| validator  | View      | View    | View     | Full | -         | -      | -          |
| viewer     | View      | View    | View     | View | View      | -      | -          |
| worker     | -         | -       | -        | Own  | Own       | -      | Full       |

---

## 8. Prioridade de Desenvolvimento

### Fase 1 - Fundacao (Semana 1-2)
1. Setup PostgreSQL + schema na VPS
2. API backend basica (auth + CRUD workers/projects)
3. Conectar dashboard ao backend (substituir mock data)
4. Auth real (login/logout)
5. Multi-tenant basico (tenant_id em tudo)

### Fase 2 - Core Business (Semana 3-4)
6. Modulo de documentos funcional (upload, OCR queue, validacao)
7. Timesheet funcional (input + aprovacao)
8. Modo Operario com login dedicado e punch clock real
9. Compliance alerts automaticos

### Fase 3 - Inteligencia (Semana 5-6)
10. Matching AI (Qwen 2.5 para sugestao de alocacoes)
11. Modulo de hospedagem
12. Modulo de alocacoes com pipeline visual
13. Export Primavera

### Fase 4 - Automacao (Semana 7-8)
14. Declaracoes automaticas (ONSS, SS, Financas)
15. Chatbot do operario via Kimi
16. Modulo de configuracoes completo
17. Onboarding de novos tenants (SaaS)

---

## 9. Decisoes de Deploy

1. **Git push** → GitHub (geekia-pt/MetalBrass2)
2. **OpenCloud agent** na VPS faz pull + build + deploy
3. Frontend servido como static files (Vite build)
4. API backend como servico na VPS
5. PostgreSQL na mesma VPS
6. Nginx como reverse proxy (frontend + API)

---

## 10. Bugs a Corrigir Agora

1. Timesheet: adicionar `group` class ao `<tr>` para action buttons
2. Worker App: implementar relogio em tempo real
3. ProjectDetailView: carregar dados baseado no `:id` da rota
4. Settings view: criar pagina placeholder
