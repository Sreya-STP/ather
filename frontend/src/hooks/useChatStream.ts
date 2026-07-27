"use client";

import { useCallback, useRef } from "react";
import { useStore } from "@/store";
import { streamChat } from "@/lib/api";
import { generateId } from "@/lib/utils";
import type { ChatMessage } from "@/types";

export function useChatStream() {
  const abortRef = useRef<(() => void) | null>(null);
  const {
    chatMessages, addChatMessage, updateLastAssistant,
    setChatStreaming, addXP, unlockAchievement, mode,
  } = useStore();

  const send = useCallback(async (content: string) => {
    abortRef.current?.();

    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    addChatMessage(userMsg);

    const assistantMsg: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    addChatMessage(assistantMsg);
    setChatStreaming(true);

    let accumulated = "";
    const allMessages = [...chatMessages, userMsg];

    abortRef.current = await streamChat(allMessages, mode, {
      onText: (chunk) => {
        accumulated += chunk;
        updateLastAssistant(accumulated);
      },
      onEvent: (name) => {
        if (name === "done") {
          setChatStreaming(false);
          addXP(5);
          // Check for chat achievement (10 messages)
          const totalMsgs = allMessages.length + 2;
          if (totalMsgs >= 10) unlockAchievement("chat_10");
        }
      },
      onDone: () => {
        setChatStreaming(false);
      },
      onError: (msg) => {
        updateLastAssistant(`Sorry, an error occurred: ${msg}`);
        setChatStreaming(false);
      },
    });
  }, [chatMessages, addChatMessage, updateLastAssistant, setChatStreaming, addXP, unlockAchievement, mode]);

  const abort = useCallback(() => {
    abortRef.current?.();
    setChatStreaming(false);
  }, [setChatStreaming]);

  return { send, abort };
}
