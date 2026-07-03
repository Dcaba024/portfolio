"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="section-shell px-4 py-6 md:px-10 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="glass-panel grid gap-6 rounded-[1.75rem] p-5 text-left md:gap-8 md:rounded-[2rem] md:p-8 lg:grid-cols-[0.95fr_1.05fr]"
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
        </div>

        <div className="grid gap-3 self-center sm:grid-cols-3 lg:grid-cols-1">
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
      </motion.div>
    </section>
  );
}
