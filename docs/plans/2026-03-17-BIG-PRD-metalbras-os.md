# MetalBrass OS - Product Requirements Document (PRD)

**Versao**: 1.0.0
**Data**: 2026-03-17
**Autor**: Equipa MetalBrass
**Estado**: Draft para Desenvolvimento

---

## Indice

1. [Visao Geral](#1-visao-geral)
2. [Contexto e Problema](#2-contexto-e-problema)
3. [Objetivos](#3-objetivos)
4. [Escala e Numeros](#4-escala-e-numeros)
5. [Arquitetura Tecnica](#5-arquitetura-tecnica)
6. [Modulos do Sistema](#6-modulos-do-sistema)
7. [Schema da Base de Dados](#7-schema-da-base-de-dados)
8. [API REST - Endpoints Completos](#8-api-rest---endpoints-completos)
9. [Matriz RBAC](#9-matriz-rbac)
10. [Diagrama de Integracoes](#10-diagrama-de-integracoes)
11. [Fluxo de Negocio](#11-fluxo-de-negocio)
12. [Fases de Desenvolvimento](#12-fases-de-desenvolvimento)
13. [Requisitos Nao-Funcionais](#13-requisitos-nao-funcionais)
14. [Riscos e Mitigacoes](#14-riscos-e-mitigacoes)
15. [Agentes Autonomos OpenClaw](#15-agentes-autonomos-openclaw)

---

## 1. Visao Geral

O **MetalBrass OS** e um sistema operacional industrial para empresas de metalomecanica e construcao metalica. Funciona como plataforma SaaS multi-tenant que gere todo o ciclo de vida de trabalhadores, projetos, producao industrial e compliance regulatorio em contexto multinacional (Portugal, Franca, Espanha, Belgica).

O frontend de todos os 14 modulos esta completo em React 19 + TypeScript + Vite + Tailwind. Este PRD define o backend, base de dados, integracao com IA e infraestrutura necessaria para tornar o sistema totalmente funcional.

---

## 2. Contexto e Problema

### Problemas Atuais
- Gestao de 700+ trabalhadores feita em Excel e papel
- Captacao de candidatos via WhatsApp sem pipeline estruturado
- Compliance regulatorio (ONSS, Seguranca Social, Financas) feito manualmente
- Exportacoes para Primavera feitas a mao
- Sem visibilidade em tempo real de alocacoes, horas, custos
- Documentos de trabalhadores espalhados por pastas fisicas e digitais sem OCR
- Alocacao de alojamento e viaturas sem sistema de matching

### Solucao
Sistema unico que centraliza todas as operacoes com automacao de IA para OCR, matching de competencias e chatbot de suporte.

---

## 3. Objetivos

| Objetivo | Metrica | Meta |
|----------|---------|------|
| Reducao tempo de captacao | Dias desde contacto ate validacao | < 3 dias |
| Automacao documental | % documentos processados por OCR | > 90% |
| Precisao de alocacao | Match score medio worker-projeto | > 85% |
| Compliance | Declaracoes submetidas a tempo | 100% |
| Exportacao Primavera | Tempo de exportacao mensal | < 5 min |
| Disponibilidade | Uptime do sistema | > 99.5% |

---

## 4. Escala e Numeros

- **Trabalhadores ativos**: 700+
- **Projetos simultaneos**: 60+
- **Empresas do grupo**: 4+
- **Paises de operacao**: PT, FR, ES, BE
- **Candidatos/mes**: ~50-100
- **Documentos processados/mes**: ~2000+
- **Registos timesheet/dia**: ~700
- **Utilizadores internos**: ~30-50
- **Clientes externos (SaaS)**: Fase futura

---

## 5. Arquitetura Tecnica

### Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS |
| Backend | Node.js (Express/Fastify) OU Python FastAPI |
| Base de Dados | PostgreSQL (VPS) |
| IA / ML | Ollama + Qwen 2.5 (OCR, matching, chatbot) |
| Orquestrador | Kimi Claw |
| WhatsApp | OpenClaw integration |
| Deploy | OpenCloud agent no VPS |
| Autenticacao | JWT (access + refresh tokens) |
| File Storage | Local VPS (com backup S3 opcional) |
| Cache | Redis (sessoes, cache de queries frequentes) |

### Diagrama de Arquitetura

```
+------------------------------------------------------------------+
|                        CLIENTES                                   |
|                                                                   |
|  +------------------+  +------------------+  +-----------------+  |
|  | Dashboard Web    |  | Modo Operario    |  | WhatsApp Bot    |  |
|  | (React 19 SPA)   |  | (Mobile PWA)     |  | (OpenClaw)      |  |
|  +--------+---------+  +--------+---------+  +--------+--------+  |
+-----------|----------------------|----------------------|---------+
            |                      |                      |
            v                      v                      v
+------------------------------------------------------------------+
|                     API GATEWAY / BACKEND                         |
|                                                                   |
|  +------------------------------------------------------------+  |
|  |  REST API (Node.js/FastAPI)                                 |  |
|  |                                                             |  |
|  |  /api/v1/auth    /api/v1/workers    /api/v1/projects       |  |
|  |  /api/v1/docs    /api/v1/timesheet  /api/v1/allocations    |  |
|  |  /api/v1/housing /api/v1/industry   /api/v1/fleet          |  |
|  |  /api/v1/exports /api/v1/candidates /api/v1/ai             |  |
|  |  /api/v1/compliance  /api/v1/config /api/v1/database       |  |
|  +----+-----------+-----------+-----------+-------------------+  |
|       |           |           |           |                      |
|  +----v---+  +----v---+  +---v----+  +---v----+                 |
|  | Auth   |  | RBAC   |  | Upload |  | Queue  |                 |
|  | (JWT)  |  | Middle |  | Files  |  | (Jobs) |                 |
|  +--------+  +--------+  +--------+  +--------+                 |
+-----------|----------------------|----------------------|---------+
            |                      |                      |
            v                      v                      v
+------------------------------------------------------------------+
|                     SERVICOS DE DADOS                             |
|                                                                   |
|  +--------------+  +--------------+  +--------------------------+ |
|  | PostgreSQL   |  | Redis        |  | File Storage (VPS)       | |
|  | (Principal)  |  | (Cache/Sess) |  | /uploads/docs/           | |
|  +--------------+  +--------------+  | /uploads/photos/         | |
|                                      +--------------------------+ |
+------------------------------------------------------------------+
            |
            v
+------------------------------------------------------------------+
|                     SERVICOS DE IA                                |
|                                                                   |
|  +--------------------+  +--------------------+                   |
|  | Ollama + Qwen 2.5  |  | Kimi Claw          |                  |
|  |                     |  | (Orquestrador)      |                 |
|  | - OCR Documentos   |  | - Pipeline IA       |                 |
|  | - Matching Skills  |  | - Automacao         |                 |
|  | - Chatbot          |  +--------------------+                  |
|  +--------------------+                                           |
+------------------------------------------------------------------+
```

---

## 6. Modulos do Sistema

### 6.1 Dashboard

**Descricao**: Pagina principal com visao 360 graus da operacao.

**Componentes**:
- 6 KPIs principais: Trabalhadores ativos, Projetos ativos, Horas mes, Receita mensal, Compliance %, Candidatos em pipeline
- Cards de projetos ativos com progresso
- Grafico de producao (linha/barras)
- Alertas de compliance (vencimentos, documentos em falta)
- Quick links para acoes frequentes
- Modal de exportacao rapida
- Modal de alocacao rapida

**Dados necessarios**: Agregacoes de todas as tabelas principais.

---

### 6.2 Candidatos

**Descricao**: Pipeline de captacao de candidatos via WhatsApp bot.

**Pipeline (4 etapas)**:
1. **Bot WhatsApp Ativo** - Bot contactou candidato, a aguardar resposta
2. **Dados Recebidos** - Candidato enviou informacoes/documentos
3. **Em Validacao** - Equipa interna a validar documentos e perfil
4. **Validado** - Pronto para contratacao e alocacao

**Funcionalidades**:
- 10 tipos de documentos: BI/CC, Passaporte, NISS, NIF, Certificados, Contrato anterior, Comprovativo morada, IBAN, Foto, Curriculo
- Gestao de certificacoes (TIG, MIG, MAG, ASME, EN, ISO, etc.)
- Historico de trabalho do candidato
- Transicao de estado com validacao
- Rejeicao com motivo
- Conversao candidato → trabalhador

---

### 6.3 Pessoal

**Descricao**: Gestao de trabalhadores em servico ativo.

**Funcionalidades**:
- CRUD completo de trabalhadores
- Acoes rapidas: enviar mensagem, ver documentos, ver perfil, desativar
- URL pessoal do trabalhador: `nexus.metalbrass.com/{nome}`
- Receita anual por trabalhador
- Filtros por projeto, competencia, pais, estado
- Exportacao de lista

---

### 6.4 Projetos

**Descricao**: Gestao completa de projetos/obras.

**Funcionalidades**:
- CRUD com cockpit por projeto
- KPIs do projeto: progresso, horas gastas, custo, equipa
- Milestones com timeline
- Geo-fence do local da obra
- Tab Equipa: trabalhadores alocados
- Tab Logistica: alojamentos, viaturas, materiais
- Codigo Primavera vinculado

---

### 6.5 Documentos

**Descricao**: Gestao documental com OCR automatico.

**Funcionalidades**:
- Lista cronologica de todos os documentos
- OCR em background via Ollama + Qwen 2.5
- Aprovacao manual apenas quando confianca OCR < threshold
- Icones de estado: pendente, processando, aprovado, rejeitado, expirado
- Vinculacao documento ↔ trabalhador/candidato
- Alertas de vencimento

---

### 6.6 Timesheet

**Descricao**: Registo de horas com verificacao GPS.

**Funcionalidades**:
- Clock-in / Clock-out com timestamp
- Verificacao GPS (dentro do geo-fence do projeto)
- Calculo automatico de horas extra
- Calculo de custo por hora/trabalhador/projeto
- Exportacao para Primavera (formato compativel)
- Vista diaria, semanal, mensal

---

### 6.7 Alocacoes

**Descricao**: Sistema de alocacao de trabalhadores a projetos.

**Funcionalidades**:
- Vista dupla: por projeto / por trabalhador
- Skill matching % (IA calcula compatibilidade)
- Sugestao automatica de alojamento proximo
- Sugestao automatica de viatura disponivel
- Estados: proposta → confirmada → ativa → concluida
- Historico de alocacoes

---

### 6.8 Alojamentos

**Descricao**: Gestao de alojamentos para trabalhadores.

**Funcionalidades**:
- Cards com indicador de ocupacao (X/Y camas)
- Pagina de detalhe por alojamento:
  - Lista de ocupantes atuais
  - Custos de utilidades (agua, luz, gas, internet)
  - Inventario (moveis, eletrodomesticos)
  - Log de manutencao
- Alertas de sobrelotacao

---

### 6.9 Industria

**Descricao**: Gestao de producao industrial com Kanban.

**Funcionalidades**:
- Kanban com 6 colunas: Recebido → Preparacao → Producao → Qualidade → Pronto → Expedido
- Sidebar com equipa por ordem de producao
- Detalhe da ordem:
  - Tarefas (checklist)
  - Materiais necessarios
  - Fotos de progresso/qualidade
- Drag & drop entre colunas

---

### 6.10 Frota

**Descricao**: Gestao de viaturas da empresa.

**Funcionalidades**:
- Tabela de viaturas com filtros
- Detalhe por viatura:
  - Documentos (seguro, inspecao, carta verde)
  - Historico de manutencao
  - Km atuais
- Vinculacao viatura ↔ projeto
- Alertas de vencimento (seguro, inspecao)

---

### 6.11 Exportacoes

**Descricao**: Wizard de exportacao de dados em 3 passos.

**Passo 1 - Dados**: Selecionar tipo de dados a exportar
**Passo 2 - Destino**: Escolher destino
**Passo 3 - Periodo**: Definir intervalo temporal

**5 Destinos**:
1. **Primavera** - Formato SAF-T / CSV compativel
2. **Excel** - XLSX com formatacao
3. **ONSS** - Declaracao para Belgica
4. **Seguranca Social** - Declaracao PT
5. **Financas** - Declaracao fiscal PT

---

### 6.12 Base de Dados

**Descricao**: Visualizacao e importacao/exportacao de dados mestres.

**4 Tabs**:
1. **Obras** - Lista completa de projetos/obras
2. **Funcionarios** - Lista completa de trabalhadores
3. **Frota** - Lista completa de viaturas
4. **Localizacoes** - Moradas de obras, alojamentos, sedes

**Funcionalidades**: Import CSV/Excel, Export CSV/Excel, filtros avancados.

---

### 6.13 Configuracoes

**Descricao**: Administracao do sistema.

**5 Sub-paginas**:
1. **Utilizadores** - CRUD utilizadores, atribuicao de roles
2. **Compliance** - Regras de alertas, prazos legais por pais
3. **Alojamento** - Regras de ocupacao, custos padrao
4. **Templates** - Templates de documentos, contratos, emails
5. **Integracoes** - Configuracao Primavera, WhatsApp, ONSS, SS, Financas

---

### 6.14 Modo Operario

**Descricao**: App mobile para trabalhadores (PWA).

**Acesso**: `nexus.metalbrass.com/{nome}` + password

**Funcionalidades**:
- Ver projeto atual e detalhes
- Clock-in / Clock-out com GPS
- Ver documentos pessoais
- Assinar contrato digitalmente
- Ver informacoes de alojamento
- Chatbot de suporte (IA)
- Notificacoes push

---

## 7. Schema da Base de Dados

### Convencoes
- Todas as tabelas incluem `id`, `created_at`, `updated_at`
- Multi-tenant via coluna `tenant_id`
- Soft delete via `deleted_at` (nullable)
- UUIDs como chaves primarias
- Timestamps em UTC

```sql
-- ============================================================
-- EXTENSOES
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";  -- para geo-fence

-- ============================================================
-- TENANTS (Multi-tenant SaaS)
-- ============================================================

CREATE TABLE tenants (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) NOT NULL UNIQUE,
    type            VARCHAR(20) NOT NULL CHECK (type IN ('internal', 'external')),
    -- internal = empresas do grupo MetalBrass
    -- external = clientes SaaS futuros
    nif             VARCHAR(20),
    country         VARCHAR(5) NOT NULL DEFAULT 'PT',
    address         TEXT,
    phone           VARCHAR(30),
    email           VARCHAR(255),
    logo_url        VARCHAR(500),
    settings        JSONB DEFAULT '{}',
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

-- ============================================================
-- USERS (Autenticacao + RBAC)
-- ============================================================

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    email           VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    role            VARCHAR(20) NOT NULL CHECK (role IN (
                        'admin', 'manager', 'validator', 'viewer', 'worker'
                    )),
    phone           VARCHAR(30),
    avatar_url      VARCHAR(500),
    language        VARCHAR(5) NOT NULL DEFAULT 'pt',
    is_active       BOOLEAN NOT NULL DEFAULT true,
    last_login_at   TIMESTAMPTZ,
    refresh_token   VARCHAR(500),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    UNIQUE(tenant_id, email)
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================
-- CANDIDATES (Pipeline de captacao)
-- ============================================================

CREATE TABLE candidates (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    phone           VARCHAR(30),
    email           VARCHAR(255),
    whatsapp_id     VARCHAR(100),
    nationality     VARCHAR(5),
    date_of_birth   DATE,
    nif             VARCHAR(20),
    niss            VARCHAR(20),
    address         TEXT,
    photo_url       VARCHAR(500),
    status          VARCHAR(20) NOT NULL DEFAULT 'bot_active' CHECK (status IN (
                        'bot_active', 'data_received', 'validating', 'validated', 'rejected'
                    )),
    rejection_reason TEXT,
    skills          JSONB DEFAULT '[]',
    -- ex: ["TIG", "MIG", "serralharia", "soldadura"]
    notes           TEXT,
    converted_to_worker_id UUID,
    validated_by    UUID REFERENCES users(id),
    validated_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_candidates_tenant ON candidates(tenant_id);
CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_candidates_phone ON candidates(phone);

-- ============================================================
-- WORKERS (Pessoal ativo)
-- ============================================================

CREATE TABLE workers (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    user_id         UUID REFERENCES users(id),
    candidate_id    UUID REFERENCES candidates(id),
    employee_number VARCHAR(20),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) NOT NULL,
    -- slug para URL: nexus.metalbrass.com/{slug}
    phone           VARCHAR(30),
    email           VARCHAR(255),
    nationality     VARCHAR(5),
    date_of_birth   DATE,
    nif             VARCHAR(20),
    niss            VARCHAR(20),
    iban            VARCHAR(34),
    address         TEXT,
    photo_url       VARCHAR(500),
    contract_type   VARCHAR(30),
    -- ex: 'ctt', 'cdi', 'temporario', 'destacamento'
    contract_start  DATE,
    contract_end    DATE,
    hourly_rate     DECIMAL(10,2),
    daily_rate      DECIMAL(10,2),
    monthly_salary  DECIMAL(10,2),
    skills          JSONB DEFAULT '[]',
    languages       JSONB DEFAULT '[]',
    -- ex: ["pt", "fr", "es"]
    emergency_contact JSONB DEFAULT '{}',
    -- ex: {"name": "...", "phone": "...", "relation": "..."}
    status          VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN (
                        'active', 'inactive', 'on_leave', 'terminated'
                    )),
    annual_revenue  DECIMAL(12,2) DEFAULT 0,
    primavera_code  VARCHAR(50),
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    UNIQUE(tenant_id, slug),
    UNIQUE(tenant_id, employee_number)
);

CREATE INDEX idx_workers_tenant ON workers(tenant_id);
CREATE INDEX idx_workers_status ON workers(status);
CREATE INDEX idx_workers_slug ON workers(slug);
CREATE INDEX idx_workers_skills ON workers USING GIN(skills);

-- ============================================================
-- DOCUMENTS (10+ tipos, OCR)
-- ============================================================

CREATE TABLE documents (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    owner_type      VARCHAR(20) NOT NULL CHECK (owner_type IN ('candidate', 'worker', 'vehicle', 'project')),
    owner_id        UUID NOT NULL,
    type            VARCHAR(30) NOT NULL CHECK (type IN (
                        'bi_cc', 'passport', 'niss', 'nif', 'certificate',
                        'contract', 'proof_address', 'iban', 'photo', 'cv',
                        'insurance', 'inspection', 'green_card', 'license',
                        'medical', 'work_permit', 'other'
                    )),
    title           VARCHAR(255) NOT NULL,
    file_url        VARCHAR(500) NOT NULL,
    file_size       BIGINT,
    mime_type       VARCHAR(100),
    ocr_status      VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (ocr_status IN (
                        'pending', 'processing', 'completed', 'failed', 'not_applicable'
                    )),
    ocr_confidence  DECIMAL(5,2),
    -- 0.00 a 100.00
    ocr_data        JSONB DEFAULT '{}',
    -- dados extraidos pelo OCR
    approval_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (approval_status IN (
                        'pending', 'approved', 'rejected', 'expired'
                    )),
    approved_by     UUID REFERENCES users(id),
    approved_at     TIMESTAMPTZ,
    rejection_reason TEXT,
    expires_at      DATE,
    -- data de validade do documento
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_documents_tenant ON documents(tenant_id);
CREATE INDEX idx_documents_owner ON documents(owner_type, owner_id);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_ocr_status ON documents(ocr_status);
CREATE INDEX idx_documents_approval ON documents(approval_status);
CREATE INDEX idx_documents_expires ON documents(expires_at);

-- ============================================================
-- CERTIFICATIONS
-- ============================================================

CREATE TABLE certifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    owner_type      VARCHAR(20) NOT NULL CHECK (owner_type IN ('candidate', 'worker')),
    owner_id        UUID NOT NULL,
    type            VARCHAR(30) NOT NULL,
    -- ex: 'TIG', 'MIG', 'MAG', 'ASME', 'EN_ISO_9606', 'EN_287', etc.
    code            VARCHAR(100),
    issuer          VARCHAR(255),
    issue_date      DATE,
    expiry_date     DATE,
    document_id     UUID REFERENCES documents(id),
    is_valid        BOOLEAN NOT NULL DEFAULT true,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_certifications_tenant ON certifications(tenant_id);
CREATE INDEX idx_certifications_owner ON certifications(owner_type, owner_id);
CREATE INDEX idx_certifications_expiry ON certifications(expiry_date);

-- ============================================================
-- WORK HISTORY
-- ============================================================

CREATE TABLE work_history (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    owner_type      VARCHAR(20) NOT NULL CHECK (owner_type IN ('candidate', 'worker')),
    owner_id        UUID NOT NULL,
    company_name    VARCHAR(255) NOT NULL,
    role            VARCHAR(255),
    country         VARCHAR(5),
    start_date      DATE,
    end_date        DATE,
    description     TEXT,
    reference_contact VARCHAR(100),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_work_history_owner ON work_history(owner_type, owner_id);

-- ============================================================
-- PROJECTS (Obras/Projetos)
-- ============================================================

CREATE TABLE projects (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    code            VARCHAR(50),
    primavera_code  VARCHAR(50),
    client_name     VARCHAR(255),
    client_contact  VARCHAR(255),
    country         VARCHAR(5) NOT NULL DEFAULT 'PT',
    address         TEXT,
    geo_fence       GEOMETRY(POLYGON, 4326),
    -- poligono do local da obra para verificacao GPS
    geo_center      GEOMETRY(POINT, 4326),
    geo_radius_m    INTEGER DEFAULT 500,
    -- raio em metros para clock-in simplificado
    status          VARCHAR(20) NOT NULL DEFAULT 'planning' CHECK (status IN (
                        'planning', 'active', 'paused', 'completed', 'cancelled'
                    )),
    start_date      DATE,
    end_date        DATE,
    budget          DECIMAL(14,2),
    spent           DECIMAL(14,2) DEFAULT 0,
    progress        DECIMAL(5,2) DEFAULT 0,
    -- 0.00 a 100.00
    description     TEXT,
    milestones      JSONB DEFAULT '[]',
    -- ex: [{"name": "Fundacoes", "date": "2026-04-01", "done": false}]
    settings        JSONB DEFAULT '{}',
    manager_id      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_projects_tenant ON projects(tenant_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_primavera ON projects(primavera_code);
CREATE INDEX idx_projects_geo ON projects USING GIST(geo_fence);

-- ============================================================
-- LOCATIONS
-- ============================================================

CREATE TABLE locations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    type            VARCHAR(20) NOT NULL CHECK (type IN (
                        'project_site', 'housing', 'office', 'warehouse', 'other'
                    )),
    address         TEXT,
    city            VARCHAR(100),
    country         VARCHAR(5),
    postal_code     VARCHAR(20),
    coordinates     GEOMETRY(POINT, 4326),
    reference_id    UUID,
    -- id do projeto, alojamento, etc.
    reference_type  VARCHAR(20),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_locations_tenant ON locations(tenant_id);
CREATE INDEX idx_locations_type ON locations(type);
CREATE INDEX idx_locations_geo ON locations USING GIST(coordinates);

-- ============================================================
-- ALLOCATIONS (Alocacoes trabalhador ↔ projeto)
-- ============================================================

CREATE TABLE allocations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    worker_id       UUID NOT NULL REFERENCES workers(id),
    project_id      UUID NOT NULL REFERENCES projects(id),
    role            VARCHAR(100),
    -- funcao no projeto
    status          VARCHAR(20) NOT NULL DEFAULT 'proposed' CHECK (status IN (
                        'proposed', 'confirmed', 'active', 'completed', 'cancelled'
                    )),
    match_score     DECIMAL(5,2),
    -- 0.00 a 100.00 (calculado pela IA)
    start_date      DATE,
    end_date        DATE,
    hourly_rate     DECIMAL(10,2),
    daily_rate      DECIMAL(10,2),
    housing_id      UUID REFERENCES housings(id),
    vehicle_id      UUID REFERENCES vehicles(id),
    notes           TEXT,
    proposed_by     UUID REFERENCES users(id),
    confirmed_by    UUID REFERENCES users(id),
    confirmed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_allocations_tenant ON allocations(tenant_id);
CREATE INDEX idx_allocations_worker ON allocations(worker_id);
CREATE INDEX idx_allocations_project ON allocations(project_id);
CREATE INDEX idx_allocations_status ON allocations(status);

-- ============================================================
-- HOUSINGS (Alojamentos)
-- ============================================================

CREATE TABLE housings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    address         TEXT,
    city            VARCHAR(100),
    country         VARCHAR(5) NOT NULL DEFAULT 'PT',
    coordinates     GEOMETRY(POINT, 4326),
    capacity        INTEGER NOT NULL DEFAULT 0,
    current_occupancy INTEGER NOT NULL DEFAULT 0,
    monthly_rent    DECIMAL(10,2),
    status          VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN (
                        'active', 'inactive', 'maintenance'
                    )),
    utilities       JSONB DEFAULT '{}',
    -- ex: {"water": 45.00, "electricity": 120.00, "gas": 30.00, "internet": 25.00}
    inventory       JSONB DEFAULT '[]',
    -- ex: [{"item": "cama", "qty": 6}, {"item": "frigorifico", "qty": 1}]
    photos          JSONB DEFAULT '[]',
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_housings_tenant ON housings(tenant_id);
CREATE INDEX idx_housings_status ON housings(status);
CREATE INDEX idx_housings_geo ON housings USING GIST(coordinates);

-- ============================================================
-- HOUSING OCCUPANTS
-- ============================================================

CREATE TABLE housing_occupants (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    housing_id      UUID NOT NULL REFERENCES housings(id),
    worker_id       UUID NOT NULL REFERENCES workers(id),
    check_in_date   DATE NOT NULL,
    check_out_date  DATE,
    bed_number      VARCHAR(20),
    status          VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN (
                        'active', 'checked_out', 'transferred'
                    )),
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_housing_occupants_housing ON housing_occupants(housing_id);
CREATE INDEX idx_housing_occupants_worker ON housing_occupants(worker_id);
CREATE INDEX idx_housing_occupants_status ON housing_occupants(status);

-- ============================================================
-- HOUSING MAINTENANCE LOG
-- ============================================================

CREATE TABLE housing_maintenance (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    housing_id      UUID NOT NULL REFERENCES housings(id),
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    priority        VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN (
                        'low', 'medium', 'high', 'urgent'
                    )),
    status          VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN (
                        'open', 'in_progress', 'completed', 'cancelled'
                    )),
    cost            DECIMAL(10,2),
    completed_at    TIMESTAMPTZ,
    reported_by     UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_housing_maintenance_housing ON housing_maintenance(housing_id);

-- ============================================================
-- TIME ENTRIES (Timesheet)
-- ============================================================

CREATE TABLE time_entries (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    worker_id       UUID NOT NULL REFERENCES workers(id),
    project_id      UUID NOT NULL REFERENCES projects(id),
    allocation_id   UUID REFERENCES allocations(id),
    date            DATE NOT NULL,
    clock_in        TIMESTAMPTZ,
    clock_out       TIMESTAMPTZ,
    clock_in_gps    GEOMETRY(POINT, 4326),
    clock_out_gps   GEOMETRY(POINT, 4326),
    gps_verified    BOOLEAN DEFAULT false,
    -- true se GPS estava dentro do geo-fence do projeto
    regular_hours   DECIMAL(5,2) DEFAULT 0,
    overtime_hours  DECIMAL(5,2) DEFAULT 0,
    night_hours     DECIMAL(5,2) DEFAULT 0,
    total_hours     DECIMAL(5,2) DEFAULT 0,
    hourly_cost     DECIMAL(10,2),
    total_cost      DECIMAL(10,2),
    status          VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
                        'pending', 'approved', 'rejected', 'exported'
                    )),
    approved_by     UUID REFERENCES users(id),
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_time_entries_tenant ON time_entries(tenant_id);
CREATE INDEX idx_time_entries_worker ON time_entries(worker_id);
CREATE INDEX idx_time_entries_project ON time_entries(project_id);
CREATE INDEX idx_time_entries_date ON time_entries(date);
CREATE INDEX idx_time_entries_status ON time_entries(status);

-- ============================================================
-- PRODUCTION ORDERS (Industria - Kanban)
-- ============================================================

CREATE TABLE production_orders (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    order_number    VARCHAR(50) NOT NULL,
    project_id      UUID REFERENCES projects(id),
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    client_name     VARCHAR(255),
    status          VARCHAR(20) NOT NULL DEFAULT 'received' CHECK (status IN (
                        'received', 'preparation', 'production', 'quality', 'ready', 'shipped'
                    )),
    priority        VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN (
                        'low', 'medium', 'high', 'urgent'
                    )),
    due_date        DATE,
    estimated_hours DECIMAL(8,2),
    actual_hours    DECIMAL(8,2) DEFAULT 0,
    materials       JSONB DEFAULT '[]',
    -- ex: [{"name": "Chapa 10mm", "qty": 5, "unit": "m2"}]
    photos          JSONB DEFAULT '[]',
    assigned_team   JSONB DEFAULT '[]',
    -- ex: [{"worker_id": "uuid", "role": "soldador"}]
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    UNIQUE(tenant_id, order_number)
);

CREATE INDEX idx_production_orders_tenant ON production_orders(tenant_id);
CREATE INDEX idx_production_orders_status ON production_orders(status);
CREATE INDEX idx_production_orders_project ON production_orders(project_id);

-- ============================================================
-- PRODUCTION TASKS
-- ============================================================

CREATE TABLE production_tasks (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    order_id        UUID NOT NULL REFERENCES production_orders(id),
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    assigned_to     UUID REFERENCES workers(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'todo' CHECK (status IN (
                        'todo', 'in_progress', 'done', 'blocked'
                    )),
    sort_order      INTEGER DEFAULT 0,
    estimated_hours DECIMAL(5,2),
    actual_hours    DECIMAL(5,2),
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_production_tasks_order ON production_tasks(order_id);
CREATE INDEX idx_production_tasks_assigned ON production_tasks(assigned_to);

-- ============================================================
-- VEHICLES (Frota)
-- ============================================================

CREATE TABLE vehicles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    plate           VARCHAR(20) NOT NULL,
    brand           VARCHAR(100),
    model           VARCHAR(100),
    year            INTEGER,
    type            VARCHAR(30),
    -- ex: 'carrinha', 'camiao', 'grua', 'empilhador'
    fuel_type       VARCHAR(20),
    current_km      INTEGER DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN (
                        'available', 'assigned', 'maintenance', 'inactive'
                    )),
    insurance_expiry DATE,
    inspection_expiry DATE,
    green_card_expiry DATE,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    UNIQUE(tenant_id, plate)
);

CREATE INDEX idx_vehicles_tenant ON vehicles(tenant_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_plate ON vehicles(plate);

-- ============================================================
-- VEHICLE ASSIGNMENTS
-- ============================================================

CREATE TABLE vehicle_assignments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    vehicle_id      UUID NOT NULL REFERENCES vehicles(id),
    project_id      UUID REFERENCES projects(id),
    worker_id       UUID REFERENCES workers(id),
    start_date      DATE NOT NULL,
    end_date        DATE,
    start_km        INTEGER,
    end_km          INTEGER,
    status          VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN (
                        'active', 'completed', 'cancelled'
                    )),
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_vehicle_assignments_vehicle ON vehicle_assignments(vehicle_id);
CREATE INDEX idx_vehicle_assignments_project ON vehicle_assignments(project_id);

-- ============================================================
-- VEHICLE MAINTENANCE
-- ============================================================

CREATE TABLE vehicle_maintenance (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    vehicle_id      UUID NOT NULL REFERENCES vehicles(id),
    type            VARCHAR(30) NOT NULL,
    -- ex: 'oil_change', 'tires', 'brakes', 'revision', 'repair', 'other'
    description     TEXT,
    cost            DECIMAL(10,2),
    km_at_service   INTEGER,
    service_date    DATE NOT NULL,
    next_service_date DATE,
    next_service_km INTEGER,
    provider        VARCHAR(255),
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicle_maintenance_vehicle ON vehicle_maintenance(vehicle_id);

-- ============================================================
-- COMPLIANCE ALERTS
-- ============================================================

CREATE TABLE compliance_alerts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    type            VARCHAR(30) NOT NULL,
    -- ex: 'document_expiry', 'certification_expiry', 'insurance_expiry',
    --     'inspection_due', 'declaration_due', 'contract_expiry'
    severity        VARCHAR(10) NOT NULL DEFAULT 'warning' CHECK (severity IN (
                        'info', 'warning', 'critical'
                    )),
    title           VARCHAR(255) NOT NULL,
    message         TEXT,
    reference_type  VARCHAR(30),
    -- ex: 'worker', 'vehicle', 'document', 'project'
    reference_id    UUID,
    due_date        DATE,
    resolved        BOOLEAN NOT NULL DEFAULT false,
    resolved_by     UUID REFERENCES users(id),
    resolved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_compliance_alerts_tenant ON compliance_alerts(tenant_id);
CREATE INDEX idx_compliance_alerts_resolved ON compliance_alerts(resolved);
CREATE INDEX idx_compliance_alerts_severity ON compliance_alerts(severity);
CREATE INDEX idx_compliance_alerts_due ON compliance_alerts(due_date);

-- ============================================================
-- PRIMAVERA EXPORTS
-- ============================================================

CREATE TABLE primavera_exports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    type            VARCHAR(30) NOT NULL,
    -- ex: 'timesheet', 'workers', 'projects', 'costs'
    period_start    DATE NOT NULL,
    period_end      DATE NOT NULL,
    file_url        VARCHAR(500),
    file_format     VARCHAR(10) NOT NULL DEFAULT 'csv',
    records_count   INTEGER DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
                        'pending', 'processing', 'completed', 'failed'
                    )),
    error_message   TEXT,
    exported_by     UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_primavera_exports_tenant ON primavera_exports(tenant_id);
CREATE INDEX idx_primavera_exports_type ON primavera_exports(type);

-- ============================================================
-- GOVERNMENT DECLARATIONS (ONSS, SS, Financas)
-- ============================================================

CREATE TABLE government_declarations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    type            VARCHAR(20) NOT NULL CHECK (type IN (
                        'onss', 'ss', 'financas'
                    )),
    -- onss = Office National de Securite Sociale (Belgica)
    -- ss = Seguranca Social (Portugal)
    -- financas = Autoridade Tributaria (Portugal)
    country         VARCHAR(5) NOT NULL,
    period_month    INTEGER NOT NULL,
    -- 1-12
    period_year     INTEGER NOT NULL,
    workers_count   INTEGER DEFAULT 0,
    total_amount    DECIMAL(14,2),
    file_url        VARCHAR(500),
    status          VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN (
                        'draft', 'generating', 'ready', 'submitted', 'accepted', 'rejected', 'failed'
                    )),
    submission_date DATE,
    reference_number VARCHAR(100),
    error_message   TEXT,
    submitted_by    UUID REFERENCES users(id),
    data            JSONB DEFAULT '{}',
    -- dados completos da declaracao
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gov_declarations_tenant ON government_declarations(tenant_id);
CREATE INDEX idx_gov_declarations_type ON government_declarations(type);
CREATE INDEX idx_gov_declarations_period ON government_declarations(period_year, period_month);
CREATE INDEX idx_gov_declarations_status ON government_declarations(status);

-- ============================================================
-- AUDIT LOG (para rastreabilidade)
-- ============================================================

CREATE TABLE audit_log (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    user_id         UUID REFERENCES users(id),
    action          VARCHAR(30) NOT NULL,
    -- ex: 'create', 'update', 'delete', 'export', 'login', 'approve'
    entity_type     VARCHAR(50) NOT NULL,
    entity_id       UUID,
    changes         JSONB DEFAULT '{}',
    ip_address      VARCHAR(45),
    user_agent      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_tenant ON audit_log(tenant_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

-- ============================================================
-- UPDATED_AT TRIGGER (automatico para todas as tabelas)
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas as tabelas com updated_at
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN
        SELECT table_name FROM information_schema.columns
        WHERE column_name = 'updated_at'
        AND table_schema = 'public'
        AND table_name != 'audit_log'
    LOOP
        EXECUTE format(
            'CREATE TRIGGER trg_%I_updated_at
             BEFORE UPDATE ON %I
             FOR EACH ROW EXECUTE FUNCTION update_updated_at()',
            t, t
        );
    END LOOP;
END;
$$;
```

---

## 8. API REST - Endpoints Completos

**Base URL**: `https://api.metalbrass.com/api/v1`

**Headers padrao**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
X-Tenant-ID: <tenant_uuid>  (opcional, inferido do token)
```

### 8.1 Autenticacao

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | `/auth/login` | Login com email+password, retorna access+refresh tokens |
| POST | `/auth/refresh` | Renovar access token com refresh token |
| POST | `/auth/logout` | Invalidar refresh token |
| POST | `/auth/forgot-password` | Enviar email de reset |
| POST | `/auth/reset-password` | Reset password com token |
| GET | `/auth/me` | Dados do utilizador autenticado |
| PUT | `/auth/me` | Atualizar perfil proprio |
| PUT | `/auth/me/password` | Alterar password |

### 8.2 Tenants

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/tenants` | Listar tenants (super-admin) |
| POST | `/tenants` | Criar tenant |
| GET | `/tenants/:id` | Detalhe do tenant |
| PUT | `/tenants/:id` | Atualizar tenant |
| DELETE | `/tenants/:id` | Desativar tenant (soft delete) |

### 8.3 Utilizadores

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/users` | Listar utilizadores do tenant |
| POST | `/users` | Criar utilizador |
| GET | `/users/:id` | Detalhe |
| PUT | `/users/:id` | Atualizar |
| DELETE | `/users/:id` | Desativar (soft delete) |
| PUT | `/users/:id/role` | Alterar role |

### 8.4 Candidatos

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/candidates` | Listar com filtros (?status=bot_active&page=1) |
| POST | `/candidates` | Criar candidato |
| GET | `/candidates/:id` | Detalhe completo |
| PUT | `/candidates/:id` | Atualizar dados |
| DELETE | `/candidates/:id` | Soft delete |
| PUT | `/candidates/:id/status` | Mudar estado do pipeline |
| POST | `/candidates/:id/convert` | Converter para trabalhador |
| GET | `/candidates/:id/documents` | Documentos do candidato |
| GET | `/candidates/:id/certifications` | Certificacoes |
| GET | `/candidates/:id/work-history` | Historico de trabalho |
| GET | `/candidates/stats` | Estatisticas do pipeline |

### 8.5 Trabalhadores

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/workers` | Listar com filtros e paginacao |
| POST | `/workers` | Criar trabalhador |
| GET | `/workers/:id` | Detalhe completo |
| PUT | `/workers/:id` | Atualizar |
| DELETE | `/workers/:id` | Soft delete |
| PUT | `/workers/:id/status` | Alterar estado (active/inactive/on_leave/terminated) |
| GET | `/workers/:id/documents` | Documentos |
| GET | `/workers/:id/certifications` | Certificacoes |
| GET | `/workers/:id/allocations` | Historico de alocacoes |
| GET | `/workers/:id/time-entries` | Registos de horas |
| GET | `/workers/:id/revenue` | Receita anual calculada |
| GET | `/workers/by-slug/:slug` | Buscar por slug (Modo Operario) |
| GET | `/workers/stats` | Estatisticas gerais |

### 8.6 Documentos

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/documents` | Listar com filtros (?type=bi_cc&status=pending) |
| POST | `/documents` | Upload de documento (multipart/form-data) |
| GET | `/documents/:id` | Detalhe com dados OCR |
| PUT | `/documents/:id` | Atualizar metadados |
| DELETE | `/documents/:id` | Soft delete |
| PUT | `/documents/:id/approve` | Aprovar documento |
| PUT | `/documents/:id/reject` | Rejeitar documento |
| POST | `/documents/:id/ocr-retry` | Re-processar OCR |
| GET | `/documents/expiring` | Documentos a expirar (proximos 30/60/90 dias) |
| GET | `/documents/stats` | Estatisticas OCR e aprovacao |

### 8.7 Certificacoes

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/certifications` | Listar |
| POST | `/certifications` | Criar |
| GET | `/certifications/:id` | Detalhe |
| PUT | `/certifications/:id` | Atualizar |
| DELETE | `/certifications/:id` | Soft delete |
| GET | `/certifications/expiring` | A expirar |

### 8.8 Historico de Trabalho

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/work-history` | Listar (por owner) |
| POST | `/work-history` | Criar |
| PUT | `/work-history/:id` | Atualizar |
| DELETE | `/work-history/:id` | Soft delete |

### 8.9 Projetos

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/projects` | Listar com filtros (?status=active&country=PT) |
| POST | `/projects` | Criar projeto |
| GET | `/projects/:id` | Detalhe com KPIs |
| PUT | `/projects/:id` | Atualizar |
| DELETE | `/projects/:id` | Soft delete |
| GET | `/projects/:id/team` | Equipa alocada |
| GET | `/projects/:id/time-entries` | Horas registadas |
| GET | `/projects/:id/allocations` | Alocacoes |
| GET | `/projects/:id/vehicles` | Viaturas atribuidas |
| GET | `/projects/:id/costs` | Resumo de custos |
| PUT | `/projects/:id/milestones` | Atualizar milestones |
| GET | `/projects/stats` | Estatisticas gerais |
| GET | `/projects/map` | Dados para mapa (geo) |

### 8.10 Alocacoes

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/allocations` | Listar (?view=by_project ou ?view=by_worker) |
| POST | `/allocations` | Criar alocacao |
| GET | `/allocations/:id` | Detalhe |
| PUT | `/allocations/:id` | Atualizar |
| DELETE | `/allocations/:id` | Cancelar |
| PUT | `/allocations/:id/status` | Mudar estado |
| POST | `/allocations/suggest` | IA sugere workers para projeto |
| GET | `/allocations/conflicts` | Detetar conflitos de alocacao |

### 8.11 Alojamentos

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/housings` | Listar com ocupacao |
| POST | `/housings` | Criar alojamento |
| GET | `/housings/:id` | Detalhe completo |
| PUT | `/housings/:id` | Atualizar |
| DELETE | `/housings/:id` | Soft delete |
| GET | `/housings/:id/occupants` | Lista de ocupantes |
| POST | `/housings/:id/occupants` | Check-in de trabalhador |
| PUT | `/housings/:id/occupants/:oid` | Atualizar ocupante |
| DELETE | `/housings/:id/occupants/:oid` | Check-out |
| PUT | `/housings/:id/utilities` | Atualizar custos utilidades |
| PUT | `/housings/:id/inventory` | Atualizar inventario |
| GET | `/housings/:id/maintenance` | Log de manutencao |
| POST | `/housings/:id/maintenance` | Registar manutencao |
| PUT | `/housings/:id/maintenance/:mid` | Atualizar manutencao |
| POST | `/housings/suggest` | Sugerir alojamento para worker/projeto |

### 8.12 Timesheet

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/time-entries` | Listar (?worker_id=&project_id=&date_from=&date_to=) |
| POST | `/time-entries/clock-in` | Clock-in com GPS |
| PUT | `/time-entries/:id/clock-out` | Clock-out com GPS |
| POST | `/time-entries` | Registo manual |
| PUT | `/time-entries/:id` | Corrigir registo |
| DELETE | `/time-entries/:id` | Soft delete |
| PUT | `/time-entries/:id/approve` | Aprovar |
| PUT | `/time-entries/:id/reject` | Rejeitar |
| POST | `/time-entries/bulk-approve` | Aprovacao em massa |
| GET | `/time-entries/summary` | Resumo por periodo (?group_by=worker ou project) |
| GET | `/time-entries/overtime` | Relatorio de horas extra |
| GET | `/time-entries/costs` | Calculo de custos |

### 8.13 Producao Industrial

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/production-orders` | Listar (Kanban) |
| POST | `/production-orders` | Criar ordem |
| GET | `/production-orders/:id` | Detalhe |
| PUT | `/production-orders/:id` | Atualizar |
| DELETE | `/production-orders/:id` | Soft delete |
| PUT | `/production-orders/:id/status` | Mover no Kanban |
| PUT | `/production-orders/:id/team` | Atualizar equipa |
| POST | `/production-orders/:id/photos` | Adicionar foto |
| GET | `/production-orders/:id/tasks` | Listar tarefas |
| POST | `/production-orders/:id/tasks` | Criar tarefa |
| PUT | `/production-orders/:id/tasks/:tid` | Atualizar tarefa |
| DELETE | `/production-orders/:id/tasks/:tid` | Remover tarefa |
| GET | `/production-orders/stats` | Estatisticas producao |

### 8.14 Frota

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/vehicles` | Listar com filtros |
| POST | `/vehicles` | Criar viatura |
| GET | `/vehicles/:id` | Detalhe |
| PUT | `/vehicles/:id` | Atualizar |
| DELETE | `/vehicles/:id` | Soft delete |
| GET | `/vehicles/:id/documents` | Documentos da viatura |
| GET | `/vehicles/:id/maintenance` | Historico manutencao |
| POST | `/vehicles/:id/maintenance` | Registar manutencao |
| GET | `/vehicles/:id/assignments` | Historico atribuicoes |
| POST | `/vehicles/:id/assignments` | Atribuir a projeto/worker |
| PUT | `/vehicles/:id/assignments/:aid` | Atualizar atribuicao |
| GET | `/vehicles/expiring` | Viaturas com docs a expirar |
| GET | `/vehicles/available` | Viaturas disponiveis |

### 8.15 Exportacoes

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | `/exports/primavera` | Exportar para Primavera |
| POST | `/exports/excel` | Exportar para Excel |
| POST | `/exports/onss` | Gerar declaracao ONSS |
| POST | `/exports/ss` | Gerar declaracao Seguranca Social |
| POST | `/exports/financas` | Gerar declaracao Financas |
| GET | `/exports/history` | Historico de exportacoes |
| GET | `/exports/:id` | Detalhe e download |
| GET | `/exports/:id/download` | Download do ficheiro |

### 8.16 Declaracoes Governamentais

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/declarations` | Listar declaracoes |
| POST | `/declarations` | Criar/gerar declaracao |
| GET | `/declarations/:id` | Detalhe |
| PUT | `/declarations/:id` | Atualizar |
| POST | `/declarations/:id/submit` | Submeter a entidade |
| GET | `/declarations/calendar` | Calendario de prazos |

### 8.17 Compliance

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/compliance/alerts` | Listar alertas (?severity=critical&resolved=false) |
| PUT | `/compliance/alerts/:id/resolve` | Resolver alerta |
| GET | `/compliance/dashboard` | Resumo de compliance |
| POST | `/compliance/check` | Executar verificacao manual |
| GET | `/compliance/rules` | Listar regras configuradas |
| PUT | `/compliance/rules/:id` | Atualizar regra |

### 8.18 Localizacoes

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/locations` | Listar |
| POST | `/locations` | Criar |
| GET | `/locations/:id` | Detalhe |
| PUT | `/locations/:id` | Atualizar |
| DELETE | `/locations/:id` | Soft delete |
| GET | `/locations/map` | Dados para mapa |

### 8.19 Base de Dados (Import/Export)

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/database/obras` | Listar obras (tab Obras) |
| GET | `/database/funcionarios` | Listar funcionarios (tab Funcionarios) |
| GET | `/database/frota` | Listar frota (tab Frota) |
| GET | `/database/localizacoes` | Listar localizacoes (tab Localizacoes) |
| POST | `/database/import` | Importar CSV/Excel (multipart) |
| GET | `/database/export/:tab` | Exportar tab para CSV/Excel |

### 8.20 Configuracoes

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/config/users` | Listar utilizadores do sistema |
| GET | `/config/compliance` | Regras de compliance |
| PUT | `/config/compliance` | Atualizar regras |
| GET | `/config/housing` | Regras de alojamento |
| PUT | `/config/housing` | Atualizar regras |
| GET | `/config/templates` | Listar templates |
| POST | `/config/templates` | Criar template |
| PUT | `/config/templates/:id` | Atualizar template |
| DELETE | `/config/templates/:id` | Remover template |
| GET | `/config/integrations` | Listar integracoes |
| PUT | `/config/integrations/:name` | Configurar integracao |
| POST | `/config/integrations/:name/test` | Testar integracao |

### 8.21 IA / AI Endpoints

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | `/ai/ocr` | Processar documento com OCR (Qwen 2.5) |
| POST | `/ai/matching` | Calcular match score worker ↔ projeto |
| POST | `/ai/suggest-allocation` | Sugerir melhor alocacao para projeto |
| POST | `/ai/chatbot` | Chatbot para Modo Operario |
| GET | `/ai/status` | Estado dos servicos IA (Ollama health) |

### 8.22 WhatsApp Bot Webhook

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | `/webhook/whatsapp` | Receber mensagens do OpenClaw |
| POST | `/webhook/whatsapp/status` | Status de entrega de mensagens |
| POST | `/bot/send-message` | Enviar mensagem via bot |
| POST | `/bot/send-template` | Enviar template WhatsApp |

### 8.23 Dashboard Aggregations

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/dashboard/kpis` | 6 KPIs principais |
| GET | `/dashboard/projects` | Cards projetos ativos |
| GET | `/dashboard/production-chart` | Dados grafico producao |
| GET | `/dashboard/alerts` | Alertas recentes |
| GET | `/dashboard/quick-stats` | Estatisticas rapidas |

### 8.24 Modo Operario

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | `/worker-app/login` | Login do trabalhador (slug + password) |
| GET | `/worker-app/profile` | Perfil do trabalhador |
| GET | `/worker-app/project` | Projeto atual |
| POST | `/worker-app/clock-in` | Clock-in com GPS |
| POST | `/worker-app/clock-out` | Clock-out com GPS |
| GET | `/worker-app/documents` | Documentos pessoais |
| POST | `/worker-app/sign-contract` | Assinar contrato digitalmente |
| GET | `/worker-app/housing` | Info alojamento |
| POST | `/worker-app/chatbot` | Chatbot IA |
| GET | `/worker-app/notifications` | Notificacoes |

---

## 9. Matriz RBAC

### Roles

| Role | Descricao |
|------|-----------|
| **admin** | Acesso total ao sistema, gestao de tenants e utilizadores |
| **manager** | Gestao de projetos, trabalhadores, alocacoes, exportacoes |
| **validator** | Validacao de candidatos, aprovacao de documentos, timesheet |
| **viewer** | Visualizacao apenas (read-only em todos os modulos) |
| **worker** | Acesso apenas ao Modo Operario (app mobile) |

### Matriz de Permissoes

| Modulo/Acao | admin | manager | validator | viewer | worker |
|-------------|:-----:|:-------:|:---------:|:------:|:------:|
| **Dashboard** |
| Ver KPIs | X | X | X | X | - |
| Ver alertas | X | X | X | X | - |
| **Candidatos** |
| Listar | X | X | X | X | - |
| Criar | X | X | - | - | - |
| Editar | X | X | - | - | - |
| Validar/Rejeitar | X | X | X | - | - |
| Converter para worker | X | X | - | - | - |
| **Pessoal** |
| Listar | X | X | X | X | - |
| Criar | X | X | - | - | - |
| Editar | X | X | - | - | - |
| Desativar | X | - | - | - | - |
| Ver salarios | X | X | - | - | - |
| **Projetos** |
| Listar | X | X | X | X | - |
| Criar | X | X | - | - | - |
| Editar | X | X | - | - | - |
| Eliminar | X | - | - | - | - |
| Ver custos | X | X | - | - | - |
| **Documentos** |
| Listar | X | X | X | X | - |
| Upload | X | X | X | - | X* |
| Aprovar/Rejeitar | X | X | X | - | - |
| Eliminar | X | - | - | - | - |
| **Timesheet** |
| Ver todos | X | X | X | X | - |
| Registo manual | X | X | - | - | - |
| Clock-in/out | X | X | - | - | X |
| Aprovar | X | X | X | - | - |
| **Alocacoes** |
| Listar | X | X | X | X | - |
| Criar/Editar | X | X | - | - | - |
| Confirmar | X | X | - | - | - |
| **Alojamentos** |
| Listar | X | X | X | X | - |
| Criar/Editar | X | X | - | - | - |
| Check-in/out | X | X | X | - | - |
| **Industria** |
| Listar | X | X | X | X | - |
| Criar/Editar | X | X | - | - | - |
| Mover Kanban | X | X | X | - | - |
| **Frota** |
| Listar | X | X | X | X | - |
| Criar/Editar | X | X | - | - | - |
| Atribuir | X | X | - | - | - |
| **Exportacoes** |
| Primavera | X | X | - | - | - |
| Excel | X | X | X | X | - |
| Declaracoes gov. | X | X | - | - | - |
| **Configuracoes** |
| Utilizadores | X | - | - | - | - |
| Compliance | X | X | - | - | - |
| Templates | X | X | - | - | - |
| Integracoes | X | - | - | - | - |
| **Modo Operario** |
| Acesso | - | - | - | - | X |

> *X* = trabalhador pode fazer upload apenas dos proprios documentos via Modo Operario

---

## 10. Diagrama de Integracoes

```
+------------------------------------------------------------------+
|                    INTEGRACOES EXTERNAS                            |
+------------------------------------------------------------------+
|                                                                    |
|  +-------------------+       +-------------------+                 |
|  | WhatsApp          |       | Primavera ERP     |                 |
|  | (OpenClaw)        |       |                   |                 |
|  |                   |       | - Exportacao SAF-T |                |
|  | - Bot captacao    |       | - Sync trabalhadores|               |
|  | - Notificacoes    |       | - Sync projetos   |                |
|  | - Mensagens       |       | - Exportacao horas |                |
|  +--------+----------+       +---------+---------+                 |
|           |                            |                           |
|           v                            v                           |
|  +------------------------------------------------+               |
|  |           MetalBrass OS Backend                 |               |
|  |                                                 |               |
|  |  Webhook      REST API       Background Jobs    |               |
|  |  /webhook/*   /api/v1/*      (Cron/Queue)       |               |
|  +-----+------------------+-------------+----------+              |
|        |                  |             |                          |
|        v                  v             v                          |
|  +------------+  +--------------+  +------------------+           |
|  | Ollama     |  | PostgreSQL   |  | Declaracoes Gov. |           |
|  | Qwen 2.5   |  | (VPS)        |  |                  |          |
|  |            |  |              |  | - ONSS (BE)      |           |
|  | - OCR      |  | - Dados      |  | - SS (PT)        |          |
|  | - Match    |  | - PostGIS    |  | - Financas (PT)  |          |
|  | - Chat     |  |              |  |                  |           |
|  +------------+  +--------------+  +------------------+           |
|                                                                    |
|  +-------------------+       +-------------------+                 |
|  | Kimi Claw         |       | OpenCloud          |                |
|  | (Orquestrador)    |       | (Deploy Agent)     |                |
|  |                   |       |                   |                 |
|  | - Pipeline IA     |       | - VPS management  |                |
|  | - Automacao       |       | - SSL/TLS         |                |
|  | - Workflows       |       | - Monitoring      |                |
|  +-------------------+       +-------------------+                 |
+------------------------------------------------------------------+

FLUXO DE DADOS:

WhatsApp Bot (OpenClaw)
    |
    |--> POST /webhook/whatsapp
    |       |
    |       |--> Cria/atualiza candidato
    |       |--> Guarda documentos recebidos
    |       |--> Dispara OCR (Ollama)
    |
    |--> Notificacoes enviadas via bot

Primavera ERP
    |
    |--> POST /exports/primavera
    |       |
    |       |--> Gera ficheiro CSV/SAF-T
    |       |--> Mapeia codigos Primavera
    |       |--> Download disponivel

Declaracoes Governamentais
    |
    |--> POST /declarations
    |       |
    |       |--> Agrega dados trabalhadores por pais
    |       |--> Gera ficheiro no formato oficial
    |       |--> Submissao (manual ou automatica)

Ollama + Qwen 2.5
    |
    |--> POST /ai/ocr
    |       |--> Extrai texto de documentos
    |       |--> Retorna dados estruturados + confianca
    |
    |--> POST /ai/matching
    |       |--> Compara skills worker vs requisitos projeto
    |       |--> Retorna score 0-100%
    |
    |--> POST /ai/chatbot
            |--> Responde perguntas trabalhadores
            |--> Contexto: projeto, contrato, alojamento
```

---

## 11. Fluxo de Negocio

### 11.1 Captacao (Candidato chega via WhatsApp)

```
1. Bot WhatsApp contacta candidato
   |
2. Candidato responde → status: bot_active
   |
3. Bot pede documentos (BI, CV, certificados)
   |
4. Candidato envia documentos → status: data_received
   |
5. OCR processa documentos em background
   |  - Confianca alta (>80%): aprovacao automatica do documento
   |  - Confianca baixa (<80%): flag para revisao manual
   |
6. Equipa interna revisa → status: validating
   |
7. Validacao completa → status: validated
   |  OU
7b. Rejeicao com motivo → status: rejected
   |
8. Conversao para trabalhador (POST /candidates/:id/convert)
   |
9. Criacao automatica de:
   - Registo worker
   - User com role 'worker'
   - URL pessoal (nexus.metalbrass.com/slug)
```

### 11.2 Alocacao (Worker atribuido a projeto)

```
1. Manager cria alocacao ou pede sugestao IA
   |
2. IA calcula match score (skills, certificacoes, lingua, localizacao)
   |
3. Sistema sugere alojamento proximo ao projeto
   |
4. Sistema sugere viatura disponivel
   |
5. Alocacao criada → status: proposed
   |
6. Manager confirma → status: confirmed
   |
7. Worker notificado (WhatsApp + Modo Operario)
   |
8. Data inicio → status: active
   |
9. Worker faz clock-in diario via Modo Operario
   |
10. Data fim ou desalocacao → status: completed
```

### 11.3 Integracao (Onboarding do trabalhador)

```
1. Worker recebe credenciais do Modo Operario
   |
2. Acede a nexus.metalbrass.com/{slug}
   |
3. Ve informacoes do projeto, alojamento
   |
4. Assina contrato digitalmente
   |
5. Recebe formacao (registada no sistema)
   |
6. Inicia trabalho com clock-in GPS
```

### 11.4 Formalizacao (Declaracoes governamentais)

```
1. Cron job mensal (ou trigger manual)
   |
2. Sistema agrega dados por pais:
   |  - PT: Seguranca Social + Financas
   |  - BE: ONSS
   |  - FR: URSSAF (futuro)
   |  - ES: Seguridad Social (futuro)
   |
3. Gera ficheiros no formato oficial
   |
4. Revisao por admin/manager
   |
5. Submissao (manual ou automatica conforme integracao)
   |
6. Registo de numero de referencia e estado
```

### 11.5 Acompanhamento (Operacao diaria)

```
Diario:
- Workers fazem clock-in/out via Modo Operario
- GPS verificado contra geo-fence do projeto
- Horas regulares e extras calculadas automaticamente

Semanal:
- Manager revisa horas pendentes
- Aprovacao em massa de timesheets
- Verificacao de compliance alerts

Mensal:
- Exportacao para Primavera (horas + custos)
- Geracao de declaracoes governamentais
- Relatorio de custos por projeto
- Relatorio de receita por trabalhador
```

---

## 12. Fases de Desenvolvimento

### Fase 1 - Fundacao (Semana 1-2)

**Objetivo**: Backend funcional com autenticacao e CRUD basico.

| Tarefa | Prioridade | Estimativa |
|--------|-----------|-----------|
| Setup PostgreSQL no VPS | Alta | 2h |
| Executar schema completo (todas as tabelas) | Alta | 2h |
| Setup projeto backend (Node.js ou FastAPI) | Alta | 4h |
| Middleware de autenticacao JWT | Alta | 4h |
| Middleware RBAC | Alta | 4h |
| Middleware multi-tenant | Alta | 3h |
| CRUD Workers completo | Alta | 6h |
| CRUD Projects completo | Alta | 6h |
| CRUD Users | Alta | 4h |
| Conectar frontend React ao backend | Alta | 8h |
| Seed data (tenants, users, workers, projects) | Media | 3h |
| Setup CORS, rate limiting, logging | Media | 2h |
| **Total Fase 1** | | **~48h** |

**Entregavel**: Dashboard funcional com dados reais, login, listagem e criacao de trabalhadores e projetos.

---

### Fase 2 - Documentos e Timesheet (Semana 3-4)

**Objetivo**: Gestao documental com OCR e registo de horas.

| Tarefa | Prioridade | Estimativa |
|--------|-----------|-----------|
| CRUD Documents com upload ficheiros | Alta | 6h |
| Integracao Ollama + Qwen 2.5 para OCR | Alta | 8h |
| Pipeline OCR em background (job queue) | Alta | 6h |
| Logica de aprovacao manual (baixa confianca) | Alta | 4h |
| CRUD Time Entries | Alta | 6h |
| Clock-in/out com GPS | Alta | 6h |
| Verificacao geo-fence (PostGIS) | Alta | 4h |
| Calculo horas extra automatico | Media | 4h |
| Calculo de custos | Media | 3h |
| Modo Operario - Login + perfil + clock-in | Alta | 8h |
| Alertas de vencimento de documentos | Media | 3h |
| Compliance alerts automaticos | Media | 4h |
| **Total Fase 2** | | **~62h** |

**Entregavel**: Upload e OCR de documentos funcional, timesheet com GPS, app mobile basica para trabalhadores.

---

### Fase 3 - IA e Alocacoes (Semana 5-6)

**Objetivo**: Matching inteligente e gestao de alojamentos.

| Tarefa | Prioridade | Estimativa |
|--------|-----------|-----------|
| AI Matching engine (skills vs requisitos) | Alta | 10h |
| CRUD Allocations | Alta | 6h |
| Vista dupla (por projeto / por worker) | Alta | 4h |
| CRUD Housings | Alta | 6h |
| Housing occupants (check-in/out) | Alta | 4h |
| Utilities e inventory | Media | 3h |
| Housing maintenance log | Media | 3h |
| Sugestao automatica de alojamento | Alta | 4h |
| Sugestao automatica de viatura | Media | 3h |
| Exportacao Primavera (timesheet) | Alta | 8h |
| Exportacao Excel | Media | 4h |
| Certifications CRUD | Media | 3h |
| Work history CRUD | Media | 2h |
| **Total Fase 3** | | **~60h** |

**Entregavel**: Alocacao inteligente de trabalhadores com sugestoes de alojamento e viatura. Exportacao para Primavera funcional.

---

### Fase 4 - Governo e Industria (Semana 7-8)

**Objetivo**: Declaracoes automatizadas e producao industrial.

| Tarefa | Prioridade | Estimativa |
|--------|-----------|-----------|
| Geracao declaracao ONSS (Belgica) | Alta | 10h |
| Geracao declaracao SS (Portugal) | Alta | 8h |
| Geracao declaracao Financas (Portugal) | Alta | 8h |
| Calendario de prazos | Media | 3h |
| CRUD Production Orders (Kanban) | Alta | 6h |
| Production Tasks | Alta | 4h |
| Drag & drop Kanban (sync backend) | Alta | 4h |
| Chatbot IA para Modo Operario | Media | 8h |
| Multi-tenant: separacao completa de dados | Alta | 6h |
| Assinatura digital de contrato | Media | 6h |
| **Total Fase 4** | | **~63h** |

**Entregavel**: Declaracoes governamentais automatizadas, Kanban de producao funcional, chatbot no Modo Operario.

---

### Fase 5 - WhatsApp e Completude (Semana 9-10)

**Objetivo**: Pipeline completo de candidatos e modulos restantes.

| Tarefa | Prioridade | Estimativa |
|--------|-----------|-----------|
| Integracao WhatsApp (OpenClaw webhook) | Alta | 10h |
| Bot de captacao (fluxo conversacional) | Alta | 8h |
| CRUD Candidates com pipeline | Alta | 6h |
| Conversao candidato → trabalhador | Alta | 4h |
| CRUD Vehicles (Frota) | Alta | 6h |
| Vehicle maintenance history | Media | 3h |
| Vehicle assignments | Media | 3h |
| Base de Dados (4 tabs + import/export CSV) | Media | 8h |
| Configuracoes (5 sub-paginas) | Media | 8h |
| Dashboard KPIs agregados reais | Alta | 6h |
| Testes end-to-end | Alta | 8h |
| Performance tuning e indexacao | Media | 4h |
| **Total Fase 5** | | **~74h** |

**Entregavel**: Sistema completo e funcional com todos os 14 modulos conectados ao backend.

---

### Resumo de Esforco

| Fase | Semanas | Horas | Modulos |
|------|---------|-------|---------|
| Fase 1 | 1-2 | ~48h | Auth, Workers, Projects, Dashboard (basico) |
| Fase 2 | 3-4 | ~62h | Documents, Timesheet, Modo Operario, Compliance |
| Fase 3 | 5-6 | ~60h | Allocations, Housings, AI Matching, Primavera Export |
| Fase 4 | 7-8 | ~63h | Declarations, Industry, Chatbot, Multi-tenant |
| Fase 5 | 9-10 | ~74h | WhatsApp Bot, Candidates, Fleet, Database, Config |
| **Total** | **10 semanas** | **~307h** | **14 modulos completos** |

---

## 13. Requisitos Nao-Funcionais

### Performance
- Tempo de resposta API: < 200ms (P95) para CRUD simples
- Tempo de resposta API: < 2s (P95) para queries com agregacao
- OCR processing: < 30s por documento
- Matching score: < 5s por calculo
- Suportar 100 utilizadores simultaneos

### Seguranca
- JWT com expiracao curta (15min access, 7d refresh)
- HTTPS obrigatorio (TLS 1.3)
- Rate limiting por IP e por utilizador
- Sanitizacao de inputs (SQL injection, XSS)
- Passwords: bcrypt com salt rounds >= 12
- RBAC enforced em todos os endpoints
- Audit log de todas as acoes criticas
- Multi-tenant isolation (row-level security)
- File upload: validacao de tipo e tamanho (max 20MB)

### Disponibilidade
- Uptime target: 99.5%
- Backup diario da base de dados
- Backup semanal dos ficheiros
- Health check endpoint: GET /health
- Monitoring: metricas de CPU, RAM, disco, requests

### Escalabilidade
- Schema preparado para multi-tenant SaaS
- Indexes otimizados para queries frequentes
- Paginacao em todas as listagens (default: 20, max: 100)
- Background jobs para operacoes pesadas (OCR, exportacoes, declaracoes)

### Compatibilidade
- Frontend: Chrome, Firefox, Safari, Edge (ultimas 2 versoes)
- Modo Operario: iOS Safari, Android Chrome (PWA)
- API: RESTful, JSON, versionada (/api/v1/)

### Internacionalizacao
- Interface em Portugues (principal)
- Dados multi-pais: PT, FR, ES, BE
- Formatos de data/moeda conforme pais
- Campos de NIF/NISS adaptados por pais

---

## 14. Riscos e Mitigacoes

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|:------------:|:-------:|-----------|
| OCR com baixa precisao em documentos manuscritos | Media | Alto | Fallback para aprovacao manual; treino fine-tuned do Qwen |
| Latencia do Ollama em VPS com recursos limitados | Media | Medio | Queue de processamento; cache de resultados; GPU dedicada se necessario |
| Formatos de declaracao governamental mudam | Baixa | Alto | Abstraction layer; templates configuráveis; monitorizar sites oficiais |
| Geo-fence impreciso em zonas rurais/indoor | Media | Baixo | Raio de tolerancia configuravel; override manual por manager |
| WhatsApp API rate limits | Baixa | Medio | Queue de mensagens; retry com backoff; monitorizacao |
| Volume de dados cresce acima do esperado | Baixa | Medio | Particionamento de tabelas por data; archiving de dados antigos |
| Downtime do VPS | Baixa | Alto | Backup automatico; procedimento de recovery documentado; alertas |
| Trabalhadores sem smartphone moderno | Media | Medio | PWA leve; funciona offline para clock-in; fallback SMS |

---

## Apendice A - Variaveis de Ambiente

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/metalbrass
DATABASE_POOL_SIZE=20

# Auth
JWT_SECRET=<random-256-bit-key>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# File Storage
UPLOAD_DIR=/var/data/metalbrass/uploads
MAX_FILE_SIZE=20971520  # 20MB

# Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5

# WhatsApp (OpenClaw)
OPENCLAW_API_KEY=<key>
OPENCLAW_WEBHOOK_SECRET=<secret>
OPENCLAW_PHONE_NUMBER_ID=<id>

# Primavera
PRIMAVERA_EXPORT_FORMAT=csv

# Redis
REDIS_URL=redis://localhost:6379

# App
APP_URL=https://nexus.metalbrass.com
API_URL=https://api.metalbrass.com
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
```

---

## Apendice B - Convencoes de Codigo

### Backend (Node.js/FastAPI)
- Estrutura: `src/modules/{module}/controller.ts`, `service.ts`, `repository.ts`, `routes.ts`, `types.ts`
- Validacao de input: Zod (Node.js) ou Pydantic (FastAPI)
- Error handling centralizado com codigos HTTP corretos
- Logging estruturado (JSON) com request ID
- Testes: Jest (Node.js) ou Pytest (FastAPI)

### Base de Dados
- Nomes de tabelas: snake_case, plural
- Nomes de colunas: snake_case
- Foreign keys: `{tabela_singular}_id`
- Indexes: `idx_{tabela}_{coluna}`
- Migrations: sequenciais com timestamp

### API
- Versionamento: `/api/v1/`
- Paginacao: `?page=1&limit=20`
- Filtros: query parameters (`?status=active&country=PT`)
- Ordenacao: `?sort=created_at&order=desc`
- Resposta padrao: `{ data: T, meta: { page, limit, total } }`
- Erros: `{ error: { code: string, message: string, details?: any } }`

---

## 15. Agentes Autonomos OpenClaw

O sistema MetalBrass OS utiliza 7 agentes autonomos OpenClaw na VPS, cada um com workspace isolado, memoria persistente, heartbeat proprio e identidade unica. Os agentes correm 24/7 e comunicam entre si via API e WhatsApp.

### 15.1 Arquitetura Multi-Agent

```
KIMI CLAW (Orquestrador - VPS)
├── OpenClaw Gateway (daemon systemd)
│   ├── WhatsApp Channel (QR code link)
│   ├── Kimi K2.5 (LLM principal)
│   ├── Qwen 2.5 via Ollama (OCR + matching)
│   ├── PostgreSQL (dados)
│   └── API Backend (comunicacao com dashboard)
│
├── workspace-recruiter/      → Agente 1: Recrutador
├── workspace-doc-validator/  → Agente 2: Validador Docs
├── workspace-compliance/     → Agente 3: Compliance Monitor
├── workspace-allocator/      → Agente 4: Alocador Inteligente
├── workspace-onboarding/     → Agente 5: Onboarding Assistant
├── workspace-timesheet/      → Agente 6: Timesheet Monitor
└── workspace-export/         → Agente 7: Export & Declarations
```

### 15.2 Ficheiros por Agente

Cada workspace contem 6 ficheiros de configuracao:

| Ficheiro | Funcao |
|----------|--------|
| **SOUL.md** | Personalidade, missao, valores, limites comportamentais |
| **IDENTITY.md** | Nome, emoji, apresentacao, tom de comunicacao |
| **USER.md** | Info da empresa, infraestrutura, contactos, agentes relacionados |
| **AGENTS.md** | Regras operacionais detalhadas, fluxos, decisoes, metricas |
| **MEMORY.md** | Memoria persistente (atualizada automaticamente pelo agente) |
| **HEARTBEAT.md** | Checklist autonoma executada periodicamente sem input humano |

### 15.3 Agente 1: Recrutador

- **Workspace**: `workspace-recruiter`
- **Modelo**: Kimi K2.5
- **Heartbeat**: 15 minutos
- **Canal**: WhatsApp (contacto direto com candidatos)
- **Idiomas**: PT, FR, ES, EN, UA, RO

**Missao**: Receber candidatos via WhatsApp, guiar no processo de candidatura, recolher 10 tipos de documentos (um de cada vez), confirmar rececao, e registar na base de dados.

**Documentos recolhidos**:
1. Passaporte
2. Cartao Cidadao / BI
3. Certificado A1
4. Seguro de Saude
5. Certificado Aptidao de Saude
6. Diploma Seguranca no Trabalho
7. Diploma Trabalho em Altura
8. Certidao de Registo Criminal
9. IBAN / Dados Bancarios
10. Foto 3x4

**Fluxo**: Saudacao → Dados pessoais → Perfil profissional → Documentos (1 a 1) → Confirmacao → Registar na DB

**Cron**: Diariamente 9h - followup candidatos com docs incompletos

### 15.4 Agente 2: Validador de Documentos

- **Workspace**: `workspace-doc-validator`
- **Modelo**: Qwen 2.5:32b (via Ollama - especializado em OCR)
- **Heartbeat**: 30 minutos
- **Canal**: Interno (nao comunica com candidatos)

**Missao**: Processar OCR de cada documento recebido, extrair dados, validar autenticidade e validade, aprovar ou rejeitar automaticamente.

**Regras de decisao**:
- Confianca > 90% + campos OK + validade OK → Aprovacao automatica
- Confianca 70-90% → Aprovacao com flag revisao
- Confianca < 70% → Revisao manual obrigatoria
- Documento expirado → Rejeicao automatica

**Validacoes por tipo**: Passaporte (MRZ, validade > 6 meses), A1 (pais correto, periodo valido), Aptidao Saude (< 12 meses), Certidao Criminal (< 6 meses), IBAN (checksum valido)

### 15.5 Agente 3: Compliance Monitor

- **Workspace**: `workspace-compliance`
- **Modelo**: Kimi K2.5
- **Heartbeat**: 1 hora
- **Canal**: WhatsApp (alertas a operarios e gestores)

**Missao**: Monitorizar continuamente a validade de TODOS os documentos de TODOS os operarios ativos. Zero tolerancia a documentacao invalida.

**5 niveis de alerta**:
- VERDE (> 30 dias): OK
- AMARELO (15-30 dias): alerta dashboard
- LARANJA (7-14 dias): WhatsApp operario + gestor
- VERMELHO (< 7 dias): bloquear alocacoes + admin
- PRETO (expirado): alerta critico + gestor obra + nao-conformidade

**Regras por pais**: PT (Passaporte, Contrato, Seguro, Aptidao, Seguranca), FR (+ A1, Certidao Criminal), BE (+ ONSS), ES (+ A1)

**Crons**: Diario 6h (scan completo), Semanal segunda 8h (relatorio), Mensal dia 1 (consolidado)

### 15.6 Agente 4: Alocador Inteligente

- **Workspace**: `workspace-allocator`
- **Modelo**: Kimi K2.5
- **Heartbeat**: 1 hora
- **Canal**: Interno (comunica com gestores via dashboard)

**Missao**: Matching inteligente entre operarios disponiveis e vagas em obras, considerando skills, compliance, custo, proximidade e historico.

**Dois modos**:
- **Por Obra**: Obra tem vagas → encontrar candidatos compativeis
- **Por Funcionario**: Operario disponivel → encontrar obras compativeis

**Criterios de matching** (por ordem de peso):
1. Skills match (TIG, MIG, ASME, certificacoes obrigatorias)
2. Compliance 100% para o pais destino (via agente compliance)
3. Custo/hora dentro do orcamento da obra
4. Proximidade / alojamento disponivel na zona
5. Historico positivo em obras similares

**Output**: Top 5 candidatos com score + sugestao de alojamento + viatura. NUNCA aloca automaticamente - apenas sugere.

### 15.7 Agente 5: Onboarding Assistant

- **Workspace**: `workspace-onboarding`
- **Modelo**: Kimi K2.5
- **Heartbeat**: 30 minutos
- **Canal**: WhatsApp (contacto direto com operarios)
- **Idiomas**: PT, FR, ES, EN, UA

**Missao**: Guiar operario desde a confirmacao da alocacao ate ao primeiro dia na obra.

**Fluxo em 5 etapas (3-7 dias)**:
1. **Dia 0**: Parabens + info da obra (nome, cliente, pais, cidade, endereco, horario, responsavel)
2. **Dia 0-1**: Info alojamento (endereco, regras, colegas, inventario, transporte ate obra)
3. **Dia 1-2**: Treinamento seguranca (envia PDF/video, exige confirmacao "SIM", regista na DB)
4. **Dia 2-3**: Contrato (link nexus.metalbrass.com/nome, senha enviada separadamente, assinatura digital)
5. **Vespera**: Lembrete "Amanha e o seu 1o dia! Apresente-se as [hora] em [endereco]"

**Escalonamento**: Sem resposta 48h → lembrete. 72h → alerta admin.

### 15.8 Agente 6: Timesheet Monitor

- **Workspace**: `workspace-timesheet`
- **Modelo**: Kimi K2.5
- **Heartbeat**: 30 minutos (seg-sex 7h-21h)
- **Canal**: WhatsApp (lembretes a operarios)

**Missao**: Monitorizar registos de horas de todos os operarios, verificar GPS, detetar overtime, garantir precisao para faturacao.

**Verificacoes**:
- GPS: clock-in dentro do geo-fence da obra? Se nao → flag location_alert
- Overtime: > 8h/dia flag, > 10h justificacao, > 12h alerta gestor
- Missing: operario ativo sem registo as 20h → lembrete WhatsApp
- Custo: horas × custo/hora por operario

**Crons**: Diario 20h (lembretes), Diario 21h (totais por obra), Semanal sexta 18h (resumo gestores)

### 15.9 Agente 7: Export & Declarations

- **Workspace**: `workspace-export`
- **Modelo**: Kimi K2.5
- **Heartbeat**: 2 horas
- **Canal**: Interno (notifica admin quando exports prontos)

**Missao**: Gerar automaticamente ficheiros para Primavera (ERP), declaracoes ONSS (Belgica), Seguranca Social (Portugal) e Financas (Portugal).

**Exports mensais (dia 1, 8h)**:
- Primavera: timesheets + faturacao (formato Primavera)
- ONSS: declaracao por operario na Belgica (XML)
- DMR Seguranca Social: remuneracoes PT
- Modelo 10 Financas: dados fiscais PT

**Regra critica**: NUNCA submete declaracoes governamentais automaticamente. Prepara, disponibiliza para download, notifica admin para revisao e aprovacao.

### 15.10 Fluxo entre Agentes

```
CANDIDATO (WhatsApp)
      │
      ▼
[1] RECRUTADOR ──doc──▶ [2] VALIDADOR DOCS
      │                        │
      │ (candidato completo)   │ (doc validado/rejeitado)
      ▼                        ▼
   Base de Dados ◀──────── Documentos validados
      │
      │ (candidato aprovado internamente)
      ▼
[3] COMPLIANCE ◀──── Verifica docs para pais destino
      │
      │ (compliance OK)
      ▼
[4] ALOCADOR ──match──▶ Gestor aprova no dashboard
      │
      │ (alocacao confirmada)
      ▼
[5] ONBOARDING ──────▶ Operario (WhatsApp)
      │                 - Info obra + alojamento
      │                 - Treinamento seguranca
      │                 - Contrato digital
      │                 - Lembrete 1o dia
      ▼
[6] TIMESHEET ──────▶ Operario (lembretes diarios)
      │                - GPS check
      │                - Overtime detection
      │                - Resumos semanais
      ▼
[7] EXPORT ──────▶ Admin (ficheiros prontos)
                    - Primavera
                    - ONSS / SS / Financas
```

### 15.11 Cron Jobs

| Job | Agente | Schedule | Descricao |
|-----|--------|----------|-----------|
| compliance-daily | Compliance | `0 6 * * *` | Scan completo diario as 6h |
| recruiter-followup | Recrutador | `0 9 * * *` | Followup candidatos incompletos |
| timesheet-reminder | Timesheet | `0 20 * * 1-5` | Lembrete horas seg-sex 20h |
| timesheet-weekly | Timesheet | `0 18 * * 5` | Resumo semanal sexta 18h |
| compliance-weekly | Compliance | `0 8 * * 1` | Relatorio semanal segunda 8h |
| export-monthly | Export | `0 8 1 * *` | Exportacoes mensais dia 1 |

### 15.12 Deploy dos Agentes na VPS

```bash
# 1. Copiar workspaces
cp -r docs/openclaw/workspace-* ~/.openclaw/

# 2. Copiar config
cp docs/openclaw/openclaw.json ~/.openclaw/openclaw.json

# 3. Configurar WhatsApp
openclaw setup whatsapp  # scan QR code

# 4. Configurar modelo (Kimi K2.5)
openclaw config set model kimi-k2.5
openclaw config set provider moonshot

# 5. Configurar Ollama (Qwen 2.5 para OCR)
ollama pull qwen2.5:32b

# 6. Iniciar gateway
openclaw start

# 7. Verificar agentes
openclaw agents list

# 8. Testar recrutador
# Enviar mensagem no WhatsApp para o numero configurado
```

### 15.13 Ficheiros dos Agentes

Todos os ficheiros estao em `docs/openclaw/` no repositorio:

```
docs/openclaw/
├── README.md                              ← Documentacao dos agentes
├── openclaw.json                          ← Config multi-agent + cron jobs
│
├── workspace-recruiter/                   ← Agente 1
│   ├── SOUL.md    (personalidade)
│   ├── IDENTITY.md (apresentacao)
│   ├── USER.md    (contexto empresa)
│   ├── AGENTS.md  (regras operacionais)
│   ├── MEMORY.md  (memoria persistente)
│   └── HEARTBEAT.md (checklist autonoma)
│
├── workspace-doc-validator/               ← Agente 2
│   └── (6 ficheiros)
│
├── workspace-compliance/                  ← Agente 3
│   └── (6 ficheiros)
│
├── workspace-allocator/                   ← Agente 4
│   └── (6 ficheiros)
│
├── workspace-onboarding/                  ← Agente 5
│   └── (6 ficheiros)
│
├── workspace-timesheet/                   ← Agente 6
│   └── (6 ficheiros)
│
└── workspace-export/                      ← Agente 7
    └── (6 ficheiros)
```

---

## 16. Stack Backend: Python FastAPI

### 16.1 Decisao Tecnica

| Criterio | Node.js | Python FastAPI | Vencedor |
|----------|---------|---------------|----------|
| Ecossistema AI/ML | LangChain JS (incompleto) | LangChain, LlamaIndex, HuggingFace nativos | Python |
| OCR / Qwen 2.5 | Bridges complexos | Ollama SDK nativo | Python |
| pgvector | Libs menos maduras | SQLAlchemy + pgvector perfeito | Python |
| OpenClaw skills | Precisa bridge | Scripts nativos | Python |
| Performance API | ~44% mais rapido I/O puro | FastAPI async fecha gap | Empate |
| Validacao dados | Zod (manual) | Pydantic (automatico, type-safe) | Python |
| Docs API | Swagger extra | OpenAPI auto-gerado | Python |
| Embeddings | Libs parciais | SDK completo Kimi/Ollama | Python |

**Decisao**: Python FastAPI - o core do MetalBrass e AI (OCR, matching, embeddings, agentes). Python domina em tudo que e critico.

### 16.2 Stack Completa

```
Python 3.12+
├── FastAPI (framework web async)
├── SQLAlchemy 2.0 (ORM async)
├── asyncpg (driver PostgreSQL async)
├── Pydantic v2 (validacao + serialization)
├── Alembic (migrations)
├── python-jose (JWT auth)
├── passlib + bcrypt (password hashing)
├── ollama-python (Qwen 2.5 OCR)
├── httpx (Kimi K2.5 API calls)
├── pgvector (extensao SQLAlchemy)
├── python-multipart (file uploads)
├── Pillow (processamento imagens)
├── openpyxl (Excel export)
├── jinja2 (templates declaracoes)
├── uvicorn (ASGI server)
├── PgBouncer (connection pooling)
└── pytest + httpx (testes)
```

### 16.3 Estrutura do Projeto Backend

```
backend/
├── app/
│   ├── main.py                    ← FastAPI app entry point
│   ├── config.py                  ← Settings (env vars)
│   ├── database.py                ← SQLAlchemy engine + session
│   │
│   ├── models/                    ← SQLAlchemy models (1 ficheiro por tabela)
│   │   ├── tenant.py
│   │   ├── user.py
│   │   ├── candidate.py
│   │   ├── worker.py
│   │   ├── document.py
│   │   ├── project.py
│   │   ├── allocation.py
│   │   ├── housing.py
│   │   ├── vehicle.py
│   │   ├── time_entry.py
│   │   ├── production_order.py
│   │   ├── compliance.py
│   │   ├── export.py
│   │   └── embedding.py           ← Tabelas pgvector
│   │
│   ├── schemas/                   ← Pydantic schemas (request/response)
│   │   ├── auth.py
│   │   ├── candidate.py
│   │   ├── worker.py
│   │   ├── document.py
│   │   ├── project.py
│   │   └── ...
│   │
│   ├── routers/                   ← API endpoints (1 ficheiro por modulo)
│   │   ├── auth.py
│   │   ├── candidates.py
│   │   ├── workers.py
│   │   ├── projects.py
│   │   ├── documents.py
│   │   ├── time_entries.py
│   │   ├── allocations.py
│   │   ├── housings.py
│   │   ├── vehicles.py
│   │   ├── production.py
│   │   ├── compliance.py
│   │   ├── exports.py
│   │   ├── database.py
│   │   ├── dashboard.py
│   │   └── webhook.py              ← WhatsApp bot webhook
│   │
│   ├── services/                  ← Logica de negocio
│   │   ├── auth_service.py
│   │   ├── ocr_service.py         ← Qwen 2.5 via Ollama
│   │   ├── embedding_service.py   ← Kimi K2.5 embeddings
│   │   ├── matching_service.py    ← AI allocation matching
│   │   ├── compliance_service.py
│   │   ├── export_service.py      ← Primavera, ONSS, SS
│   │   └── notification_service.py ← WhatsApp via OpenClaw
│   │
│   ├── middleware/
│   │   ├── auth.py                ← JWT verification
│   │   ├── tenant.py             ← Multi-tenant isolation
│   │   └── cors.py
│   │
│   └── utils/
│       ├── file_storage.py        ← Upload/download ficheiros
│       ├── geo.py                ← Geo-fence calculations
│       └── primavera.py          ← Formato export Primavera
│
├── migrations/                    ← Alembic migrations
│   ├── versions/
│   └── env.py
│
├── tests/
├── requirements.txt
├── Dockerfile
├── docker-compose.yml             ← FastAPI + PostgreSQL + PgBouncer + Ollama
└── .env.example
```

---

## 17. Base de Dados: PostgreSQL + pgvector (Guia Completo)

### 17.1 Porquê PostgreSQL + pgvector

1. **Uma base para tudo**: dados relacionais (workers, projects) + vectores (embeddings) na MESMA DB
2. **Sem servicos externos**: nao precisa Pinecone, Weaviate ou Qdrant separado
3. **Busca hibrida**: combina WHERE relacional + busca semantica no MESMO query
4. **Escala comprovada**: 50M vectores com pgvectorscale, 99% recall
5. **Tudo na VPS**: zero dependencias cloud, total controlo

### 17.2 Extensoes Necessarias

```sql
-- Instalar extensoes (executar uma vez como superuser)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";       -- UUIDs para PKs
CREATE EXTENSION IF NOT EXISTS "vector";           -- pgvector para embeddings
CREATE EXTENSION IF NOT EXISTS "pg_trgm";          -- Busca fuzzy (nomes com typos)
CREATE EXTENSION IF NOT EXISTS "postgis";          -- Geolocalização (geo-fence)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";         -- Hashing passwords
```

### 17.3 Configuracao PostgreSQL para Performance

```ini
# postgresql.conf - optimizado para VPS com 8GB+ RAM

# Memoria
shared_buffers = 2GB
effective_cache_size = 6GB
work_mem = 64MB
maintenance_work_mem = 512MB

# WAL
wal_buffers = 64MB
max_wal_size = 2GB

# Planeamento
random_page_cost = 1.1          # SSD
effective_io_concurrency = 200  # SSD

# Paralelismo
max_parallel_workers_per_gather = 4
max_parallel_workers = 8

# pgvector specifico
# HNSW build usa muita RAM temporariamente
maintenance_work_mem = 1GB      # Para CREATE INDEX HNSW

# Conexoes
max_connections = 200           # PgBouncer vai gerir o pool real
```

### 17.4 PgBouncer (Connection Pooling)

```ini
# pgbouncer.ini
[databases]
metalbras = host=127.0.0.1 port=5432 dbname=metalbras

[pgbouncer]
listen_port = 6432
listen_addr = 127.0.0.1
auth_type = md5
pool_mode = transaction
default_pool_size = 25
max_client_conn = 200
min_pool_size = 5
reserve_pool_size = 5
```

FastAPI conecta ao PgBouncer (porta 6432), nao diretamente ao PostgreSQL.

### 17.5 Schema Completo com pgvector

#### Tabelas Core (relacionais)

As 20+ tabelas do PRD original mantem-se (secao 7). Aqui adicionamos as tabelas de embeddings e indices.

#### Tabelas de Embeddings

```sql
-- =====================================================
-- EMBEDDINGS DE DOCUMENTOS
-- Cada documento processado pelo OCR gera um embedding
-- Permite busca semantica: "certificacoes de soldadura validas"
-- =====================================================
CREATE TABLE document_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES workers(id),
  candidate_id UUID REFERENCES candidates(id),

  -- Texto extraido pelo OCR
  content_text TEXT NOT NULL,
  content_summary TEXT,                    -- Resumo curto gerado pelo LLM

  -- Embedding (Kimi K2.5 gera vectores de 1536 dimensoes)
  embedding vector(1536) NOT NULL,

  -- Metadata para filtros hibridos
  document_type VARCHAR(100),              -- passport, a1_cert, etc
  language VARCHAR(10),                    -- pt, fr, en, etc
  country VARCHAR(50),                     -- Pais do documento
  expiry_date DATE,                        -- Para filtrar docs validos
  ocr_confidence DECIMAL(5,2),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index HNSW para busca semantica rapida
CREATE INDEX idx_doc_emb_hnsw ON document_embeddings
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 200);

-- Index composto para queries hibridas (filtro + semantica)
CREATE INDEX idx_doc_emb_tenant ON document_embeddings(tenant_id);
CREATE INDEX idx_doc_emb_type ON document_embeddings(document_type);
CREATE INDEX idx_doc_emb_worker ON document_embeddings(worker_id);
CREATE INDEX idx_doc_emb_expiry ON document_embeddings(expiry_date);

-- =====================================================
-- EMBEDDINGS DE PERFIS DE WORKERS
-- Perfil completo do worker como embedding
-- Permite matching semantico com projetos
-- =====================================================
CREATE TABLE worker_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,

  -- Texto do perfil (gerado a partir dos dados do worker)
  -- Ex: "Soldador TIG certificado ASME e EN ISO 9606-1, 10 anos experiencia,
  --      trabalhou na EDF France e Martifer, especializado em aco inox e
  --      tubagem industrial, fala portugues e frances, disponivel para Franca
  --      e Belgica, custo 45EUR/hora, compliance 100%"
  profile_text TEXT NOT NULL,

  -- Skills como texto estruturado para embedding
  skills_text TEXT,                        -- "TIG, MIG, ASME, EN ISO 9606-1"

  -- Embedding do perfil completo
  embedding vector(1536) NOT NULL,

  -- Cache de dados para evitar JOINs
  availability_status VARCHAR(50),
  compliance_score INTEGER,
  hourly_cost DECIMAL(10,2),
  country VARCHAR(50),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_worker_emb_hnsw ON worker_embeddings
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 200);

CREATE INDEX idx_worker_emb_tenant ON worker_embeddings(tenant_id);
CREATE INDEX idx_worker_emb_status ON worker_embeddings(availability_status);
CREATE INDEX idx_worker_emb_cost ON worker_embeddings(hourly_cost);

-- =====================================================
-- EMBEDDINGS DE PROJETOS / OBRAS
-- Requisitos do projeto como embedding
-- Permite matching semantico com workers
-- =====================================================
CREATE TABLE project_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Texto dos requisitos
  -- Ex: "Obra de renovacao de central hidreletrica em Lyon Franca,
  --      cliente EDF, necessita 3 soldadores TIG com certificacao ASME,
  --      2 serralheiros industriais e 1 engenheiro mecanico,
  --      orcamento 1.25M EUR, duracao 8 meses, A1 obrigatorio"
  requirements_text TEXT NOT NULL,

  -- Embedding dos requisitos
  embedding vector(1536) NOT NULL,

  -- Cache
  country VARCHAR(50),
  status VARCHAR(50),
  required_skills TEXT[],
  vacancies_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_project_emb_hnsw ON project_embeddings
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 200);

CREATE INDEX idx_project_emb_tenant ON project_embeddings(tenant_id);
CREATE INDEX idx_project_emb_status ON project_embeddings(status);

-- =====================================================
-- KNOWLEDGE BASE (RAG)
-- Regras, templates, SOPs, manuais da empresa
-- Os agentes consultam isto via busca semantica
-- =====================================================
CREATE TABLE knowledge_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),

  -- Conteudo
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,          -- compliance, onboarding, safety,
                                           -- housing_rules, primavera, onss,
                                           -- seguranca_social, financas

  -- Metadata
  country VARCHAR(50),                     -- Se regra especifica de pais
  language VARCHAR(10) DEFAULT 'pt',
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,

  -- Embedding
  embedding vector(1536) NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_knowledge_emb_hnsw ON knowledge_embeddings
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 200);

CREATE INDEX idx_knowledge_emb_category ON knowledge_embeddings(category);
CREATE INDEX idx_knowledge_emb_country ON knowledge_embeddings(country);
CREATE INDEX idx_knowledge_emb_active ON knowledge_embeddings(is_active);

-- =====================================================
-- HISTORICO DE CONVERSAS DOS AGENTES
-- Para os agentes terem contexto de conversas passadas
-- =====================================================
CREATE TABLE agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),

  agent_id VARCHAR(50) NOT NULL,           -- recruiter, onboarding, etc
  contact_phone VARCHAR(50),               -- WhatsApp do candidato/operario
  contact_name VARCHAR(255),

  -- Mensagem
  direction VARCHAR(10) NOT NULL,          -- inbound, outbound
  message_text TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text', -- text, image, document, audio
  file_url VARCHAR(500),                   -- Se enviou ficheiro

  -- Embedding da mensagem (para busca contextual)
  embedding vector(1536),

  -- Metadata
  related_candidate_id UUID REFERENCES candidates(id),
  related_worker_id UUID REFERENCES workers(id),
  session_id VARCHAR(100),                 -- Agrupar conversas

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agent_conv_hnsw ON agent_conversations
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 200);

CREATE INDEX idx_agent_conv_agent ON agent_conversations(agent_id);
CREATE INDEX idx_agent_conv_phone ON agent_conversations(contact_phone);
CREATE INDEX idx_agent_conv_date ON agent_conversations(created_at);
CREATE INDEX idx_agent_conv_session ON agent_conversations(session_id);
```

### 17.6 Queries de Exemplo (Como os Agentes Usam)

```sql
-- =====================================================
-- MATCHING SEMANTICO: Worker ↔ Projeto
-- Agente Alocador usa isto para encontrar candidatos
-- =====================================================

-- Encontrar top 10 workers mais compativeis com um projeto
SELECT
  w.id, w.name, w.role_title, w.hourly_cost, w.compliance_score,
  we.profile_text,
  1 - (we.embedding <=> pe.embedding) AS similarity_score
FROM worker_embeddings we
JOIN workers w ON w.id = we.worker_id
CROSS JOIN project_embeddings pe
WHERE pe.project_id = 'uuid-do-projeto'
  AND we.availability_status = 'available'
  AND we.tenant_id = 'uuid-do-tenant'
  AND w.compliance_score >= 90
ORDER BY we.embedding <=> pe.embedding
LIMIT 10;

-- =====================================================
-- BUSCA SEMANTICA DE DOCUMENTOS
-- Agente Compliance: "documentos de seguranca expirados"
-- =====================================================

-- Gerar embedding da query primeiro via Kimi K2.5, depois:
SELECT
  d.id, d.type, d.document_number, d.expiry_date, d.status,
  w.name AS worker_name,
  de.content_summary,
  1 - (de.embedding <=> $1) AS relevance
FROM document_embeddings de
JOIN documents d ON d.id = de.document_id
JOIN workers w ON w.id = de.worker_id
WHERE de.tenant_id = 'uuid-do-tenant'
  AND d.expiry_date < CURRENT_DATE + INTERVAL '30 days'
ORDER BY de.embedding <=> $1
LIMIT 20;
-- $1 = embedding da query "documentos de seguranca expirados"

-- =====================================================
-- RAG: Buscar conhecimento para os agentes
-- Agente Onboarding: "regras de alojamento em Franca"
-- =====================================================

SELECT
  title, content, category, country,
  1 - (embedding <=> $1) AS relevance
FROM knowledge_embeddings
WHERE is_active = true
  AND (country = 'FR' OR country IS NULL)
  AND category IN ('housing_rules', 'onboarding', 'safety')
ORDER BY embedding <=> $1
LIMIT 5;

-- =====================================================
-- BUSCA FUZZY POR NOME (pg_trgm)
-- Dashboard: buscar "Rikardo" encontra "Ricardo"
-- =====================================================

SELECT id, name, nif, role_title
FROM workers
WHERE name % 'Rikardo'              -- Similarity > 0.3
   OR name ILIKE '%Rikardo%'
ORDER BY similarity(name, 'Rikardo') DESC
LIMIT 10;

-- =====================================================
-- GEO-FENCE VERIFICATION (PostGIS)
-- Agente Timesheet: verificar clock-in dentro do raio
-- =====================================================

SELECT
  ST_Distance(
    ST_MakePoint(te.location_lng, te.location_lat)::geography,
    ST_MakePoint(p.geo_lng, p.geo_lat)::geography
  ) AS distance_meters,
  CASE
    WHEN ST_DWithin(
      ST_MakePoint(te.location_lng, te.location_lat)::geography,
      ST_MakePoint(p.geo_lng, p.geo_lat)::geography,
      p.geo_fence_radius_m
    ) THEN true
    ELSE false
  END AS within_geofence
FROM time_entries te
JOIN projects p ON p.id = te.project_id
WHERE te.id = 'uuid-do-time-entry';

-- =====================================================
-- DASHBOARD KPIs (queries agregadas)
-- =====================================================

-- Compliance medio por obra
SELECT
  p.id, p.name,
  AVG(w.compliance_score) AS avg_compliance,
  COUNT(w.id) AS team_size,
  COUNT(CASE WHEN w.compliance_score < 80 THEN 1 END) AS at_risk
FROM projects p
JOIN allocations a ON a.project_id = p.id AND a.status = 'active'
JOIN workers w ON w.id = a.worker_id
WHERE p.tenant_id = 'uuid-do-tenant'
GROUP BY p.id, p.name
ORDER BY avg_compliance ASC;

-- Faturamento diario
SELECT
  p.name AS project_name,
  SUM(te.total_cost) AS daily_revenue
FROM time_entries te
JOIN projects p ON p.id = te.project_id
WHERE te.date = CURRENT_DATE
  AND te.tenant_id = 'uuid-do-tenant'
GROUP BY p.name
ORDER BY daily_revenue DESC;
```

### 17.7 Fluxo de Geracao de Embeddings

```
┌─────────────────────────────────────────────────┐
│  TRIGGER: Novo documento / worker / projeto     │
└──────────┬──────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│  1. EXTRAIR TEXTO                                │
│     Documento → OCR via Qwen 2.5 (Ollama)       │
│     Worker → Concatenar dados do perfil          │
│     Projeto → Concatenar requisitos              │
└──────────┬───────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│  2. GERAR EMBEDDING                              │
│     Texto → Kimi K2.5 API                        │
│     Input: texto (max 8192 tokens)               │
│     Output: vector(1536)                         │
│                                                  │
│     Endpoint: POST /v1/embeddings                │
│     Model: kimi-embedding-v1                     │
│     Ou via Ollama: ollama embed kimi-k2.5        │
└──────────┬───────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│  3. ARMAZENAR                                    │
│     INSERT INTO {type}_embeddings                │
│     (document_id, content_text, embedding, ...)  │
│     VALUES ($1, $2, $3::vector, ...)             │
└──────────┬───────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│  4. DISPONIVEL PARA BUSCA                        │
│     Agentes podem agora fazer queries semanticas │
│     via SQL: ORDER BY embedding <=> query_vec    │
└──────────────────────────────────────────────────┘
```

### 17.8 Servico de Embeddings (FastAPI)

```python
# app/services/embedding_service.py

import httpx
from pgvector.sqlalchemy import Vector
from sqlalchemy import text

KIMI_API_URL = "https://api.moonshot.ai/v1/embeddings"
KIMI_API_KEY = os.environ["KIMI_API_KEY"]
EMBEDDING_MODEL = "kimi-embedding-v1"
EMBEDDING_DIM = 1536

async def generate_embedding(text_input: str) -> list[float]:
    """Gera embedding via Kimi K2.5 API"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            KIMI_API_URL,
            headers={"Authorization": f"Bearer {KIMI_API_KEY}"},
            json={
                "model": EMBEDDING_MODEL,
                "input": text_input[:8192]  # max tokens
            }
        )
        return response.json()["data"][0]["embedding"]

async def semantic_search(
    db, table: str, query_text: str,
    tenant_id: str, filters: dict = None,
    limit: int = 10
) -> list:
    """Busca semantica generica em qualquer tabela de embeddings"""
    query_embedding = await generate_embedding(query_text)

    sql = f"""
        SELECT *, 1 - (embedding <=> :query_vec) AS similarity
        FROM {table}
        WHERE tenant_id = :tenant_id
    """
    params = {
        "query_vec": str(query_embedding),
        "tenant_id": tenant_id
    }

    if filters:
        for key, value in filters.items():
            sql += f" AND {key} = :{key}"
            params[key] = value

    sql += " ORDER BY embedding <=> :query_vec LIMIT :limit"
    params["limit"] = limit

    result = await db.execute(text(sql), params)
    return result.fetchall()

async def upsert_worker_embedding(db, worker_id: str):
    """Gera/atualiza embedding do perfil de um worker"""
    worker = await get_worker_with_details(db, worker_id)

    profile_text = f"""
    {worker.name}, {worker.nationality}, {worker.role_title}.
    Skills: {', '.join(worker.skills)}.
    Custo: {worker.hourly_cost} EUR/hora.
    Experiencia: {format_work_history(worker.history)}.
    Certificacoes: {format_certifications(worker.certifications)}.
    Compliance: {worker.compliance_score}%.
    Disponibilidade: {worker.availability_status}.
    """

    embedding = await generate_embedding(profile_text)

    await db.execute(text("""
        INSERT INTO worker_embeddings
        (tenant_id, worker_id, profile_text, embedding,
         availability_status, compliance_score, hourly_cost)
        VALUES (:tenant_id, :worker_id, :profile_text,
                :embedding::vector, :status, :score, :cost)
        ON CONFLICT (worker_id)
        DO UPDATE SET
            profile_text = EXCLUDED.profile_text,
            embedding = EXCLUDED.embedding,
            availability_status = EXCLUDED.availability_status,
            compliance_score = EXCLUDED.compliance_score,
            hourly_cost = EXCLUDED.hourly_cost,
            updated_at = NOW()
    """), {
        "tenant_id": worker.tenant_id,
        "worker_id": worker_id,
        "profile_text": profile_text,
        "embedding": str(embedding),
        "status": worker.availability_status,
        "score": worker.compliance_score,
        "cost": worker.hourly_cost
    })
```

### 17.9 Quando Gerar/Atualizar Embeddings

| Evento | Tabela Embedding | Trigger |
|--------|-----------------|---------|
| Documento processado pelo OCR | document_embeddings | Agente Doc Validator |
| Novo candidato validado → worker | worker_embeddings | Apos validacao |
| Worker atualiza skills/certificacoes | worker_embeddings | PUT /api/workers/:id |
| Worker muda compliance_score | worker_embeddings | Agente Compliance |
| Novo projeto criado | project_embeddings | POST /api/projects |
| Projeto muda requisitos/vagas | project_embeddings | PUT /api/projects/:id |
| Nova regra/template adicionado | knowledge_embeddings | Settings > Templates |
| Mensagem WhatsApp recebida/enviada | agent_conversations | Agentes com WhatsApp |

### 17.10 Estimativa de Volume e Performance

```
CENARIO ACTUAL (2026):
- 700 workers × embedding = 700 vectores (instantaneo)
- 700 × 10 docs × embedding = 7.000 vectores (< 5ms)
- 60 projetos × embedding = 60 vectores (instantaneo)
- 100 regras knowledge = 100 vectores (instantaneo)
- Total: ~8.000 vectores

CENARIO 1 ANO:
- 2.000 workers × 15 docs = 30.000 vectores
- + 200 projetos + 500 regras + 50.000 conversas
- Total: ~80.000 vectores (< 10ms com HNSW)

CENARIO 5 ANOS + SaaS (10 tenants):
- 10.000 workers × 20 docs = 200.000 vectores
- + 1.000 projetos + 2.000 regras + 500.000 conversas
- Total: ~700.000 vectores (< 20ms com HNSW)

CENARIO 10 ANOS + SaaS GRANDE (50 tenants):
- 50.000 workers × 25 docs = 1.250.000 vectores
- + 5.000 projetos + 10.000 regras + 2.000.000 conversas
- Total: ~3.500.000 vectores (< 50ms com HNSW)
- Se necessario: pgvectorscale suporta 50M+ vectores

STORAGE ESTIMADO:
- 1 embedding (1536d float32) = ~6KB
- 1.000.000 embeddings = ~6GB (so vectores)
- + texto + metadata = ~15GB total
- VPS com 100GB+ disco e mais que suficiente
```

### 17.11 Backup e Manutencao

```sql
-- Cron semanal: optimizar indices HNSW
REINDEX INDEX CONCURRENTLY idx_doc_emb_hnsw;
REINDEX INDEX CONCURRENTLY idx_worker_emb_hnsw;
REINDEX INDEX CONCURRENTLY idx_project_emb_hnsw;

-- Cron diario: vacuum
VACUUM ANALYZE document_embeddings;
VACUUM ANALYZE worker_embeddings;
VACUUM ANALYZE project_embeddings;
VACUUM ANALYZE agent_conversations;

-- Backup diario (pg_dump)
pg_dump -Fc metalbras > /backups/metalbras_$(date +%Y%m%d).dump

-- Backup WAL continuo (point-in-time recovery)
archive_mode = on
archive_command = 'cp %p /backups/wal/%f'
```

### 17.12 Docker Compose (Desenvolvimento)

```yaml
# docker-compose.yml
version: '3.9'

services:
  db:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_DB: metalbras
      POSTGRES_USER: metalbras
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U metalbras"]
      interval: 5s
      timeout: 5s
      retries: 5

  pgbouncer:
    image: edoburu/pgbouncer:latest
    environment:
      DATABASE_URL: postgres://metalbras:${DB_PASSWORD}@db:5432/metalbras
      POOL_MODE: transaction
      DEFAULT_POOL_SIZE: 25
    ports:
      - "6432:6432"
    depends_on:
      db:
        condition: service_healthy

  api:
    build: ./backend
    environment:
      DATABASE_URL: postgresql+asyncpg://metalbras:${DB_PASSWORD}@pgbouncer:6432/metalbras
      KIMI_API_KEY: ${KIMI_API_KEY}
      OLLAMA_URL: http://ollama:11434
      JWT_SECRET: ${JWT_SECRET}
      FILE_STORAGE_PATH: /data/documents
    volumes:
      - documents:/data/documents
    ports:
      - "8000:8000"
    depends_on:
      - pgbouncer
      - ollama

  ollama:
    image: ollama/ollama:latest
    volumes:
      - ollama_data:/root/.ollama
    ports:
      - "11434:11434"
    deploy:
      resources:
        reservations:
          memory: 8G

  frontend:
    build: .
    ports:
      - "3001:80"
    depends_on:
      - api

volumes:
  pgdata:
  documents:
  ollama_data:
```

---

## 18. Infraestrutura: Cloudflare Tunnel (Acesso Fixo a VPS)

### 18.1 Porquê Cloudflare Tunnel

Toda a infraestrutura do MetalBrass OS reside na VPS. Para dar acesso externo seguro sem expor IP publico, portas abertas ou configurar SSL manualmente, usamos Cloudflare Tunnel (gratis).

O tunnel cria uma conexao encriptada OUTBOUND-ONLY da VPS para a edge da Cloudflare. Nenhuma porta precisa estar aberta na VPS. SSL e automatico. DDoS protection incluida. CDN global.

### 18.2 Arquitectura de Rede

```
Utilizadores (browser/WhatsApp)
         │
         ▼
Cloudflare Edge Network
├── SSL/TLS automatico
├── DDoS protection
├── CDN (cache static assets)
├── WAF (firewall)
         │
         ▼ (tunnel encriptado, outbound-only)
         │
VPS (cloudflared daemon)
├── app.metalbrass.com       → React Dashboard (porta 3001)
├── api.metalbrass.com       → FastAPI Backend (porta 8000)
├── nexus.metalbrass.com     → Worker App (porta 3001)
├── docs.metalbrass.com      → API Swagger (porta 8000/docs)
│
├── PostgreSQL + pgvector    (porta 5432, so local)
├── PgBouncer                (porta 6432, so local)
├── Ollama + Qwen 2.5       (porta 11434, so local)
└── OpenClaw Gateway         (7 agentes autonomos)
```

### 18.3 Subdominios

| Subdominio | Servico | Porta VPS | Acesso |
|------------|---------|-----------|--------|
| `app.metalbrass.com` | Dashboard React | 3001 | Equipa admin, gestores, validadores |
| `api.metalbrass.com` | FastAPI Backend | 8000 | Frontend, agentes OpenClaw |
| `nexus.metalbrass.com` | Worker App React | 3001 | Operarios (login + ponto digital) |
| `docs.metalbrass.com` | Swagger/OpenAPI | 8000 | Developers |

URL do operario: `nexus.metalbrass.com/ricardo-santos` + senha

### 18.4 Setup Cloudflare Tunnel na VPS

```bash
# =====================================================
# PASSO 1: Instalar cloudflared
# =====================================================
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 \
  -o /usr/local/bin/cloudflared
chmod +x /usr/local/bin/cloudflared

# =====================================================
# PASSO 2: Autenticar (abre URL no browser)
# =====================================================
cloudflared login
# Selecionar dominio metalbrass.com no browser

# =====================================================
# PASSO 3: Criar tunnel permanente
# =====================================================
cloudflared tunnel create metalbras-os
# Output: Created tunnel metalbras-os with id a1b2c3d4-e5f6-...
# Guardar o UUID!

# =====================================================
# PASSO 4: Configurar routing
# =====================================================
cat > /root/.cloudflared/config.yml << 'CLOUDFLARE_CONFIG'
tunnel: a1b2c3d4-e5f6-xxxx-xxxx-xxxxxxxxxxxx
credentials-file: /root/.cloudflared/a1b2c3d4-e5f6-xxxx-xxxx-xxxxxxxxxxxx.json

# Opcoes globais
originRequest:
  connectTimeout: 30s
  noTLSVerify: true

ingress:
  # API Backend (FastAPI)
  - hostname: api.metalbrass.com
    service: http://localhost:8000
    originRequest:
      connectTimeout: 60s

  # Dashboard Admin (React)
  - hostname: app.metalbrass.com
    service: http://localhost:3001

  # Worker App (React - mesmo build, rota diferente)
  - hostname: nexus.metalbrass.com
    service: http://localhost:3001

  # API Docs (Swagger)
  - hostname: docs.metalbrass.com
    service: http://localhost:8000

  # Catch-all obrigatorio
  - service: http_status:404
CLOUDFLARE_CONFIG

# =====================================================
# PASSO 5: Criar DNS records automaticamente
# =====================================================
cloudflared tunnel route dns metalbras-os app.metalbrass.com
cloudflared tunnel route dns metalbras-os api.metalbrass.com
cloudflared tunnel route dns metalbras-os nexus.metalbrass.com
cloudflared tunnel route dns metalbras-os docs.metalbrass.com

# =====================================================
# PASSO 6: Testar
# =====================================================
cloudflared tunnel run metalbras-os
# Verificar: https://app.metalbrass.com deve carregar o dashboard

# =====================================================
# PASSO 7: Instalar como servico systemd (24/7)
# =====================================================
cloudflared service install
systemctl enable cloudflared
systemctl start cloudflared
systemctl status cloudflared

# =====================================================
# VERIFICAR TUDO
# =====================================================
cloudflared tunnel list
cloudflared tunnel info metalbras-os
curl https://api.metalbrass.com/health
curl https://app.metalbrass.com
```

### 18.5 Seguranca Adicional (Cloudflare Access)

Para proteger o dashboard admin, podemos adicionar Cloudflare Access (gratis ate 50 utilizadores):

```
Cloudflare Dashboard → Zero Trust → Access → Applications

Regra para app.metalbrass.com:
- Policy: Allow
- Include: Emails ending in @metalbras.pt
- Require: One-time PIN (email)

Resultado: Ao aceder app.metalbrass.com, pede email @metalbras.pt
e envia codigo. Sem login = sem acesso.

nexus.metalbrass.com NAO tem Access (operarios acedem livremente com
a sua password na app).
```

### 18.6 Vantagens vs Alternativas

| Feature | Cloudflare Tunnel | Nginx + Let's Encrypt | Ngrok |
|---------|-------------------|----------------------|-------|
| Custo | Gratis | Gratis (setup manual) | Pago ($8+/mes) |
| SSL | Automatico | Certbot + renovacao | Automatico |
| IP publico | Nao exposto | Exposto | Nao exposto |
| Portas abertas | Zero | 80 + 443 | Zero |
| DDoS | Incluido | Nenhum | Basico |
| CDN | Global | Nenhum | Nenhum |
| Dominio fixo | Sim (teu dominio) | Sim | Pago |
| Multiplos subdominios | Ilimitado | Manual | Limitado |
| Setup | 5 minutos | 30+ minutos | 5 minutos |
| Producao | Sim | Sim | Nao recomendado |

### 18.7 Integracao com Docker Compose

Adicionar ao docker-compose.yml:

```yaml
  cloudflared:
    image: cloudflare/cloudflared:latest
    command: tunnel run metalbras-os
    volumes:
      - /root/.cloudflared:/etc/cloudflared
    restart: unless-stopped
    depends_on:
      - api
      - frontend
```

### 18.8 Nota sobre WhatsApp

O WhatsApp funciona via OpenClaw channel na VPS (scan QR code). O OpenClaw conecta-se diretamente ao WhatsApp Web, NAO usa WhatsApp Business API. Nao precisa de Cloudflare Tunnel para o WhatsApp - o OpenClaw faz conexao outbound direta.

O webhook do bot (para o backend receber eventos) funciona internamente na VPS:
- OpenClaw → POST http://localhost:8000/api/webhook/whatsapp
- Tudo local, sem necessidade de URL publica para webhooks.

---

## 19. Resumo da Stack Completa

```
┌─────────────────────────────────────────────────────────┐
│                CLOUDFLARE EDGE (gratis)                  │
│  SSL + CDN + DDoS + WAF                                │
│  app.metalbrass.com | api. | nexus. | docs.             │
└──────────────────────┬──────────────────────────────────┘
                       │ Tunnel (encriptado, outbound-only)
┌──────────────────────▼──────────────────────────────────┐
│                    VPS (tudo aqui)                        │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │ React (3001) │  │ FastAPI(8000)│  │ Swagger (8000)│ │
│  │ Dashboard +  │  │ REST API     │  │ /docs         │ │
│  │ Worker App   │  │ JWT Auth     │  │               │ │
│  └──────────────┘  └──────┬───────┘  └───────────────┘ │
│                           │                              │
│  ┌────────────────────────▼─────────────────────────┐   │
│  │        PostgreSQL + pgvector (5432)               │   │
│  │  20+ tabelas relacionais                          │   │
│  │  5 tabelas embeddings (HNSW)                      │   │
│  │  PgBouncer (6432) connection pool                 │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │Ollama (11434)│  │ OpenClaw     │  │ cloudflared   │ │
│  │ Qwen 2.5    │  │ 7 Agentes    │  │ tunnel daemon │ │
│  │ OCR + embed  │  │ WhatsApp     │  │               │ │
│  └──────────────┘  │ Heartbeats   │  └───────────────┘ │
│                    │ Cron jobs    │                      │
│                    └──────────────┘                      │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              File Storage (/data/)                │   │
│  │  /data/documents/  (PDFs, scans, fotos)          │   │
│  │  /data/exports/    (Primavera, ONSS, CSV)        │   │
│  │  /data/backups/    (pg_dump diario)              │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Portas internas (so localhost, NADA exposto)

| Servico | Porta | Acesso |
|---------|-------|--------|
| React Frontend | 3001 | Via Cloudflare Tunnel |
| FastAPI Backend | 8000 | Via Cloudflare Tunnel |
| PostgreSQL | 5432 | So local (PgBouncer) |
| PgBouncer | 6432 | So local (FastAPI) |
| Ollama | 11434 | So local (FastAPI + OpenClaw) |
| OpenClaw | interno | So local (WhatsApp outbound) |
| cloudflared | outbound | Conexao a Cloudflare Edge |

**Zero portas abertas no firewall da VPS.** Tudo via Cloudflare Tunnel.

---

**FIM DO PRD**

*Documento vivo - atualizar conforme decisoes de implementacao evoluem. Versao: 3.0 (2026-03-17)*
