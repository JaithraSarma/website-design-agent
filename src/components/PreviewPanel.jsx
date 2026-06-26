import React from 'react';
import { Eye, Code, Terminal, RotateCw, ExternalLink, ShieldCheck } from 'lucide-react';
import CodePanel from './CodePanel';
import ConsolePanel from './ConsolePanel';
import ErrorBoundary from './ErrorBoundary';

export default function PreviewPanel({ 
  activeTab, 
  setActiveTab, 
  isGenerating, 
  statusMessage, 
  previewHtml, 
  selectedFile, 
  logs,
  onClearLogs,
  onRefreshPreview
}) {
  return (
    <div className="flex-1 flex flex-col bg-[#0a0b0e] min-w-0 h-full">
      {/* Tabs Header bar */}
      <div className="flex items-center px-4 border-b border-[#1e2733] bg-[#0f1117]/50 flex-shrink-0 select-none">
        <div className="flex items-center gap-1.5 py-2">
          {[
            { id: 'preview', label: 'Preview', icon: <Eye className="w-3.5 h-3.5" /> },
            { id: 'code', label: 'Code Inspector', icon: <Code className="w-3.5 h-3.5" /> },
            { id: 'console', label: 'Console Stream', icon: <Terminal className="w-3.5 h-3.5" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs rounded-lg flex items-center gap-1.5 transition-all font-semibold cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#1e2433] text-[#e8eaf0] border border-[#1e2733]'
                  : 'text-[#4b5563] hover:text-[#8b95a7] border border-transparent'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Address Bar (Localhost details) */}
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#161b27] border border-[#1e2733] rounded-lg px-3 py-1 text-[10px] text-[#8b95a7] font-semibold">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span className="text-[#c8ccd6]">localhost:5173</span>
          </div>

          <button 
            onClick={onRefreshPreview}
            className="p-1.5 text-[#4b5563] hover:text-[#8b95a7] transition-colors rounded-lg hover:bg-[#161b27] border border-transparent hover:border-[#1e2733]" 
            title="Refresh Preview & Sync HMR"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          
          <button 
            className="p-1.5 text-[#4b5563] hover:text-[#8b95a7] transition-colors rounded-lg hover:bg-[#161b27] border border-transparent hover:border-[#1e2733]" 
            title="Open Sandbox in new tab (Simulated)"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Pane Content Viewports */}
      <div className="flex-1 overflow-hidden relative">
        <ErrorBoundary>
          {activeTab === 'preview' && (
            <div className="h-full relative bg-slate-900">
              {isGenerating && (
                <div className="absolute inset-0 bg-[#0a0b0e]/75 backdrop-blur-sm z-10 flex items-center justify-center transition-all duration-300">
                  <div className="flex flex-col items-center gap-3.5 bg-[#161b27]/85 px-6 py-5 rounded-2xl border border-blue-500/25 shadow-2xl glass-panel text-center">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin spinner" />
                    <div>
                      <span className="text-xs font-semibold text-[#e8eaf0] block">{statusMessage}</span>
                      <span className="text-[10px] text-[#4b5563] font-medium mt-0.5 block">HMR pipeline compiling...</span>
                    </div>
                  </div>
                </div>
              )}
              <iframe
                id="preview-iframe"
                srcDoc={previewHtml}
                title="Workspace Preview"
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts"
              />
            </div>
          )}

          {activeTab === 'code' && (
            <CodePanel selectedFile={selectedFile} />
          )}

          {activeTab === 'console' && (
            <ConsolePanel logs={logs} onClear={onClearLogs} />
          )}
        </ErrorBoundary>
      </div>

      {/* Bottom Status bar */}
      <div className="flex items-center justify-between px-4 py-1.5 border-t border-[#1e2733] bg-[#0f1117]/80 text-[10px] font-semibold text-[#4b5563] select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Dev Server Running</span>
          </div>
          <span>·</span>
          <span>HMR Port Active</span>
        </div>
        <div className="flex items-center gap-3 text-[9px] uppercase tracking-wider font-bold">
          <span>UTF-8</span>
          <span>·</span>
          <span>Spaces: 2</span>
          <span>·</span>
          <span>{selectedFile ? selectedFile.name.split('.').pop() : 'none'}</span>
        </div>
      </div>
    </div>
  );
}
