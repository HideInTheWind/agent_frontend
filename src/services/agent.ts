import { serverUrl } from "@/services/request";
import { parseSSEStream } from "@/utils/parseSSE";

export const askStream = async (
  question: string,
  onEvent: (event: StreamEvent) => void,
  signal?: AbortSignal,
): Promise<void> => {
  const res = await fetch(`${serverUrl}/ask/stream`, {
    method: "POST",
    body: JSON.stringify({ question }),
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  if (!res.body) throw new Error("响应体为空");

  const reader = res.body.getReader();

  // for await (const raw of parseSSEStream(reader)) {
  //   onEvent(raw as StreamEvent);
  //   if (raw.type === "done" || raw.type === "error") break;
  // }
  // for await 本质上等价于：
  const gen = parseSSEStream(reader);

  while (true) {
    const { value, done } = await gen.next(); // 消费方主动要下一个值
    if (done) break;
    onEvent(value);
  }
};
