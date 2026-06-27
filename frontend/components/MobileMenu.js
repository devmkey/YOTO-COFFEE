"use client";

import Link from "next/link";
import { useState } from "react";
import { MenuIcon } from "./icons";

export default function MobileMenu({ links }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden w-9 h-9 flex items-center justify-center text-cream"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        <MenuIcon className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full md:hidden flex flex-col gap-4 px-6 pb-5 bg-coffeeDark border-t border-coffee">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-tan"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="text-sm font-semibold text-terracottaDark"
            onClick={() => setOpen(false)}
          >
            Log in
          </Link>
        </div>
      )}
    </>
  );
}
