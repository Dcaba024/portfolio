"use client";

import { motion } from "framer-motion";
import { FaArrowRight, FaExternalLinkAlt, FaGithub } from "react-icons/fa";

const projects = [
  {
    title: "Resume Analyzer",
    description:
      "An AI-driven app that compares resumes against job descriptions and returns match scores with practical feedback.",
    tech: ["Next.js", "OpenAI API", "Tailwind"],
    github: "https://github.com/Dcaba024/Resume-Analyzer",
    demo: "https://resume-analyzer-woad.vercel.app/",
  },
  {
    title: "Cardboard Kings",
    description:
      "A fan-focused sports card storefront where collectors can book cleaning services and sell prized collectibles.",
    tech: ["Next.js", "Postgres", "Tailwind"],
    github: "https://github.com/Dcaba024/cardboardkings",
    demo: "https://cardboardkings.org",
  },
  {
    title: "Spring Boot Task Manager",
    description:
      "A CRUD task management app with a Spring Boot backend for creating, updating, tracking, and deleting tasks.",
    tech: ["Spring Boot", "Java", "CRUD"],
    github: "https://github.com/Dcaba024/spring-task-manager",
    demo: "https://spring-task-manager.vercel.app/",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="section-shell px-4 py-6 md:px-10 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="glass-panel rounded-[1.75rem] p-5 text-left md:rounded-[2rem] md:p-8"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="section-kicker">Selected Work</p>
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
              A mix of front-end builds, AI applications, and polished product work.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 dark:text-slate-300">
              These projects reflect how I approach implementation: clean UI,
              practical functionality, and products that solve a clear user need.
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex w-full items-center justify-center gap-3 self-start rounded-full border border-slate-300 bg-white/75 px-5 py-3 text-sm font-semibold text-slate-800 hover:-translate-y-0.5 sm:w-auto dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"
          >
            Start a conversation
            <FaArrowRight />
          </a>
        </div>

        <div className="mt-8 grid gap-5 lg:mt-10 lg:grid-cols-3 lg:gap-6">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              className="group rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-slate-900/5 dark:border-white/10 dark:bg-slate-950/55"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.22 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  0{index + 1}
                </span>
                <div className="flex gap-3 text-slate-500 dark:text-slate-400">
                  {project.github ? (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} GitHub repository`}
                      className="rounded-full border border-slate-200 p-3 hover:border-amber-600 hover:text-amber-700 dark:border-white/10 dark:hover:border-amber-400 dark:hover:text-amber-300"
                    >
                      <FaGithub size={18} />
                    </a>
                  ) : null}
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} live demo`}
                    className="rounded-full border border-slate-200 p-3 hover:border-amber-600 hover:text-amber-700 dark:border-white/10 dark:hover:border-amber-400 dark:hover:text-amber-300"
                  >
                    <FaExternalLinkAlt size={16} />
                  </a>
                </div>
              </div>

              <h3 className="mt-8 text-2xl font-semibold text-slate-950 dark:text-white">
                {project.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {project.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
