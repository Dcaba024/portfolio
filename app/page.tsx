"use client";

import { motion } from "framer-motion";
import { FaArrowRight, FaGithub, FaLinkedin } from "react-icons/fa";
import About from "./components/About";
import Connect4 from "./components/Connect4";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const highlights = [
  { label: "Specialty", value: "IAM, AI, and front-end delivery" },
  { label: "Experience", value: "Texas.gov and TXDMV programs" },
  { label: "Core stack", value: "Next.js, React, TypeScript, OpenAI" },
];

export default function Home() {
  return (
    <main className="flex flex-col pb-8 text-center">
      <section className="section-shell min-h-screen px-6 pt-6 pb-12 md:px-10 md:pt-10">
        <div className="glass-panel grid-lines rounded-[2rem] p-6 md:p-8">
          <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="text-left">
                <p className="section-kicker">Dylan Caballero</p>
              </div>
              <nav className="flex flex-wrap justify-start gap-3 text-sm font-medium text-slate-600 dark:text-slate-300 md:justify-end">
                <a href="#about" className="rounded-full px-4 py-2 hover:bg-white/60 dark:hover:bg-white/5">
                  About
                </a>
                <a href="#projects" className="rounded-full px-4 py-2 hover:bg-white/60 dark:hover:bg-white/5">
                  Projects
                </a>
                <a href="#connect4" className="rounded-full px-4 py-2 hover:bg-white/60 dark:hover:bg-white/5">
                  Playground
                </a>
                <a href="#contact" className="rounded-full px-4 py-2 hover:bg-white/60 dark:hover:bg-white/5">
                  Contact
                </a>
              </nav>
            </header>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="grid gap-8 py-8 text-left lg:grid-cols-[1.2fr_0.8fr] lg:items-end"
            >
              <div className="space-y-6">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-700 dark:text-teal-300">
                  Software Engineer • IAM Engineer • Front-End Builder
                </p>
                <h1 className="max-w-4xl text-5xl font-semibold leading-none tracking-[-0.05em] text-slate-950 md:text-7xl dark:text-white">
                  Dylan Caballero builds secure, user-focused products for modern web teams.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                  I’m a software engineer with hands-on experience in identity and
                  access management, AI-assisted applications, and polished React
                  interfaces. My work spans secure authentication flows, public-sector
                  digital services, and product experiences designed to be both clear
                  for users and dependable for stakeholders.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <a
                    href="#projects"
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
                  >
                    View projects
                    <FaArrowRight />
                  </a>
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-800 hover:-translate-y-0.5 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                  >
                    Download resume
                  </a>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[1.75rem] border border-white/60 bg-white/80 p-6 text-left shadow-lg shadow-slate-900/5 dark:border-white/10 dark:bg-slate-950/70">
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    Snapshot
                  </p>
                  <div className="mt-5 grid gap-4">
                    {highlights.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between gap-4 border-b border-slate-200/70 pb-3 last:border-none last:pb-0 dark:border-slate-800"
                      >
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {item.label}
                        </span>
                        <span className="text-right text-sm font-semibold text-slate-900 dark:text-white">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-teal-900/10 bg-gradient-to-br from-teal-600 to-cyan-700 p-6 text-left text-white shadow-xl shadow-teal-900/15">
                  <p className="text-sm uppercase tracking-[0.22em] text-white/70">
                    Currently
                  </p>
                  <p className="mt-3 text-2xl font-semibold leading-tight">
                    Building secure authentication journeys, AI-powered features, and
                    production-ready web experiences.
                  </p>
                  <div className="mt-6 flex gap-4">
                    <a
                      href="https://github.com/Dcaba024"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-white/20 p-3 text-white/90 hover:bg-white/10"
                    >
                      <FaGithub size={22} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/dylan-caballero-54963b185/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-white/20 p-3 text-white/90 hover:bg-white/10"
                    >
                      <FaLinkedin size={22} />
                    </a>
                  </div>
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
