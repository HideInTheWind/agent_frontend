import { useRef, useEffect, useState } from "react";
import { Button, Input, Tag, Spin, Tooltip } from "antd";
import {
  SendOutlined,
  StopOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useStreamChat } from "../../hooks/useStreamChat";
import "./index.scss";

const { TextArea } = Input;

const NODE_LABEL: Record<string, string> = {
  input_check: "安全检查",
  history_trigger: "历史分析",
  condense_query: "问题凝缩",
  routeAgent: "路由决策",
  cache: "缓存查询",
  direct: "直接回答",
  rag: "知识检索",
  tools: "工具调用",
  rewrite_query: "问题改写",
  doc_grade: "文档评估",
  generate_answer: "生成答案",
  hallucination_check: "幻觉检测",
  quality_check: "质量检查",
  output_guard: "输出过滤",
};

export default function ChatWindow() {
  const { messages, streaming, currentNode, sendMessage, abort } =
    useStreamChat(import.meta.env.VITE_API_BASE ?? "http://localhost:8000");
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    sendMessage(text);
  };

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message message--${msg.role}`}>
            <div className="message__bubble">
              {msg.optimizing ? (
                <span className="message__optimizing">答案优化中...</span>
              ) : (
                msg.content ||
                (streaming && msg.role === "assistant" ? (
                  <Spin size="small" />
                ) : null)
              )}
            </div>
            {msg.role === "assistant" && (
              <div className="message__meta">
                {msg.draft && (
                  <Tag color="default">草稿</Tag>
                )}
                {msg.cached && (
                  <Tooltip title={`相似度 ${(msg.cacheScore ?? 0).toFixed(2)}`}>
                    <Tag icon={<ThunderboltOutlined />} color="gold">
                      缓存命中
                    </Tag>
                  </Tooltip>
                )}
                {msg.blocked && (
                  <Tag color="red">已拦截：{msg.blockReason}</Tag>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {streaming && currentNode && (
        <div className="chat-status">
          <Spin size="small" />
          <span>{NODE_LABEL[currentNode] ?? currentNode}...</span>
        </div>
      )}

      <div className="chat-input">
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="输入问题，Shift+Enter 换行"
          autoSize={{ minRows: 1, maxRows: 4 }}
          disabled={streaming}
        />
        {streaming ? (
          <Button danger icon={<StopOutlined />} onClick={abort} />
        ) : (
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!input.trim()}
          />
        )}
      </div>
    </div>
  );
}
