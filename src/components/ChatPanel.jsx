import React, { useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, Maximize2, Minimize2 } from 'lucide-react';

export default function ChatPanel({ 
  messages, 
  inputValue, 
  setInputValue, 
  onSend, 
  isGenerating, 
  suggestions, 
  onSelectSuggestion,
  onMaximize,
  isMaximized
}) {
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Auto-resize textarea height based on content length
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#09090b] border-r border-[#27272a]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#27272a] bg-[#09090b] flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="text-xs font-semibold text-[#f4f4f5]">Orchestration Chat</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onMaximize}
            className="p-1 rounded text-[#52525b] hover:text-[#f4f4f5] hover:bg-[#18181b] transition-all cursor-pointer"
            title={isMaximized ? "Restore Layout" : "Maximize Chat"}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <span className="text-[9px] text-[#52525b] bg-[#18181b] px-2 py-0.5 rounded border border-[#27272a] font-bold uppercase tracking-wider">
            {messages.length} Messages
          </span>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar bg-[#000000]">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`fade-in flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              {/* Agent Avatar */}
              {!isUser && (
                <div className="w-6 h-6 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              )}

              <div className={`max-w-[80%] ${isUser ? 'order-1' : 'order-2'}`}>
                {/* Header detail */}
                <div className={`flex items-center gap-1.5 mb-1 text-[10px] text-[#52525b] font-medium ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <span>{isUser ? 'You' : 'Agent'}</span>
                  <span>·</span>
                  <span>{formatTime(msg.timestamp)}</span>
                </div>

                {/* Bubble */}
                <div
                  className={`px-3.5 py-2.5 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-white text-black rounded-tr-none font-semibold shadow-sm'
                      : 'bg-[#18181b] text-[#e4e4e7] border border-[#27272a] rounded-tl-none font-medium'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {/* Streaming Loader / Typing Dots */}
        {isGenerating && (
          <div className="flex gap-2.5 justify-start fade-in">
            <div className="w-6 h-6 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1 text-[10px] text-[#52525b] font-medium">
                <span>Agent</span>
                <span>·</span>
                <span>Compiling...</span>
              </div>
              <div className="px-3.5 py-3 rounded-xl rounded-tl-none bg-[#18181b] border border-[#27272a] flex items-center gap-1.5">
                {[0, 0.2, 0.4].map((delay, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white"
                    style={{ animation: `pulse-dot 1.2s ${delay}s infinite` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {!isGenerating && suggestions.length > 0 && (
        <div className="px-4 pb-2.5 flex gap-1.5 overflow-x-auto scrollbar-hide select-none bg-[#000000]">
          {suggestions.slice(0, 3).map((suggestion, i) => (
            <button
              key={i}
              onClick={() => onSelectSuggestion(suggestion)}
              className="flex-shrink-0 text-[10px] px-3 py-1.5 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa] hover:text-white hover:border-[#52525b] hover:bg-[#27272a] transition-all font-semibold whitespace-nowrap cursor-pointer"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input Form Box */}
      <div className="px-4 pb-4 pt-1.5 border-t border-[#27272a] bg-[#09090b]">
        <div className="relative flex items-end gap-2 bg-[#18181b] border border-[#27272a] rounded-lg overflow-hidden focus-within:border-[#52525b] transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe design modifications..."
            disabled={isGenerating}
            className="flex-1 px-3.5 py-3 bg-transparent text-xs text-[#f4f4f5] placeholder-[#52525b] outline-none resize-none leading-relaxed min-h-[40px] max-h-[120px] custom-scrollbar"
          />
          <button
            onClick={onSend}
            disabled={!inputValue.trim() || isGenerating}
            className={`m-2 p-2 rounded transition-all flex items-center justify-center flex-shrink-0 select-none cursor-pointer ${
              inputValue.trim() && !isGenerating
                ? 'bg-white text-black hover:bg-[#e4e4e7]'
                : 'bg-[#27272a] text-[#52525b] cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 px-1 select-none">
          <span className="text-[9px] text-[#52525b] font-medium">↵ Send · ⇧↵ New line</span>
          <span className="text-[9px] text-[#52525b] font-medium flex items-center gap-1">
            <MessageSquare className="w-2.5 h-2.5" />
            Gemini BYOK Active
          </span>
        </div>
      </div>
    </div>
  );
}
