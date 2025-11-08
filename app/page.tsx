"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="flex h-screen bg-[#343541]">
      {/* Sidebar */}
      <div className="w-64 bg-[#202123] flex flex-col">
        <button
          onClick={handleNewChat}
          className="m-3 p-3 border border-gray-600 rounded hover:bg-gray-700 transition text-left text-sm"
        >
          + New chat
        </button>
        <div className="flex-1 overflow-y-auto p-3">
          <div className="text-xs text-gray-400 mb-2">Recent chats</div>
        </div>
        <div className="p-3 border-t border-gray-700">
          <div className="text-xs text-gray-400">GPT Clone</div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-8">GPT Clone</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto px-4">
                  <div className="p-4 bg-[#444654] rounded-lg">
                    <div className="text-lg mb-2">💡</div>
                    <div className="text-sm">Examples</div>
                    <div className="text-xs text-gray-400 mt-2">
                      "Explain quantum computing"
                    </div>
                  </div>
                  <div className="p-4 bg-[#444654] rounded-lg">
                    <div className="text-lg mb-2">⚡</div>
                    <div className="text-sm">Capabilities</div>
                    <div className="text-xs text-gray-400 mt-2">
                      Remembers conversation context
                    </div>
                  </div>
                  <div className="p-4 bg-[#444654] rounded-lg">
                    <div className="text-lg mb-2">⚠️</div>
                    <div className="text-sm">Limitations</div>
                    <div className="text-xs text-gray-400 mt-2">
                      May occasionally generate incorrect info
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`py-6 ${
                  message.role === "assistant" ? "bg-[#444654]" : "bg-[#343541]"
                }`}
              >
                <div className="max-w-3xl mx-auto px-4 flex gap-6">
                  <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-[#5436DA] flex items-center justify-center text-white font-bold">
                    {message.role === "user" ? "U" : "AI"}
                  </div>
                  <div className="flex-1 prose prose-invert max-w-none">
                    {message.role === "assistant" ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="py-6 bg-[#444654]">
              <div className="max-w-3xl mx-auto px-4 flex gap-6">
                <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-[#5436DA] flex items-center justify-center text-white font-bold">
                  AI
                </div>
                <div className="flex-1">
                  <div className="animate-pulse">Thinking...</div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-gray-700 bg-[#343541]">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Send a message..."
                className="w-full bg-[#40414f] border border-gray-600 rounded-lg py-3 px-4 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 resize-none"
                rows={1}
                style={{ maxHeight: "200px" }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 bottom-2 p-2 rounded-md hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M7 11L12 6L17 11M12 18V7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="text-xs text-gray-400 text-center mt-2">
              Free Research Preview. This is a demo application.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
