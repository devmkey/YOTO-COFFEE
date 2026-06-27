import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-coffeeDark text-[#E2D3BB] mt-16 px-6 pt-12 pb-7">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-9">
        <div>
          <div className="font-serif italic text-2xl text-cream mb-2">yoto</div>
          <p className="text-sm text-[#C9B79A]">
            A neighbourhood coffee house for honest espresso and slow mornings.
          </p>
        </div>

        <div>
          <h3 className="text-cream text-xs uppercase tracking-wide font-bold mb-3">Explore</h3>
          <ul className="space-y-2 text-sm text-[#C9B79A]">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/menu">Menu</Link></li>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/login">Log in</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-cream text-xs uppercase tracking-wide font-bold mb-3">Visit</h3>
          <p className="text-sm text-[#C9B79A]">Bole Road, Addis Ababa</p>
          <p className="text-sm text-[#C9B79A]">Mon–Fri 7:00–19:00</p>
          <p className="text-sm text-[#C9B79A]">Sat–Sun 8:00–18:00</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-5 border-t border-[#E2D3BB]/15 text-xs text-[#9A8870] text-center">
        © 2026 Yoto Coffee House. All rights reserved.
      </div>
    </footer>
  );
}
