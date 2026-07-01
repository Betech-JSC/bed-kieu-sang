"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "model";
  message: string;
  created_at: string;
}

export default function AiChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [visibleCount, setVisibleCount] = useState(15);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const messageContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);

  // Initialize and load chat history
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("xongnhatayue_web_chat_history");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setMessages(parsed);
        } catch (e) {
          console.error("Error parsing chat history:", e);
        }
      } else {
        // Welcome message
        const welcome: Message = {
          id: "welcome",
          role: "model",
          message: "Xin chào! Tôi là Trợ lý AI của Thảo Mộc Tẩy Uế. Tôi có thể giúp gì cho bạn hôm nay?",
          created_at: new Date().toISOString(),
        };
        setMessages([welcome]);
        localStorage.setItem("xongnhatayue_web_chat_history", JSON.stringify([welcome]));
      }
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage when messages change
  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      localStorage.setItem("xongnhatayue_web_chat_history", JSON.stringify(messages));
    }
  }, [messages, isInitialized]);

  // Handle scroll position adjustment after prepending older messages
  useEffect(() => {
    if (loadingMore && messageContainerRef.current) {
      const container = messageContainerRef.current;
      const diff = container.scrollHeight - prevScrollHeightRef.current;
      container.scrollTop = diff;
      setLoadingMore(false);
    }
  }, [visibleCount]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(scrollToBottom, 50);
    }
  };

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (container.scrollTop === 0 && messages.length > visibleCount && !loadingMore) {
      loadOlderMessages();
    }
  };

  const loadOlderMessages = () => {
    setLoadingMore(true);
    if (messageContainerRef.current) {
      prevScrollHeightRef.current = messageContainerRef.current.scrollHeight;
    }

    console.log("[AI Chat Web] Đang tải các tin nhắn cũ hơn từ bộ nhớ local...");

    // Simulate loading/pagination API delay
    setTimeout(() => {
      const newVisibleCount = Math.min(visibleCount + 15, messages.length);
      const loadedMessages = messages.slice(-newVisibleCount, -visibleCount);
      
      console.log("Các tin nhắn cũ hơn:", loadedMessages);
      
      setVisibleCount(newVisibleCount);
    }, 600);
  };

  const SUGGESTIONS = [
    { text: "🏠 Chọn loại xông nhà phù hợp", prompt: "Tôi muốn chuyển nhà/nhập trạch hoặc đang gặp khó khăn trong làm ăn, tôi nên chọn loại Tẩy uế xông nhà nào và cách dùng ra sao?" },
    { text: "🌿 Thơm phòng & Sức khỏe", prompt: "Tôi muốn xông nhà thơm phòng hoặc tốt cho sức khỏe thì chọn loại nào phù hợp và dùng ra sao?" },
    { text: "🔥 Cách xông nhà chung cư", prompt: "Nhà chung cư thì nên xông tẩy uế bằng phương pháp nào là tốt nhất?" },
    { text: "📞 Nhận tư vấn sâu hơn", prompt: "Tôi cần tư vấn chi tiết hơn, vui lòng hướng dẫn cách để lại thông tin liên hệ." }
  ];

  const handleSuggestionClick = (promptText: string) => {
    setNewMessage(promptText);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    const userText = newMessage;
    setNewMessage("");

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      message: userText,
      created_at: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Increase visible count so new messages are rendered
    setVisibleCount((prev) => prev + 1);

    setTimeout(scrollToBottom, 50);

    try {
      // Build context of last 10 messages for Gemini API
      const historyContext = updatedMessages.slice(-10).map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.message }],
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contents: historyContext }),
      });

      if (!res.ok) {
        throw new Error("HTTP error " + res.status);
      }

      const data = await res.json();
      const modelText = data.text || "Xin lỗi, tôi không nhận được phản hồi.";

      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        message: modelText,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, modelMsg]);
      setVisibleCount((prev) => prev + 1);
      setTimeout(scrollToBottom, 50);
    } catch (error) {
      console.error("Error communicating with AI Assistant:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        message: "Rất tiếc, đã có lỗi kết nối tới trợ lý AI. Vui lòng thử lại sau.",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setVisibleCount((prev) => prev + 1);
      setTimeout(scrollToBottom, 50);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (text: string) => {
    if (!text) return "";
    let escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    escaped = escaped.replace(/```([\s\S]*?)```/g, '<pre class="bg-zinc-850 text-zinc-100 p-3 rounded-lg my-2 overflow-x-auto text-xs font-mono">$1</pre>');
    escaped = escaped.replace(/`(.*?)`/g, '<code class="bg-zinc-200 text-rose-600 px-1 rounded font-mono text-xs">$1</code>');
    return escaped.replace(/\n/g, "<br>");
  };

  const visibleMessages = messages.slice(-visibleCount);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-96 h-[500px] mb-4 bg-[#FFFDF9] border border-[#043616]/10 shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right">
          {/* Chat Header */}
          <div className="bg-[#043616] text-[#FFFDF9] px-4 py-3 flex items-center justify-between border-b border-[#FAF6EE]/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E5C44B] text-[#043616] flex items-center justify-center font-bold font-serif shadow-inner">
                AI
              </div>
              <div className="text-left">
                <h4 className="text-sm font-semibold tracking-wide text-[#E5C44B]">Trợ lý Thảo Mộc Tẩy Uế</h4>
                <span className="text-[10px] text-[#FAF6EE]/75 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Trực tuyến
                </span>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="p-1 hover:bg-[#FAF6EE]/15 rounded-lg transition-colors text-[#FAF6EE]/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div
            ref={messageContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF6EE]/30"
          >
            {loadingMore && (
              <div className="flex justify-center items-center py-2 gap-2 text-xs text-zinc-500">
                <Loader2 className="animate-spin h-4 w-4 text-[#043616]" />
                <span>Đang tải tin nhắn cũ...</span>
              </div>
            )}

            {visibleMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`${
                    msg.role === "user"
                      ? "bg-[#043616] text-[#FFFDF9] rounded-2xl rounded-tr-none"
                      : "bg-white text-zinc-800 rounded-2xl rounded-tl-none border-l-4 border-[#E5C44B] shadow-sm"
                  } px-4 py-2.5 max-w-[85%] text-sm leading-relaxed break-words shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-left`}
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.message) }}
                />
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start">
                <div className="bg-white text-zinc-800 rounded-2xl rounded-tl-none border-l-4 border-[#E5C44B] px-4 py-3 shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions Bar */}
          <div className="px-3 py-2 border-t border-zinc-100 bg-white flex gap-1.5 overflow-x-auto shrink-0 select-none no-scrollbar">
            {SUGGESTIONS.map((sug) => (
              <button
                key={sug.text}
                type="button"
                onClick={() => handleSuggestionClick(sug.prompt)}
                className="shrink-0 text-[10px] font-bold text-zinc-700 bg-zinc-100 hover:bg-[#FAF6EE] hover:text-[#043616] px-2.5 py-1.5 rounded-lg border border-zinc-200 transition-colors"
              >
                {sug.text}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={sendMessage}
            className="p-3 border-t border-zinc-200 bg-white flex items-center gap-2 shrink-0"
          >
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              type="text"
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#043616] focus:bg-white transition-all duration-200 text-zinc-800 placeholder-zinc-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isLoading}
              className="p-2.5 bg-[#043616] text-[#E5C44B] rounded-xl hover:bg-[#032610] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-sm"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Chat Trigger Button */}
      <button
        onClick={toggleChat}
        className="w-14 h-14 bg-[#043616] text-[#E5C44B] shadow-xl rounded-full flex items-center justify-center hover:bg-[#032610] hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none relative group border border-[#E5C44B]/20"
      >
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#043616]/30 animate-ping group-hover:hidden"></span>
        {!isOpen ? (
          <MessageSquare className="w-7 h-7" />
        ) : (
          <X className="w-7 h-7" />
        )}
      </button>
    </div>
  );
}
