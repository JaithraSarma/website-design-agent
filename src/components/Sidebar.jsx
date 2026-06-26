import React, { useState } from 'react';
import { Folder, FileCode, FileJson, FileText, ChevronRight, ChevronDown, Plus, Search, Layers } from 'lucide-react';

export default function Sidebar({ files, activeFile, onSelectFile, expandedFolders, onToggleFolder }) {
  const [searchQuery, setSearchQuery] = useState('');

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop();
    switch (ext) {
      case 'html':
        return <FileCode className="w-3.5 h-3.5 text-orange-500" />;
      case 'jsx':
        return <FileCode className="w-3.5 h-3.5 text-sky-400" />;
      case 'js':
        return <FileCode className="w-3.5 h-3.5 text-yellow-500" />;
      case 'css':
        return <FileText className="w-3.5 h-3.5 text-blue-500" />;
      case 'json':
        return <FileJson className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  const renderFileTree = (items, depth = 0) => {
    return items
      .filter(item => {
        if (!searchQuery) return true;
        // Basic flat match for demo simplicity
        if (item.name.toLowerCase().includes(searchQuery.toLowerCase())) return true;
        if (item.children) {
          return item.children.some(child => child.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return false;
      })
      .map(file => {
        const isFolder = file.type === 'folder';
        const isExpanded = expandedFolders[file.id];
        const isActive = activeFile && activeFile.id === file.id;

        return (
          <div key={file.id} className="select-none">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-md transition-all duration-150 group text-xs font-medium ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border-l-2 border-blue-500 rounded-l-none'
                  : 'text-[#8b95a7] hover:text-[#e8eaf0] hover:bg-[#1e2433]'
              }`}
              style={{ paddingLeft: `${12 + depth * 12}px` }}
              onClick={() => {
                if (isFolder) {
                  onToggleFolder(file.id);
                } else {
                  onSelectFile(file);
                }
              }}
            >
              {isFolder ? (
                <span className="text-[#4b5563] group-hover:text-[#8b95a7] transition-colors">
                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </span>
              ) : (
                <span className="w-3 h-3" />
              )}
              
              <span>
                {isFolder ? (
                  <Folder className={`w-3.5 h-3.5 ${isExpanded ? 'text-blue-400/80' : 'text-amber-500/80'}`} />
                ) : (
                  getFileIcon(file.name)
                )}
              </span>
              
              <span className="truncate">{file.name}</span>
              
              {!isFolder && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
              )}
            </div>
            
            {isFolder && isExpanded && file.children && (
              <div className="mt-0.5">
                {renderFileTree(file.children, depth + 1)}
              </div>
            )}
          </div>
        );
      });
  };

  return (
    <aside className="w-56 flex-shrink-0 border-r border-[#1e2733] bg-[#0f1117]/90 backdrop-blur-md flex flex-col slide-in-left">
      {/* Sidebar Header */}
      <div className="px-4 py-3 border-b border-[#1e2733] flex items-center justify-between">
        <span className="text-[10px] font-bold text-[#4b5563] uppercase tracking-wider select-none">Workspace Explorer</span>
        <button className="p-1 rounded-md text-[#4b5563] hover:text-[#8b95a7] hover:bg-[#1e2433] transition-colors" title="Create new file (Simulated)">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-1.5 bg-[#161b27] border border-[#1e2733] rounded-lg px-2.5 py-1.5 focus-within:border-blue-500/50 transition-colors">
          <Search className="w-3.5 h-3.5 text-[#4b5563]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full bg-transparent border-0 text-xs text-[#e8eaf0] placeholder-[#4b5563] outline-none"
          />
        </div>
      </div>

      {/* Project Root Label */}
      <div className="px-4 py-1.5 flex items-center gap-1.5 select-none">
        <Layers className="w-3 h-3 text-[#4b5563]" />
        <span className="text-[10px] font-bold text-[#4b5563] uppercase tracking-wider">website-design-agent</span>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto py-1 px-1 custom-scrollbar">
        {renderFileTree(files)}
      </div>

      {/* Sidebar Footer */}
      <div className="px-4 py-3.5 border-t border-[#1e2733] bg-[#0c0d12]/50">
        <div className="flex items-center gap-2 text-[10px] text-[#4b5563] select-none font-semibold">
          <span className="flex items-center justify-center w-4 h-4 rounded bg-[#161b27] text-sky-400">⚛</span>
          <span>Vite + React 19 + Tailwind v4</span>
        </div>
      </div>
    </aside>
  );
}
