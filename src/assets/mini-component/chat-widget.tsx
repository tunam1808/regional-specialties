// Đây là component nhỏ dùng để mở cửa sổ chat nhanh với cửa hàng

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaComments, FaTimes, FaPaperPlane } from "react-icons/fa";
import ChatSuggestions from "./QA-suggest";

type Message = {
  id: string;
  from: "user" | "shop";
  text: string;
  time?: string;
};

export default function ChatWidget({
  shopName = "Đặc sản ba miền",
}: {
  shopName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      from: "shop",
      text: `Xin chào! Mình có thể giúp gì cho bạn hôm nay?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll mượt khi có tin nhắn mới
  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    } else if (!open) {
      // tăng số tin chưa đọc nếu tin nhắn mới từ shop đến khi đóng
      const last = messages[messages.length - 1];
      if (last && last.from === "shop") {
        setUnread((u) => u + 1);
      }
    }
  }, [messages, open]);

  // Giả lập shop trả lời
  const simulateShopReply = (userText: string) => {
    setIsTyping(true);
    setTimeout(() => {
      const reply: Message = {
        id: `s_${Date.now()}`,
        from: "shop",
        text: `Cảm ơn bạn! Chúng tôi đã nhận được: "${truncate(
          userText,
          80
        )}". Sẽ phản hồi nhanh nhất có thể.`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((m) => [...m, reply]);
      setIsTyping(false);
    }, 900 + Math.random() * 1200);
  };

  // Khi user click câu hỏi gợi ý
  const handleSampleQuestion = (item: { q: string; a: string }) => {
    const msg: Message = {
      id: `u_${Date.now()}`,
      from: "user",
      text: item.q,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((m) => [...m, msg]);

    setTimeout(() => {
      const reply: Message = {
        id: `s_${Date.now()}`,
        from: "shop",
        text: item.a,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((m) => [...m, reply]);
    }, 700);
  };

  // Gửi tin nhắn
  const handleSend = () => {
    if (!input.trim()) return;
    const msg: Message = {
      id: `u_${Date.now()}`,
      from: "user",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((m) => [...m, msg]);
    setInput("");
    simulateShopReply(msg.text);
    setUnread(0);
  };

  const toggleOpen = () => {
    setOpen((o) => {
      const next = !o;
      if (next) setUnread(0);
      return next;
    });
  };

  // helper: truncate long text
  function truncate(str: string, n: number) {
    return str.length > n ? str.slice(0, n - 1) + "…" : str;
  }

  return (
    <>
      {/* Floating button */}
      <div className="fixed right-6 bottom-20 z-50 flex items-end justify-end">
        <div className="relative">
          <button
            aria-label={open ? "Đóng chat" : `Mở chat với ${shopName}`}
            onClick={toggleOpen}
            className="group bg-orange-600 hover:bg-orange-700 text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 cursor-pointer"
          >
            <FaComments className="w-6 h-6" />
          </button>
          {unread > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold shadow">
              {unread > 9 ? "9+" : unread}
            </div>
          )}
        </div>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="fixed right-6 bottom-20 z-50 w-[360px] max-w-[92vw] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Cửa sổ chat với cửa hàng"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <FaComments className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">{shopName}</div>
                  <div className="text-xs opacity-90">Hỗ trợ trực tuyến</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Đóng"
                className="p-1 rounded-md hover:bg-white/20 focus:outline-none"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Messages (scrollable) */}
            <div
              className="flex-1 p-4 overflow-y-auto max-h-[300px]"
              ref={listRef}
            >
              <div className="flex flex-col gap-3">
                {messages.map((m, idx) => (
                  <div key={m.id} className="flex flex-col">
                    <div
                      className={`max-w-[85%] ${
                        m.from === "user"
                          ? "self-end bg-orange-100 text-gray-900 rounded-2xl rounded-br-none p-3"
                          : "self-start bg-gray-100 text-gray-900 rounded-2xl rounded-bl-none p-3"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-line">
                        {m.text}
                      </div>
                      {m.time && (
                        <div className="text-[10px] opacity-80 mt-1 text-right">
                          {m.time}
                        </div>
                      )}
                    </div>

                    {/* Hiển thị gợi ý ngay sau tin nhắn chào đầu tiên */}
                    {idx === 0 && m.from === "shop" && (
                      <div className="self-start mt-1">
                        <ChatSuggestions onSelect={handleSampleQuestion} />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="self-start bg-gray-100 rounded-2xl rounded-bl-none p-2 px-3">
                    <TypingDots />
                  </div>
                )}
              </div>
            </div>

            {/* Composer */}
            <div className="px-4 py-3 border-t">
              <div className="flex gap-2 items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Gửi tin nhắn cho cửa hàng..."
                  className="flex-1 bg-gray-50 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  aria-label="Tin nhắn"
                />
                <button
                  onClick={handleSend}
                  aria-label="Gửi"
                  className="inline-flex items-center justify-center rounded-xl px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm focus:outline-none cursor-pointer"
                >
                  <FaPaperPlane className="w-4 h-4 mr-1 " />
                  Gửi
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      <span
        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
        style={{ animationDelay: "0s" }}
      />
      <span
        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
        style={{ animationDelay: "0.1s" }}
      />
      <span
        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
        style={{ animationDelay: "0.2s" }}
      />
    </div>
  );
}
