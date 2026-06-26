import React, { useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare } from 'lucide-react';

export default function ChatPanel({ 
  messages, 
  inputValue, 
  setInputValue, 
  onSend, 
  isGenerating, 
  suggestions, 
  onSelectSuggestion
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
    <div className="w-[400px] flex-shrink-0 flex flex-col border-r border-[#1e2733] bg-[#0a0b0e] h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e2733] bg-[#0f1117]/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="text-xs font-semibold text-[#e8eaf0]">Orchestration Chat</span>
        </div>
        <span className="text-[10px] text-[#4b5563] bg-[#161b27] px-2 py-0.5 rounded-full border border-[#1e2733] font-medium">
          {messages.length} Messages
        </span>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
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
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              )}

              <div className={`max-w-[80%] ${isUser ? 'order-1' : 'order-2'}`}>
                {/* Header detail */}
                <div className={`flex items-center gap-1.5 mb-1 text-[10px] text-[#4b5563] font-medium ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <span>{isUser ? 'You' : 'Agent'}</span>
                  <span>·</span>
                  <span>{formatTime(msg.timestamp)}</span>
                </div>

                {/* Bubble */}
                <div
                  className={`px-3.5 py-2.5 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none font-medium'
                      : 'bg-[#161b27] text-[#c8ccd6] border border-[#1e2733] rounded-tl-none font-medium'
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
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1 text-[10px] text-[#4b5563] font-medium">
                <span>Agent</span>
                <span>·</span>
                <span>Compiling...</span>
              </div>
              <div className="px-3.5 py-3 rounded-xl rounded-tl-none bg-[#161b27] border border-[#1e2733] flex items-center gap-1.5">
                {[0, 0.2, 0.4].map((delay, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-blue-400"
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
        <div className="px-4 pb-2.5 flex gap-1.5 overflow-x-auto scrollbar-hide select-none">
          {suggestions.slice(0, 3).map((suggestion, i) => (
            <button
              key={i}
              onClick={() => onSelectSuggestion(suggestion)}
              className="flex-shrink-0 text-[10px] px-2.5 py-1.5 rounded-full bg-[#161b27] border border-[#1e2733] text-[#8b95a7] hover:text-[#e8eaf0] hover:border-blue-500/30 transition-all font-semibold whitespace-nowrap cursor-pointer hover:bg-[#1e2433]"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input Form Box */}
      <div className="px-4 pb-4 pt-1.5 border-t border-[#1e2733]/40 bg-[#0c0d12]/50">
        <div className="relative flex items-end gap-2 bg-[#161b27] border border-[#1e2733] rounded-xl overflow-hidden focus-within:border-blue-500/50 transition-colors">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe design modifications..."
            disabled={isGenerating}
            className="flex-1 px-3.5 py-3 bg-transparent text-xs text-[#e8eaf0] placeholder-[#4b5563] outline-none resize-none leading-relaxed min-h-[40px] max-h-[120px] custom-scrollbar"
          />
          <button
            onClick={onSend}
            disabled={!inputValue.trim() || isGenerating}
            className={`m-2 p-2 rounded-lg transition-all flex items-center justify-center flex-shrink-0 select-none cursor-pointer ${
              inputValue.trim() && !isGenerating
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/10'
                : 'bg-[#1e2433] text-[#4b5563] cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 px-1 select-none">
          <span className="text-[9px] text-[#4b5563] font-medium">↵ Send · ⇧↵ New line</span>
          <span className="text-[9px] text-[#4b5563] font-medium flex items-center gap-1">
            <MessageSquare className="w-2.5 h-2.5" />
            Gemini BYOK Status
          </span>
        </div>
      </div>
    </div>
  );
}
