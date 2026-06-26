import React, { useState, useEffect } from 'react';
import { Copy, Check, FileCode } from 'lucide-react';

export default function CodePanel({ selectedFile }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [selectedFile]);

  const handleCopy = () => {
    if (!selectedFile) return;
    navigator.clipboard.writeText(selectedFile.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!selectedFile) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-[#0f1117] text-center select-none">
        <FileCode className="w-10 h-10 text-[#4b5563] mb-3" />
        <h3 className="text-xs font-semibold text-[#8b95a7] mb-1">No File Selected</h3>
        <p className="text-[10px] text-[#4b5563] max-w-xs leading-relaxed">
          Select a file from the explorer sidebar to inspect its source code.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#0f1117] overflow-hidden">
      {/* File Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e2733] bg-[#0c0d12]/50 select-none">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-[#e8eaf0]">{selectedFile.name}</span>
          <span className="text-[9px] text-[#4b5563] bg-[#161b27] px-2 py-0.5 rounded border border-[#1e2733] font-semibold uppercase">
            {selectedFile.name.split('.').pop()}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="px-2.5 py-1 text-[10px] text-[#8b95a7] hover:text-[#e8eaf0] bg-[#161b27] hover:bg-[#1e2433] rounded-md border border-[#1e2733] transition-all flex items-center gap-1.5 font-bold cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Text Area */}
      <div className="flex-1 overflow-auto p-4 font-mono text-[11px] leading-relaxed text-[#c8ccd6] custom-scrollbar bg-[#090a0f] selection:bg-blue-600/30">
        <pre className="whitespace-pre">{selectedFile.content || '// Empty file'}</pre>
      </div>
    </div>
  );
}
