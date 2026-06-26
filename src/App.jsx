import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import PreviewPanel from './components/PreviewPanel';
import SettingsModal from './components/SettingsModal';

// Helper: initial files content template definitions
const INITIAL_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AgentFlow SaaS Landing Page</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Outfit', sans-serif;
    }
  </style>
</head>
<body class="bg-[#0f172a] text-white min-h-screen">
  <div id="root"></div>
</body>
</html>`;


const INITIAL_HEADER = `import React from 'react';

export default function Header() {
  return (
    <nav className="border-b border-white/5 bg-slate-950/65 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/10">
            A
          </div>
          <span className="font-semibold text-white tracking-wide">AgentFlow</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-400 font-medium">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <a href="#" className="hover:text-white transition-colors">Docs</a>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/25">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}`;


const INITIAL_PACKAGE = `{
  "name": "agentflow-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "vite": "^6.0.0"
  }
}`;

const INITIAL_VITE = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});`;

// Preview iframe source generator for each state
const getPreviewHtml = (state, theme = 'blue') => {
  const isPurple = theme === 'purple';
  const brandGradient = isPurple 
    ? 'from-purple-400 via-indigo-400 to-pink-400' 
    : 'from-blue-400 via-indigo-400 to-purple-400';
  const buttonBg = isPurple ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/25' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/25';
  const tagText = isPurple ? 'text-purple-400' : 'text-blue-400';
  const tagBg = isPurple ? 'bg-purple-500/10 border-purple-500/20' : 'bg-blue-500/10 border-blue-500/20';
  const logoBg = isPurple ? 'from-purple-500 to-pink-600' : 'from-blue-500 to-indigo-600';

  if (state === 'dashboard') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AgentFlow Admin Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Outfit', sans-serif; background-color: #090d16; }
  </style>
</head>
<body class="text-slate-100 flex min-h-screen">
  <!-- Sidebar -->
  <aside class="w-64 bg-[#0f1524] border-r border-slate-800 flex flex-col justify-between">
    <div>
      <div class="p-6 flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br ${logoBg} flex items-center justify-center font-bold text-white">D</div>
        <span class="font-bold text-white text-lg">AgentFlow</span>
      </div>
      <nav class="px-4 py-2 space-y-1">
        <a href="#" class="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/15 font-semibold text-sm">📊 Dashboard</a>
        <a href="#" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 font-semibold text-sm transition-all">📂 Projects</a>
        <a href="#" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 font-semibold text-sm transition-all">⚙ Settings</a>
      </nav>
    </div>
    <div class="p-4 border-t border-slate-850 flex items-center gap-3">
      <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-semibold text-sm text-slate-300">JS</div>
      <div>
        <div class="text-xs font-bold text-white">Jaithra Sarma</div>
        <div class="text-[10px] text-slate-500 font-medium">Administrator</div>
      </div>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-grow p-8 space-y-8 overflow-y-auto">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-white">Welcome Back, Jaithra</h1>
        <p class="text-slate-500 text-sm">Monitor compilation tasks and server environments.</p>
      </div>
      <button class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/10 transition-all">+ Launch Deploy</button>
    </div>

    <!-- Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-[#0f1524] border border-slate-800 p-6 rounded-2xl">
        <div class="text-slate-500 text-xs font-bold uppercase tracking-wider">Project Deployments</div>
        <div class="text-3xl font-bold mt-2 text-white">12</div>
        <div class="text-xs text-emerald-400 mt-1 font-semibold">▲ 24% this week</div>
      </div>
      <div class="bg-[#0f1524] border border-slate-800 p-6 rounded-2xl">
        <div class="text-slate-500 text-xs font-bold uppercase tracking-wider">Gemini API Invocations</div>
        <div class="text-3xl font-bold mt-2 text-white">4,812</div>
        <div class="text-xs text-emerald-400 mt-1 font-semibold">▲ 8.1% average speed</div>
      </div>
      <div class="bg-[#0f1524] border border-slate-800 p-6 rounded-2xl">
        <div class="text-slate-500 text-xs font-bold uppercase tracking-wider">Network Success Rate</div>
        <div class="text-3xl font-bold mt-2 text-white">99.98%</div>
        <div class="text-xs text-slate-500 mt-1 font-semibold">Local HMR Port active</div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-[#0f1524] border border-slate-800 rounded-2xl overflow-hidden">
      <div class="p-6 border-b border-slate-850 flex justify-between items-center">
        <h3 class="font-bold text-white">Recent HMR Builds</h3>
        <span class="text-xs text-blue-400 font-semibold cursor-pointer">View All</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-400">
          <thead class="bg-slate-900/50 text-xs uppercase font-bold text-slate-500 border-b border-slate-850">
            <tr>
              <th class="p-4">Target Component</th>
              <th class="p-4">Compiled Port</th>
              <th class="p-4">Time</th>
              <th class="p-4">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-850">
            <tr>
              <td class="p-4 font-semibold text-white">Hero.jsx</td>
              <td class="p-4 font-mono text-xs">localhost:5173</td>
              <td class="p-4">12 mins ago</td>
              <td class="p-4"><span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">Passed</span></td>
            </tr>
            <tr>
              <td class="p-4 font-semibold text-white">Pricing.jsx</td>
              <td class="p-4 font-mono text-xs">localhost:5173</td>
              <td class="p-4">32 mins ago</td>
              <td class="p-4"><span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">Passed</span></td>
            </tr>
            <tr>
              <td class="p-4 font-semibold text-white">Header.jsx</td>
              <td class="p-4 font-mono text-xs">localhost:5173</td>
              <td class="p-4">1 hour ago</td>
              <td class="p-4"><span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">Passed</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</body>
</html>`;
  }

  // Determine subcomponents rendering
  const showPricing = state === 'pricing' || state === 'pricing_purple' || state === 'pricing_testimonials';
  const showTestimonials = state === 'testimonials' || state === 'pricing_testimonials';

  const pricingSection = showPricing ? `
  <!-- Pricing Section -->
  <section class="py-20 border-t border-slate-800 bg-slate-900/10 section-block">
    <div class="max-w-5xl mx-auto px-6 text-center">
      <h2 class="text-3xl font-extrabold tracking-tight text-white mb-4">Flexible Pricing Tiers</h2>
      <p class="text-slate-400 max-w-md mx-auto mb-10 text-sm">Unlock full scaling code generations with transparent BYOK billing options.</p>
      
      <!-- Toggle Switched widget -->
      <div class="flex items-center justify-center gap-3 mb-12">
        <span class="text-xs font-bold text-slate-400">Monthly Billing</span>
        <button id="billing-toggle" class="w-11 h-6 bg-slate-800 border border-slate-700 rounded-full p-0.5 relative transition-colors">
          <div id="toggle-dot" class="w-4.5 h-4.5 bg-blue-500 rounded-full transition-transform duration-200" style="transform: translateX(0px);"></div>
        </button>
        <span class="text-xs font-bold text-blue-400">Annual Billing (Save 20%)</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Card 1 -->
        <div class="bg-slate-950/40 border border-slate-800 hover:border-slate-700 p-8 rounded-2xl text-left flex flex-col justify-between transition-all">
          <div>
            <h3 class="font-bold text-base text-white">Starter</h3>
            <div class="text-2xl font-black mt-4 text-white">Free</div>
            <p class="text-slate-500 text-xs mt-2 leading-relaxed">Bring your own Google Gemini API keys and test setups locally.</p>
            <ul class="space-y-3.5 mt-8 text-xs text-slate-400">
              <li class="flex items-center gap-2"><span class="text-blue-500">✓</span> Basic UI Generation</li>
              <li class="flex items-center gap-2"><span class="text-blue-500">✓</span> Local Iframe Previews</li>
              <li class="flex items-center gap-2"><span class="text-blue-500">✓</span> Export Code Files</li>
            </ul>
          </div>
          <button class="w-full mt-8 py-3 border border-slate-800 hover:bg-white/5 text-white rounded-xl text-xs font-bold transition-all">Get Started</button>
        </div>

        <!-- Card 2 -->
        <div class="bg-slate-950 border-2 border-blue-500/40 p-8 rounded-2xl relative text-left flex flex-col justify-between shadow-xl shadow-blue-500/5 transition-all">
          <span class="absolute top-0 right-6 -translate-y-1/2 bg-blue-600 text-white text-[9px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">Popular</span>
          <div>
            <h3 class="font-bold text-base text-white">Professional</h3>
            <div class="text-3xl font-black mt-4 text-white"><span class="price-value">$29</span><span class="text-xs text-slate-500 font-normal billing-cycle">/mo</span></div>
            <p class="text-slate-500 text-xs mt-2 leading-relaxed">Full Dyad local desktop integration with automatic pipeline routing.</p>
            <ul class="space-y-3.5 mt-8 text-xs text-slate-400">
              <li class="flex items-center gap-2"><span class="text-blue-500">✓</span> Unlimited Design Layouts</li>
              <li class="flex items-center gap-2"><span class="text-blue-500">✓</span> Interactive Sandboxes</li>
              <li class="flex items-center gap-2"><span class="text-blue-500">✓</span> Custom Sync Modules</li>
              <li class="flex items-center gap-2"><span class="text-blue-500">✓</span> Priority API support</li>
            </ul>
          </div>
          <button class="w-full mt-8 py-3 ${buttonBg} text-white rounded-xl text-xs font-bold transition-all shadow-lg">Upgrade Now</button>
        </div>

        <!-- Card 3 -->
        <div class="bg-slate-950/40 border border-slate-800 hover:border-slate-700 p-8 rounded-2xl text-left flex flex-col justify-between transition-all">
          <div>
            <h3 class="font-bold text-base text-white">Enterprise</h3>
            <div class="text-2xl font-black mt-4 text-white font-black">Custom</div>
            <p class="text-slate-500 text-xs mt-2 leading-relaxed">Scale automated observing test runners across team repositories.</p>
            <ul class="space-y-3.5 mt-8 text-xs text-slate-400">
              <li class="flex items-center gap-2"><span class="text-blue-500">✓</span> Custom observers</li>
              <li class="flex items-center gap-2"><span class="text-blue-500">✓</span> SOC2 credentials</li>
              <li class="flex items-center gap-2"><span class="text-blue-500">✓</span> Dedicated runner VM</li>
            </ul>
          </div>
          <button class="w-full mt-8 py-3 border border-slate-800 hover:bg-white/5 text-white rounded-xl text-xs font-bold transition-all">Contact Sales</button>
        </div>
      </div>
    </div>
  </section>` : '';

  const testimonialsSection = showTestimonials ? `
  <!-- FAQ Accordion & Testimonials -->
  <section class="py-20 border-t border-slate-800 section-block">
    <div class="max-w-4xl mx-auto px-6">
      <h2 class="text-3xl font-extrabold tracking-tight text-white mb-4 text-center">Frequently Asked Questions</h2>
      <p class="text-slate-400 text-center max-w-sm mx-auto mb-12 text-sm">Find quick answers to common queries about local orchestrator integrations.</p>
      
      <!-- Accordion Grid -->
      <div class="space-y-4 max-w-2xl mx-auto">
        <!-- FAQ 1 -->
        <div class="faq-item bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden transition-all">
          <button class="faq-question w-full px-5 py-4 text-left text-xs font-bold text-white flex justify-between items-center outline-none">
            <span>How does the BYOK (Bring Your Own Key) architecture work?</span>
            <span class="faq-chevron text-[#4b5563] transition-transform duration-200">▼</span>
          </button>
          <div class="faq-answer hidden px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-850 pt-2">
            The BYOK mechanism stores credentials locally in environment files (\`.env.local\`). It sends prompts directly to your Gemini API endpoints, guaranteeing zero cloud storage of billing tokens.
          </div>
        </div>

        <!-- FAQ 2 -->
        <div class="faq-item bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden transition-all">
          <button class="faq-question w-full px-5 py-4 text-left text-xs font-bold text-white flex justify-between items-center outline-none">
            <span>Can I export generated workspaces?</span>
            <span class="faq-chevron text-[#4b5563] transition-transform duration-200">▼</span>
          </button>
          <div class="faq-answer hidden px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-850 pt-2">
            Yes! Clicking the "Export" button packages all JSX components, HTML indices, and CSS files into a download package locally.
          </div>
        </div>

        <!-- FAQ 3 -->
        <div class="faq-item bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden transition-all">
          <button class="faq-question w-full px-5 py-4 text-left text-xs font-bold text-white flex justify-between items-center outline-none">
            <span>Does it support Tailwind CSS v4?</span>
            <span class="faq-chevron text-[#4b5563] transition-transform duration-200">▼</span>
          </button>
          <div class="faq-answer hidden px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-850 pt-2">
            Fully. All compilation targets are compiled for Tailwind CSS v4, supporting CSS-only imports and optimized utility flags.
          </div>
        </div>
      </div>
    </div>
  </section>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AgentFlow SaaS Landing Page</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { 
      font-family: 'Outfit', sans-serif; 
      background-color: #020617; 
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    /* Light Theme mappings */
    body.light-theme {
      background-color: #f8fafc;
      color: #0f172a;
    }
    body.light-theme nav {
      background-color: rgba(248, 250, 252, 0.85);
      border-bottom-color: rgba(15, 23, 42, 0.08);
    }
    body.light-theme nav span, body.light-theme nav a {
      color: #0f172a;
    }
    body.light-theme nav a:hover {
      color: #3b82f6;
    }
    body.light-theme h1, body.light-theme h2, body.light-theme h3 {
      color: #0f172a;
    }
    body.light-theme p, body.light-theme li {
      color: #334155;
    }
    body.light-theme .bg-slate-950, body.light-theme .bg-slate-950\\/40, body.light-theme .faq-item {
      background-color: #ffffff;
      border-color: rgba(15, 23, 42, 0.08);
    }
    body.light-theme .section-block {
      background-color: #f1f5f9/30;
      border-top-color: rgba(15, 23, 42, 0.08);
    }
    body.light-theme .border-white\\/5, body.light-theme .border-slate-800, body.light-theme border-t {
      border-color: rgba(15, 23, 42, 0.08);
    }
    body.light-theme .text-slate-400 {
      color: #475569;
    }
  </style>
</head>
<body class="text-slate-100 min-h-screen flex flex-col justify-between bg-slate-950 relative overflow-x-hidden">
  <!-- Glowing Background Blobs -->
  <div class="absolute top-20 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl mix-blend-screen animate-pulse pointer-events-none"></div>
  <div class="absolute top-40 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl mix-blend-screen animate-pulse pointer-events-none" style="animation-delay: 2s"></div>

  <!-- Navigation Header -->
  <nav class="border-b border-white/5 bg-slate-950/65 backdrop-blur-md sticky top-0 z-50 transition-colors">
    <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br ${logoBg} flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/10">A</div>
        <span class="font-bold text-white tracking-wide text-sm">AgentFlow</span>
      </div>
      <div class="flex items-center gap-6 text-xs text-slate-400 font-semibold">
        <a href="#" class="hover:text-white transition-colors">Features</a>
        <a href="#" class="hover:text-white transition-colors">Pricing</a>
        <a href="#" class="hover:text-white transition-colors">FAQs</a>
        
        <!-- Theme Toggle button -->
        <button id="theme-toggle" class="p-1 rounded-md text-slate-400 hover:text-white transition-colors outline-none cursor-pointer">
          <svg id="moon-icon" class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <svg id="sun-icon" class="w-4.5 h-4.5 hidden text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m2.828 0l-.707-.707m12.728-12.728l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        </button>

        <button class="${buttonBg} text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg">Get Started</button>
      </div>
    </div>
  </nav>

  <!-- Hero Content -->
  <main class="flex-grow max-w-4xl mx-auto px-6 py-20 text-center relative z-10">
    <div class="inline-flex items-center gap-2 ${tagBg} ${tagText} text-[10px] px-3.5 py-1.5 rounded-full mb-8 font-extrabold uppercase tracking-wider">
      <span class="w-1.5 h-1.5 rounded-full ${isPurple ? 'bg-purple-400' : 'bg-blue-400'} animate-pulse"></span>
      AI-Powered Interface Generation
    </div>
    <h1 class="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
      Build Professional Frontends<br/>
      <span class="text-transparent bg-clip-text bg-gradient-to-r ${brandGradient}">
        Powered by Gemini AI
      </span>
    </h1>
    <p class="text-slate-400 text-sm md:text-base max-w-lg mx-auto mb-10 leading-relaxed font-normal">
      Describe your dashboard, page, or UI interface, and our AI development agent compiles clean, production-ready React components with Tailwind CSS instantly.
    </p>
    <div class="flex items-center gap-4 justify-center">
      <button class="${buttonBg} text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] shadow-lg">Launch Agent</button>
      <button class="border border-white/10 hover:bg-white/5 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all">Learn More</button>
    </div>

    <!-- Product Demo Mockup Runner Widget (Nested Loop) -->
    <div class="mt-20 max-w-2xl mx-auto bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-left relative shadow-2xl backdrop-blur-md">
      <div class="flex items-center gap-1.5 mb-4 select-none">
        <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
        <span class="text-[10px] font-bold text-slate-500 ml-2">agentflow-compiler-mockup.sh</span>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3">
        <input 
          type="text" 
          value="Build me a modern SaaS landing page with pricing tiers" 
          readonly 
          class="flex-1 bg-slate-950 border border-slate-850 px-3.5 py-2.5 rounded-xl text-xs text-slate-300 font-mono outline-none"
        />
        <button 
          id="run-demo-btn" 
          class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all select-none shadow-lg cursor-pointer"
        >
          Run Demo
        </button>
      </div>

      <!-- Compiling progress -->
      <div id="demo-status" class="hidden mt-4 space-y-2.5">
        <div class="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span id="demo-output">Initializing compiler nodes...</span>
        </div>
        <div class="h-1 bg-slate-950 rounded-full overflow-hidden">
          <div id="demo-bar" class="h-full bg-blue-500 transition-all duration-300" style="width: 0%;"></div>
        </div>
      </div>
    </div>
  </main>

  <!-- Pricing -->
  ${pricingSection}

  <!-- FAQs -->
  ${testimonialsSection}

  <!-- Footer -->
  <footer class="border-t border-slate-800 bg-slate-950 py-8 transition-colors">
    <div class="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-slate-500 text-[10px] font-semibold gap-4 select-none">
      <span>&copy; ${new Date().getFullYear()} AgentFlow Inc. All rights reserved.</span>
      <div class="flex gap-6">
        <a href="#" class="hover:text-slate-300 transition-colors">Privacy</a>
        <a href="#" class="hover:text-slate-300 transition-colors">Terms</a>
        <a href="#" class="hover:text-slate-300 transition-colors">Contact Support</a>
      </div>
    </div>
  </footer>

  <!-- Dynamic Actions Script -->
  <script>
    // 1. Billing Switcher
    const billingToggle = document.getElementById('billing-toggle');
    const toggleDot = document.getElementById('toggle-dot');
    const priceValues = document.querySelectorAll('.price-value');
    const billingCycles = document.querySelectorAll('.billing-cycle');

    let isAnnually = false;

    if (billingToggle) {
      billingToggle.addEventListener('click', () => {
        isAnnually = !isAnnually;
        if (isAnnually) {
          toggleDot.style.transform = 'translateX(1.25rem)';
          if (priceValues[0]) priceValues[0].textContent = '$23';
          billingCycles.forEach(c => c.textContent = '/mo, billed annually');
        } else {
          toggleDot.style.transform = 'translateX(0px)';
          if (priceValues[0]) priceValues[0].textContent = '$29';
          billingCycles.forEach(c => c.textContent = '/mo');
        }
      });
    }

    // 2. Light/Dark Theme Switcher
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        if (isLight) {
          sunIcon.classList.remove('hidden');
          moonIcon.classList.add('hidden');
        } else {
          sunIcon.classList.add('hidden');
          moonIcon.classList.remove('hidden');
        }
      });
    }

    // 3. FAQ Accordion Collapsibles
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(q => {
      q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const ans = item.querySelector('.faq-answer');
        const chev = item.querySelector('.faq-chevron');
        const isClosed = ans.classList.contains('hidden');

        // Close all first for clean single accordion behavior
        document.querySelectorAll('.faq-answer').forEach(a => a.classList.add('hidden'));
        document.querySelectorAll('.faq-chevron').forEach(c => c.style.transform = 'rotate(0deg)');

        if (isClosed) {
          ans.classList.remove('hidden');
          chev.style.transform = 'rotate(180deg)';
        }
      });
    });

    // 4. Product compiler mockup demo
    const runDemoBtn = document.getElementById('run-demo-btn');
    const demoStatus = document.getElementById('demo-status');
    const demoBar = document.getElementById('demo-bar');
    const demoOutput = document.getElementById('demo-output');

    if (runDemoBtn) {
      runDemoBtn.addEventListener('click', () => {
        runDemoBtn.disabled = true;
        demoStatus.classList.remove('hidden');
        demoBar.style.width = '0%';
        demoOutput.textContent = 'Initializing virtual bundler nodes...';
        
        let progress = 0;
        const interval = setInterval(() => {
          progress += 25;
          demoBar.style.width = progress + '%';
          if (progress === 25) demoOutput.textContent = 'Analyzing syntax declarations...';
          if (progress === 50) demoOutput.textContent = 'Bundling Tailwind utility classes...';
          if (progress === 75) demoOutput.textContent = 'Compiling hot reload assets...';
          
          if (progress >= 100) {
            clearInterval(interval);
            demoOutput.innerHTML = '<span class="text-emerald-400 font-bold">✓ Project built live in 12ms!</span>';
            runDemoBtn.disabled = false;
          }
        }, 300);
      });
    }
  </script>
</body>
</html>`;
};

// Initial state logs definitions
const INITIAL_LOGS = [
  { id: 1, type: 'info', msg: 'Starting local development pipeline...', timestamp: Date.now() - 3000 },
  { id: 2, type: 'info', msg: 'Loading Dyad config settings...', timestamp: Date.now() - 2500 },
  { id: 3, type: 'success', msg: '✓ Connected to Local Dyad Orchestrator Client on port 8080', timestamp: Date.now() - 2400 },
  { id: 4, type: 'success', msg: '✓ Gemini BYOK Key authorized (VITE_GEMINI_API_KEY environment variable detected)', timestamp: Date.now() - 2000 },
  { id: 5, type: 'info', msg: 'Vite v6.0.0 dev server active at http://localhost:5173/', timestamp: Date.now() - 1500 },
  { id: 6, type: 'success', msg: '✓ Compiled Tailwind CSS v4.0.0 and React 19 templates dynamically (284ms)', timestamp: Date.now() - 1200 },
  { id: 7, type: 'info', msg: 'Hot Module Replacement (HMR) pipeline connected and listening...', timestamp: Date.now() - 1000 },
];

export default function App() {
  // Config state (read VITE_GEMINI_API_KEY from environment)
  const [config, setConfig] = useState({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    dyadPort: '8080',
    model: 'gemini-2.5-flash',
    dyadStatus: 'connected'
  });

  const [activeTab, setActiveTab] = useState('preview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Layout sizing & maximizing states
  const [explorerWidth, setExplorerWidth] = useState(200);
  const [chatWidth, setChatWidth] = useState(380);
  const [isDraggingExplorer, setIsDraggingExplorer] = useState(false);
  const [isDraggingChat, setIsDraggingChat] = useState(false);
  const [maximizedPanel, setMaximizedPanel] = useState(null);

  // Telemetry compilation speed stats
  const [compileTimes, setCompileTimes] = useState([120, 150, 110, 142, 128]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingExplorer) {
        const newWidth = Math.max(150, Math.min(350, e.clientX));
        setExplorerWidth(newWidth);
      }
      if (isDraggingChat) {
        const offset = sidebarOpen ? explorerWidth : 0;
        const newChatWidth = e.clientX - offset;
        setChatWidth(Math.max(260, Math.min(600, newChatWidth)));
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
  }, [isDraggingExplorer, isDraggingChat, explorerWidth, sidebarOpen]);


  // Chat message feed
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hello Jaithra! I'm your Website Design Development Agent. I am connected locally via Dyad. I can generate production-grade React interfaces with Tailwind CSS.\n\nType your instructions in chat, or use one of the quick suggestions to modify this landing page workspace.",
      timestamp: new Date(Date.now() - 180000)
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  // Generation status tracking
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Ready');
  const [projectState, setProjectState] = useState('initial'); // 'initial' | 'pricing' | 'purple' | 'testimonials' | 'dashboard'
  const [theme, setTheme] = useState('blue'); // 'blue' | 'purple'

  // Logs stream state
  const [logs, setLogs] = useState(INITIAL_LOGS);

  // Deploy simulation
  const [isDeploying, setIsDeploying] = useState(false);

  // Virtual Files System tree state
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({ 3: true, 7: true });

  const addLog = (type, msg) => {
    setLogs(prev => [
      ...prev,
      { id: prev.length + 1, type, msg, timestamp: Date.now() }
    ]);
  };

  // Sync virtual files contents based on prompt modifications
  const updateVirtualFiles = (stateName, activeTheme) => {
    const isPurpleTheme = activeTheme === 'purple';
    
    // Pricing component code
    const pricingCode = `import React from 'react';

export default function Pricing() {
  return (
    <section className="py-20 border-t border-white/5 bg-slate-900/30">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Flexible Pricing Tiers</h2>
        <p className="text-slate-400 max-w-md mx-auto mb-16 text-sm">
          Unlock the full power of AI generation workflows with transparent configurations.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-950 border border-white/5 p-8 rounded-2xl text-left">
            <h3 className="font-semibold text-lg text-white">Starter</h3>
            <div className="text-2xl font-bold mt-4 text-white">Free</div>
            <button className="w-full mt-8 py-2.5 border border-white/10 hover:bg-white/5 text-white rounded-xl text-xs font-semibold">
              Get Started
            </button>
          </div>
          <div className="bg-slate-950 border-2 border-${isPurpleTheme ? 'purple' : 'blue'}-500/40 p-8 rounded-2xl text-left relative shadow-xl">
            <h3 className="font-semibold text-lg text-white">Professional</h3>
            <div className="text-2xl font-bold mt-4 text-white">$29/mo</div>
            <button className="w-full mt-8 py-2.5 bg-${isPurpleTheme ? 'purple' : 'blue'}-600 hover:bg-${isPurpleTheme ? 'purple' : 'blue'}-500 text-white rounded-xl text-xs font-semibold">
              Upgrade Now
            </button>
          </div>
          <div className="bg-slate-950 border border-white/5 p-8 rounded-2xl text-left">
            <h3 className="font-semibold text-lg text-white">Enterprise</h3>
            <div className="text-2xl font-bold mt-4">Custom</div>
            <button className="w-full mt-8 py-2.5 border border-white/10 hover:bg-white/5 text-white rounded-xl text-xs font-semibold">
              Talk to Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}`;

    // Testimonials component code
    const testimonialsCode = `import React from 'react';

export default function Testimonials() {
  return (
    <section className="py-20 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Loved by AI Engineers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl text-left">
            <div className="text-xs font-bold text-white mb-2">Sarah Reynolds</div>
            <p className="text-slate-400 text-xs">"The speed of compiling components is incredible!"</p>
          </div>
          <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl text-left">
            <div className="text-xs font-bold text-white mb-2">Marcus Lee</div>
            <p className="text-slate-400 text-xs">"Client-side ZIP export makes bootstrapping project simple."</p>
          </div>
          <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl text-left">
            <div className="text-xs font-bold text-white mb-2">Tanya Devry</div>
            <p className="text-slate-400 text-xs">"Dynamic updates load in seconds."</p>
          </div>
        </div>
      </div>
    </section>
  );
}`;

    // Generate specific CSS variables based on active theme
    const activeCss = `@import "tailwindcss";

:root {
  --primary: ${isPurpleTheme ? '#7c3aed' : '#2563eb'};
  --primary-glow: ${isPurpleTheme ? 'rgba(124, 58, 237, 0.15)' : 'rgba(37, 99, 235, 0.15)'};
}

body {
  background-color: #020617;
  color: #f8fafc;
}
`;

    // Hero Component (styled according to active theme)
    const activeHero = `import React from 'react';

export default function Hero() {
  return (
    <main className="flex-grow max-w-4xl mx-auto px-6 py-24 text-center">
      <div className="inline-flex items-center gap-2 bg-${isPurpleTheme ? 'purple' : 'blue'}-500/10 border border-${isPurpleTheme ? 'purple' : 'blue'}-500/20 text-${isPurpleTheme ? 'purple' : 'blue'}-400 text-xs px-3.5 py-1.5 rounded-full mb-8 font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-${isPurpleTheme ? 'purple' : 'blue'}-400 animate-pulse"></span>
        AI-Powered Interface Generation
      </div>
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
        Build Professional Frontends<br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-${isPurpleTheme ? 'purple' : 'blue'}-400 via-indigo-400 to-${isPurpleTheme ? 'pink' : 'purple'}-400">
          Powered by Gemini AI
        </span>
      </h1>
      <p className="text-slate-400 text-base max-w-xl mx-auto mb-10 leading-relaxed font-normal">
        Describe your dashboard, page, or UI interface, and our AI development agent compiles clean, production-ready React components with Tailwind CSS instantly.
      </p>
      <div className="flex items-center gap-4 justify-center">
        <button className="bg-${isPurpleTheme ? 'purple' : 'blue'}-600 hover:bg-${isPurpleTheme ? 'purple' : 'blue'}-500 text-white px-7 py-3 rounded-xl font-medium transition-all shadow-lg">
          Launch Agent
        </button>
      </div>
    </main>
  );
}`;

    // App Component imports and layouts
    let appImports = `import React from 'react';\nimport Header from './components/Header';\nimport Hero from './components/Hero';`;
    let appRenders = `<Header />\n      <Hero />`;

    const folderChildren = [
      { id: 4, name: 'Header.jsx', type: 'jsx', content: INITIAL_HEADER },
      { id: 5, name: 'Hero.jsx', type: 'jsx', content: activeHero }
    ];

    if (stateName === 'pricing' || stateName === 'pricing_purple' || stateName === 'pricing_testimonials') {
      appImports += `\nimport Pricing from './components/Pricing';`;
      appRenders += `\n      <Pricing />`;
      folderChildren.push({ id: 12, name: 'Pricing.jsx', type: 'jsx', content: pricingCode });
    }

    if (stateName === 'testimonials' || stateName === 'pricing_testimonials') {
      appImports += `\nimport Testimonials from './components/Testimonials';`;
      appRenders += `\n      <Testimonials />`;
      folderChildren.push({ id: 13, name: 'Testimonials.jsx', type: 'jsx', content: testimonialsCode });
    }

    appImports += `\nimport Footer from './components/Footer';`;
    appRenders += `\n      <Footer />`;

    const activeApp = `${appImports}\n\nexport default function App() {\n  return (\n    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">\n      ${appRenders}\n    </div>\n  );\n}`;

    const adminDashboardCode = `import React from 'react';
import Sidebar from './components/Sidebar';
import MainDashboard from './components/MainDashboard';

export default function App() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <MainDashboard />
    </div>
  );
}`;

    let appFileContent = activeApp;
    if (stateName === 'dashboard') {
      appFileContent = adminDashboardCode;
      folderChildren.push({ id: 14, name: 'Sidebar.jsx', type: 'jsx', content: `// Dashboard Sidebar Component Code` });
      folderChildren.push({ id: 15, name: 'MainDashboard.jsx', type: 'jsx', content: `// Dashboard Main Content Panel Code` });
    }

    const newFilesTree = [
      { id: 1, name: 'index.html', type: 'html', content: INITIAL_HTML },
      { id: 2, name: 'App.jsx', type: 'jsx', content: appFileContent },
      { 
        id: 3, 
        name: 'components/', 
        type: 'folder', 
        children: folderChildren
      },
      { 
        id: 7, 
        name: 'styles/', 
        type: 'folder', 
        children: [
          { id: 8, name: 'index.css', type: 'css', content: activeCss }
        ]
      },
      { id: 10, name: 'package.json', type: 'json', content: INITIAL_PACKAGE },
      { id: 11, name: 'vite.config.js', type: 'js', content: INITIAL_VITE }
    ];

    setFiles(newFilesTree);
    
    // Maintain active file binding
    if (activeFile) {
      const findActiveFile = (list) => {
        for (const f of list) {
          if (f.id === activeFile.id) return f;
          if (f.children) {
            const found = findActiveFile(f.children);
            if (found) return found;
          }
        }
        return null;
      };
      const synced = findActiveFile(newFilesTree);
      if (synced) setActiveFile(synced);
    } else {
      setActiveFile(newFilesTree[1]); // Default select App.jsx
    }
  };

  // Run on mount to seed virtual files
  useEffect(() => {
    updateVirtualFiles(projectState, theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleFolder = (id) => {
    setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectFile = (file) => {
    setActiveFile(file);
    setActiveTab('code');
  };

  // Compile Pipeline Simulator
  const triggerHmrBuild = (targetState, targetTheme) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setStatusMessage('Analyzing workspace instructions...');
    addLog('info', 'Executing compilation pipeline trigger...');

    const stages = [
      { progress: 20, status: 'Gemini generating updated React/JSX components...', delay: 500, log: 'Gemini GenAI completed component routing.' },
      { progress: 50, status: 'Validating environment variables & safety keys...', delay: 800, log: 'Environment security checks: Clean' },
      { progress: 75, status: 'Recompiling Tailwind CSS styles...', delay: 650, log: 'Tailwind HMR build completed.' },
      { progress: 90, status: 'Vite bundler packaging dev assets...', delay: 500, log: 'Vite compiled assets.' },
      { progress: 100, status: 'Syncing live viewport preview frame...', delay: 400, log: '✓ Hot Module Replacement (HMR) complete' }
    ];

    let currentStage = 0;
    const runStage = () => {
      if (currentStage >= stages.length) {
        setIsGenerating(false);
        setGenerationProgress(0);
        setStatusMessage('Ready');
        
        // Push final update
        setProjectState(targetState);
        setTheme(targetTheme);
        updateVirtualFiles(targetState, targetTheme);
        setCompileTimes(prev => [...prev.slice(1), Math.floor(Math.random() * 80) + 90]);
        
        addLog('success', '✓ Compiled and refreshed live development runner successfully');
        return;
      }

      const stage = stages[currentStage];
      setGenerationProgress(stage.progress);
      setStatusMessage(stage.status);
      addLog('info', stage.log);
      currentStage++;
      setTimeout(runStage, stage.delay);
    };

    setTimeout(runStage, 200);
  };

  const handleSendPrompt = (promptText = inputValue) => {
    if (!promptText.trim() || isGenerating) return;
    
    // Add user message
    const userMsg = {
      id: messages.length + 1,
      role: 'user',
      content: promptText.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Determine target updates
    const lower = promptText.toLowerCase();
    let targetState = projectState;
    let targetTheme = theme;
    let assistantReply = '';

    if (lower.includes('pric')) {
      if (theme === 'purple') {
        targetState = 'pricing_purple';
        assistantReply = "I've added a premium 3-tier pricing section utilizing purple gradients to match the active brand aesthetic.\n\n**Modifications:**\n- Added [components/Pricing.jsx]\n- Integrated `<Pricing />` in `App.jsx`\n- Compiled clean hover scaling effects\n\nPreview is updated live.";
      } else {
        targetState = 'pricing';
        assistantReply = "I've added a modern 3-tier pricing table to the SaaS landing page.\n\n**Modifications:**\n- Added [components/Pricing.jsx]\n- Modified `App.jsx` to render `<Pricing />`\n\nView the updated live preview on the right.";
      }
    } else if (lower.includes('purple') || lower.includes('color') || lower.includes('theme')) {
      targetTheme = 'purple';
      if (projectState === 'pricing') {
        targetState = 'pricing_purple';
      } else if (projectState === 'testimonials') {
        targetState = 'pricing_testimonials'; // Simple compound mapping
      }
      assistantReply = "Color scheme and branding accents updated to a sleek, modern Purple gradient.\n\n**Modifications:**\n- Updated index.css root CSS variables to violet hues\n- Refactored brand classes in [components/Hero.jsx]\n- Adjusted progress bar and accents\n\nTailwind has recompiled.";
    } else if (lower.includes('testimonial')) {
      if (projectState === 'pricing' || projectState === 'pricing_purple') {
        targetState = 'pricing_testimonials';
      } else {
        targetState = 'testimonials';
      }
      assistantReply = "Testimonial cards grid added to the workspace.\n\n**Modifications:**\n- Added [components/Testimonials.jsx]\n- Updates loaded into main viewport\n\nCheck out the layout structures in live preview.";
    } else if (lower.includes('dashboard') || lower.includes('admin')) {
      targetState = 'dashboard';
      assistantReply = "Fully interactive Admin Dashboard view layout generated.\n\n**Modifications:**\n- Overhauled App.jsx with static sidebar and grid blocks\n- Added stats monitors and recent HMR tables\n\nPreview is compiled.";
    } else {
      assistantReply = `I've analyzed your prompt: "${promptText}". The components have been validated, files compiled, and active Tailwind CSS hooks updated.\n\nInspect the updated files in the Code panel.`;
    }

    // Trigger AI response loading
    setTimeout(() => {
      triggerHmrBuild(targetState, targetTheme);
      
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          role: 'assistant',
          content: assistantReply,
          timestamp: new Date()
        }
      ]);
    }, 600);
  };

  // Export full workspace to ZIP using JSZip
  const handleExportZip = async () => {
    addLog('info', 'Compiling and packing workspace folders...');
    const zip = new JSZip();

    // Helper: recursively add virtual files to ZIP folder
    const addFilesToZip = (items, currentFolder = zip) => {
      items.forEach(item => {
        if (item.type === 'folder') {
          const subFolder = currentFolder.folder(item.name.replace('/', ''));
          if (item.children) {
            addFilesToZip(item.children, subFolder);
          }
        } else {
          currentFolder.file(item.name, item.content || '');
        }
      });
    };

    addFilesToZip(files);
    
    // Add additional readme and SOW documents to download
    zip.file('README.md', '# Generated React Workspace\nBuilt by Website Design Development Agent powered by Gemini.');

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `agentflow-project-${projectState}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      addLog('success', '✓ Workspace exported and downloaded successfully as ZIP archive');
    } catch (err) {
      console.error(err);
      addLog('error', `Failed to generate ZIP bundle: ${err.message}`);
    }
  };

  // Simulated Deploy Flow
  const handleDeploy = () => {
    setIsDeploying(true);
    addLog('info', 'Initializing deployment process to cloud environments...');
    setTimeout(() => {
      addLog('info', 'Running final code build tests...');
      setTimeout(() => {
        addLog('success', '✓ Build checks passed (Zero warnings)');
        setTimeout(() => {
          setIsDeploying(false);
          addLog('success', '✓ Application deployed live at https://agentflow-dev.web.app/');
          alert('Project deployed successfully to https://agentflow-dev.web.app/ (Simulated)');
        }, 1000);
      }, 800);
    }, 600);
  };

  return (
    <div className="flex flex-col h-screen bg-[#000000] text-[#f4f4f5] overflow-hidden">
      {/* Header navbar */}
      <Header
        isGenerating={isGenerating}
        statusMessage={statusMessage}
        generationProgress={generationProgress}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        config={config}
        onOpenSettings={() => setSettingsOpen(true)}
        onExport={handleExportZip}
        onDeploy={handleDeploy}
        isDeploying={isDeploying}
      />

      {/* Main Panel Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar explorer */}
        {sidebarOpen && (maximizedPanel === null || maximizedPanel === 'explorer') && (
          <div style={{ width: maximizedPanel === 'explorer' ? '100%' : explorerWidth }} className="h-full flex flex-col flex-shrink-0">
            <Sidebar
              files={files}
              activeFile={activeFile}
              onSelectFile={handleSelectFile}
              expandedFolders={expandedFolders}
              onToggleFolder={toggleFolder}
              onMaximize={() => setMaximizedPanel(maximizedPanel === 'explorer' ? null : 'explorer')}
              isMaximized={maximizedPanel === 'explorer'}
            />
          </div>
        )}

        {maximizedPanel === null && sidebarOpen && (
          <div 
            className={`resizer-gutter ${isDraggingExplorer ? 'dragging' : ''}`}
            onMouseDown={() => setIsDraggingExplorer(true)}
          />
        )}

        {/* Chat window */}
        {(maximizedPanel === null || maximizedPanel === 'chat') && (
          <div style={{ width: maximizedPanel === 'chat' ? '100%' : chatWidth }} className="h-full flex flex-col flex-shrink-0">
            <ChatPanel
              messages={messages}
              inputValue={inputValue}
              setInputValue={setInputValue}
              onSend={handleSendPrompt}
              isGenerating={isGenerating}
              suggestions={[
                'Add a pricing table',
                'Change color scheme to purple gradient',
                'Add a testimonials section',
                'Create a dashboard layout'
              ]}
              onSelectSuggestion={handleSendPrompt}
              config={config}
              onMaximize={() => setMaximizedPanel(maximizedPanel === 'chat' ? null : 'chat')}
              isMaximized={maximizedPanel === 'chat'}
            />
          </div>
        )}

        {maximizedPanel === null && (
          <div 
            className={`resizer-gutter ${isDraggingChat ? 'dragging' : ''}`}
            onMouseDown={() => setIsDraggingChat(true)}
          />
        )}

        {/* Live Preview Panel */}
        {(maximizedPanel === null || maximizedPanel === 'preview') && (
          <div className="flex-1 h-full min-w-0">
            <PreviewPanel
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isGenerating={isGenerating}
              statusMessage={statusMessage}
              previewHtml={getPreviewHtml(projectState, theme)}
              selectedFile={activeFile}
              logs={logs}
              onClearLogs={() => setLogs([])}
              onRefreshPreview={() => triggerHmrBuild(projectState, theme)}
              onMaximize={() => setMaximizedPanel(maximizedPanel === 'preview' ? null : 'preview')}
              isMaximized={maximizedPanel === 'preview'}
              compileTimes={compileTimes}
            />
          </div>
        )}
      </div>

      {/* Settings Dialog Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        config={config}
        onSave={(updatedConfig) => {
          setConfig(updatedConfig);
          addLog('success', `✓ Saved BYOK configuration settings (Active Model: ${updatedConfig.model})`);
        }}
      />
    </div>
  );
}
