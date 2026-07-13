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
            <p className="section-kicker">IAM + AI Integration</p>
            <h2 className="mt-5 max-w-md text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
              I build secure identity systems, full-stack products, and production AI automations.
            </h2>
          </div>

          <div className="space-y-4 text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
            <p>
              I’m a full stack software engineer focused on identity and access
              management, OAuth 2.0, MFA, and account-lifecycle security, with
              applied AI agent and automation development.
            </p>
            <p>
              My recent work includes supporting ForgeRock-based IAM flows, OAuth
              2.0 authorization, and Google reCAPTCHA integrations for public-sector
              experiences serving Texas.gov and TXDMV users.
            </p>
            <p>
              I also build production AI agents and automations with LangChain,
              CrewAI, n8n, and OpenAI/Claude APIs, with an emphasis on reliable
              outputs and practical evaluation loops.
            </p>
          </div>
        </div>

        <div className="grid gap-3 self-center sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-[1rem] border border-white/20 bg-slate-950/50 p-4">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/70">Identity security</p>
            <p className="mt-2 font-semibold text-white">
              ForgeRock IAM, OAuth 2.0, MFA
            </p>
          </div>
          <div className="rounded-[1rem] border border-white/20 bg-slate-950/50 p-4">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/70">AI agents</p>
            <p className="mt-2 font-semibold text-white">
              LangChain, CrewAI, and n8n
            </p>
          </div>
          <div className="rounded-[1rem] border border-white/20 bg-slate-950/50 p-4">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/70">Engineering</p>
            <p className="mt-2 font-semibold text-white">
              Secure full-stack product delivery
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
