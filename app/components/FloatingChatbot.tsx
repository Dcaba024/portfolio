"use client";

import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { FaComments, FaMinus, FaPaperPlane } from "react-icons/fa";

type ChatLink = {
  label: string;
  href: string;
};

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
  links?: ChatLink[];
};

type ChatApiResponse = {
  answer?: string;
  error?: string;
};

const defaultErrorMessage =
  "I ran into an issue connecting to my AI assistant. Please try again in a moment.";

const initialMessage: Message = {
  id: 1,
  role: "bot",
  text: "Hi, I'm Dilly Bot. Anything I can help you find?",
};

type FloatingChatbotProps = {
  onResumeRequest?: () => void;
  onContactRequest?: () => void;
  onProjectsRequest?: () => void;
};

const resumeRequestPattern = /\b(resume|cv|curriculum vitae)\b/i;
const resumeGuidanceMessage =
  "Absolutely. I highlighted the Download resume button for you. You can also open it here.";
const contactRequestPattern =
  /\b(where\s+can\s+i\s+contact\s+you|contact\s+you|reach\s+you|get\s+in\s+touch|message\s+you|contact\s+form)\b/i;
const contactGuidanceMessage =
  "You can contact me through the form. I highlighted it for you.";
const projectsRequestPattern =
  /\b(projects?|selected\s+work|portfolio\s+work|work\s+samples?|apps?|things\s+you(?:'ve| have)?\s+built|what\s+have\s+you\s+built)\b/i;
const projectsGuidanceMessage =
  "Here are the projects in my portfolio. I highlighted that section for you.";
const autoLinkPattern =
  /((?:https?:\/\/|www\.)[^\s<>()]+|(?:linkedin\.com|github\.com)[^\s<>()]*)/gi;
const trailingPunctuationPattern = /[.,!?;:]+$/;

const knownLinks = {
  linkedin: {
    label: "Open LinkedIn",
    href: "https://www.linkedin.com/in/dylan-caballero-54963b185/",
  },
  github: {
    label: "Open GitHub",
    href: "https://github.com/Dcaba024",
  },
  resume: {
    label: "Open resume",
    href: "/Dylan-Caballero-AI-Resume.pdf",
  },
  email: {
    label: "Email Dylan",
    href: "mailto:CaballeroDylan96@gmail.com",
  },
  resumeAnalyzer: {
    label: "Open Resume Analyzer",
    href: "https://resume-analyzer-woad.vercel.app/",
  },
  cardboardKings: {
    label: "Open Cardboard Kings",
    href: "https://cardboardkings.org",
  },
  babyDaddy: {
    label: "Open BabyDaddy.com",
    href: "https://babbydaddy.vercel.app/",
  },
} satisfies Record<string, ChatLink>;

type LinkRequestResponse = {
  text: string;
  links: ChatLink[];
  shouldSpotlightResume?: boolean;
  shouldSpotlightContact?: boolean;
  shouldSpotlightProjects?: boolean;
};

const getLinkRequestResponse = (question: string): LinkRequestResponse | null => {
  if (/\bresume analyzer\b/i.test(question)) {
    return {
      text: "Here is the Resume Analyzer project.",
      links: [knownLinks.resumeAnalyzer],
    };
  }

  if (/\bcardboard kings\b/i.test(question)) {
    return {
      text: "Here is the Cardboard Kings project.",
      links: [knownLinks.cardboardKings],
    };
  }

  if (/\b(baby\s*daddy|babydaddy|babbydaddy)\b/i.test(question)) {
    return {
      text: "Here is the BabyDaddy.com project.",
      links: [knownLinks.babyDaddy],
    };
  }

  if (resumeRequestPattern.test(question)) {
    return {
      text: resumeGuidanceMessage,
      links: [knownLinks.resume],
      shouldSpotlightResume: true,
    };
  }

  if (contactRequestPattern.test(question)) {
    return {
      text: contactGuidanceMessage,
      links: [knownLinks.email],
      shouldSpotlightContact: true,
    };
  }

  if (projectsRequestPattern.test(question)) {
    return {
      text: projectsGuidanceMessage,
      links: [
        knownLinks.resumeAnalyzer,
        knownLinks.cardboardKings,
        knownLinks.babyDaddy,
      ],
      shouldSpotlightProjects: true,
    };
  }

  if (/\blinked\s*in\b|\blinkedin\b/i.test(question)) {
    return {
      text: "Here is my LinkedIn profile.",
      links: [knownLinks.linkedin],
    };
  }

  if (/\bgit\s*hub\b|\bgithub\b/i.test(question)) {
    return {
      text: "Here is my GitHub profile.",
      links: [knownLinks.github],
    };
  }

  if (/\bemail\b|\be-mail\b/i.test(question)) {
    return {
      text: "Here is the best email to reach me.",
      links: [knownLinks.email],
    };
  }

  if (/\b(links?|profiles?|socials?)\b/i.test(question)) {
    return {
      text: "Here are the main links.",
      links: [
        knownLinks.linkedin,
        knownLinks.github,
        knownLinks.resume,
        knownLinks.resumeAnalyzer,
        knownLinks.cardboardKings,
        knownLinks.babyDaddy,
      ],
    };
  }

  return null;
};

const getHrefFromMatchedUrl = (url: string) => {
  if (/^https?:\/\//i.test(url)) return url;
  if (/^www\./i.test(url)) return `https://${url}`;
  return `https://${url}`;
};

const renderLinkedText = (text: string) => {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(autoLinkPattern)) {
    const matchedUrl = match[0];
    const index = match.index ?? 0;
    const trailingPunctuation = matchedUrl.match(trailingPunctuationPattern)?.[0] ?? "";
    const linkText = trailingPunctuation
      ? matchedUrl.slice(0, -trailingPunctuation.length)
      : matchedUrl;

    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }

    nodes.push(
      <a
        key={`${linkText}-${index}`}
        href={getHrefFromMatchedUrl(linkText)}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-amber-200 underline decoration-amber-300/60 underline-offset-4 transition hover:text-amber-100"
      >
        {linkText}
      </a>
    );

    if (trailingPunctuation) {
      nodes.push(trailingPunctuation);
    }

    lastIndex = index + matchedUrl.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : text;
};

export default function FloatingChatbot({
  onResumeRequest,
  onContactRequest,
  onProjectsRequest,
}: FloatingChatbotProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(2);

  useEffect(() => {
    const container = listRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isThinking]);

  const createMessage = (
    role: Message["role"],
    text: string,
    links?: ChatLink[]
  ): Message => {
    const message = {
      id: nextId.current,
      role,
      text,
      links,
    };

    nextId.current += 1;
    return message;
  };

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

    setMessages((prev) => [...prev, createMessage("user", trimmed)]);
    setInput("");

    const linkRequestResponse = getLinkRequestResponse(trimmed);
    if (linkRequestResponse) {
      if (linkRequestResponse.shouldSpotlightResume) {
        onResumeRequest?.();
      }
      if (linkRequestResponse.shouldSpotlightContact) {
        onContactRequest?.();
      }
      if (linkRequestResponse.shouldSpotlightProjects) {
        onProjectsRequest?.();
      }
      setMessages((prev) => [
        ...prev,
        createMessage(
          "bot",
          linkRequestResponse.text,
          linkRequestResponse.links
        ),
      ]);
      return;
    }

    setIsThinking(true);

    const answer = await fetchAnswer(trimmed);

    setMessages((prev) => [...prev, createMessage("bot", answer)]);
    setIsThinking(false);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        title="Open Dylan chatbot"
        aria-label="Open Dylan chatbot"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-3 z-[80] inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-2xl shadow-slate-950/25 transition hover:-translate-y-0.5 hover:bg-amber-700 sm:bottom-5 sm:left-5 dark:bg-white dark:text-slate-950 dark:hover:bg-amber-300"
      >
        <FaComments size={22} />
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28 }}
      className="fixed bottom-4 left-3 z-[80] w-[calc(100vw-1.5rem)] max-w-[23rem] text-left shadow-2xl shadow-slate-950/20 sm:bottom-5 sm:left-5"
    >
      <section
        aria-label="Dylan chatbot"
        className="overflow-hidden rounded-[1.35rem] border border-white/15 bg-slate-950 text-white"
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {"Dylan's assistant"}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">Online now</p>
          </div>
          <button
            type="button"
            title="Minimize Dylan chatbot"
            aria-label="Minimize Dylan chatbot"
            onClick={() => setIsOpen(false)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-amber-300/70 hover:text-amber-200"
          >
            <FaMinus size={14} />
          </button>
        </div>

        <div
          ref={listRef}
          aria-live="polite"
          className="max-h-[min(46vh,20rem)] min-h-44 space-y-3 overflow-y-auto bg-slate-950 px-4 py-4"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[86%] rounded-[1.1rem] px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-amber-600 to-indigo-700 text-white"
                    : "border border-white/10 bg-white/10 text-slate-100"
                }`}
              >
                <span>{renderLinkedText(message.text)}</span>
                {message.links ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-xs font-semibold text-amber-100 transition hover:border-amber-200/70 hover:bg-amber-300/20 focus:outline-none focus:ring-2 focus:ring-amber-300"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex justify-start">
              <div className="rounded-[1.1rem] border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-300">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-white/10 bg-white/[0.04] p-3"
        >
          <input
            type="text"
            className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/8 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-amber-400"
            placeholder="Ask Dylan..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            aria-label="Ask Dylan a question"
          />
          <button
            type="submit"
            title="Send message"
            aria-label="Send message"
            disabled={!input.trim() || isThinking}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <FaPaperPlane size={15} />
          </button>
        </form>
      </section>
    </motion.div>
  );
}
