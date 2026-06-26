# 📖 End-to-End Project Walkthrough

A complete guide to understanding the **Website Design Development Agent** project — from concept to deployment. Use this to present to your client and explain every aspect of the system.

---

## Table of Contents

1. [What This Project Is](#1-what-this-project-is)
2. [Architecture Overview](#2-architecture-overview)
3. [The Development Pipeline](#3-the-development-pipeline)
4. [Code Walkthrough](#4-code-walkthrough)
5. [The CI/CD Pipeline](#5-the-cicd-pipeline)
6. [How to Run & Test Locally](#6-how-to-run--test-locally)
7. [Dyad + Gemini Integration](#7-dyad--gemini-integration)
8. [Security & Environment Hygiene](#8-security--environment-hygiene)
9. [Presenting to the Client](#9-presenting-to-the-client)

---

## 1. What This Project Is

This is a **Website Design Development Agent** — an AI-powered dashboard where a user can:

1. **Describe** a website or UI in natural language (via chat)
2. **Watch** the AI generate React + Tailwind code in real time
3. **Preview** the result in a live split-screen pane
4. **Inspect** the generated source code
5. **Deploy** the finished project

Think of it as an "AI web designer" — the user types "Build me a SaaS landing page" and the agent generates the code and shows a live preview, all within a single dashboard interface.

### Why It Matters

The industry is moving toward AI-assisted development. This dashboard demonstrates that workflow:
- **Input:** Natural language prompt
- **Process:** AI model (Gemini) generates code
- **Output:** Live, renderable React + Tailwind website

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (localhost:5173)              │
│                                                         │
│  ┌──────────┐  ┌─────────────┐  ┌────────────────────┐ │
│  │  Sidebar  │  │   Chat      │  │  Preview / Code /  │ │
│  │  (File    │  │   Panel     │  │  Console Panel     │ │
│  │  Explorer)│  │             │  │                    │ │
│  │           │  │  User ←→ AI │  │  ┌──────────────┐ │ │
│  │  📁 files │  │  messages   │  │  │   <iframe>   │ │ │
│  │  📄 index │  │             │  │  │  Live HTML   │ │ │
│  │  ⚛️ App   │  │  ⚡ Quick   │  │  │  Preview     │ │ │
│  │           │  │  suggestions│  │  │              │ │ │
│  └──────────┘  └─────────────┘  │  └──────────────┘ │ │
│                                  └────────────────────┘ │
└─────────────────────────────────────────────────────────┘
        │                    │
        ▼                    ▼
  Vite Dev Server      React 19 + Tailwind CSS 4
        │
        ▼
  Dyad Orchestrator ──▶ Google Gemini API
```

### The Three Panels

| Panel | What It Does |
|-------|-------------|
| **File Explorer (Left)** | Shows the project's file tree. Users can expand/collapse folders and see which file is active. This gives the "IDE-like" feel. |
| **Chat (Center)** | The main interaction point. Users type prompts, the AI responds with generated code and descriptions. Includes typing indicators and a progress bar. |
| **Preview/Code/Console (Right)** | Three tabs: **Preview** shows the live rendered website in an iframe. **Code** shows the generated JSX source. **Console** shows server/build status logs. |

---

## 3. The Development Pipeline

Here's the end-to-end pipeline from the Statement of Work:

```
                    ┌──────────────┐
                    │    Dyad      │
                    │  (Desktop    │
                    │   App)       │
                    └──────┬───────┘
                           │ Prompts code via
                           ▼
                    ┌──────────────┐
                    │ Google Gemini│
                    │    API       │
                    │ (2.5 Flash / │
                    │  3.1 Pro)    │
                    └──────┬───────┘
                           │ Generates
                           ▼
                    ┌──────────────┐
                    │ React +      │
                    │ Tailwind SPA │
                    │ (this repo)  │
                    └──────┬───────┘
                           │ git push
                           ▼
                    ┌──────────────┐
                    │   GitHub     │
                    │  Repository  │
                    └──────┬───────┘
                           │ triggers
                           ▼
                    ┌──────────────┐
                    │ GitHub       │
                    │ Actions CI   │
                    │ (kudil-      │
                    │  observer)   │
                    └──────────────┘
                           │ outputs
                           ▼
                    ┌──────────────┐
                    │ JSON Success │
                    │ Log → Kudil  │
                    │ Observer     │
                    └──────────────┘
```

### Step-by-Step:

1. **Dyad** is the local orchestrator — an open-source desktop app that manages AI coding workflows
2. **Google Gemini** is the AI model that generates code (configured via BYOK — Bring Your Own Key)
3. **The SPA** is the generated output — a React + Tailwind dashboard
4. **GitHub** hosts the code and tracks version history
5. **GitHub Actions** runs automated CI/CD on every push, building the project and outputting a structured log
6. **Kudil-Observer** is the testing subsystem that receives the JSON handoff

---

## 4. Code Walkthrough

### `index.html` — The Entry Point

```html
<!doctype html>
<html lang="en">
  <head>
    <!-- Google Fonts loaded here (not in CSS) to avoid @import ordering issues -->
    <link href="https://fonts.googleapis.com/css2?family=Inter..." rel="stylesheet" />
    <title>Website Design Agent — AI Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**Key point:** Google Fonts are loaded via `<link>` tags in HTML, not `@import` in CSS. This avoids a CSS ordering warning where `@import` rules must come before other rules — and Tailwind v4 generates its base styles before any custom CSS.

### `src/main.jsx` — React Bootstrap

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Standard React 19 entry point. `StrictMode` enables additional development warnings. Only `index.css` is imported — no separate `App.css` (was removed as unused boilerplate).

### `src/index.css` — Styles + Tailwind

```css
@import "tailwindcss";

:root {
  --bg-primary: #0a0b0e;
  --bg-secondary: #0f1117;
  /* ... */
}
```

**Key point:** Tailwind CSS v4 uses `@import "tailwindcss"` instead of the v3 `@tailwind base/components/utilities` directives. There's no `tailwind.config.js` — Tailwind v4 handles configuration differently (via CSS or the Vite plugin).

### `src/App.jsx` — The Dashboard (≈500 lines)

This is the core of the application. Here's what each section does:

**State Management:**
```jsx
const [messages, setMessages] = useState(INITIAL_MESSAGES);
const [inputValue, setInputValue] = useState('');
const [isGenerating, setIsGenerating] = useState(false);
const [files, setFiles] = useState(INITIAL_FILES);
const [activeTab, setActiveTab] = useState('preview');
const [sidebarOpen, setSidebarOpen] = useState(true);
```

All state is managed with React's `useState` hooks. No external state library needed for this scale.

**Chat System:**
- Pre-populated with a demo conversation (AI welcome → user prompt → AI response)
- User can type new messages and receive simulated AI responses
- Typing indicators with animated dots
- Suggested quick prompts

**Preview System:**
- The preview iframe loads a complete HTML document via `srcDoc` (not a URL)
- The HTML includes Tailwind CDN, a nav bar, hero section, feature cards, and footer
- This is a **real, fully rendered website** — not a placeholder image

**File Explorer:**
- Tree structure with expandable folders
- File type icons (JSX, CSS, JSON, HTML)
- Active file highlighting

**Generation Simulation:**
- Multi-stage progress: Analyzing → Designing → Generating → Optimizing → Complete
- Progress bar in the header
- Status messages update in real time

### `vite.config.js` — Build Configuration

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**Key point:** Tailwind CSS v4 uses the `@tailwindcss/vite` plugin instead of PostCSS configuration. This is cleaner and faster than the v3 approach.

---

## 5. The CI/CD Pipeline

### File: `.github/workflows/kudil-observer.yml`

```yaml
name: Kudil-Observer CI

on:
  push:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'    # ← Pinned! Critical for consistency
          cache: 'npm'
      - run: npm ci             # ← Uses ci, not install (reproducible)
      - run: npm run build      # ← Must pass or the workflow fails
      - run: echo '{ JSON success log }'
```

### Why These Choices Matter

| Decision | Why |
|----------|-----|
| `node-version: '20'` | Pinned to avoid version mismatches between local and CI. If local uses Node 20 but CI defaults to 18, the build could fail. |
| `npm ci` instead of `npm install` | `npm ci` uses the exact lockfile versions. `npm install` can resolve to different versions, causing "works on my machine" bugs. |
| `cache: 'npm'` | Caches the npm cache directory between runs, making subsequent builds faster. |
| `ubuntu-latest` | Standard GitHub Actions runner. The SOW says "headless environment" — this is it. |

### The JSON Success Log

The final step outputs a structured JSON log to stdout. This is the **handoff point** to the Kudil-Observer testing subsystem. The log includes:
- Build status (success/failure)
- Commit SHA and branch
- Timestamp
- Status of each pipeline step
- Build artifact location

---

## 6. How to Run & Test Locally

### First Time Setup

```bash
# 1. Clone the repo
git clone https://github.com/JaithraSarma/website-design-agent.git
cd website-design-agent

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
# → Opens at http://localhost:5173/
```

### Verify the Build Works

```bash
npm run build
```

Expected output:
```
✓ 16 modules transformed.
dist/index.html                   0.97 kB
dist/assets/index-XXXXX.css      28.77 kB
dist/assets/index-XXXXX.js      215.40 kB
✓ built in ~400ms
```

**If the build has zero errors and zero warnings, it will pass CI.**

### Testing the Dashboard

1. Open `http://localhost:5173/` in your browser
2. Verify you see three panels: sidebar, chat, preview
3. Try typing a message in the chat input and pressing Enter
4. Watch the progress bar and typing indicator
5. Click the "Code" and "Console" tabs
6. Toggle the sidebar with the hamburger icon

---

## 7. Dyad + Gemini Integration

### What is Dyad?

[Dyad](https://github.com/dyad-sh/dyad) is an open-source desktop application for AI-assisted web development. It acts as a local orchestrator that:
- Connects to AI models (via BYOK)
- Generates code from natural language prompts
- Manages project files
- Provides a local development environment

### What is BYOK?

**Bring Your Own Key** — instead of paying for a subscription, you provide your own API key for the AI model. This project uses the Google Gemini API.

### Setup Steps

1. Download and install [Dyad](https://github.com/dyad-sh/dyad)
2. Open Dyad → Settings → API Keys
3. Select "Google Gemini" as the provider
4. Paste your API key from [Google AI Studio](https://aistudio.google.com/apikey)
5. Choose a model (Gemini 2.5 Flash for speed, Gemini 3.1 Pro for quality)
6. Dyad is now ready to generate code

### How It Connects

```
Your Gemini API Key
        │
        ▼
  Dyad Desktop App
  (BYOK Settings)
        │
        ▼
  Google Gemini API
  (aistudio.google.com)
        │
        ▼
  Generated React/
  Tailwind Code
```

---

## 8. Security & Environment Hygiene

### What the `.gitignore` Protects

```gitignore
# Dependencies (never commit — too large, platform-specific)
node_modules

# Build output (regenerated from source)
dist

# CRITICAL: API keys and secrets
.env
.env.*
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### The #1 Rule

> **Never commit your API key to GitHub.**
>
> The SOW explicitly states: *"Committing the Gemini API key to GitHub results in an immediate failure and rejection."*

If you need to store the key locally:
1. Create a file called `.env.local` (already in `.gitignore`)
2. Add: `VITE_GEMINI_API_KEY=your_key_here`
3. The file will never be tracked by git

### Verification

```bash
# Check that .env files are ignored
git status
# Should NOT show any .env files

# Check the gitignore works
echo "test" > .env.local
git status
# .env.local should NOT appear in the output
```

---

## 9. Presenting to the Client

### What to Show

1. **The Dashboard** — Open `http://localhost:5173/` and walk through the three panels
2. **The Chat** — Type a prompt and show the generation simulation
3. **The Preview** — Point out that the iframe shows a real, rendered website
4. **The Code Tab** — Show the generated JSX source
5. **The Console** — Show the server status logs
6. **GitHub** — Show the repository with clean commit history
7. **GitHub Actions** — Show the green ✅ build in the Actions tab
8. **The JSON Log** — Click into the workflow run and show the Kudil-Observer JSON output

### Key Talking Points

| Point | What to Say |
|-------|------------|
| **Tech Stack** | "React 19 with Tailwind CSS v4 — the latest versions, using the modern Vite plugin approach." |
| **Dyad** | "Dyad acts as the local orchestrator, connecting to Gemini via BYOK so the API key never touches the cloud." |
| **CI/CD** | "Every push to main triggers an automated build pipeline. The JSON log is designed for handoff to the Kudil-Observer testing subsystem." |
| **Security** | "The .gitignore is hardened to block all .env files, API keys, and local configurations. Zero secrets in the repo." |
| **Code Quality** | "The build passes with zero errors and zero warnings. The CSS is clean, the components are well-structured, and the UI is responsive." |

### Potential Questions & Answers

**Q: "Why React instead of Vue/Svelte?"**
A: The SOW specifies React + Tailwind CSS. React 19 with the latest features provides the most robust foundation.

**Q: "Why Tailwind v4 instead of v3?"**
A: Tailwind v4 is the latest release. It uses a simpler configuration model (no `tailwind.config.js` needed) and integrates natively with Vite via `@tailwindcss/vite`.

**Q: "How does the AI actually generate code?"**
A: In the full pipeline, Dyad sends the user's prompt to the Gemini API, which returns generated React/Tailwind code. The dashboard displays this code in the chat panel, renders it in the preview pane, and saves it to the file tree.

**Q: "What is Kudil-Observer?"**
A: It's the testing subsystem that receives the CI/CD output. The GitHub Actions workflow outputs a structured JSON log that Kudil-Observer uses to verify the build passed and the code is ready for deployment.

---

## Summary

| Component | Status | Notes |
|-----------|--------|-------|
| React + Tailwind SPA | ✅ Complete | Dashboard with chat, preview, sidebar |
| Live Preview | ✅ Complete | Renders real website in iframe |
| GitHub Actions CI | ✅ Complete | Triggers on push, outputs JSON log |
| `.gitignore` | ✅ Hardened | Blocks .env, node_modules, dist |
| Build | ✅ Passes | Zero errors, zero warnings |
| README | ✅ Complete | Setup instructions, CI badge, BYOK docs |
| Security | ✅ Clean | No API keys in repo |
