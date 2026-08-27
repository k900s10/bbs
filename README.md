# BBS Transparency Web Application

A modular, testable, and transparent dashboard web application for the **Rantang Kasih (Bagi Bagi Sarapan)** initiative, built with modern JavaScript (ES Modules), TailwindCSS, and Chart.js, powered by **Bun**.

---

## 🚀 Getting Started with Bun

### Prerequisites
- [Bun](https://bun.sh) (v1.0+)

If you haven't installed Bun yet on Windows (PowerShell):
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

### Running the Development Server
To start the dev server with hot reload and file watching:
```bash
bun dev
```
*(Alternatively, run `bun start`)*

Open your browser and navigate to:
👉 **[http://localhost:3000/](http://localhost:3000/)**

---

## 🏗️ Architecture & File Structure

```
bbs/
├── index.html                     # Semantic HTML markup & template token binding
├── package.json                   # Bun scripts and project metadata
├── server.ts                      # Native Bun HTTP static server
├── assets/
│   └── string.xml                 # Centralized XML string resource dictionary
├── css/
│   └── styles.css                 # Custom styles and responsive container dimensions
└── js/
    ├── app.js                     # Main application entry point (DIP bootstrap)
    ├── config/
    │   └── tailwind.config.js     # Tailwind theme & color token definitions
    ├── data/                      # Pure Data Layer (Single source of truth)
    │   ├── allocationData.js      # Rantang Kasih budget allocation dataset
    │   ├── impactTiers.js         # Predefined impact tiers & meal constants
    │   └── historyData.js         # Campaign targets & monthly audit records
    ├── services/                  # Business Logic Layer (SRP)
    │   ├── StringResourceLoader.js# XML resource parser & DOM token binder
    │   ├── ImpactService.js       # Calculates meal portions & recipient impact
    │   └── DonationService.js     # Aggregates data & formats currency strings
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
| **Single Responsibility (SRP)** | - `StringResourceLoader.js` handles loading and injecting XML strings into DOM tokens.<br>- `DonationService.js` handles data retrieval & formatting only.<br>- `ImpactService.js` handles impact calculations only.<br>- `ChartService.js` and chart components manage Chart.js rendering and lifecycle.<br>- `ImpactCalculatorUI.js` and `AuditTableUI.js` handle DOM bindings only. |
| **Open/Closed (OCP)** | - Adding new copy/strings to `assets/string.xml`, new donation tiers to `impactTiers.js`, or new audit records to `historyData.js` automatically updates UI without touching rendering logic. |
| **Liskov Substitution (LSP)** | - Chart components (`AllocationChart.js`, `ProgressChart.js`, `HistoryChart.js`) implement standard `.render()` and `.destroy()` lifecycles and can be swapped or tested independently. |
| **Interface Segregation (ISP)** | - Modules export focused functions and data structures so UI components only consume what they require. |
| **Dependency Inversion (DIP)** | - `app.js` orchestrates high-level components through service abstractions rather than tightly coupling to raw DOM events and inline scripts. |

---

## 🛠️ Technology Stack

- **Runtime & Dev Server**: [Bun](https://bun.sh)
- **UI Framework**: Vanilla JavaScript (ES Modules)
- **Styling**: Tailwind CSS & Vanilla CSS
- **Data Visualization**: Chart.js
- **Localization / Resources**: XML (`assets/string.xml`)

---

## 🌿 Git Branching Strategy & Rules

To keep the development process clean, predictable, and simple, we adhere to a **2-Branch Workflow**:

```
[development] ──(work / test)──> [PR / Merge] ──> [main] (Production / Live)
```

### 1. Core Branches

| Branch | Purpose | Rules / Constraints |
| :--- | :--- | :--- |
| **`main`** | **Production & Live Deployment** | - Always stable and deployable.<br>- Serves live deployment (e.g. GitHub Pages).<br>- **No direct commits** for untested features. Only merges from `development` or emergency hotfixes. |
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
3. **Optional Extensions (When Needed)**:
   - `feature/<name>`: For large or experimental features requiring isolated work before merging back into `development`.
   - `hotfix/<name>`: For urgent production bug fixes branched directly off `main` and backported to `development`.

