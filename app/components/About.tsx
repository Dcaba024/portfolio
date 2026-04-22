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
        "Hi! I’m Dylan Caballero, a software engineer with experience in IAM, AI-powered applications, and front-end development. Ask me about ForgeRock, OAuth 2.0, Google reCAPTCHA, public-sector identity journeys, or the kind of roles I’m targeting.",
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
    <section id="about" className="section-shell px-6 py-8 md:px-10 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="glass-panel grid gap-8 rounded-[2rem] p-6 text-left md:p-8 lg:grid-cols-[0.88fr_1.12fr]"
      >
        <div className="flex flex-col justify-between gap-8">
          <div>
            <p className="section-kicker">About + AI</p>
            <h2 className="mt-5 max-w-md text-4xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 dark:text-white">
              Recruiter-ready context on my experience, strengths, and technical focus.
            </h2>
          </div>

          <div className="space-y-4 text-base leading-8 text-slate-600 dark:text-slate-300">
            <p>
              I’m a software engineer with a strong focus on identity and access
              management, front-end application development, and AI-assisted
              product experiences.
            </p>
            <p>
              My recent work includes supporting ForgeRock-based IAM flows, OAuth
              2.0 authorization, and Google reCAPTCHA integrations for public-sector
              experiences serving Texas.gov and TXDMV users.
            </p>
            <p>
              I’m most effective in roles where I can bridge secure systems and
              product execution by turning technical requirements into reliable,
              user-friendly interfaces.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
              <p className="text-sm text-slate-500 dark:text-slate-400">Domain</p>
              <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                IAM and secure user journeys
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
              <p className="text-sm text-slate-500 dark:text-slate-400">Stack</p>
              <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                React, Next.js, TypeScript, OpenAI
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
              <p className="text-sm text-slate-500 dark:text-slate-400">Approach</p>
              <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                Clear communication and product ownership
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200/30 bg-slate-950 p-5 shadow-2xl shadow-slate-950/10 dark:border-white/10">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
                Dylan Caballero
              </p>
              <p className="mt-1 text-2xl font-semibold text-white">
                Career chatbot
              </p>
            </div>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              Live
            </span>
          </div>

          <div
            ref={listRef}
            className="mt-5 h-80 space-y-3 overflow-y-auto rounded-[1.35rem] border border-white/8 bg-white/[0.04] p-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[84%] rounded-[1.35rem] px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                      : "border border-white/8 bg-white/8 text-slate-100"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="rounded-[1.35rem] border border-white/8 bg-white/8 px-4 py-3 text-sm text-slate-300">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              className="flex-1 rounded-full border border-white/10 bg-white/6 px-5 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Ask about my experience, IAM work, AI projects, or roles I’m a fit for..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              aria-label="Ask Dylan a question"
            />
            <button
              type="submit"
              className="rounded-full bg-white px-6 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
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
