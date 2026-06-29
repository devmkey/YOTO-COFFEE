"use client";

import { useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { ClockIcon, PinIcon } from "../../components/icons";
import { submitContact } from "../../lib/api";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    try {
      await submitContact(form);
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto">
        <span className="text-xs uppercase tracking-[2px] text-terracotta font-semibold block mb-2">
          Get in touch
        </span>
        <h2 className="text-2xl md:text-3xl mb-6 sm:mb-8">Come say hello</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-4">
            <Card icon={<PinIcon className="w-6 h-6" />} title="Location">
              2V63+547 LK/Safari, Addis Ababa<br />
            </Card>
            <Card icon={<ClockIcon className="w-6 h-6" />} title="Opening hours">
              Mon–Fri 7:00–19:00<br />Sat–Sun 8:00–18:00
            </Card>
          </div>

          <form onSubmit={handleSubmit} className="bg-coffee border border-coffeeMid rounded-xl p-4 sm:p-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-cream block mb-1.5">Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border border-coffeeMid bg-coffeeDark text-cream rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta placeholder-textMuted"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-cream block mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full border border-coffeeMid bg-coffeeDark text-cream rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta placeholder-textMuted"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-cream block mb-1.5">Message</label>
              <textarea
                rows={4}
                placeholder="How can we help?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                className="w-full border border-coffeeMid bg-coffeeDark text-cream rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta placeholder-textMuted"
              />
            </div>
            {status === "success" && (
              <p className="text-green-400 text-sm">Message sent! We'll get back to you soon.</p>
            )}
            {status === "error" && (
              <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
            )}
            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sending..." : "Send message"}
            </Button>
          </form>
        </div>

        <div className="mt-8 sm:mt-10 rounded-xl overflow-hidden border border-coffeeMid h-52 sm:h-64 md:h-80">
          <iframe
            title="Google Map location"
            src="https://maps.google.com/maps?q=YOTO+Coffee,+Feyel+Bet+Square,+Addis+Ababa&z=16&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
