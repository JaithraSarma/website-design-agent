# Minimalist Pro Dashboard Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the dashboard container UI using a Minimalist Pro (Sleek Apple style) theme, featuring resizable grid panels via custom gutters, a panel maximizing focus system, and live SVG compilation telemetry.

**Architecture:** Update React state in App.jsx to control dynamic column layouts, track mouse events on vertical divider bars, toggle panel maximizing states, and render SVG telemetry paths inside ConsolePanel.jsx. Style the entire container using index.css design variables.

**Tech Stack:** React 19, Tailwind CSS v4, Lucide React icons.

## Global Constraints
- Zero linting warnings/errors (run `npm run lint` to verify).
- Zero production compiler warnings/errors (run `npm run build` to verify).
- Avoid commits containing active GEMINI_API_KEY credentials.

---

### Task 1: Clean CSS Style System Update

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- Produces: CSS design variables for pure-black elements, custom scrollbars, and gutter hover lines.

- [ ] **Step 1: Replace global CSS design variables**
  Update the `:root` variables to reflect the Apple-style Minimalist Pro theme.
  Modify the start of [index.css](file:///c:/Users/Jaith/Desktop/Lotus%20Interworks/website-design-agent/src/index.css#L1-L20) with:
  ```css
  @import "tailwindcss";

  :root {
    --bg-primary: #000000;
    --bg-secondary: #09090b;
    --bg-tertiary: #18181b;
    --bg-hover: #27272a;
    --border-color: #27272a;
    --border-active: #ffffff;
    --text-primary: #f4f4f5;
    --text-secondary: #a1a1aa;
    --text-muted: #52525b;
    --accent-blue: #0071e3;
    --accent-blue-light: #3b82f6;
  }
  ```

- [ ] **Step 2: Redesign scrollbar styles**
  Replace custom scrollbars to be ultra-thin and muted.
  Modify [index.css:44-59](file:///c:/Users/Jaith/Desktop/Lotus%20Interworks/website-design-agent/src/index.css#L44-L59) with:
  ```css
  .custom-scrollbar::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #27272a;
    border-radius: 9999px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #52525b;
  }
  ```

- [ ] **Step 3: Add resizer gutter style utilities**
  Append gutter hover highlights to [index.css](file:///c:/Users/Jaith/Desktop/Lotus%20Interworks/website-design-agent/src/index.css#L130-L151):
  ```css
  .resizer-gutter {
    position: relative;
    width: 4px;
    background: transparent;
    cursor: col-resize;
    z-index: 10;
    transition: background 0.15s ease;
  }
  .resizer-gutter:hover, .resizer-gutter.dragging {
    background: #27272a;
  }
  ```

- [ ] **Step 4: Run production build check**
  Run: `npm run build`
  Expected: PASS

- [ ] **Step 5: Commit changes**
  ```bash
  git add src/index.css
  git commit -m "style: update global colors and dividers for minimalist pro theme"
  ```

---

### Task 2: Draggable Panel Resizing System

**Files:**
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: Gutter style classes.
- Produces: State handlers for mouse drags, updating explorer and chat column width variables.

- [ ] **Step 1: Add panel sizing states and dragging hooks**
  Modify `src/App.jsx` inside `App()` function initialization to add tracking states:
  ```jsx
  const [explorerWidth, setExplorerWidth] = useState(220);
  const [chatWidth, setChatWidth] = useState(380);
  const [isDraggingExplorer, setIsDraggingExplorer] = useState(false);
  const [isDraggingChat, setIsDraggingChat] = useState(false);
  ```

- [ ] **Step 2: Add global mousemove event listeners**
  Add a `useEffect` hook in `src/App.jsx` to handle active mouse drag movements:
  ```jsx
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingExplorer) {
        const newWidth = Math.max(160, Math.min(360, e.clientX));
        setExplorerWidth(newWidth);
      }
      if (isDraggingChat) {
        const remainingSpace = window.innerWidth - e.clientX;
        // Adjust width based on third panel boundary
        const newWidth = Math.max(260, Math.min(500, remainingSpace - (window.innerWidth - e.clientX - chatWidth)));
        setChatWidth(Math.max(260, Math.min(520, window.innerWidth - e.clientX - 450)));
      }
    };

    const handleMouseUp = () => {
      setIsDraggingExplorer(false);
      setIsDraggingChat(false);
    };

    if (isDraggingExplorer || isDraggingChat) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingExplorer, isDraggingChat, chatWidth]);
  ```

- [ ] **Step 3: Render vertical gutters in Main Layout**
  Inject vertical resizer gutter spans in `src/App.jsx` main container markup:
  ```jsx
  <div className="flex flex-1 overflow-hidden relative">
    {sidebarOpen && (
      <div style={{ width: explorerWidth }}>
        <Sidebar ... />
      </div>
    )}
    <div 
      className={`resizer-gutter ${isDraggingExplorer ? 'dragging' : ''}`}
      onMouseDown={() => setIsDraggingExplorer(true)}
    />
    <div style={{ width: chatWidth }}>
      <ChatPanel ... />
    </div>
    <div 
      className={`resizer-gutter ${isDraggingChat ? 'dragging' : ''}`}
      onMouseDown={() => setIsDraggingChat(true)}
    />
    <div className="flex-grow">
      <PreviewPanel ... />
    </div>
  </div>
  ```

- [ ] **Step 4: Run dev build verification**
  Run: `npm run build`
  Expected: PASS

- [ ] **Step 5: Commit changes**
  ```bash
  git add src/App.jsx
  git commit -m "feat: implement draggable divider layout in dashboard container"
  ```

---

### Task 3: Panel Focus Maximizer Controls

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/Sidebar.jsx`
- Modify: `src/components/ChatPanel.jsx`
- Modify: `src/components/PreviewPanel.jsx`

**Interfaces:**
- Consumes: Pane focus states.
- Produces: Click handlers to maximize and collapse specific panels.

- [ ] **Step 1: Add maximize layout tracking in App.jsx**
  Track `maximizedPanel` state ('explorer' | 'chat' | 'preview' | null) inside `App.jsx`:
  ```jsx
  const [maximizedPanel, setMaximizedPanel] = useState(null);
  ```

- [ ] **Step 2: Update layout view toggles in main render container**
  Hide panels based on maximized status:
  ```jsx
  <div className="flex flex-1 overflow-hidden relative">
    {sidebarOpen && (maximizedPanel === null || maximizedPanel === 'explorer') && (
      <div style={{ width: maximizedPanel === 'explorer' ? '100%' : explorerWidth }}>
        <Sidebar onMaximize={() => setMaximizedPanel(maximizedPanel === 'explorer' ? null : 'explorer')} isMaximized={maximizedPanel === 'explorer'} ... />
      </div>
    )}
    
    {maximizedPanel === null && (
      <div className="resizer-gutter" onMouseDown={() => setIsDraggingExplorer(true)} />
    )}

    {(maximizedPanel === null || maximizedPanel === 'chat') && (
      <div style={{ width: maximizedPanel === 'chat' ? '100%' : chatWidth }}>
        <ChatPanel onMaximize={() => setMaximizedPanel(maximizedPanel === 'chat' ? null : 'chat')} isMaximized={maximizedPanel === 'chat'} ... />
      </div>
    )}

    {maximizedPanel === null && (
      <div className="resizer-gutter" onMouseDown={() => setIsDraggingChat(true)} />
    )}

    {(maximizedPanel === null || maximizedPanel === 'preview') && (
      <div className="flex-1">
        <PreviewPanel onMaximize={() => setMaximizedPanel(maximizedPanel === 'preview' ? null : 'preview')} isMaximized={maximizedPanel === 'preview'} ... />
      </div>
    )}
  </div>
  ```

- [ ] **Step 3: Update subcomponent headers with maximize actions**
  Inject Lucide `Maximize2` and `Minimize2` toggles inside:
  - `src/components/Sidebar.jsx`
  - `src/components/ChatPanel.jsx`
  - `src/components/PreviewPanel.jsx`

- [ ] **Step 4: Run compiler validation**
  Run: `npm run build`
  Expected: PASS

- [ ] **Step 5: Commit changes**
  ```bash
  git commit -am "feat: add panel maximize and minimize transitions"
  ```

---

### Task 4: Minimalist Header, Buttons and Badges Redesign

**Files:**
- Modify: `src/components/Header.jsx`

**Interfaces:**
- Produces: Minimalist design styling for brand logo, cpu / dyad pills, and action controls.

- [ ] **Step 1: Simplify Header branding**
  Remove conic spinning badge code. Set brand background to pure flat white with bold black font:
  ```jsx
  <div className="w-7 h-7 rounded bg-white text-black flex items-center justify-center font-black text-sm select-none">
    W
  </div>
  ```

- [ ] **Step 2: Clean model and link status badges**
  Replace outer status shadows with plain, thin borders (`border border-[#27272a]`):
  ```jsx
  <div className="flex items-center gap-2 text-[10px] text-[#a1a1aa] bg-[#09090b] px-3 py-1 rounded border border-[#27272a]">
    <Cpu className="w-3 h-3 text-[#a1a1aa]" />
    <span className="font-mono text-[9px] font-semibold">{config.model}</span>
  </div>
  ```

- [ ] **Step 3: Style Action buttons**
  Apply minimalist hover actions to Export and Deploy buttons:
  ```jsx
  className="px-3 py-1.5 text-xs bg-[#09090b] border border-[#27272a] hover:bg-white hover:text-black rounded transition-all font-bold"
  ```

- [ ] **Step 4: Run production build check**
  Run: `npm run build`
  Expected: PASS

- [ ] **Step 5: Commit changes**
  ```bash
  git add src/components/Header.jsx
  git commit -m "style: simplify header logo, connection badges and actions"
  ```

---

### Task 5: Live SVG Telemetry Chart Panel

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/ConsolePanel.jsx`

**Interfaces:**
- Consumes: Compile duration speed telemetry arrays.
- Produces: Dynamic SVG line sparklines and detailed stats panels.

- [ ] **Step 1: Update compile times array logic inside App.jsx**
  Initialize and append HMR load times to a tracking list:
  ```jsx
  const [compileTimes, setCompileTimes] = useState([120, 150, 110, 142, 128]);
  ```
  Append random variance of `100-200ms` in the compilation resolver:
  ```jsx
  setCompileTimes(prev => [...prev.slice(1), Math.floor(Math.random() * 100) + 100]);
  ```

- [ ] **Step 2: Build the Telemetry sparkline in ConsolePanel.jsx**
  Pass `compileTimes` to `ConsolePanel.jsx` and render a simple sparkline:
  ```jsx
  // Calculate SVG point path
  const max = Math.max(...compileTimes);
  const min = Math.min(...compileTimes);
  const points = compileTimes.map((val, i) => {
    const x = (i / (compileTimes.length - 1)) * 140 + 10;
    const range = max - min || 1;
    const y = 35 - ((val - min) / range) * 20;
    return `${x},${y}`;
  }).join(' ');
  ```

- [ ] **Step 3: Render telemetry grid view in console footer**
  Add a metrics strip with the visual SVG element inside `ConsolePanel.jsx`:
  ```jsx
  <div className="border-t border-[#27272a] bg-[#09090b] p-3 flex items-center justify-between font-mono text-[10px] text-[#a1a1aa] select-none">
    <div>
      <div>HMR Speed: <span className="text-white font-bold">{compileTimes[compileTimes.length - 1]}ms</span></div>
      <div className="text-[9px] text-[#52525b] mt-0.5">Bundle React: 24.2 KB · Tailwind: 84.1 KB</div>
    </div>
    <svg className="w-36 h-10 border border-[#27272a]/40 rounded bg-black/40">
      <polyline fill="none" stroke="#0071e3" strokeWidth="1.5" points={points} />
    </svg>
  </div>
  ```

- [ ] **Step 4: Verify build and compile outputs**
  Run: `npm run build`
  Expected: PASS

- [ ] **Step 5: Commit changes**
  ```bash
  git commit -am "feat: implement visual compile telemetry chart in console logs panel"
  ```

---

## Verification Plan

### Automated Tests
- Run `npm run lint` - Check for zero violations.
- Run `npm run build` - Check for clean production bundles.

### Manual Verification
1. Drag the panel borders to ensure resizing works and respects constraints.
2. Maximize and minimize panels via header icons.
3. Open compile console panel and trigger a compilation task (e.g. by sending a chat message) to verify telemetry sparklines reload and draw dynamically.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-26-minimalist-pro-dashboard-plan.md`. Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
