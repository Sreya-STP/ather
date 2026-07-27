"use client";

/**
 * StreamingText — v2
 * ==================
 * Renders the plain-text numbered-section output from Gemini.
 * Handles the format:
 *   01 SECTION HEADING
 *   - bullet point one
 *   - bullet point two
 *   Free text lines
 *
 * Does NOT use react-markdown — we parse the format ourselves so there
 * is zero chance of raw ** or ## symbols appearing in the UI.
 */

import { cn } from "@/lib/utils";

interface StreamingTextProps {
  content: string;
  isStreaming?: boolean;
  className?: string;
}

type Block =
  | { type: "section"; number: string; title: string }
  | { type: "bullet"; text: string }
  | { type: "kv"; key: string; value: string }
  | { type: "text"; text: string }
  | { type: "blank" };

function parseLine(line: string): Block {
  // Section header: "01 SECTION NAME" or "01. SECTION NAME"
  const sectionMatch = line.match(/^(\d{2})\.?\s+([A-Z][A-Z\s&()\/₹-]{2,})/);
  if (sectionMatch) {
    return { type: "section", number: sectionMatch[1], title: sectionMatch[2].trim() };
  }

  // Bullet: "- something"
  if (/^[-•]\s+/.test(line)) {
    return { type: "bullet", text: line.replace(/^[-•]\s+/, "").trim() };
  }

  // Key-value: "Some Label: value" (capitalised label)
  const kvMatch = line.match(/^([A-Z][^:]{2,40}):\s+(.+)$/);
  if (kvMatch) {
    return { type: "kv", key: kvMatch[1].trim(), value: kvMatch[2].trim() };
  }

  // Blank line
  if (!line.trim()) {
    return { type: "blank" };
  }

  return { type: "text", text: line.trim() };
}

function cleanText(text: string): string {
  // Strip any lingering markdown symbols Gemini might have slipped in
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")   // **bold** → bold
    .replace(/\*(.+?)\*/g,   "$1")     // *italic* → italic
    .replace(/`(.+?)`/g,     "$1")     // `code` → code
    .replace(/^#{1,3}\s*/,   "")       // ## heading → plain
    .trim();
}

export function StreamingText({ content, isStreaming, className }: StreamingTextProps) {
  const lines  = content.split("\\n").join("\n").split("\n");
  const blocks = lines.map(parseLine);

  return (
    <div className={cn("space-y-0.5", className)}>
      {blocks.map((block, i) => {
        switch (block.type) {

          case "section":
            return (
              <div key={i} className="mt-5 mb-2 first:mt-0">
                <div className="flex items-center gap-2.5">
                  <span className="flex-shrink-0 w-6 h-6 rounded-md bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 text-[10px] font-bold flex items-center justify-center">
                    {block.number}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 tracking-wide uppercase">
                    {block.title}
                  </h3>
                </div>
                <div className="h-px bg-gray-100 dark:bg-zinc-800 mt-2" />
              </div>
            );

          case "bullet":
            return (
              <div key={i} className="flex items-start gap-2 py-0.5 pl-2">
                <span className="text-brand-500 mt-[3px] flex-shrink-0 text-xs">›</span>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {renderInline(cleanText(block.text))}
                </p>
              </div>
            );

          case "kv":
            return (
              <div key={i} className="flex gap-2 py-0.5 pl-2 flex-wrap">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex-shrink-0 pt-0.5 min-w-[90px]">
                  {block.key}:
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-200 flex-1">
                  {renderInline(cleanText(block.value))}
                </span>
              </div>
            );

          case "blank":
            return <div key={i} className="h-2" />;

          case "text":
          default:
            return (
              <p key={i} className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pl-2">
                {renderInline(cleanText(block.text))}
              </p>
            );
        }
      })}

      {/* Blinking cursor while streaming */}
      {isStreaming && (
        <span
          aria-hidden="true"
          className="inline-block w-[2px] h-[14px] bg-brand-500 ml-0.5 align-middle animate-[blink_1s_step-end_infinite]"
        />
      )}
    </div>
  );
}

/** Render inline emphasis: [BLOCKER] [HIGH] [MEDIUM] badges + plain bold */
function renderInline(text: string): React.ReactNode {
  // Split on [TAG] patterns and key: value patterns at sentence level
  const parts = text.split(/(\[BLOCKER\]|\[HIGH IMPACT\]|\[HIGH\]|\[MEDIUM\]|\[LOW\]|\[EXISTENTIAL\])/g);

  return parts.map((part, i) => {
    if (part === "[BLOCKER]" || part === "[EXISTENTIAL]")
      return <span key={i} className="inline-block text-[10px] font-bold bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 px-1.5 py-0.5 rounded-full mx-0.5 align-middle">{part.replace(/[\[\]]/g,"")}</span>;
    if (part === "[HIGH IMPACT]" || part === "[HIGH]")
      return <span key={i} className="inline-block text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-full mx-0.5 align-middle">{part.replace(/[\[\]]/g,"")}</span>;
    if (part === "[MEDIUM]")
      return <span key={i} className="inline-block text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded-full mx-0.5 align-middle">{part.replace(/[\[\]]/g,"")}</span>;
    if (part === "[LOW]")
      return <span key={i} className="inline-block text-[10px] font-bold bg-gray-100 dark:bg-zinc-800 text-gray-500 px-1.5 py-0.5 rounded-full mx-0.5 align-middle">{part.replace(/[\[\]]/g,"")}</span>;
    return <span key={i}>{part}</span>;
  });
}
