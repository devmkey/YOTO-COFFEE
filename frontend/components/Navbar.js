"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled
          ? "bg-coffeeDark/95 border-b border-coffee shadow-lg shadow-black/20"
          : "bg-coffeeDark border-b border-coffee"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="font-serif italic font-bold text-2xl text-cream">
          yoto
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-tan hover:text-terracotta"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold border border-tan text-cream rounded-lg px-4 py-2 hover:bg-tan hover:text-coffeeDark transition"
          >
            Log in
          </Link>
        </div>

        <MobileMenu links={NAV_LINKS} />
      </div>
    </nav>
  );
}
