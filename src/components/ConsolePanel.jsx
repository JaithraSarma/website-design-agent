import React, { useRef, useEffect } from 'react';
import { Trash2, Terminal, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

export default function ConsolePanel({ logs, onClear, compileTimes = [120, 150, 110, 142, 128] }) {
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
        return <Info className="w-3.5 h-3.5 text-neutral-400 mt-0.5 flex-shrink-0" />;
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
        return 'text-[#a1a1aa]';
    }
  };

  // Calculate SVG point path for the sparkline chart
  const max = Math.max(...compileTimes);
  const min = Math.min(...compileTimes);
  const points = compileTimes.map((val, i) => {
    const x = (i / (compileTimes.length - 1)) * 120 + 10;
    const range = max - min || 1;
    // Keep it vertically aligned in a 40px height canvas
    const y = 30 - ((val - min) / range) * 20;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="h-full flex flex-col bg-[#000000] overflow-hidden">
      {/* Console Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#27272a] bg-[#09090b] select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#a1a1aa]" />
          <span className="text-xs font-bold text-[#f4f4f5]">Vite Dev Terminal Logs</span>
        </div>
        <button
          onClick={onClear}
          className="p-1 rounded text-[#52525b] hover:text-[#f4f4f5] hover:bg-[#18181b] transition-colors border border-transparent cursor-pointer"
          title="Clear Console Buffer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Log Feed */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-2 bg-[#000000] custom-scrollbar selection:bg-neutral-800"
      >
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-[#52525b] font-semibold select-none">
            Console Buffer Empty
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 border-b border-[#27272a]/20 pb-1 last:border-b-0 leading-relaxed">
              <span className="text-[#52525b] select-none text-[9px] mt-0.5">
                {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
              </span>
              {getLogIcon(log.type)}
              <span className={`${getLogColor(log.type)} select-text`}>{log.msg}</span>
            </div>
          ))
        )}
      </div>

      {/* Telemetry Footer Grid */}
      <div className="border-t border-[#27272a] bg-[#09090b] p-3.5 flex items-center justify-between font-mono text-[10px] text-[#a1a1aa] select-none">
        <div>
          <div className="text-white font-bold">HMR Speed: <span className="text-white font-extrabold">{compileTimes[compileTimes.length - 1]}ms</span></div>
          <div className="text-[9px] text-[#52525b] mt-1">Bundle Size: React 24.2 KB · Tailwind 84.1 KB</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] text-[#52525b] uppercase font-bold tracking-widest">HMR Telemetry</span>
          <svg className="w-36 h-10 border border-[#27272a]/40 rounded bg-black">
            <polyline fill="none" stroke="#ffffff" strokeWidth="1.25" points={points} />
          </svg>
        </div>
      </div>
    </div>
  );
}
