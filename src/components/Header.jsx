import React from 'react';
import { Settings, Download, Globe, Menu, RefreshCw, Cpu, Activity } from 'lucide-react';

export default function Header({ 
  isGenerating, 
  statusMessage, 
  generationProgress, 
  sidebarOpen, 
  setSidebarOpen, 
  config, 
  onOpenSettings, 
  onExport, 
  onDeploy,
  isDeploying
}) {
  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-[#27272a] bg-[#09090b] flex-shrink-0 z-20 select-none">
      {/* Left section: Branding & Indicators */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-white text-black flex items-center justify-center font-black text-sm select-none">
            W
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-xs font-bold text-white tracking-wide">Website Design</span>
              <span className="text-xs font-bold text-neutral-400 tracking-wide">Agent</span>
            </div>
            <span className="text-[9px] text-[#52525b] font-bold block mt-1 uppercase tracking-widest">Lotus AI Works</span>
          </div>
        </div>
        
        <div className="h-5 w-px bg-[#27272a]" />
        
        {/* Model Indicator */}
        <div className="flex items-center gap-2 text-[10px] text-[#a1a1aa] bg-[#09090b] px-3 py-1 rounded border border-[#27272a]">
          <Cpu className="w-3 h-3 text-[#a1a1aa]" />
          <span className="font-mono text-[9px] font-semibold uppercase tracking-wider">
            {config.model?.replace(/-/g, ' ')}
          </span>
        </div>

        {/* Dyad Connection Status */}
        <div className="flex items-center gap-2 text-[10px] text-[#a1a1aa] bg-[#09090b] px-3 py-1 rounded border border-[#27272a]">
          <Activity className="w-3 h-3 text-[#a1a1aa]" />
          <span className={`w-1.5 h-1.5 rounded-full ${config.dyadStatus === 'connected' ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span className="font-mono text-[9px] font-semibold uppercase tracking-wider">Dyad:{config.dyadPort}</span>
        </div>
      </div>

      {/* Middle Section: Progress Tracking (Centered) */}
      {isGenerating ? (
        <div className="flex-1 mx-12 max-w-sm hidden md:block fade-in">
          <div className="flex items-center gap-2.5 mb-1.5">
            <RefreshCw className="w-3 h-3 text-white animate-spin" />
            <span className="text-xs font-semibold text-[#a1a1aa]">{statusMessage}</span>
            <span className="text-xs font-bold text-white ml-auto">{generationProgress}%</span>
          </div>
          <div className="h-1 bg-[#18181b] rounded overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${generationProgress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`p-1.5 rounded text-xs transition-all border cursor-pointer ${
            sidebarOpen 
              ? 'bg-[#18181b] border-[#27272a] text-white' 
              : 'border-[#27272a] text-[#52525b] hover:text-[#a1a1aa] hover:bg-[#18181b]'
          }`}
          title="Toggle Explorer Sidebar"
        >
          <Menu className="w-3.5 h-3.5" />
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 border border-[#27272a] bg-[#09090b] hover:bg-[#18181b] text-[#52525b] hover:text-white rounded transition-all cursor-pointer"
          title="BYOK & Orchestrator Settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        {/* Export ZIP action */}
        <button
          onClick={onExport}
          className="px-3 py-1.5 text-xs bg-[#09090b] border border-[#27272a] hover:bg-white hover:text-black rounded transition-all flex items-center gap-1.5 font-bold cursor-pointer"
          title="Download workspace as a ZIP package"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

        {/* Deploy action */}
        <button
          onClick={onDeploy}
          disabled={isDeploying || isGenerating}
          className={`px-3.5 py-1.5 text-xs rounded font-bold transition-all flex items-center gap-1.5 select-none cursor-pointer ${
            isDeploying 
              ? 'bg-[#18181b] text-[#52525b] cursor-not-allowed border border-[#27272a]' 
              : 'bg-white text-black hover:bg-[#e4e4e7]'
          }`}
        >
          {isDeploying ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Deploying...</span>
            </>
          ) : (
            <>
              <Globe className="w-3.5 h-3.5" />
              <span>Deploy</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
