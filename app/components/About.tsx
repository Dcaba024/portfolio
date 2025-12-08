"use client";

import { FormEvent, useRef, useState } from "react";
import { motion } from "framer-motion";

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
};

const knowledgeBase = [
  {
    keywords: ["experience", "years", "background", "career", "story"],
    answer:
      "I’m an AI-focused software engineer with 5 years of professional experience building scalable React and Next.js applications, most recently delivering enterprise tools at Deloitte.",
  },
  {
    keywords: ["deloitte", "current role", "job", "work"],
    answer:
      "At Deloitte I design and ship enterprise-grade web applications that support millions of users. My focus is on clean UI systems, accessibility, and collaborating with cross-functional teams inside Agile sprints.",
  },
  {
    keywords: ["skills", "stack", "technologies", "tools", "languages"],
    answer:
      "Day to day I work with TypeScript, React, Next.js, Tailwind, and Node.js. On the data side I have hands-on experience with Python, TensorFlow, PyTorch, and scikit-learn for model development.",
  },
  {
    keywords: ["ai", "machine learning", "ml", "artificial"],
    answer:
      "I specialize in integrating AI into products—building machine learning workflows, deploying models, and exploring areas like NLP and computer vision to keep improving user experiences.",
  },
  {
    keywords: ["projects", "ai resume analyzer", "side project"],
    answer:
      "I created the AI Resume Analyzer, a full-stack React and Node.js platform that uses OpenAI APIs to score resumes, match jobs, and provide personalized recommendations.",
  },
  {
    keywords: ["accomplishment", "achievement", "impact", "success", "result"],
    answer:
      "My proudest accomplishment is leading front-end delivery for a statewide Deloitte project that serves millions of residents—owning the authentication UX and accessibility workstreams while keeping performance and quality KPIs above target. On the side, launching the AI Resume Analyzer proved I can take an AI product from concept to deployment solo.",
  },
  {
    keywords: ["strength", "strengths", "superpower", "value", "advantage"],
    answer:
      "My strengths blend product sense with engineering rigor: I can translate business needs into polished user experiences, rapidly prototype with AI, and keep large-scale React systems maintainable through strong component architecture, accessibility, and testing practices.",
  },
  {
    keywords: ["leadership", "mentor", "team lead", "manage", "collaborate"],
    answer:
      "I regularly mentor newer engineers at Deloitte, pairing on tickets and reviewing code to ensure we uphold accessibility and performance standards. I thrive in cross-functional squads where designers, PMs, and engineers iterate together.",
  },
  {
    keywords: ["education", "school", "degree", "university", "college"],
    answer:
      "I earned my B.S. in Computer Science from Florida International University in 2020.",
  },
  {
    keywords: ["location", "based", "from", "miami", "florida"],
    answer:
      "I’m based in Florida and originally from Miami, so I’m comfortable collaborating remotely across U.S. time zones.",
  },
  {
    keywords: ["contact", "email", "phone", "linkedin"],
    answer:
      "You can reach me at CaballeroDylan96@gmail.com, connect on LinkedIn at linkedin.com/in/dylan-caballero-54963b185, or call (954) 589-3197.",
  },
  {
    keywords: [
      "availability",
      "available",
      "start date",
      "timeline",
      "notice",
      "schedule",
      "time slot",
      "hours",
    ],
    answer:
      "I keep Mondays through Fridays from 12 PM to 5 PM ET open for recruiter conversations, and my email/phone are listed right on my resume. If you need a specific start date we can align once we connect.",
  },
  {
    keywords: ["relocate", "relocation", "remote", "work location"],
    answer:
      "I’m based in Florida but fully comfortable working remotely. I’m open to limited travel for key planning sessions or team offsites when needed.",
  },
  {
    keywords: ["culture", "team", "communication", "collaboration"],
    answer:
      "I do my best work on collaborative teams that value open communication, trust, and continuous improvement. I’m proactive about sharing context, documenting decisions, and running tight feedback loops with designers and stakeholders.",
  },
  {
    keywords: ["learning", "certification", "upskill", "growth"],
    answer:
      "Continuous learning is important to me—I’m actively pursuing AI/ML certifications and experimenting with new tooling in NLP and computer vision to keep leveling up.",
  },
  {
    keywords: ["interests", "hobbies", "food"],
    answer:
      "Outside of work you’ll find me training Brazilian Jiu-Jitsu and hunting down great Colombian food—cheesecake and pizza are staples for me.",
  },
  {
    keywords: [
      "challenge",
      "biggest challenge",
      "difficult",
      "problem",
      "obstacle",
    ],
    answer:
      "One meaningful challenge was rebuilding the authentication UX for a statewide Deloitte platform under a tight compliance deadline. I led the front-end effort, aligning design, security, and accessibility stakeholders so we could launch on time while meeting WCAG 2.1 AA and performance targets.",
  },
  {
    keywords: ["motivation", "why leave", "new role", "next role", "goal"],
    answer:
      "I’m excited to keep pushing deeper into AI-enabled products and front-end platforms where I can own a larger scope. Deloitte’s been fantastic, but I’m ready to take those enterprise learnings to a team that needs an engineer who can blend UX, AI, and platform thinking.",
  },
  {
    keywords: [
      "team size",
      "teamwork",
      "cross functional",
      "collaboration style",
    ],
    answer:
      "I typically work inside Agile squads of 6–10 people—PM, designer, accessibility lead, and engineers. I stay close to design reviews, keep async notes in Notion, and run tight feedback loops so shipping is predictable.",
  },
  {
    keywords: ["process", "agile", "scrum", "workflow", "delivery"],
    answer:
      "My delivery rhythm is Agile/Scrum: refine stories with PMs, break down work into composable components, pair program when needed, and keep PRs focused and well-tested. I also invest in documentation so handoffs are painless.",
  },
  {
    keywords: [
      "certification",
      "certifications",
      "learning path",
      "courses",
      "training",
    ],
    answer:
      "I’m actively pursuing AI/ML certifications to stay sharp—diving into advanced NLP, vector search techniques, and computer vision so I can bring modern patterns straight into client work.",
  },
  {
    keywords: [
      "authorization",
      "work authorization",
      "visa",
      "sponsorship",
      "status",
    ],
    answer:
      "I’ve been working in the U.S. throughout my career and handle U.S.-based roles without needing sponsorship. Happy to provide any verification your HR team requires.",
  },
  {
    keywords: [
      "compensation",
      "salary",
      "pay",
      "rate",
      "budget",
      "expectation",
    ],
    answer:
      "I prefer to discuss compensation after we’ve aligned on scope, expectations, and team fit. I’m confident we can find a range that reflects the impact you need.",
  },
  {
    keywords: [
      "contract",
      "full time",
      "employment type",
      "engagement",
      "w2",
      "c2c",
    ],
    answer:
      "I’m open to full-time roles and select contract engagements if they involve building meaningful AI-infused products. Let me know what you have in mind.",
  },
];

const fallbackAnswer =
  "I’m not sure about that yet, but feel free to ask about my experience, skills, current work, or background.";

export default function About() {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: Date.now(),
      role: "bot",
      text: "Hi! I’m Dylan Caballero. Ask me anything about my work, skills, or experience and I’ll share the details.",
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

  const generateAnswer = (question: string) => {
    const normalized = question.toLowerCase();
    const sanitized = normalized
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const tokens = new Set(sanitized.split(" ").filter(Boolean));

    const matched = knowledgeBase.find((entry) =>
      entry.keywords.some((keyword) => {
        const normalizedKeyword = keyword.toLowerCase();
        if (normalizedKeyword.includes(" ")) {
          return sanitized.includes(normalizedKeyword);
        }
        return tokens.has(normalizedKeyword);
      })
    );

    return matched ? matched.answer : fallbackAnswer;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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

    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now(),
        role: "bot",
        text: generateAnswer(trimmed),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsThinking(false);
      scrollToBottom();
    }, 500);
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
            I’m a Front-End Developer with{" "}
            <span className="text-white font-semibold">
              5+ years of experience
            </span>{" "}
            crafting modern web applications. I currently build enterprise-grade
            solutions at Deloitte with a focus on authentication, accessibility,
            and scalable UI systems.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed">
            I love collaborating on AI-driven products, integrating machine
            learning into real-world apps, and experimenting with new tooling.
            Ask me anything below to learn how I can help your team.
          </p>
        </div>

        <div className="bg-[#0f111a] border border-blue-900/40 rounded-2xl p-6 shadow-2xl shadow-blue-900/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm uppercase tracking-widest text-gray-400">
                Dylan Caballero
              </p>
              <p className="text-xl font-semibold text-white">
                Career Chatbot
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
              placeholder="Ask about my experience, skills, or recent work..."
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
