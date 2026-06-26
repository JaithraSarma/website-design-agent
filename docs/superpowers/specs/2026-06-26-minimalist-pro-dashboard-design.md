# Design Specification: Minimalist Pro Dashboard (Toned-Down Hybrid)

This spec details the visual redesign of the **Website Design Agent Dashboard** container interface. We will transform the UI from a basic layout into an elite, high-fidelity developer workspace utilizing a Minimalist Pro (Sleek Apple style) theme, interactive draggable resizable panels, and visual telemetry charts for reloads.

---

## 1. Visual Aesthetics & Design System

### A. Color Tokens
* **Theme:** Sleek Minimalist Pro (Apple style). Highly refined, toned-down dark-mode design with clean neutral borders.
* **Background Primary:** `#000000` (Pure deep black)
* **Background Secondary:** `#09090b` (Rich dark zinc panels)
* **Background Tertiary:** `#18181b` (Muted zinc cards, fields, textareas)
* **Border Color:** `#27272a` (Subtle dark zinc line)
* **Border Highlight:** `#52525b` (Neutral zinc hover line)
* **Text Primary:** `#f4f4f5` (Off-white)
* **Text Secondary:** `#a1a1aa` (Zinc grey)
* **Text Muted:** `#52525b` (Zinc dark)
* **Accent Active:** `#ffffff` (Solid white) / `#0071e3` (Muted Apple-style blue for telemetry and link statuses)

### B. Typography & Micro-Interactions
* Use Outfit and Inter for regular UI text. Clean subpixel antialiasing (`antialiased`).
* Use JetBrains Mono or standard SFMono-Regular for code views and telemetry logs.
* Custom, hair-thin scrollbars (`3px`) that blend into panel backgrounds.
* Hover animations will use smooth, subtle linear transitions (e.g. opacity and color changes) without bouncy scales to keep it feeling premium and professional.

---

## 2. Component Design & Interactivity

### A. Header Panel
* Spinning brand logo container removed; replaced by a clean, solid white square badge with a black 'W' letter.
* Connection status pills redesigned to be extremely simple border badges.
* Action buttons (Export, Deploy, Settings) styled as dark buttons with subtle gray borders that transition to solid white backgrounds with black text on hover.

### B. Draggable Panels Layout (Sidebar Explorer / Chat / Editor / Preview)
* Column panels are wrapped in a flex container.
* Transparent resizing gutters (`w-1.5`) are placed between columns.
* Gutters highlight as a clean neutral-zinc vertical divider line when hovered.
* Drag handlers track mouse movements in `App.jsx`, updating pane width states and storing user preferences in `localStorage`.
* Panel header controls include a square Maximize icon. Clicking this icon hides other columns with a simple slide/fade animation, rendering the active panel full-width.

### C. Live Telemetry & Metrics Sparklines
* Console pane displays a minimalist visual SVG sparkline chart detailing compile cycles.
* The chart renders a single-pixel line showing hot reload compiler speeds over the last 5 builds.
* Telemetry metadata displays:
  * HMR Compilation Speed: `128ms`
  * Production React Package: `24.2 KB`
  * Utility Styles Bundle: `84.1 KB`

---

## 3. Implementation Plan Requirements

* Maintain Vite hot reloading.
* Ensure all files cleanly pass oxlint and TypeScript lints (`npm run lint`).
* Production compiles (`npm run build`) must output zero warnings.
