"use client";

import { type Ref } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaExternalLinkAlt, FaGithub } from "react-icons/fa";

const projects = [
  {
    title: "Caballero Technologies",
    description:
      "The consulting and product studio site for Caballero Technologies, showcasing IAM, full-stack, and AI automation services with a modern, conversion-focused build.",
    tech: ["Next.js", "Tailwind", "Vercel"],
    github: "https://github.com/Dcaba024/caballero-technologies",
    demo: "https://caballerotechnologies.com",
  },
  {
    title: "BabbyDaddy.com",
    description:
      "An AI legal-guidance agent for fathers who cannot afford a lawyer and are fighting for custody rights, helping them understand options, organize case details, and prepare next steps.",
    tech: ["Web App", "Responsive UI", "Vercel"],
    github: "https://github.com/Dcaba024/babydaddy",
    demo: "https://babbydaddy.com",
  },
  {
    title: "Resume Analyzer",
    description:
      "An automated AI scoring pipeline that extracts resume context, compares it with job requirements, and returns match scores with actionable feedback.",
    tech: ["Next.js", "OpenAI API", "AI Automation"],
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
  }
  
];

type ProjectsProps = {
  sectionRef?: Ref<HTMLElement>;
  isSpotlighted?: boolean;
};

export default function Projects({
  sectionRef,
  isSpotlighted = false,
}: ProjectsProps) {
  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-label="Selected Work"
      tabIndex={-1}
      className={`section-shell px-4 py-6 transition focus:outline-none md:px-10 md:py-10 ${
        isSpotlighted
          ? "relative z-[85] rounded-[2rem] ring-4 ring-white ring-offset-4 ring-offset-slate-950"
          : ""
      }`}
    >
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
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              AI automations, full-stack applications, and production-ready product work.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
              These projects show how I connect interfaces, APIs, data, and AI to
              automate decisions, reduce manual work, and solve clear user needs.
            </p>
          </div>
          <a
            href="#contact"
            className="btn-hud w-full self-start rounded-[0.4rem] px-5 py-3 sm:w-auto"
          >
            Start a conversation
            <FaArrowRight />
          </a>
        </div>

        <div className="mt-8 grid gap-5 lg:mt-10 lg:grid-cols-3 lg:gap-6">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              className="card-glow group rounded-[1.25rem] border border-white/20 bg-slate-950/55 p-6 shadow-lg shadow-black/10"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.22 }}
            >
              <div className="flex items-center justify-between">
                <span className="mono-stat text-sm font-semibold text-white">
                  0{index + 1}
                </span>
                <div className="flex gap-3 text-slate-400">
                  {project.github ? (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} GitHub repository`}
                      className="rounded-[0.35rem] border border-white/20 p-3 transition hover:border-white/70 hover:text-white"
                    >
                      <FaGithub size={18} />
                    </a>
                  ) : null}
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} live demo`}
                    className="rounded-[0.35rem] border border-white/20 p-3 transition hover:border-white/70 hover:text-white"
                  >
                    <FaExternalLinkAlt size={16} />
                  </a>
                </div>
              </div>

              <h3 className="mt-8 text-2xl font-semibold text-white">
                {project.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {project.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-[0.3rem] border border-white/20 bg-white/5 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/80"
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
