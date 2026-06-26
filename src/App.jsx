import React, { useState, useRef, useEffect } from 'react';

const INITIAL_FILES = [
  { id: 1, name: 'index.html', type: 'html', active: false },
  { id: 2, name: 'App.jsx', type: 'jsx', active: true },
  { id: 3, name: 'components/', type: 'folder', expanded: true, children: [
    { id: 4, name: 'Header.jsx', type: 'jsx', active: false },
    { id: 5, name: 'Hero.jsx', type: 'jsx', active: false },
    { id: 6, name: 'Footer.jsx', type: 'jsx', active: false },
  ]},
  { id: 7, name: 'styles/', type: 'folder', expanded: false, children: [
    { id: 8, name: 'index.css', type: 'css', active: false },
    { id: 9, name: 'tailwind.config.js', type: 'js', active: false },
  ]},
  { id: 10, name: 'package.json', type: 'json', active: false },
  { id: 11, name: 'vite.config.js', type: 'js', active: false },
];

const FILE_ICONS = {
  html: { icon: '🌐', color: '#e34c26' },
  jsx: { icon: '⚛️', color: '#61dafb' },
  js: { icon: '📄', color: '#f7df1e' },
  css: { icon: '🎨', color: '#264de4' },
  json: { icon: '{ }', color: '#cbcb41' },
  folder: { icon: '📁', color: '#e8c07d' },
};

const PREVIEW_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Website Preview</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    body { 
      font-family: 'Inter', sans-serif; 
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
  </style>
</head>
<body class="text-white">
  <nav class="border-b border-white/10 backdrop-blur-md bg-white/5">
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">A</div>
        <span class="font-semibold text-white">AgentFlow</span>
      </div>
      <div class="flex items-center gap-6 text-sm text-white/60">
        <a href="#" class="hover:text-white transition-colors">Features</a>
        <a href="#" class="hover:text-white transition-colors">Docs</a>
        <a href="#" class="hover:text-white transition-colors">Pricing</a>
        <button class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm transition-colors">Get Started</button>
      </div>
    </div>
  </nav>
  <main class="flex-1 max-w-6xl mx-auto px-6 py-20 text-center">
    <div class="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs px-3 py-1.5 rounded-full mb-8">
      <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
      AI-Powered Web Design Agent
    </div>
    <h1 class="text-5xl font-bold text-white mb-6 leading-tight">
      Build Stunning Websites<br/>
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">With AI Intelligence</span>
    </h1>
    <p class="text-white/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
      Describe your vision, and our AI agent generates production-ready React components with Tailwind CSS — live in seconds.
    </p>
    <div class="flex items-center gap-4 justify-center">
      <button class="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">Start Building Free</button>
      <button class="border border-white/20 hover:border-white/40 text-white px-8 py-3 rounded-xl font-medium transition-all">View Examples →</button>
    </div>
    <div class="mt-20 grid grid-cols-3 gap-6">
      <div class="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors">
        <div class="text-3xl mb-3">⚡</div>
        <h3 class="font-semibold text-white mb-2">Instant Generation</h3>
        <p class="text-white/50 text-sm">From prompt to pixel-perfect code in under 5 seconds</p>
      </div>
      <div class="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors">
        <div class="text-3xl mb-3">🎨</div>
        <h3 class="font-semibold text-white mb-2">Design-Aware AI</h3>
        <p class="text-white/50 text-sm">Understands aesthetics, layout, and modern UI patterns</p>
      </div>
      <div class="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors">
        <div class="text-3xl mb-3">🚀</div>
        <h3 class="font-semibold text-white mb-2">Production Ready</h3>
        <p class="text-white/50 text-sm">Clean, accessible React + Tailwind code you can ship today</p>
      </div>
    </div>
  </main>
  <footer class="border-t border-white/10 py-6">
    <div class="max-w-6xl mx-auto px-6 flex items-center justify-between text-white/40 text-sm">
      <span>© 2025 AgentFlow. All rights reserved.</span>
      <div class="flex gap-6">
        <a href="#" class="hover:text-white/60 transition-colors">Privacy</a>
        <a href="#" class="hover:text-white/60 transition-colors">Terms</a>
        <a href="#" class="hover:text-white/60 transition-colors">Contact</a>
      </div>
    </div>
  </footer>
</body>
</html>`;

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'assistant',
    content: "Hello! I'm your Website Design Development Agent. I can help you build beautiful, production-ready web interfaces using React and Tailwind CSS.\n\nDescribe what you want to build — a landing page, dashboard, portfolio, e-commerce site — and I'll generate the code in real time. You'll see the result live in the preview panel.",
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: 2,
    role: 'user',
    content: 'Build me a modern SaaS landing page with a hero section, feature cards, and a pricing section.',
    timestamp: new Date(Date.now() - 90000),
  },
  {
    id: 3,
    role: 'assistant',
    content: "I've generated a modern SaaS landing page for you! Here's what I built:\n\n**Structure:**\n- ✅ Navigation bar with logo and CTA\n- ✅ Hero section with gradient headline\n- ✅ 3-column feature cards\n- ✅ Responsive footer\n\n**Tech used:** React + Tailwind CSS with glassmorphism effects and smooth hover states.\n\nYou can see the live preview on the right. Want me to add a pricing section, testimonials, or adjust the color scheme?",
    timestamp: new Date(Date.now() - 60000),
    isCode: false,
  },
];

const SUGGESTIONS = [
  "Add a pricing table with 3 tiers",
  "Change color scheme to purple gradient",
  "Add a testimonials section",
  "Create a dashboard layout",
  "Build a contact form",
  "Add dark/light mode toggle",
];

export default function App() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [files, setFiles] = useState(INITIAL_FILES);
  const [activeTab, setActiveTab] = useState('preview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState({ 3: true });
  const [generationProgress, setGenerationProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Ready');
  const [previewHtml, setPreviewHtml] = useState(PREVIEW_HTML);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleFolder = (id) => {
    setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const simulateGeneration = (userMessage) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setStatusMessage('Analyzing prompt...');

    const stages = [
      { progress: 15, status: 'Analyzing prompt...', delay: 400 },
      { progress: 35, status: 'Designing layout...', delay: 800 },
      { progress: 55, status: 'Generating components...', delay: 700 },
      { progress: 75, status: 'Applying Tailwind styles...', delay: 600 },
      { progress: 90, status: 'Optimizing output...', delay: 500 },
      { progress: 100, status: 'Complete!', delay: 400 },
    ];

    let currentStage = 0;
    const runStage = () => {
      if (currentStage >= stages.length) {
        setIsGenerating(false);
        setStatusMessage('Ready');
        setGenerationProgress(0);

        const responseContent = generateResponse(userMessage);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          role: 'assistant',
          content: responseContent,
          timestamp: new Date(),
        }]);
        return;
      }
      const stage = stages[currentStage];
      setGenerationProgress(stage.progress);
      setStatusMessage(stage.status);
      currentStage++;
      setTimeout(runStage, stage.delay);
    };
    setTimeout(runStage, 100);
  };

  const generateResponse = (prompt) => {
    const lower = prompt.toLowerCase();
    if (lower.includes('pric')) {
      return "I've added a 3-tier pricing section below the features!\n\n**Added:**\n- ✅ Starter — Free plan\n- ✅ Pro — $29/month with highlighted badge\n- ✅ Enterprise — Custom pricing\n\nEach card includes feature lists, a CTA button, and a popular badge on the Pro tier. The layout uses a responsive 3-column grid with hover effects.";
    }
    if (lower.includes('purple') || lower.includes('color')) {
      return "Color scheme updated to purple gradient!\n\n**Changed:**\n- ✅ Primary brand color: Violet-600\n- ✅ CTA buttons updated\n- ✅ Hero gradient re-styled\n- ✅ Accent highlights updated\n\nThe design now uses a purple-to-indigo gradient palette throughout the page.";
    }
    if (lower.includes('testimonial')) {
      return "Testimonials section added!\n\n**Structure:**\n- ✅ Section header with subheadline\n- ✅ 3 testimonial cards with avatars\n- ✅ 5-star ratings with names and roles\n- ✅ Quote marks using CSS pseudoelements\n\nAll testimonials use realistic placeholder names and compelling copy.";
    }
    if (lower.includes('dashboard')) {
      return "Dashboard layout generated!\n\n**Components:**\n- ✅ Sidebar with nav links and icons\n- ✅ Stats cards with trend indicators\n- ✅ Area chart placeholder\n- ✅ Recent activity feed\n- ✅ Quick action buttons\n\nThe layout uses a fixed sidebar with a scrollable main content area.";
    }
    return `Got it! I'm working on: "${prompt}"\n\n**Generated:**\n- ✅ Component structure created\n- ✅ Responsive layout applied\n- ✅ Tailwind classes optimized\n- ✅ Animations and hover states added\n\nCheck the preview panel to see the result. Want me to adjust anything?`;
  };

  const handleSend = () => {
    if (!inputValue.trim() || isGenerating) return;
    const userMsg = {
      id: messages.length + 1,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    simulateGeneration(userMsg.content);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderFileTree = (fileList, depth = 0) => {
    return fileList.map(file => (
      <div key={file.id}>
        <div
          className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-md transition-all duration-150 group text-sm ${
            file.active
              ? 'bg-blue-600/20 text-blue-300'
              : 'text-[#8b95a7] hover:text-[#e8eaf0] hover:bg-[#1e2433]'
          }`}
          style={{ paddingLeft: `${12 + depth * 14}px` }}
          onClick={() => file.type === 'folder' && toggleFolder(file.id)}
        >
          {file.type === 'folder' ? (
            <span className="text-[10px] text-[#4b5563] transition-transform duration-200"
              style={{ transform: expandedFolders[file.id] ? 'rotate(90deg)' : 'rotate(0deg)', display: 'inline-block' }}>
              ▶
            </span>
          ) : (
            <span className="w-3 h-3" />
          )}
          <span className="text-xs">{file.type === 'folder' ? '📁' : (FILE_ICONS[file.type]?.icon || '📄')}</span>
          <span className="text-xs font-medium">{file.name}</span>
          {file.active && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
          )}
        </div>
        {file.type === 'folder' && expandedFolders[file.id] && file.children && (
          <div>{renderFileTree(file.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0b0e] text-[#e8eaf0] overflow-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-[#1e2733] bg-[#0f1117] flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold shadow-lg">
              W
            </div>
            <div>
              <span className="text-sm font-semibold text-[#e8eaf0]">Website Design</span>
              <span className="text-sm font-semibold text-[#3b82f6]"> Agent</span>
            </div>
          </div>
          <div className="h-4 w-px bg-[#1e2733]" />
          <div className="flex items-center gap-1.5 text-xs text-[#10b981]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" style={{ animation: 'pulse-dot 2s infinite' }} />
            <span>Gemini 2.5 Flash</span>
          </div>
        </div>

        {/* Generation Progress Bar */}
        {isGenerating && (
          <div className="flex-1 mx-8 max-w-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full border-2 border-blue-400 border-t-transparent spinner" />
              <span className="text-xs text-[#8b95a7]">{statusMessage}</span>
              <span className="text-xs text-blue-400 ml-auto">{generationProgress}%</span>
            </div>
            <div className="h-1 bg-[#1e2733] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            id="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-1.5 rounded-md text-xs transition-colors ${sidebarOpen ? 'bg-[#1e2433] text-[#e8eaf0]' : 'text-[#4b5563] hover:text-[#8b95a7]'}`}
            title="Toggle Sidebar"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="3" width="12" height="1.5" rx="0.75" fill="currentColor"/>
              <rect x="1" y="6.25" width="8" height="1.5" rx="0.75" fill="currentColor"/>
              <rect x="1" y="9.5" width="10" height="1.5" rx="0.75" fill="currentColor"/>
            </svg>
          </button>
          <button className="px-3 py-1.5 text-xs bg-[#1e2433] hover:bg-[#2a3347] text-[#8b95a7] hover:text-[#e8eaf0] rounded-md transition-colors border border-[#1e2733]">
            Export
          </button>
          <button
            id="deploy-btn"
            className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-all hover:shadow-lg hover:shadow-blue-500/25 font-medium"
          >
            Deploy
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-56 flex-shrink-0 border-r border-[#1e2733] bg-[#0f1117] flex flex-col slide-in-left">
            <div className="px-3 py-3 border-b border-[#1e2733] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#4b5563] uppercase tracking-wider">Explorer</span>
              <button className="text-[#4b5563] hover:text-[#8b95a7] transition-colors text-xs">
                +
              </button>
            </div>

            {/* Project label */}
            <div className="px-3 py-2 flex items-center gap-1.5">
              <span className="text-[10px] text-[#4b5563] uppercase tracking-wider">website-design-agent</span>
            </div>

            <div className="flex-1 overflow-y-auto py-1">
              {renderFileTree(files)}
            </div>

            {/* Bottom status */}
            <div className="px-3 py-3 border-t border-[#1e2733]">
              <div className="flex items-center gap-2 text-xs text-[#4b5563]">
                <span>⚡</span>
                <span>Vite + React + Tailwind</span>
              </div>
            </div>
          </aside>
        )}

        {/* Chat Panel */}
        <div className="w-[400px] flex-shrink-0 flex flex-col border-r border-[#1e2733] bg-[#0a0b0e]">
          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-[#1e2733] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-[9px]">AI</span>
              </div>
              <span className="text-sm font-medium">Chat</span>
            </div>
            <span className="text-xs text-[#4b5563]">{messages.length} messages</span>
          </div>

          {/* Messages */}
          <div id="chat-messages" className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`fade-in ${msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-[7px] font-bold">W</span>
                      </div>
                      <span className="text-[11px] text-[#4b5563]">Agent · {formatTime(msg.timestamp)}</span>
                    </div>
                  )}
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'bg-[#161b27] text-[#c8ccd6] border border-[#1e2733] rounded-tl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="flex justify-end mt-1">
                      <span className="text-[11px] text-[#4b5563]">{formatTime(msg.timestamp)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isGenerating && (
              <div className="flex justify-start fade-in">
                <div className="max-w-[85%]">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-[7px] font-bold">W</span>
                    </div>
                    <span className="text-[11px] text-[#4b5563]">Agent · generating...</span>
                  </div>
                  <div className="px-3.5 py-3 rounded-2xl rounded-tl-sm bg-[#161b27] border border-[#1e2733] flex items-center gap-1.5">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-blue-400"
                        style={{ animation: `pulse-dot 1.2s ${delay}s infinite` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {!isGenerating && (
            <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto scrollbar-hide">
              {SUGGESTIONS.slice(0, 3).map((s, i) => (
                <button
                  key={i}
                  onClick={() => setInputValue(s)}
                  className="flex-shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-[#161b27] border border-[#1e2733] text-[#8b95a7] hover:text-[#e8eaf0] hover:border-[#2563eb]/40 transition-all whitespace-nowrap"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="px-4 pb-4 pt-2">
            <div className="relative flex items-end gap-2 bg-[#161b27] border border-[#1e2733] rounded-xl overflow-hidden focus-within:border-[#2563eb]/50 transition-colors">
              <textarea
                id="chat-input"
                ref={inputRef}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe what to build..."
                disabled={isGenerating}
                rows={1}
                className="flex-1 px-3.5 py-3 bg-transparent text-sm text-[#e8eaf0] placeholder-[#4b5563] outline-none resize-none leading-relaxed"
                style={{ maxHeight: '120px' }}
              />
              <button
                id="send-btn"
                onClick={handleSend}
                disabled={!inputValue.trim() || isGenerating}
                className={`m-2 p-2 rounded-lg transition-all ${
                  inputValue.trim() && !isGenerating
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                    : 'bg-[#1e2433] text-[#4b5563] cursor-not-allowed'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M12 7L2 2L4.5 7L2 12L12 7Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[10px] text-[#4b5563]">↵ Send · ⇧↵ New line</span>
              <span className="text-[10px] text-[#4b5563]">Gemini 2.5 Flash</span>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 flex flex-col bg-[#0a0b0e] min-w-0">
          {/* Preview Tabs */}
          <div className="flex items-center px-4 border-b border-[#1e2733] bg-[#0f1117] flex-shrink-0">
            <div className="flex items-center gap-1 py-2">
              {['preview', 'code', 'console'].map(tab => (
                <button
                  key={tab}
                  id={`tab-${tab}`}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs rounded-md capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-[#1e2433] text-[#e8eaf0] font-medium'
                      : 'text-[#4b5563] hover:text-[#8b95a7]'
                  }`}
                >
                  {tab === 'preview' && '👁 '}
                  {tab === 'code' && '< '}
                  {tab === 'console' && '⬛ '}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              {/* Fake URL bar */}
              <div className="flex items-center gap-1.5 bg-[#161b27] border border-[#1e2733] rounded-md px-2.5 py-1 text-xs text-[#4b5563]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                <span>localhost:5173</span>
              </div>
              <button className="p-1.5 text-[#4b5563] hover:text-[#8b95a7] transition-colors rounded-md hover:bg-[#1e2433]" title="Refresh">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M10 6A4 4 0 1 1 6 2M6 2L8 4M6 2L4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="p-1.5 text-[#4b5563] hover:text-[#8b95a7] transition-colors rounded-md hover:bg-[#1e2433]" title="Open in new tab">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M5 2H2v8h8V7M7 1h4v4M10 2L6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-hidden relative">
            {activeTab === 'preview' && (
              <div className="h-full">
                {isGenerating && (
                  <div className="absolute inset-0 bg-[#0a0b0e]/60 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-blue-400 border-t-transparent spinner" />
                      <span className="text-sm text-[#8b95a7]">{statusMessage}</span>
                    </div>
                  </div>
                )}
                <iframe
                  id="preview-iframe"
                  srcDoc={previewHtml}
                  title="Live Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts"
                />
              </div>
            )}

            {activeTab === 'code' && (
              <div className="h-full overflow-auto p-4 font-mono text-xs bg-[#0f1117]">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#1e2733]">
                  <span className="text-[#4b5563]">App.jsx</span>
                  <button className="ml-auto text-[11px] text-[#4b5563] hover:text-[#8b95a7] px-2 py-0.5 rounded border border-[#1e2733] transition-colors">
                    Copy
                  </button>
                </div>
                <pre className="text-[#c8ccd6] leading-relaxed whitespace-pre-wrap text-[11px]">{`import React from 'react';

// Website Design Agent - Generated Component
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4
          flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br
              from-blue-500 to-purple-600" />
            <span className="font-semibold">AgentFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <button className="bg-blue-600 hover:bg-blue-500 px-4
              py-2 rounded-lg transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Build Websites with{' '}
          <span className="text-transparent bg-clip-text
            bg-gradient-to-r from-blue-400 to-purple-400">
            AI Intelligence
          </span>
        </h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
          Describe your vision, and our AI generates
          production-ready code instantly.
        </p>
        <button className="bg-blue-600 hover:bg-blue-500 px-8 py-3
          rounded-xl font-medium transition-all hover:scale-105">
          Start Building Free
        </button>
      </main>
    </div>
  );
}`}</pre>
              </div>
            )}

            {activeTab === 'console' && (
              <div className="h-full overflow-auto p-4 font-mono text-xs bg-[#0a0b0e]">
                <div className="space-y-1.5">
                  {[
                    { type: 'info', msg: 'Vite dev server running at http://localhost:5173' },
                    { type: 'success', msg: '✓ React 19.2.7 loaded successfully' },
                    { type: 'success', msg: '✓ Tailwind CSS v4 compiled — 142ms' },
                    { type: 'info', msg: 'Hot Module Replacement (HMR) enabled' },
                    { type: 'info', msg: 'Gemini API connection established' },
                    { type: 'success', msg: '✓ Website Design Agent ready' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className={`text-[10px] mt-0.5 ${
                        log.type === 'success' ? 'text-[#10b981]'
                        : log.type === 'error' ? 'text-[#ef4444]'
                        : log.type === 'warn' ? 'text-[#f59e0b]'
                        : 'text-[#4b5563]'
                      }`}>
                        {log.type === 'success' ? '●' : log.type === 'error' ? '✕' : '○'}
                      </span>
                      <span className={`${
                        log.type === 'success' ? 'text-[#10b981]'
                        : log.type === 'error' ? 'text-[#ef4444]'
                        : 'text-[#8b95a7]'
                      }`}>{log.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom status bar */}
          <div className="flex items-center justify-between px-4 py-1.5 border-t border-[#1e2733] bg-[#0f1117] text-[10px] text-[#4b5563]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${isGenerating ? 'bg-amber-400' : 'bg-[#10b981]'}`} />
                <span>{isGenerating ? statusMessage : 'Ready'}</span>
              </div>
              <span>·</span>
              <span>React 19 · Tailwind v4 · Vite 8</span>
            </div>
            <div className="flex items-center gap-3">
              <span>UTF-8</span>
              <span>·</span>
              <span>Spaces: 2</span>
              <span>·</span>
              <span>JSX</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
