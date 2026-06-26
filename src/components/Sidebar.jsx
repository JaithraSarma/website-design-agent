import React, { useState } from 'react';
import { Folder, FileCode, FileJson, FileText, ChevronRight, ChevronDown, Plus, Search, Layers, Maximize2, Minimize2 } from 'lucide-react';

export default function Sidebar({ files, activeFile, onSelectFile, expandedFolders, onToggleFolder, onMaximize, isMaximized }) {
  const [searchQuery, setSearchQuery] = useState('');

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop();
    switch (ext) {
      case 'html':
        return <FileCode className="w-3.5 h-3.5 text-[#52525b]" />;
      case 'jsx':
        return <FileCode className="w-3.5 h-3.5 text-[#a1a1aa]" />;
      case 'js':
        return <FileCode className="w-3.5 h-3.5 text-[#a1a1aa]" />;
      case 'css':
        return <FileText className="w-3.5 h-3.5 text-[#52525b]" />;
      case 'json':
        return <FileJson className="w-3.5 h-3.5 text-[#52525b]" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-[#52525b]" />;
    }
  };

  const renderFileTree = (items, depth = 0) => {
    return items
      .filter(item => {
        if (!searchQuery) return true;
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
              className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-all duration-150 group text-xs font-medium ${
                isActive
                  ? 'bg-[#18181b] text-white border-l-2 border-white'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]/50'
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
                <span className="text-[#52525b] group-hover:text-[#a1a1aa] transition-colors">
                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </span>
              ) : (
                <span className="w-3 h-3" />
              )}
              
              <span>
                {isFolder ? (
                  <Folder className={`w-3.5 h-3.5 ${isExpanded ? 'text-[#a1a1aa]' : 'text-[#52525b]'}`} />
                ) : (
                  getFileIcon(file.name)
                )}
              </span>
              
              <span className="truncate">{file.name}</span>
              
              {!isFolder && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
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
    <aside className="w-full h-full flex-shrink-0 bg-[#09090b] flex flex-col slide-in-left border-r border-[#27272a]">
      {/* Sidebar Header */}
      <div className="px-4 py-3 border-b border-[#27272a] bg-[#09090b] flex items-center justify-between">
        <span className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider select-none">Workspace Explorer</span>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={onMaximize}
            className="p-1 rounded text-[#52525b] hover:text-[#f4f4f5] hover:bg-[#18181b] transition-all cursor-pointer"
            title={isMaximized ? "Restore Layout" : "Maximize Sidebar"}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button className="p-1 rounded text-[#52525b] hover:text-[#f4f4f5] hover:bg-[#18181b] transition-all cursor-pointer" title="Create new file (Simulated)">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-3 pt-3 pb-2 bg-[#09090b]">
        <div className="flex items-center gap-1.5 bg-[#18181b] border border-[#27272a] rounded px-2.5 py-1.5 focus-within:border-[#52525b] transition-all">
          <Search className="w-3.5 h-3.5 text-[#52525b]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full bg-transparent border-0 text-xs text-[#f4f4f5] placeholder-[#52525b] outline-none"
          />
        </div>
      </div>

      {/* Project Root Label */}
      <div className="px-4 py-1.5 flex items-center gap-1.5 select-none bg-[#09090b]">
        <Layers className="w-3 h-3 text-[#52525b]" />
        <span className="text-[10px] font-bold text-[#52525b] uppercase tracking-wider">website-design-agent</span>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto py-1 px-1 custom-scrollbar">
        {renderFileTree(files)}
      </div>

      {/* Sidebar Footer */}
      <div className="px-4 py-3 border-t border-[#27272a] bg-[#09090b]">
        <div className="flex items-center gap-2 text-[10px] text-[#52525b] select-none font-semibold">
          <span className="flex items-center justify-center w-4 h-4 rounded bg-[#18181b] text-[#a1a1aa]">⚛</span>
          <span>Vite + React 19 + Tailwind v4</span>
        </div>
      </div>
    </aside>
  );
}
