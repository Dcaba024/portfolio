"use client";

import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="section-shell px-6 pt-6 pb-10 md:px-10">
      <div className="glass-panel flex flex-col items-start justify-between gap-4 rounded-[1.75rem] px-6 py-5 text-sm text-slate-600 md:flex-row md:items-center dark:text-slate-300">
        <p>© {new Date().getFullYear()} Dylan Caballero. All rights reserved.</p>

        <div className="flex gap-3">
          <a
            href="https://github.com/Dcaba024"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-slate-300 p-3 hover:border-amber-600 hover:text-amber-700 dark:border-white/10 dark:hover:border-amber-400 dark:hover:text-amber-300"
          >
            <FaGithub size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/dylan-caballero-54963b185/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-slate-300 p-3 hover:border-amber-600 hover:text-amber-700 dark:border-white/10 dark:hover:border-amber-400 dark:hover:text-amber-300"
          >
            <FaLinkedin size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
