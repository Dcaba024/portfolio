"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
   <section
  id="about"
  className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white px-6 py-16"
>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-3xl text-center"
      >
        <h2 className="text-4xl font-bold mb-6 text-blue-500">About Me</h2>
        <p className="text-lg text-gray-300 leading-relaxed mb-6">
          I’m a Front-End Developer with <span className="text-white font-semibold">5+ years of experience</span> crafting modern web applications. 
          I’ve worked at Deloitte where I built enterprise-grade React applications for the State of Texas, focusing on 
          authentication flows, accessibility, and scalable UI components.
        </p>
        <p className="text-lg text-gray-300 leading-relaxed">
          I’m passionate about building interactive, high-performance interfaces with technologies like 
          <span className="text-white font-semibold"> Next.js, React, and Tailwind CSS</span>. 
          Outside of coding, I’m diving into <span className="text-white font-semibold">cybersecurity</span> and enjoy 
          training Brazilian Jiu-Jitsu in my free time.
        </p>
      </motion.div>
    </section>
  );
}
