# 🌐 Website Design Development Agent

[![Kudil-Observer CI](https://github.com/JaithraSarma/website-design-agent/actions/workflows/kudil-observer.yml/badge.svg)](https://github.com/JaithraSarma/website-design-agent/actions/workflows/kudil-observer.yml)

An AI-powered dashboard for generating, previewing, and managing web projects using **React** and **Tailwind CSS**. Built with **Dyad** as the local orchestrator, powered by the **Google Gemini API**.

![Dashboard Preview](docs/preview.png)

---

## ✨ Features

- **💬 Chat Interface** — Describe what you want to build in natural language. The AI agent generates production-ready React + Tailwind components.
- **👁 Live Preview Pane** — Split-screen layout with a real-time preview of the generated website, rendered in an embedded iframe.
- **📁 File Explorer Sidebar** — Browse and navigate the project file tree, with folder expand/collapse and active-file highlighting.
- **< > Code View** — Inspect the generated JSX/React source code directly within the dashboard.
- **⬛ Console** — Monitor build status, dev server output, and Gemini API connection health.
- **⚡ Generation Progress** — Real-time progress bar showing AI generation stages (analyzing → designing → generating → optimizing).
- **🎯 Quick Suggestions** — One-click prompt suggestions for common tasks (pricing tables, color changes, testimonials, etc.).

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or later
- npm (comes with Node.js)
- [Dyad](https://github.com/dyad-sh/dyad) desktop application (for orchestration)
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/JaithraSarma/website-design-agent.git
cd website-design-agent

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:5173/**

### Production Build

```bash
npm run build
```

Output is generated to the `dist/` directory.

---

## 🔑 Gemini API Key Setup (BYOK)

This project is designed to work with **Dyad's BYOK (Bring Your Own Key)** system.

1. Install [Dyad](https://github.com/dyad-sh/dyad) locally
2. Open Dyad → Settings → API Keys
3. Add your Google Gemini API key (e.g., Gemini 2.5 Flash or Gemini 3.1 Pro)
4. Dyad will use the key to power AI generation

> **⚠️ IMPORTANT:** Never commit your API key to the repository. The `.gitignore` file is configured to exclude all `.env` files. If you need to store the key locally, create a `.env.local` file:
>
> ```bash
> VITE_GEMINI_API_KEY=your_key_here
> ```
>
> This file is automatically excluded from version control.

---

## 🏗 Project Structure

```
website-design-agent/
├── .github/
│   └── workflows/
│       └── kudil-observer.yml   # CI/CD pipeline
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx                  # Main dashboard component
│   ├── index.css                # Global styles + Tailwind
│   └── main.jsx                 # React entry point
├── .gitignore                   # Excludes node_modules, .env, dist
├── index.html                   # HTML entry point
├── package.json                 # Dependencies and scripts
├── vite.config.js               # Vite + Tailwind plugin config
└── README.md                    # This file
```

---

## 🔄 CI/CD Pipeline

This project includes a **GitHub Actions** workflow (`.github/workflows/kudil-observer.yml`) that:

1. **Triggers** on every push to the `main` branch
2. **Sets up** Node.js v20 with npm caching
3. **Installs** dependencies (`npm ci`)
4. **Builds** the production bundle (`npm run build`)
5. **Outputs** a structured JSON success log for the **Kudil-Observer** testing subsystem

The workflow is designed to validate that the codebase compiles and builds correctly in a headless CI environment.

### JSON Success Log Format

```json
{
  "status": "success",
  "workflow": "kudil-observer",
  "timestamp": "2025-01-01T00:00:00Z",
  "steps": {
    "checkout": "passed",
    "setup_node": "passed",
    "install": "passed",
    "build": "passed"
  },
  "message": "Kudil-Observer CI pipeline completed successfully."
}
```

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.x | UI framework |
| Tailwind CSS | 4.x | Utility-first CSS |
| Vite | 8.x | Build tool & dev server |
| Node.js | 20.x | Runtime |
| GitHub Actions | — | CI/CD pipeline |
| Dyad | Latest | Local AI orchestrator |
| Google Gemini | 2.5 Flash / 3.1 Pro | AI model backend |

---

## 📋 Dashboard UI Overview

The dashboard is a **single-page application** with a 3-panel layout:

| Panel | Position | Function |
|-------|----------|----------|
| **File Explorer** | Left sidebar | Browse project files and folders |
| **Chat** | Center-left | Send prompts and receive AI responses |
| **Preview / Code / Console** | Right (main) | View live preview, source code, or build output |

The header bar shows the active AI model, generation progress, and quick actions (Export, Deploy).

---

## 📄 License

Proprietary — Lotus AI Works Inc.
