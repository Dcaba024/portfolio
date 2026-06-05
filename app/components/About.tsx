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
        "Hi! I’m Dylan Caballero, a software engineer focused on IAM, AI agents, workflow automation, and full-stack product development. Ask me about OpenAI integrations, automated scoring and extraction workflows, ForgeRock, OAuth 2.0, or the roles I’m targeting.",
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
    <section id="about" className="section-shell px-4 py-6 md:px-10 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="glass-panel grid gap-6 rounded-[1.75rem] p-5 text-left md:gap-8 md:rounded-[2rem] md:p-8 lg:grid-cols-[0.88fr_1.12fr]"
      >
        <div className="flex flex-col justify-between gap-8">
          <div>
            <p className="section-kicker">AI + Automation</p>
            <h2 className="mt-5 max-w-md text-3xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
              I build secure products, AI-powered tools, and automations that make complex work easier.
            </h2>
          </div>

          <div className="space-y-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 dark:text-slate-300">
            <p>
              I’m a software engineer with a strong focus on identity and access
              management, full-stack development, AI agents, and workflow
              automation.
            </p>
            <p>
              My recent work includes supporting ForgeRock-based IAM flows, OAuth
              2.0 authorization, and Google reCAPTCHA integrations for public-sector
              experiences serving Texas.gov and TXDMV users.
            </p>
            <p>
              I also build OpenAI-powered chat, summarization, data extraction,
              scoring, and decision-support workflows with an emphasis on clear
              prompts, reliable outputs, and practical evaluation loops.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
              <p className="text-sm text-slate-500 dark:text-slate-400">AI systems</p>
              <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                Agents, prompting, and evaluation
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
              <p className="text-sm text-slate-500 dark:text-slate-400">Automation</p>
              <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                Extraction, scoring, and workflows
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
              <p className="text-sm text-slate-500 dark:text-slate-400">Engineering</p>
              <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                Secure full-stack product delivery
              </p>
            </div>
          </div>
        </div>

        <div className="h-fit self-start rounded-[1.5rem] border border-slate-200/30 bg-slate-950 p-4 shadow-2xl shadow-slate-950/10 md:rounded-[1.75rem] md:p-5 dark:border-white/10">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
                Dylan Caballero
              </p>
              <p className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                Career chatbot
              </p>
            </div>
            <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
              Live
            </span>
          </div>

          <div
            ref={listRef}
            className="mt-5 h-60 space-y-3 overflow-y-auto rounded-[1.25rem] border border-white/8 bg-white/[0.04] p-3 sm:h-72 sm:rounded-[1.35rem] sm:p-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-[1.2rem] px-4 py-3 text-sm leading-6 sm:max-w-[84%] sm:rounded-[1.35rem] ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-amber-600 to-indigo-700 text-white"
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
              className="flex-1 rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 sm:text-base"
              placeholder="Ask about my AI agents, automations, IAM work, or engineering experience..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              aria-label="Ask Dylan a question"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-white px-6 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
