"use client";

import {
  type ChangeEvent,
  type FormEvent,
  type Ref,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import ReCAPTCHA from "react-google-recaptcha";

type ContactProps = {
  formRef?: Ref<HTMLFormElement>;
  isSpotlighted?: boolean;
};

export default function Contact({ formRef, isSpotlighted = false }: ContactProps) {
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
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Building secure IAM systems or production AI automations? Let’s connect.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                I’m open to full-stack software engineering, IAM/OAuth 2.0, and
                AI agent automation opportunities where reliable systems and
                useful product experiences matter.
              </p>
            </div>

            <div className="rounded-[1.25rem] border border-white/25 border-l-4 border-l-white bg-slate-950/60 p-5 text-slate-100 shadow-xl shadow-black/20 md:p-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/80">
                What you can expect
              </p>
              <p className="mt-3 text-base font-semibold leading-7 text-slate-100 sm:text-lg sm:leading-8">
                Full-stack delivery, identity security, and practical AI integration designed around measurable user and business needs.
              </p>
            </div>
          </div>

          <form
            ref={formRef}
            tabIndex={-1}
            onSubmit={handleSubmit}
            className={`space-y-4 rounded-[1.5rem] transition ${
              isSpotlighted
                ? "relative z-[85] p-2 ring-4 ring-white ring-offset-4 ring-offset-slate-950"
                : ""
            }`}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="name"
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-[0.85rem] border border-white/20 bg-slate-950/60 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-white/70"
              />
              <input
                name="email"
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-[0.85rem] border border-white/20 bg-slate-950/60 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-white/70"
              />
            </div>

            <textarea
              name="message"
              rows={6}
              placeholder="Tell me about the role, team, or project."
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full rounded-[1rem] border border-white/20 bg-slate-950/60 px-4 py-4 text-white outline-none placeholder:text-slate-500 focus:border-white/70"
            />

            <button
              type="submit"
              className="btn-hud-solid w-full rounded-[0.5rem] py-3"
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
