"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import ReCAPTCHA from "react-google-recaptcha";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSent, setIsSent] = useState(false);
 const recaptchaRef = useRef<ReCAPTCHA | null>(null);


  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
  e.preventDefault();

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
    <section id="contact" className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-2xl w-full text-center"
      >
        <h2 className="text-4xl font-bold mb-8 text-blue-500">Contact Me</h2>
        <p className="text-gray-300 mb-8">Have a question or want to collaborate?</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" type="text" placeholder="Your Name" value={formData.name} onChange={handleChange} required className="w-full p-3 rounded-md bg-gray-900 text-white" />
          <input name="email" type="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required className="w-full p-3 rounded-md bg-gray-900 text-white" />
          <textarea name="message" rows={5} placeholder="Your Message" value={formData.message} onChange={handleChange} required className="w-full p-3 rounded-md bg-gray-900 text-white" />

          {/* Invisible CAPTCHA */}
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            size="invisible"
            ref={recaptchaRef}
          />

          <button type="submit" className="w-full py-3 bg-blue-600 rounded-md text-white">
            {isSent ? "Message Sent!" : "Send Message"}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
