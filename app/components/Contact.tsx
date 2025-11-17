"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import ReCAPTCHA from "react-google-recaptcha";


export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSent, setIsSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    emailjs
      .send(
        "service_6mcnsyo", // replace this
        "template_w119ov8", // replace this
        formData,
        "fXwflN6T_8dBc33BB" // replace this
      )
      .then(() => {
        setIsSent(true);
        setFormData({ name: "", email: "", message: "" });
      })
      .catch((error) => console.error("Error sending message:", error));
  };

  return (
    <section
      id="contact"
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6 py-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-2xl w-full text-center"
      >
        <h2 className="text-4xl font-bold mb-8 text-blue-500">Contact Me</h2>
        <p className="text-gray-300 mb-8">
          Have a question or want to collaborate? Send me a message and I’ll get
          back to you soon.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md bg-gray-900 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md bg-gray-900 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md bg-gray-900 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ReCAPTCHA
            sitekey="6Lfd7wksAAAAANxYip60pHbDx8_QS8oFe_WAX76s"
            onChange={(value) => console.log("Captcha value:", value)}
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 rounded-md text-white font-medium hover:bg-blue-700 transition"
          >
            {isSent ? "Message Sent!" : "Send Message"}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
