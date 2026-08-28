# BBS Transparency Web Application

A modular, testable, and transparent dashboard web application for the **Rantang Kasih (Bagi Bagi Sarapan)** initiative, built with modern JavaScript (ES Modules), TailwindCSS, Chart.js, and **Supabase**, powered by **Bun**.

---

## 🚀 Getting Started with Bun

### 1. Prerequisites
- [Bun](https://bun.sh) (v1.0+)

If you haven't installed Bun yet on Windows (PowerShell):
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

### 2. Environment Configuration
Create your local `.env` file by copying the template:
```bash
cp .env.example .env
```

Fill in your Supabase credentials in `.env`:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-publishable-anon-key
```

### 3. Running the Development Server
To start the dev server with hot reload and file watching:
```bash
bun dev
```
*(Alternatively, run `bun start`)*

Open your browser and navigate to:
👉 **[http://localhost:3000/](http://localhost:3000/)**

---

## 🗄️ Database & Supabase Integration

The app uses **Supabase (PostgreSQL)** for dynamic data management with built-in Row Level Security (RLS) and real-time support.

### Supabase Schema
Run the following SQL in your **Supabase SQL Editor** to initialize the database:

```sql
-- 1. Programs
create table if not exists programs (
    id text primary key,
    name text not null,
    description text,
    is_active boolean default true,
    created_at timestamptz default timezone('utc', now())
);

-- 2. Campaigns (Target vs Collected)
create table if not exists campaigns (
    id text primary key,
    program_id text references programs(id) on delete cascade,
    period_name text not null,
    target_amount bigint not null check (target_amount >= 0),
    collected_amount bigint not null default 0 check (collected_amount >= 0),
    is_current boolean default false,
    created_at timestamptz default timezone('utc', now())
);

-- 3. Monthly Audits (Auto-computed balance)
create table if not exists monthly_audits (
    id serial primary key,
    program_id text references programs(id) on delete cascade,
    period text not null,
    total_collected bigint not null check (total_collected >= 0),
    total_disbursed bigint not null check (total_disbursed >= 0),
    balance bigint generated always as (total_collected - total_disbursed) stored,
    impact_summary text not null,
    is_current boolean default false,
    display_order int default 0,
    created_at timestamptz default timezone('utc', now())
);

-- 4. Budget Allocations
create table if not exists budget_allocations (
    id serial primary key,
    program_id text references programs(id) on delete cascade,
    label text not null,
    percentage numeric(5,2) not null check (percentage >= 0 and percentage <= 100),
    color text not null,
    display_order int default 0
);

-- Row Level Security (Public Read-Only)
alter table programs enable row level security;
alter table campaigns enable row level security;
alter table monthly_audits enable row level security;
alter table budget_allocations enable row level security;

create policy "Public read programs" on programs for select using (is_active = true);
create policy "Public read campaigns" on campaigns for select using (true);
create policy "Public read monthly_audits" on monthly_audits for select using (true);
create policy "Public read budget_allocations" on budget_allocations for select using (true);
```

### GitHub Pages Deployment & Environments
When deploying to GitHub Pages via GitHub Actions:
1. Go to your GitHub repo **Settings** → **Secrets and variables** → **Actions** (or under **Environments** → `github-pages`).
2. Add the following repository variables:
   - `SUPABASE_URL`: Your Supabase Project URL
   - `SUPABASE_ANON_KEY`: Your Supabase Anon / Publishable Key
3. In **Settings** → **Pages**, set **Source** to **GitHub Actions**.

---

## 🏗️ Architecture & File Structure

```
bbs/
├── .env.example                   # Environment configuration template
├── index.html                     # Semantic HTML markup & template token binding
├── package.json                   # Bun scripts and project metadata
├── server.ts                      # Native Bun HTTP server with dynamic /js/config/env.js injection
├── assets/
│   └── string.xml                 # Centralized XML string resource dictionary
├── css/
│   └── styles.css                 # Custom styles and responsive container dimensions
└── js/
    ├── app.js                     # Main application bootstrap & lifecycle coordinator
    ├── config/
    │   ├── supabase.js            # Supabase client initialized via window.ENV
    │   └── tailwind.config.js     # Tailwind theme & color token definitions
    ├── data/                      # Static Application Constants
    │   └── impactTiers.js         # Predefined impact tiers & meal constants
    ├── services/                  # Business Logic Layer (SRP)
    │   ├── StringResourceLoader.js# XML resource parser & DOM token binder
    │   ├── ImpactService.js       # Calculates meal portions & recipient impact
    │   └── DonationService.js     # Live Supabase data sync & currency formatters
    ├── charts/                    # Charting Layer (LSP & SRP)
    │   ├── ChartService.js        # Core charting helpers (wrapLabel, tooltips, typography)
    │   ├── AllocationChart.js     # Budget allocation doughnut chart component
    │   ├── ProgressChart.js       # Monthly target progress horizontal bar chart
    │   └── HistoryChart.js        # Multi-month historical audit bar chart
    └── ui/                        # UI Presentation & Event Layer
        ├── ImpactCalculatorUI.js  # Impact calculator buttons, active states, and updates
        ├── AuditTableUI.js        # Dynamic rendering of transparency audit table
        └── NavigationUI.js        # Smooth scrolling and UI event handlers
```

---

## 🧩 SOLID Principles in Action

| Principle | Implementation Details |
| :--- | :--- |
| **Single Responsibility (SRP)** | - `StringResourceLoader.js` handles loading and injecting XML strings into DOM tokens.<br>- `DonationService.js` handles Supabase sync, fallback caching & formatting only.<br>- `ImpactService.js` handles impact calculations only.<br>- `ChartService.js` and chart components manage Chart.js rendering and lifecycle.<br>- `ImpactCalculatorUI.js` and `AuditTableUI.js` handle DOM bindings only. |
| **Open/Closed (OCP)** | - Adding new copy/strings to `assets/string.xml`, new donation tiers to `impactTiers.js`, or new records to Supabase tables automatically updates UI without touching rendering logic. |
| **Liskov Substitution (LSP)** | - Chart components (`AllocationChart.js`, `ProgressChart.js`, `HistoryChart.js`) implement standard `.render()` and `.destroy()` lifecycles and can be swapped or tested independently. |
| **Interface Segregation (ISP)** | - Modules export focused functions and data structures so UI components only consume what they require. |
| **Dependency Inversion (DIP)** | - `app.js` orchestrates high-level components through service abstractions rather than tightly coupling to raw DOM events and inline scripts. |

---

## 🛠️ Technology Stack

- **Runtime & Dev Server**: [Bun](https://bun.sh)
- **Database & Backend**: [Supabase (PostgreSQL)](https://supabase.com)
- **UI Framework**: Vanilla JavaScript (ES Modules)
- **Styling**: Tailwind CSS & Vanilla CSS
- **Data Visualization**: Chart.js
- **Localization / Resources**: XML (`assets/string.xml`)
- **CI/CD & Hosting**: GitHub Actions & GitHub Pages

---

## 🌿 Git Branching Strategy & Rules

To keep the development process clean, predictable, and simple, we adhere to a **2-Branch Workflow**:

```
[development] ──(work / test)──> [PR / Merge] ──> [main] (Production / Live)
```

### 1. Core Branches

| Branch | Purpose | Rules / Constraints |
| :--- | :--- | :--- |
| **`main`** | **Production & Live Deployment** | - Always stable and deployable.<br>- Serves live deployment via GitHub Pages.<br>- **No direct commits** for untested features. Only merges from `development` or emergency hotfixes. |
| **`development`** | **Active Work & Integration** | - Default working branch.<br>- New features, refactoring, and general updates are committed/tested here first.<br>- Merged into `main` once tested and verified. |

### 2. Workflow Guidelines

1. **Daily Development**:
   - Work and make changes on `development`.
   - Verify changes locally using `bun dev` before pushing.
2. **Releasing to Production**:
   - Merge `development` into `main` when features are ready to go live.
   ```bash
   git checkout main
   git merge development
   git push origin main
   ```
