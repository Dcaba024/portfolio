"use client";

import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    // main just stacks sections; no centering here
    <main className="flex flex-col bg-black text-center">
      {/* === HERO === */}
      <section className="flex flex-col items-center justify-center h-screen px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Hi, I’m <span className="text-blue-600">Dylan Caballero</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-100 max-w-xl mx-auto mb-8">
            Front-End Developer passionate about crafting sleek, accessible, and
            high-performance web apps with React, Next.js, and modern UI frameworks.
          </p>

          <div className="flex justify-center gap-4">
            <a
              href="#projects "
              className="px-5 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              View Projects
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              className="px-5 py-3 border border-white text-white rounded-lg shadow hover:bg-white hover:text-black transition"
            >
              Download Resume
            </a>
          </div>

          <div className="flex justify-center gap-6 mt-10">
            <a
              href="https://github.com/Dcaba024"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-600 transition"
            >
              <FaGithub size={30} />
            </a>
            <a
              href="https://www.linkedin.com/in/dylan-caballero-54963b185/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-600 transition"
            >
              <FaLinkedin size={30} />
            </a>
          </div>
        </motion.div>
      </section>

      {/* === ABOUT === */}
      <About />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
