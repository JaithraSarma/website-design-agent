import React, { useRef, useEffect } from 'react';
import { Trash2, Terminal, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

export default function ConsolePanel({ logs, onClear }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />;
      case 'error':
        return <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />;
      case 'warn':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />;
      case 'info':
      default:
        return <Info className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />;
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-emerald-400';
      case 'error':
        return 'text-red-400';
      case 'warn':
        return 'text-amber-500';
      case 'info':
      default:
        return 'text-[#8b95a7]';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0b0e] overflow-hidden">
      {/* Console Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e2733] bg-[#0c0d12]/50 select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-[#e8eaf0]">Vite Dev Terminal Logs</span>
        </div>
        <button
          onClick={onClear}
          className="p-1 rounded-md text-[#4b5563] hover:text-red-400 hover:bg-[#1e2433] transition-colors border border-transparent hover:border-red-950/20"
          title="Clear Console Buffer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Log Feed */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-2 bg-[#050608] custom-scrollbar selection:bg-blue-600/20"
      >
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-[#4b5563] font-semibold select-none">
            Console Buffer Empty
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 border-b border-[#1e2733]/10 pb-1 last:border-b-0 leading-relaxed">
              <span className="text-[#4b5563] select-none text-[9px] mt-0.5">
                {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
              </span>
              {getLogIcon(log.type)}
              <span className={`${getLogColor(log.type)} select-text`}>{log.msg}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
