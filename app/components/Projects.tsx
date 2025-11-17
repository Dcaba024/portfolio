"use client";

import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const projects = [
  {
    title: "Heart Warming Request",
    description:
      "This was a simple surprise for my daughter's god parents. it was meant to be a surprise when they click on the envelope a surprise happens",
    tech: ["React", "Tailwind", "Vercel"],
    github: "https://github.com/Dcaba024/GodParents",
    demo: "https://surprise-coral-gamma.vercel.app/",
  },
  {
    title: "Resume Analyzer",
    description:
      "An AI-driven app that compares resumes against job descriptions and gives match scores with actionable feedback.",
    tech: ["Next.js", "OpenAI API", "Tailwind"],
    github: "https://github.com/Dcaba024/Resume-Analyzer",
    demo: "https://resume-analyzer-woad.vercel.app/",
  },
];

export default function Projects() {
  return (
    <section
      id="projects"
      className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white px-6 py-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-6xl text-center"
      >
        <h2 className="text-4xl font-bold mb-10 text-blue-500">Projects</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="bg-black border border-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition"
              whileHover={{ scale: 1.03 }}
            >
              <h3 className="text-2xl font-semibold mb-3 text-white">
                {project.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {project.description}
              </p>

              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {project.tech.map((tech, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex justify-center gap-4 mt-4">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-500 transition"
                >
                  <FaGithub size={22} />
                </a>
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-500 transition"
                >
                  <FaExternalLinkAlt size={20} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
