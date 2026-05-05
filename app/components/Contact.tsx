"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import ReCAPTCHA from "react-google-recaptcha";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSent, setIsSent] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!recaptchaRef.current) {
      console.error("ReCAPTCHA not ready");
      return;
    }

    const token = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();

    if (!token) {
      console.error("Captcha failed");
      return;
    }

    emailjs
      .send(
        "service_6mcnsyo",
        "template_w119ov8",
        { ...formData, "g-recaptcha-response": token },
        "fXwflN6T_8dBc33BB"
      )
      .then(() => {
        setIsSent(true);
        setFormData({ name: "", email: "", message: "" });
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <>
      <section id="contact" className="section-shell px-4 py-6 md:px-10 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-panel grid gap-6 rounded-[1.75rem] p-5 text-left md:gap-8 md:rounded-[2rem] md:p-8 lg:grid-cols-[0.85fr_1.15fr]"
        >
          <div className="flex flex-col justify-between gap-6">
            <div>
              <p className="section-kicker">Contact</p>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
                Hiring, collaborating, or staffing an engineering role? Let’s connect.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 dark:text-slate-300">
                I’m open to conversations about software engineering, front-end,
                IAM, and AI-focused opportunities where secure product delivery matters.
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-gradient-to-br from-amber-700 to-indigo-800 p-5 text-white shadow-xl shadow-indigo-950/15 md:rounded-[1.75rem] md:p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                What you can expect
              </p>
              <p className="mt-3 text-base font-semibold leading-7 sm:text-lg sm:leading-8">
                Strong communication, thoughtful execution, and an engineering mindset grounded in both user experience and reliability.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="name"
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-[1.15rem] border border-slate-200 bg-white/85 px-4 py-3 text-slate-900 outline-none focus:border-amber-600 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              />
              <input
                name="email"
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-[1.15rem] border border-slate-200 bg-white/85 px-4 py-3 text-slate-900 outline-none focus:border-amber-600 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              />
            </div>

            <textarea
              name="message"
              rows={6}
              placeholder="Tell me about the role, team, or project."
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full rounded-[1.35rem] border border-slate-200 bg-white/85 px-4 py-4 text-slate-900 outline-none focus:border-amber-600 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            />

            <button
              type="submit"
              className="w-full rounded-full bg-slate-950 py-3 text-sm font-semibold text-white hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
            >
              {isSent ? "Message Sent!" : "Send Message"}
            </button>
          </form>
        </motion.div>
      </section>

      <div className="pointer-events-auto fixed right-3 bottom-3 z-[70] origin-bottom-right sm:right-5 sm:bottom-5">
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          size="invisible"
          badge="inline"
          ref={recaptchaRef}
        />
      </div>
    </>
  );
}
