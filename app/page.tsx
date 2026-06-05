"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowRight, FaGithub, FaLinkedin } from "react-icons/fa";
import About from "./components/About";
import Connect4 from "./components/Connect4";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const highlights = [
  { label: "AI systems", value: "Agents, prompts, scoring, and evaluation" },
  { label: "Automation", value: "Workflows, extraction, and decision support" },
  { label: "Core stack", value: "Next.js, React, Java, Spring Boot, OpenAI APIs" },
];

export default function Home() {
  return (
    <main className="flex flex-col pb-24 text-center md:pb-8">
      <section className="section-shell min-h-screen px-4 pt-4 pb-10 md:px-10 md:pt-10 md:pb-12">
        <div className="glass-panel grid-lines rounded-[1.75rem] p-5 md:rounded-[2rem] md:p-8">
          <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="text-left">
                <p className="section-kicker">Dylan Caballero</p>
              </div>
              <nav className="flex flex-wrap justify-start gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 sm:text-sm md:justify-end">
                <a href="#about" className="rounded-full px-3 py-2 hover:bg-white/60 dark:hover:bg-white/5 sm:px-4">
                  About
                </a>
                <a href="#projects" className="rounded-full px-3 py-2 hover:bg-white/60 dark:hover:bg-white/5 sm:px-4">
                  Projects
                </a>
                <a href="#connect4" className="rounded-full px-3 py-2 hover:bg-white/60 dark:hover:bg-white/5 sm:px-4">
                  Playground
                </a>
                <a href="#contact" className="rounded-full px-3 py-2 hover:bg-white/60 dark:hover:bg-white/5 sm:px-4">
                  Contact
                </a>
              </nav>
            </header>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="grid gap-8 py-6 text-left lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center lg:gap-x-12 lg:gap-y-7 lg:py-10 xl:grid-cols-[minmax(0,1fr)_22rem]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-800 dark:text-amber-300 sm:text-sm sm:tracking-[0.3em] lg:col-start-1 lg:row-start-1">
                Software Engineer • AI Automation Engineer • Full-Stack Builder
              </p>

              <aside className="mx-auto grid w-full max-w-xs gap-4 sm:max-w-sm lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none">
                <div className="overflow-hidden rounded-[1.75rem] border border-white/60 bg-slate-950 shadow-2xl shadow-slate-950/15 md:rounded-[2rem] dark:border-white/10">
                  <Image
                    src="/Dylan.PNG"
                    alt="Dylan Caballero"
                    width={220}
                    height={200}
                    priority
                    className="aspect-[4/5] w-full object-cover object-center"
                  />
                </div>

                <div className="grid gap-4 rounded-[1.5rem] border border-indigo-900/10 bg-gradient-to-br from-amber-700 to-indigo-800 p-5 text-white shadow-xl shadow-indigo-950/15 sm:grid-cols-[1fr_auto] sm:items-end lg:block">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                      Currently
                    </p>
                    <p className="mt-2 text-base font-semibold leading-7">
                      Building secure authentication journeys, AI agents, and
                      automated workflows that move products and teams faster.
                    </p>
                  </div>
                  <div className="flex gap-3 lg:mt-4">
                    <a
                      href="https://github.com/Dcaba024"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Dylan Caballero GitHub"
                      className="rounded-full border border-white/20 p-3 text-white/90 hover:bg-white/10"
                    >
                      <FaGithub size={20} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/dylan-caballero-54963b185/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Dylan Caballero LinkedIn"
                      className="rounded-full border border-white/20 p-3 text-white/90 hover:bg-white/10"
                    >
                      <FaLinkedin size={20} />
                    </a>
                  </div>
                </div>
              </aside>

              <div className="space-y-7 lg:col-start-1 lg:row-start-2">
                <div className="space-y-5">
                  <h1 className="max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-slate-950 sm:text-5xl md:text-6xl xl:text-7xl dark:text-white">
                    Building intelligent products and automations that turn complex work into reliable workflows.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-300">
                    I’m Dylan Caballero, a software engineer with hands-on
                    experience across identity and access management, AI agents,
                    workflow automation, Java/Spring Boot backends, and polished
                    React interfaces.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <a
                    href="#projects"
                    className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 hover:-translate-y-0.5 sm:w-auto dark:bg-white dark:text-slate-950"
                  >
                    View projects
                    <FaArrowRight />
                  </a>
                  <a
                    href="/Dylan-Caballero-AI-Resume.pdf"
                    download="Dylan-Caballero-AI-Resume.pdf"
                    className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-800 hover:-translate-y-0.5 hover:border-slate-400 sm:w-auto dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                  >
                    Download resume
                  </a>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {highlights.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.25rem] border border-white/60 bg-white/75 p-4 shadow-lg shadow-slate-900/5 dark:border-white/10 dark:bg-slate-950/60"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-950 dark:text-white">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <About />
      <Connect4 />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
