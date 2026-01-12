"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
};

type ChatApiResponse = {
  answer?: string;
  error?: string;
};

const defaultErrorMessage =
  "I ran into an issue connecting to my AI assistant. Please try again in a moment.";

export default function About() {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: Date.now(),
      role: "bot",
      text:
        "Hi! I’m Dylan Caballero, a cybersecurity engineer focused on IAM. Ask me about ForgeRock, OAuth 2.0, Google reCAPTCHA, and securing public-sector identity journeys.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const container = listRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchAnswer = async (question: string) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = (await response.json()) as ChatApiResponse;

      if (!response.ok) {
        return data?.error ?? defaultErrorMessage;
      }

      return data?.answer?.trim() || defaultErrorMessage;
    } catch (error) {
      console.error("Chatbot request failed:", error);
      return defaultErrorMessage;
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    const answer = await fetchAnswer(trimmed);

    const botMessage: Message = {
      id: Date.now(),
      role: "bot",
      text: answer,
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsThinking(false);
  };

  return (
    <section
      id="about"
      className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white px-6 py-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-5xl w-full flex flex-col gap-10"
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4 text-blue-500">
            Ask About Me
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-3">
            I’m pivoting from software engineering into cybersecurity, with a
            focus on identity and access management. My experience includes
            implementing ForgeRock-based IAM flows, OAuth 2.0 authorization,
            and Google reCAPTCHA protections for the State of Texas across
            Texas.gov and TXDMV.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed">
            I focus on secure authentication journeys, risk-reduction
            integrations, and compliance-ready identity experiences. Ask me
            anything below to learn how I can support your IAM roadmap.
          </p>
        </div>

        <div className="bg-[#0f111a] border border-blue-900/40 rounded-2xl p-6 shadow-2xl shadow-blue-900/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm uppercase tracking-widest text-gray-400">
                Dylan Caballero
              </p>
              <p className="text-xl font-semibold text-white">
                IAM Career Chatbot
              </p>
            </div>
            <span className="text-xs px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full border border-blue-600/40">
              Live
            </span>
          </div>
          <div
            ref={listRef}
            className="h-80 overflow-y-auto space-y-3 bg-black/30 rounded-xl p-4 border border-white/5"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white/10 text-gray-100 border border-white/5"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-gray-300 border border-white/5 rounded-2xl px-4 py-3 text-sm">
                  Thinking...
                </div>
              </div>
            )}
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex gap-3 mt-4 flex-col sm:flex-row"
          >
            <input
              type="text"
              className="flex-1 rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Ask about IAM, ForgeRock, OAuth 2.0, or reCAPTCHA..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              aria-label="Ask Dylan a question"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 transition text-white font-semibold px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!input.trim() || isThinking}
            >
              {isThinking ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
