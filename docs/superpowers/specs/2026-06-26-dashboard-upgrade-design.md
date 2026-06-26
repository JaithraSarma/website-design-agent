# Design Specification: Interactive Dashboard Upgrade & Modularization

This document outlines the design and architectural changes for upgrading the **Website Design Development Agent Dashboard** to a production-grade, highly interactive SPA.

---

## 1. Objectives & Success Criteria

1. **Eliminate "Vibe-Coded" Aesthetic:** Replace basic emojis with clean SVG icons, introduce consistent glassmorphic panels, and improve typography, micro-interactions, and visual states.
2. **Modular Architecture:** Split the monolithic `App.jsx` into standalone, single-responsibility components.
3. **Interactive File Explorer:** Clicking files in the explorer sidebar will load and display their actual code in the Code tab.
4. **Dynamic Project States:** Sending specific chat prompts (or clicking suggestions) updates the virtual file system (CSS, index.html, App.jsx, components, etc.) and dynamically updates the preview iframe rendering.
5. **Functional ZIP Export:** Implement client-side `jszip` integration to let users download the actual generated React + Tailwind workspace.
6. **Dyad Orchestrator Integration Settings:** Add a BYOK setting modal allowing configuration of Gemini keys and local Dyad orchestrator settings.

---

## 2. Component Architecture

```
src/
├── main.jsx                 # Entry point
├── index.css                # Global styles, Tailwind setup, variables
├── App.jsx                  # Root state management & Context Provider
├── components/
│   ├── Header.jsx           # Top navigation, build progress, actions (settings, export, deploy)
│   ├── Sidebar.jsx          # File tree navigation, project info
│   ├── ChatPanel.jsx        # Message view, suggestions chips, chat input
│   ├── PreviewPanel.jsx     # Live iframe viewport, URL bar, refreshed controller
│   ├── CodePanel.jsx        # Read-only file code inspector with copy action
│   ├── ConsolePanel.jsx     # Webpack/Vite dev server logs, compile status
│   └── SettingsModal.jsx    # Dyad connection & Gemini API Key (BYOK) setup
```

### State Management & Context (`ProjectContext`)
We will create a lightweight state controller in `App.jsx` (or a React Context) managing:
- `files`: The virtual file tree including name, type, and source code.
- `activeFile`: The currently selected file object for inspection.
- `activeTab`: Current preview tab (`preview` | `code` | `console`).
- `messages`: Chat message history.
- `isGenerating` / `generationProgress` / `statusMessage`: AI compilation states.
- `apiKey` / `dyadPort` / `dyadStatus`: BYOK credentials and local orchestrator status.

---

## 3. Dynamic Updates & Virtual Files

The dashboard will maintain a virtual file system representing the simulated React project. The project states will change depending on user prompt interactions:

| State Trigger | Files Updated | Preview HTML Output |
|---|---|---|
| **Initial State** | Base `App.jsx`, `index.html`, `index.css`, `Header.jsx`, `Hero.jsx`, `Footer.jsx` | Default SaaS Landing Page |
| **Pricing Chip** | Add `components/Pricing.jsx`, modify `App.jsx` to render it | SaaS Landing Page + 3-Tier Pricing |
| **Purple Theme** | Modify `index.css` (variables), modify Tailwind classes in components | Purple Gradient SaaS Landing Page |
| **Testimonials** | Add `components/Testimonials.jsx`, modify `App.jsx` | SaaS Landing Page + Testimonial grid |
| **Dashboard Layout** | Complete swap of `App.jsx` (sidebar, stats cards, tables, charts) | Fully functional Admin Dashboard |

---

## 4. Technical Dependencies

1. **`jszip` (version ^3.10.1):** To bundle and compress the virtual file system into a single ZIP archive client-side.
2. **`lucide-react` (or custom SVG components):** Replacing the standard emojis with professional developer icons.

---

## 5. Security & BYOK Rules

- The Gemini API key will be saved locally in `.env.local` as `VITE_GEMINI_API_KEY`.
- The `.gitignore` file guarantees no `.env*` or `.dyad/` files are pushed to GitHub.
- If no local `.env` key is found, the settings modal in the UI allows the user to paste their own key (BYOK pattern), which is saved in session storage (never persisted online).

---

## 6. Verification Plan

1. **Compilation:** Verify `npm run build` succeeds with zero errors.
2. **File Navigation:** Click files in the Sidebar and confirm the Code Panel renders the correct code.
3. **Prompt Changes:** Trigger chat updates and verify both code and preview iframe change in sync.
4. **ZIP Download:** Click "Export" and verify a valid ZIP file is downloaded containing the full file structure.
5. **CI/CD Build:** Confirm the GitHub Actions run succeeds.
