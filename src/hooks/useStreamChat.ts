import { useState, useRef, useCallback } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  cached?: boolean;
  cacheScore?: number;
  blocked?: boolean;
  blockReason?: string;
  draft?: boolean; // token 阶段标记草稿，verified 后清除
  optimizing?: boolean; // retract 无 final 时显示"答案优化中..."
}

// interface StreamDoneFrame {
//   type: "done";
//   blocked: boolean;
//   block_reason: string;
//   cached: boolean;
//   cache_score: number;
// }

const SESSION_ID = "default"; // 固定 session_id

export function useStreamChat(apiBase = "http://localhost:8000") {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [currentNode, setCurrentNode] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (userInput: string) => {
      if (streaming) return;

      // 追加用户消息
      const userMsg: Message = {
        id: Date.now() + "-user",
        role: "user",
        content: userInput,
      };
      // 追加空的 assistant 占位消息
      const assistantId = Date.now() + "-assistant";
      const assistantMsg: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setStreaming(true);
      setCurrentNode("");

      abortRef.current = new AbortController();

      try {
        const res = await fetch(`${apiBase}/chat/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_input: userInput,
            session_id: SESSION_ID,
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // 按 SSE 行解析
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? ""; // 末尾未完成行留着

          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const raw = line.slice(5).trim();
            if (raw === "[DONE]") break;

            const frame = JSON.parse(raw);

            if (frame.type === "token") {
              // 追加 token，同时标记为草稿状态
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + frame.token, draft: true }
                    : m,
                ),
              );
            } else if (frame.type === "retract") {
              if (frame.final) {
                // 有 final：清空草稿，渲染拒绝语
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? {
                          ...m,
                          content: frame.final,
                          draft: false,
                          optimizing: false,
                          blocked: true,
                          blockReason: frame.final,
                        }
                      : m,
                  ),
                );
              } else {
                // 无 final：清空气泡，显示"答案优化中..."
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? {
                          ...m,
                          content: "",
                          draft: false,
                          optimizing: true,
                        }
                      : m,
                  ),
                );
              }
            } else if (frame.type === "verified") {
              // 答案定稿，去掉草稿标记
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, draft: false, optimizing: false }
                    : m,
                ),
              );
            } else if (frame.type === "chain") {
              setCurrentNode(frame.node);
              if (frame.node === "cache") {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? {
                          ...m,
                          cached: true,
                          cacheScore: frame.cache_score,
                          content: frame.answer,
                        }
                      : m,
                  ),
                );
              }
            } else if (frame.type === "done") {
              // const meta = frame as StreamDoneFrame;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? {
                        ...m,
                        // cached: meta.cached,
                        // cacheScore: meta.cache_score,
                        // blocked: meta.blocked,
                        // blockReason: meta.block_reason,
                      }
                    : m,
                ),
              );
            }
          }
        }
      } catch (err: unknown) {
        if ((err as Error).name !== "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: "请求失败，请稍后重试。" }
                : m,
            ),
          );
        }
      } finally {
        setStreaming(false);
        setCurrentNode("");
      }
    },
    [streaming, apiBase],
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { messages, streaming, currentNode, sendMessage, abort };
}
