"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MenuIcon } from "./icons";

export default function MobileMenu({ links }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        className="md:hidden w-10 h-10 flex items-center justify-center text-cream rounded-lg active:bg-coffee border border-transparent active:border-coffeeMid transition"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {open && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden animate-fade-in"
            onClick={() => setOpen(false)}
          />

          {/* Menu Drawer */}
          <div className="absolute left-0 right-0 top-full md:hidden flex flex-col gap-2 p-5 bg-coffeeDark border-b border-coffee shadow-2xl z-50 animate-slide-down">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-medium py-2.5 px-4 rounded-xl transition ${
                    active
                      ? "bg-coffee text-cream font-semibold border border-coffeeMid"
                      : "text-tan hover:text-cream hover:bg-coffee/50"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 mt-1 border-t border-coffee/60">
              <Link
                href="/login"
                className="flex items-center justify-center text-sm font-semibold border border-tan text-cream bg-coffeeDark hover:bg-tan hover:text-coffeeDark py-3 px-4 rounded-xl transition"
                onClick={() => setOpen(false)}
              >
                Log in
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}

