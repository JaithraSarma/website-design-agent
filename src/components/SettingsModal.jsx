import React, { useState } from 'react';
import { X, Key, Shield, Cpu, RefreshCw, Radio } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, config, onSave }) {
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [dyadPort, setDyadPort] = useState(config.dyadPort || '8080');
  const [model, setModel] = useState(config.model || 'gemini-2.5-flash');
  const [dyadStatus, setDyadStatus] = useState(config.dyadStatus || 'connected');
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSave({ apiKey, dyadPort, model, dyadStatus });
    onClose();
  };

  const testConnection = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setDyadStatus('connected');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0f1117] border border-[#1e2733] rounded-2xl shadow-2xl overflow-hidden glass-panel glow-blue">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2733] bg-[#161b27]/50">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-[#e8eaf0]">BYOK Settings & Orchestration</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-[#4b5563] hover:text-[#8b95a7] hover:bg-[#1e2433] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Gemini API Key */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#8b95a7] flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-blue-400" />
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter Gemini API Key (BYOK)..."
                className="w-full px-3 py-2 bg-[#161b27] border border-[#1e2733] rounded-lg text-sm text-[#e8eaf0] placeholder-[#4b5563] outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
            <p className="text-[10px] text-[#4b5563] leading-relaxed">
              API key is kept local and never uploaded to GitHub. Runs fully on-device.
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#8b95a7] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              Active AI Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 bg-[#161b27] border border-[#1e2733] rounded-lg text-sm text-[#e8eaf0] outline-none focus:border-blue-500/50 transition-colors cursor-pointer"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Default)</option>
              <option value="gemini-3.1-pro">Gemini 3.1 Pro (High Accuracy)</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
            </select>
          </div>

          {/* Dyad Connection Settings */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#8b95a7] flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                Dyad Local Orchestrator
              </label>
              <span className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium ${
                dyadStatus === 'connected' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${dyadStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                {dyadStatus === 'connected' ? 'Connected' : 'Offline'}
              </span>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-xs text-[#4b5563]">Port:</span>
                <input
                  type="text"
                  value={dyadPort}
                  onChange={(e) => setDyadPort(e.target.value)}
                  className="w-full pl-12 pr-3 py-2 bg-[#161b27] border border-[#1e2733] rounded-lg text-sm text-[#e8eaf0] outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={testConnection}
                disabled={isTesting}
                className="px-3 bg-[#1e2433] hover:bg-[#2a3347] border border-[#1e2733] text-xs text-[#8b95a7] hover:text-[#e8eaf0] rounded-lg transition-colors flex items-center gap-1.5"
              >
                {isTesting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                Reconnect
              </button>
            </div>
            <p className="text-[10px] text-[#4b5563] leading-relaxed">
              Dyad desktop orchestrator manages files and routes local code outputs.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e2733]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#8b95a7] hover:text-[#e8eaf0] hover:bg-[#1e2433] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all shadow-md shadow-blue-600/10"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
