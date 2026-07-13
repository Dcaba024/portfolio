"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowRight, FaGithub, FaLinkedin } from "react-icons/fa";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingChatbot from "./components/FloatingChatbot";

const highlights = [
  { label: "IAM + OAuth", value: "ForgeRock, OAuth 2.0, MFA, and SSO" },
  { label: "AI agents", value: "LangChain, CrewAI, n8n, OpenAI/Claude APIs" },
  { label: "Core stack", value: "Next.js, React, Java, Spring Boot, AWS" },
];

type SpotlightTarget = "resume" | "contact" | "projects";

type Spotlight = {
  x: number;
  y: number;
  radius: number;
  target: SpotlightTarget;
};

export default function Home() {
  const [activeSpotlightTarget, setActiveSpotlightTarget] =
    useState<SpotlightTarget | null>(null);
  const [spotlight, setSpotlight] = useState<Spotlight | null>(null);
  const [systemTime, setSystemTime] = useState<string | null>(null);
  const resumeLinkRef = useRef<HTMLAnchorElement>(null);
  const contactFormRef = useRef<HTMLFormElement>(null);
  const projectsSectionRef = useRef<HTMLElement>(null);
  const spotlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spotlightMeasureTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const spotlightFrame = useRef<number | null>(null);

  const getSpotlightElement = useCallback((target: SpotlightTarget) => {
    if (target === "resume") return resumeLinkRef.current;
    if (target === "contact") return contactFormRef.current;
    return projectsSectionRef.current;
  }, []);

  const updateSpotlight = useCallback(
    (target: SpotlightTarget) => {
      const element = getSpotlightElement(target);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      setSpotlight({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        radius: Math.max(rect.width, rect.height) * 0.72 + 56,
        target,
      });
    },
    [getSpotlightElement]
  );

  useEffect(() => {
    const updateTime = () =>
      setSystemTime(
        new Date().toLocaleTimeString("en-US", { hour12: false })
      );
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    return () => {
      if (spotlightTimer.current) {
        clearTimeout(spotlightTimer.current);
      }

      spotlightMeasureTimers.current.forEach((timer) => clearTimeout(timer));

      if (spotlightFrame.current) {
        cancelAnimationFrame(spotlightFrame.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!activeSpotlightTarget) return;

    const syncSpotlight = () => updateSpotlight(activeSpotlightTarget);

    window.addEventListener("resize", syncSpotlight);
    window.addEventListener("scroll", syncSpotlight, { passive: true });

    return () => {
      window.removeEventListener("resize", syncSpotlight);
      window.removeEventListener("scroll", syncSpotlight);
    };
  }, [activeSpotlightTarget, updateSpotlight]);

  const dismissSpotlight = useCallback(() => {
    if (spotlightTimer.current) {
      clearTimeout(spotlightTimer.current);
      spotlightTimer.current = null;
    }
    setActiveSpotlightTarget(null);
    setSpotlight(null);
  }, []);

  useEffect(() => {
    if (!activeSpotlightTarget) return;

    const handlePointerDown = (event: PointerEvent) => {
      const element = getSpotlightElement(activeSpotlightTarget);
      if (
        element &&
        event.target instanceof Node &&
        element.contains(event.target)
      ) {
        return;
      }
      dismissSpotlight();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismissSpotlight();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeSpotlightTarget, dismissSpotlight, getSpotlightElement]);

  const spotlightTarget = (target: SpotlightTarget) => {
    const element = getSpotlightElement(target);
    if (!element) return;

    setActiveSpotlightTarget(target);
    element.scrollIntoView?.({
      behavior: "smooth",
      block: "center",
    });
    element.focus({ preventScroll: true });
    updateSpotlight(target);

    if (spotlightTimer.current) {
      clearTimeout(spotlightTimer.current);
    }

    spotlightMeasureTimers.current.forEach((timer) => clearTimeout(timer));

    if (spotlightFrame.current) {
      cancelAnimationFrame(spotlightFrame.current);
    }

    spotlightFrame.current = window.requestAnimationFrame(() =>
      updateSpotlight(target)
    );
    spotlightMeasureTimers.current = [280, 650].map((delay) =>
      setTimeout(() => updateSpotlight(target), delay)
    );

    spotlightTimer.current = setTimeout(() => {
      dismissSpotlight();
    }, 6000);
  };

  const spotlightStyle: CSSProperties | undefined = spotlight
    ? {
        background: `radial-gradient(circle ${spotlight.radius}px at ${spotlight.x}px ${spotlight.y}px, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0) 46%, rgba(2, 6, 23, 0.62) 70%, rgba(2, 6, 23, 0.9) 100%)`,
      }
    : undefined;

  return (
    <main className="flex flex-col pb-24 text-center md:pb-8">
      <section className="section-shell min-h-screen px-4 pt-4 pb-10 md:px-10 md:pt-10 md:pb-12">
        <div className="glass-panel grid-lines rounded-[1.75rem] p-5 md:rounded-[2rem] md:p-8">
          <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="text-left">
                <p className="section-kicker">Dylan Caballero</p>
              </div>
              <div className="flex flex-wrap items-center justify-start gap-4 md:justify-end">
                <nav className="flex flex-wrap justify-start gap-1 font-hud text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-slate-300 sm:text-xs md:justify-end">
                  <a href="#about" className="rounded-[0.35rem] px-3 py-2 transition hover:bg-white/10 hover:text-white">
                    About
                  </a>
                  <a href="#projects" className="rounded-[0.35rem] px-3 py-2 transition hover:bg-white/10 hover:text-white">
                    Projects
                  </a>
                  <a href="#contact" className="rounded-[0.35rem] px-3 py-2 transition hover:bg-white/10 hover:text-white">
                    Contact
                  </a>
                </nav>
                <div className="hidden items-center gap-2 rounded-[0.35rem] border border-white/25 bg-white/5 px-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-white sm:flex">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                  </span>
                  System online
                  <span className="text-white/60">|</span>
                  <span suppressHydrationWarning>{systemTime ?? "00:00:00"}</span>
                </div>
              </div>
            </header>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="grid gap-8 py-6 text-left lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center lg:gap-x-12 lg:gap-y-7 lg:py-10 xl:grid-cols-[minmax(0,1fr)_22rem]"
            >
              <p className="blink-cursor font-mono text-xs font-semibold uppercase tracking-[0.22em] text-white sm:text-sm sm:tracking-[0.3em] lg:col-start-1 lg:row-start-1">
                &gt; Enterprise IAM + AI agent development
              </p>

              <aside className="mx-auto grid w-full max-w-xs gap-6 sm:max-w-sm lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none">
                <div className="hud-ring mx-auto w-[70%] sm:w-[65%] lg:w-[78%]">
                  <div className="relative overflow-hidden rounded-full border border-white/40 bg-slate-950 shadow-[0_0_60px_-15px_rgba(255,255,255,0.55)]">
                    <Image
                      src="/Dylan.PNG"
                      alt="Dylan Caballero"
                      width={320}
                      height={320}
                      priority
                      className="aspect-square w-full object-cover object-center"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/30" />
                  </div>
                </div>

                <div className="grid gap-4 rounded-[1.25rem] border border-white/25 border-l-4 border-l-white bg-slate-950/60 p-5 text-slate-100 shadow-xl shadow-black/20 sm:grid-cols-[1fr_auto] sm:items-end lg:block">
                  <div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                      Status // Currently
                    </p>
                    <p className="mt-2 text-base font-semibold leading-7 text-slate-100">
                      Building secure IAM journeys, OAuth 2.0 flows, AI agents,
                      and automations that move products and teams faster.
                    </p>
                  </div>
                  <div className="flex gap-3 lg:mt-4">
                    <a
                      href="https://github.com/Dcaba024"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Dylan Caballero GitHub"
                      className="rounded-[0.35rem] border border-white/25 p-3 text-white/90 transition hover:border-white/70 hover:bg-white/10 hover:text-white"
                    >
                      <FaGithub size={20} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/dylan-caballero-54963b185/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Dylan Caballero LinkedIn"
                      className="rounded-[0.35rem] border border-white/25 p-3 text-white/90 transition hover:border-white/70 hover:bg-white/10 hover:text-white"
                    >
                      <FaLinkedin size={20} />
                    </a>
                  </div>
                </div>
              </aside>

              <div className="space-y-7 lg:col-start-1 lg:row-start-2">
                <div className="space-y-5">
                  <h1 className="heading-glow max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-5xl md:text-6xl xl:text-7xl">
                    Full Stack Software Engineer | Identity & Access Management (IAM) + OAuth 2.0 | AI Agent & Automation Development
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                    5+ years building secure, enterprise-scale identity and
                    authentication systems (ForgeRock, OAuth 2.0, MFA) at
                    government scale, combined with hands-on experience building
                    production AI agents and automations (LangChain, CrewAI,
                    n8n, OpenAI/Claude APIs).
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <a
                    href="#projects"
                    className="btn-hud-solid w-full rounded-[0.4rem] px-6 py-3 sm:w-auto"
                  >
                    View projects
                    <FaArrowRight />
                  </a>
                  <a
                    ref={resumeLinkRef}
                    href="/Dylan-Caballero-Resume.pdf"
                    download="Dylan-Caballero-Resume.pdf"
                    className={`btn-hud w-full rounded-[0.4rem] px-6 py-3 focus:outline-none focus:ring-4 focus:ring-white/60 sm:w-auto ${
                      activeSpotlightTarget === "resume"
                        ? "relative z-[85] animate-pulse ring-4 ring-white ring-offset-4 ring-offset-slate-950"
                        : ""
                    }`}
                  >
                    Download resume
                  </a>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {highlights.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[0.85rem] border border-white/20 bg-slate-950/50 p-4 shadow-lg shadow-black/10"
                    >
                      <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                        {item.label}
                      </p>
                      <p className="mono-stat mt-2 text-sm font-semibold leading-6 text-slate-100">
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
      <Projects
        sectionRef={projectsSectionRef}
        isSpotlighted={activeSpotlightTarget === "projects"}
      />
      <Contact
        formRef={contactFormRef}
        isSpotlighted={activeSpotlightTarget === "contact"}
      />
      <Footer />
      {spotlight ? (
        <div
          aria-hidden="true"
          data-testid={`${spotlight.target}-spotlight-overlay`}
          className="pointer-events-none fixed inset-0 z-[75] transition-opacity duration-300"
          style={spotlightStyle}
        />
      ) : null}
      <FloatingChatbot
        onResumeRequest={() => spotlightTarget("resume")}
        onContactRequest={() => spotlightTarget("contact")}
        onProjectsRequest={() => spotlightTarget("projects")}
      />
    </main>
  );
}
