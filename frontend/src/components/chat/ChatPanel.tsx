"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Trash2, Zap } from "lucide-react";
import { useStore } from "@/store";
import { useChatStream } from "@/hooks/useChatStream";
import { StreamingText } from "@/components/ui/StreamingText";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STARTERS = [
  "What skills should I learn for a Software Engineer role?",
  "How do I prepare for system design interviews?",
  "Review my startup idea: an AI tutor for college students",
  "What's the best way to negotiate my first salary?",
];

export function ChatPanel() {
  const [input, setInput] = useState("");
  const { chatMessages, chatStreaming, clearChat, mode } = useStore();
  const { send } = useChatStream();
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatStreaming]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || chatStreaming) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    await send(text);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[700px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center">
            <Zap size={15} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Aether AI</p>
            <p className="text-xs text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Online · {mode === "startup" ? "Startup Mentor" : "Career Coach"}
            </p>
          </div>
        </div>
        {chatMessages.length > 0 && (
          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
            aria-label="Clear chat"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-brand mx-auto mb-4 flex items-center justify-center">
              <Zap size={24} className="text-white" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              How can I help you today?
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Ask me anything about careers, skills, or your startup idea.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left text-xs text-gray-600 dark:text-gray-300 p-3 rounded-xl border border-gray-100 dark:border-zinc-800 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3 animate-fade-up",
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
              msg.role === "user"
                ? "bg-brand-500"
                : "bg-gradient-brand"
            )}>
              {msg.role === "user"
                ? <User size={13} className="text-white" />
                : <Bot size={13} className="text-white" />}
            </div>
            <div className={cn(
              "max-w-[80%] rounded-2xl px-4 py-3",
              msg.role === "user"
                ? "bg-brand-600 text-white rounded-tr-sm"
                : "bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-tl-sm"
            )}>
              {msg.role === "user" ? (
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <StreamingText
                  content={msg.content || "…"}
                  isStreaming={chatStreaming && !msg.content}
                  className="text-sm"
                />
              )}
              <p className={cn(
                "text-[10px] mt-1.5",
                msg.role === "user" ? "text-brand-200 text-right" : "text-gray-400"
              )}>
                {formatTime(new Date(msg.timestamp))}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100 dark:border-zinc-800">
        <div className="flex gap-2 items-end bg-gray-50 dark:bg-zinc-800 rounded-2xl px-3 py-2 border border-gray-100 dark:border-zinc-700 focus-within:border-brand-400 transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKey}
            placeholder="Ask anything about your career or startup…"
            rows={1}
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 resize-none focus:outline-none min-h-[24px] max-h-[120px] leading-6"
            aria-label="Chat message"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || chatStreaming}
            className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
              input.trim() && !chatStreaming
                ? "bg-brand-600 text-white hover:bg-brand-500"
                : "bg-gray-200 dark:bg-zinc-700 text-gray-400 cursor-not-allowed"
            )}
            aria-label="Send message"
          >
            {chatStreaming
              ? <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              : <Send size={14} />}
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-1.5">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
