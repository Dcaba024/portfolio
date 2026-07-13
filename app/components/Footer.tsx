"use client";

import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="section-shell px-6 pt-6 pb-10 md:px-10">
      <div className="glass-panel flex flex-col items-start justify-between gap-4 rounded-[1.75rem] px-6 py-5 font-mono text-xs text-slate-400 md:flex-row md:items-center">
        <p>© {new Date().getFullYear()} Dylan Caballero. All rights reserved.</p>

        <div className="flex gap-3">
          <a
            href="https://github.com/Dcaba024"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[0.35rem] border border-white/20 p-3 transition hover:border-white/70 hover:text-white"
          >
            <FaGithub size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/dylan-caballero-54963b185/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[0.35rem] border border-white/20 p-3 transition hover:border-white/70 hover:text-white"
          >
            <FaLinkedin size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
