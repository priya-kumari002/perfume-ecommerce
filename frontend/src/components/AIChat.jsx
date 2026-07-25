import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

const getImageUrl = (img) => {
  if (!img) return null;
  if (img.startsWith("http")) return img;
  const clean = img.replace(/\\/g, "/");
  return `http://localhost:5000${clean.startsWith("/") ? clean : `/${clean}`}`;
};

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm LuxeScent AI ✨\nAsk me for perfume recommendations, order help, or anything else!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const { data } = await api.post("/ai/chat", { message: userMsg });
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.data.reply,
          products: data.data.products || [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 text-black rounded-full shadow-lg shadow-yellow-600/30 flex items-center justify-center text-2xl"
      >
        {open ? "×" : "🤖"}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] h-[480px] bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-4 py-3 flex items-center gap-3">
              <span className="text-xl">🤖</span>
              <div>
                <p className="font-semibold text-sm">LuxeScent AI</p>
                <p className="text-xs opacity-70">Fragrance Assistant</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-line ${
                      m.role === "user"
                        ? "bg-yellow-600 text-black rounded-br-md"
                        : "bg-gray-900 text-gray-200 rounded-bl-md"
                    }`}
                  >
                    {m.text}
                    {m.products?.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {m.products.map((p) => (
                          <Link
                            key={p._id}
                            to={`/product/${p.slug}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2 bg-black/30 rounded-lg p-2 hover:bg-black/50 transition"
                          >
                            {p.image && (
                              <img
                                src={getImageUrl(p.image)}
                                alt=""
                                className="w-8 h-8 rounded object-cover"
                              />
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-medium truncate text-yellow-400">
                                {p.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                ₹{p.price}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-900 rounded-2xl px-4 py-2 text-sm text-gray-400">
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={send}
              className="p-3 border-t border-gray-800 flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-full text-sm outline-none focus:border-yellow-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-10 h-10 bg-yellow-600 text-black rounded-full flex items-center justify-center font-bold disabled:opacity-50"
              >
                →
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}