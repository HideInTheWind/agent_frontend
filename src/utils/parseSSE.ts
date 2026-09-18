// 三个关键点：

// fetch 返回的 response.body 是 ReadableStream，逐块读取
// TextDecoder 把 Uint8Array 字节流解码成字符串，{stream: true} 避免跨块截断
// SSE 格式固定是 data: <JSON>\n\n，按行过滤 + 解析

export async function* parseSSEStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
): AsyncGenerator<StreamEvent> {
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    // done：布尔值，表示流是否读完。true 表示没有更多数据。
    // value：二进制数据
    // reader.read() 返回的是原始字节
    const { done, value } = await reader.read();
    if (done) break;
    // TextDecoder 把 value 解码成字符串
    buffer += decoder.decode(value, { stream: true });
    // 按双换行切分完整事件块
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? ""; // 最后一段可能不完整，留到下次

    for (const part of parts) {
      const line = part.trim();
      if (!line.startsWith("data:")) continue;
      const json = line.slice(5).trim();
      if (json) yield JSON.parse(json);
    }
  }
}
