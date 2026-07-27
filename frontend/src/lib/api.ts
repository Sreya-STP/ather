import type { CareerFormData, StartupFormData, ChatMessage } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export type SSEHandler = {
  onText: (chunk: string) => void;
  onEvent: (name: string, data: unknown) => void;
  onDone: () => void;
  onError: (msg: string) => void;
};

/**
 * SSE consumer — fixed for Aether's collect-parse-emit backend pattern.
 *
 * The backend emits THREE kinds of SSE blocks, all separated by \\n\\n:
 *
 * 1. Plain narrative token:
 *      data: Hello\\n\\n
 *    (newlines inside text are escaped as \\n by the backend)
 *
 * 2. Named structured event:
 *      event: scores\\n
 *      data: {"overall":72,...}\\n\\n
 *
 * 3. Error event:
 *      event: error\\n
 *      data: {"message":"..."}\\n\\n
 *
 * Each complete SSE block is separated by exactly one blank line (\\n\\n).
 * We split on \\n\\n, then for each block detect which type it is.
 */
async function consumeSSE(
  url: string,
  body: unknown,
  handlers: SSEHandler
): Promise<() => void> {
  const controller = new AbortController();

  try {
    const res = await fetch(`${BASE}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      let detail = `Server error ${res.status}`;
      try {
        const j = await res.json();
        detail = j.detail || j.message || detail;
      } catch { /* ignore */ }
      handlers.onError(detail);
      return () => {};
    }

    if (!res.body) {
      handlers.onError("No response body from server.");
      return () => {};
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    const processBlock = (block: string) => {
      if (!block.trim()) return;

      const lines = block.split("\n");
      let eventName: string | undefined;
      const dataLines: string[] = [];

      for (const line of lines) {
        if (line.startsWith("event: ")) {
          eventName = line.slice(7).trim();
        } else if (line.startsWith("data: ")) {
          dataLines.push(line.slice(6));
        }
      }

      const dataStr = dataLines.join("");

      // ── Named event ───────────────────────────────────────
      if (eventName) {
        if (eventName === "done") {
          handlers.onDone();
          return;
        }
        if (eventName === "error") {
          try {
            const parsed = JSON.parse(dataStr);
            handlers.onError(parsed.message || "Unknown server error");
          } catch {
            handlers.onError(dataStr || "Unknown server error");
          }
          return;
        }
        // Any other named event → structured data
        try {
          handlers.onEvent(eventName, JSON.parse(dataStr));
        } catch {
          // If JSON parse fails, forward as raw string
          handlers.onEvent(eventName, dataStr);
        }
        return;
      }

      // ── Plain text token ───────────────────────────────────
      if (dataStr) {
        // Unescape \\n back to real newlines (backend escapes them)
        const text = dataStr.replace(/\\n/g, "\n");
        handlers.onText(text);
      }
    };

    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // Flush any remaining buffer content
          if (buffer.trim()) processBlock(buffer);
          handlers.onDone();
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        // Split completed SSE blocks (delimited by \n\n)
        const blocks = buffer.split("\n\n");
        // Last element may be incomplete — keep it in buffer
        buffer = blocks.pop() ?? "";

        for (const block of blocks) {
          processBlock(block);
        }
      }
    };

    pump().catch((err) => {
      if (err.name === "AbortError") return;
      handlers.onError(err.message || "Stream connection error");
    });

  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return () => {};
    handlers.onError(
      err instanceof Error ? err.message : "Failed to connect to server"
    );
  }

  return () => controller.abort();
}

export function streamCareerEval(data: CareerFormData, handlers: SSEHandler) {
  return consumeSSE("/api/career-evaluate", data, handlers);
}

export function streamStartupEval(data: StartupFormData, handlers: SSEHandler) {
  return consumeSSE("/api/business-evaluate", data, handlers);
}

export function streamChat(
  messages: ChatMessage[],
  mode: string,
  handlers: SSEHandler
) {
  return consumeSSE("/api/chat", {
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    mode,
  }, handlers);
}

export async function checkHealth() {
  try {
    const res = await fetch(`${BASE}/api/health`);
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}
