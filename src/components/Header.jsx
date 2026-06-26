import React from 'react';
import { Settings, Download, Globe, Menu, RefreshCw } from 'lucide-react';

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
    <header className="flex items-center justify-between px-4 py-2.5 border-b border-[#1e2733] bg-[#0f1117]/85 backdrop-blur-md flex-shrink-0 z-10">
      {/* Left section: Branding & Indicators */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center font-bold shadow-lg shadow-blue-500/10 text-white select-none">
            W
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-xs font-semibold text-[#e8eaf0] tracking-wide">Website Design</span>
              <span className="text-xs font-bold text-blue-400">Agent</span>
            </div>
            <span className="text-[10px] text-[#4b5563] font-medium leading-none block mt-0.5 select-none">Lotus AI Works</span>
          </div>
        </div>
        
        <div className="h-4 w-px bg-[#1e2733]" />
        
        {/* Model Indicator */}
        <div className="flex items-center gap-1.5 text-xs text-[#8b95a7] bg-[#161b27] px-2.5 py-1 rounded-full border border-[#1e2733] select-none">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span className="font-medium text-[10px] text-[#c8ccd6] capitalize">
            {config.model?.replace(/-/g, ' ')}
          </span>
        </div>

        {/* Dyad Connection Status */}
        <div className="flex items-center gap-1.5 text-[10px] text-[#8b95a7] bg-[#161b27] px-2.5 py-1 rounded-full border border-[#1e2733] select-none">
          <div className={`w-1.5 h-1.5 rounded-full ${config.dyadStatus === 'connected' ? 'bg-emerald-400' : 'bg-red-400 animate-pulse'}`} />
          <span className="font-medium text-[#c8ccd6]">Dyad Link:{config.dyadPort}</span>
        </div>
      </div>

      {/* Middle Section: Progress Tracking (Centered) */}
      {isGenerating ? (
        <div className="flex-1 mx-8 max-w-md hidden md:block">
          <div className="flex items-center gap-2 mb-1">
            <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
            <span className="text-xs font-medium text-[#8b95a7]">{statusMessage}</span>
            <span className="text-xs font-bold text-blue-400 ml-auto">{generationProgress}%</span>
          </div>
          <div className="h-1 bg-[#1e2733] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${generationProgress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2.5">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`p-2 rounded-lg text-xs transition-colors border ${
            sidebarOpen 
              ? 'bg-[#161b27] border-blue-500/20 text-[#e8eaf0]' 
              : 'border-[#1e2733] text-[#4b5563] hover:text-[#8b95a7] hover:bg-[#161b27]'
          }`}
          title="Toggle Explorer Sidebar"
        >
          <Menu className="w-3.5 h-3.5" />
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 border border-[#1e2733] hover:bg-[#161b27] text-[#8b95a7] hover:text-[#e8eaf0] rounded-lg transition-colors"
          title="BYOK & Orchestrator Settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        {/* Export ZIP action */}
        <button
          onClick={onExport}
          className="px-3 py-2 text-xs border border-[#1e2733] hover:bg-[#161b27] text-[#8b95a7] hover:text-[#e8eaf0] rounded-lg transition-all flex items-center gap-1.5 font-medium cursor-pointer"
          title="Download workspace as a ZIP package"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

        {/* Deploy action */}
        <button
          onClick={onDeploy}
          disabled={isDeploying || isGenerating}
          className={`px-3 py-2 text-xs text-white rounded-lg font-semibold transition-all flex items-center gap-1.5 shadow-lg select-none cursor-pointer ${
            isDeploying 
              ? 'bg-blue-800/50 text-[#8b95a7] cursor-not-allowed border border-blue-800/30' 
              : 'bg-blue-600 hover:bg-blue-500 hover:scale-[1.02] shadow-blue-600/10'
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
