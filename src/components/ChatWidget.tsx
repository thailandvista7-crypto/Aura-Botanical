import { useState, useRef, useEffect } from "react";
import { trpc } from "@/trpc/client";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm Aura, your wellness guide. Ask me about our Thai botanical soaps, candles, or gift sets — I'm here to help you find your perfect match!",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMutation = trpc.aiChat.send.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sendMutation.isPending) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    sendMutation.mutate({ message: userMsg });
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#1B4332] text-[#FFF8F0] shadow-lg hover:bg-[#5C3D2E] transition-all flex items-center justify-center"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] rounded-lg overflow-hidden flex flex-col"
          style={{
            height: 500,
            background: "#0A0A0F",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1B4332] flex items-center justify-center">
              <Bot size={16} className="text-[#C9A227]" />
            </div>
            <div>
              <p className="text-[#FFF8F0] text-[14px] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Aura Assistant
              </p>
              <p className="text-[#FFF8F0]/40 text-[11px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Wellness Guide
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-[#1B4332] flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={12} className="text-[#C9A227]" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#1B4332] text-[#FFF8F0]"
                      : "bg-white/10 text-[#FFF8F0]/90"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-6 h-6 rounded-full bg-[#C9A227] flex items-center justify-center flex-shrink-0 mt-1">
                    <User size={12} className="text-[#5C3D2E]" />
                  </div>
                )}
              </div>
            ))}
            {sendMutation.isPending && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-[#1B4332] flex items-center justify-center flex-shrink-0">
                  <Bot size={12} className="text-[#C9A227]" />
                </div>
                <div className="bg-white/10 px-3 py-2 rounded-lg">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#FFF8F0]/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-[#FFF8F0]/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-[#FFF8F0]/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our products..."
              className="flex-1 h-10 px-3 bg-white/5 rounded text-[#FFF8F0] placeholder:text-[#FFF8F0]/30 text-[13px] focus:outline-none focus:bg-white/10 transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            <button
              type="submit"
              disabled={!input.trim() || sendMutation.isPending}
              className="w-10 h-10 rounded bg-[#1B4332] text-[#FFF8F0] flex items-center justify-center hover:bg-[#C9A227] hover:text-[#5C3D2E] transition-colors disabled:opacity-30"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
