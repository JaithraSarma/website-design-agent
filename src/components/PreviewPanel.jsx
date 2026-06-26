import React from 'react';
import { Eye, Code, Terminal, RotateCw, ExternalLink, ShieldCheck, Maximize2, Minimize2 } from 'lucide-react';
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
  onRefreshPreview,
  onMaximize,
  isMaximized,
  compileTimes
}) {
  return (
    <div className="flex-1 flex flex-col bg-[#000000] min-w-0 h-full">
      {/* Tabs Header bar */}
      <div className="flex items-center px-4 border-b border-[#27272a] bg-[#09090b] flex-shrink-0 select-none">
        <div className="flex items-center gap-1.5 py-2">
          {[
            { id: 'preview', label: 'Preview', icon: <Eye className="w-3.5 h-3.5" /> },
            { id: 'code', label: 'Code Inspector', icon: <Code className="w-3.5 h-3.5" /> },
            { id: 'console', label: 'Console Stream', icon: <Terminal className="w-3.5 h-3.5" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs rounded flex items-center gap-1.5 transition-all font-semibold cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#18181b] text-white border border-[#27272a]'
                  : 'text-[#a1a1aa] hover:text-white border border-transparent'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Address Bar (Localhost details) */}
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#18181b] border border-[#27272a] rounded px-3 py-1 text-[10px] text-[#a1a1aa] font-semibold">
            <ShieldCheck className="w-3 h-3 text-white" />
            <span className="text-[#f4f4f5]">localhost:5173</span>
          </div>

          <button 
            onClick={onRefreshPreview}
            className="p-1.5 text-[#52525b] hover:text-[#f4f4f5] transition-colors rounded hover:bg-[#18181b] border border-transparent hover:border-[#27272a] cursor-pointer" 
            title="Refresh Preview & Sync HMR"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          
          <button 
            className="p-1.5 text-[#52525b] hover:text-[#f4f4f5] transition-colors rounded hover:bg-[#18181b] border border-transparent hover:border-[#27272a] cursor-pointer" 
            title="Open Sandbox in new tab (Simulated)"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button 
            onClick={onMaximize}
            className="p-1.5 text-[#52525b] hover:text-[#f4f4f5] transition-colors rounded hover:bg-[#18181b] border border-transparent hover:border-[#27272a] cursor-pointer" 
            title={isMaximized ? "Restore Layout" : "Maximize Preview"}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Pane Content Viewports */}
      <div className="flex-1 overflow-hidden relative">
        <ErrorBoundary>
          {activeTab === 'preview' && (
            <div className="h-full relative bg-black">
              {isGenerating && (
                <div className="absolute inset-0 bg-[#000000]/75 backdrop-blur-sm z-10 flex items-center justify-center transition-all duration-300">
                  <div className="flex flex-col items-center gap-3.5 bg-[#09090b]/90 px-6 py-5 rounded border border-[#27272a] shadow-2xl text-center">
                    <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin spinner" />
                    <div>
                      <span className="text-xs font-semibold text-[#f4f4f5] block">{statusMessage}</span>
                      <span className="text-[10px] text-[#52525b] font-medium mt-0.5 block">HMR pipeline compiling...</span>
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
            <ConsolePanel logs={logs} onClear={onClearLogs} compileTimes={compileTimes} />
          )}
        </ErrorBoundary>
      </div>

      {/* Bottom Status bar */}
      <div className="flex items-center justify-between px-4 py-1.5 border-t border-[#27272a] bg-[#09090b] text-[10px] font-semibold text-[#52525b] select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
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
