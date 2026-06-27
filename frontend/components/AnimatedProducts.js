"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "./ProductCard";
import { fetchProducts } from "../lib/api";

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedProducts() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data.slice(0, 4)))
      .catch(() => setProducts([]));
  }, []);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const headingEl = headingRef.current;
      if (headingEl) {
        const subtitle = headingEl.querySelector(".section-subtitle");
        const title = headingEl.querySelector(".section-title");
        const link = headingEl.querySelector(".section-link");

        gsap.from([subtitle, title, link], {
          opacity: 0,
          y: 40,
          duration: 1.2,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      }

      const cards = sectionRef.current.querySelectorAll(".product-card-animated");
      if (cards.length > 0) {
        gsap.from(cards, {
          opacity: 0,
          y: 100,
          rotateX: 10,
          scale: 0.9,
          duration: 1.4,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: {
            trigger: cards[0],
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      }
    },
    { scope: sectionRef, dependencies: [products] }
  );

  return (
    <section ref={sectionRef} className="px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div
          ref={headingRef}
          className="flex items-baseline justify-between mb-8 flex-wrap gap-2"
        >
          <div>
            <span className="section-subtitle text-xs uppercase tracking-[2px] text-terracotta font-semibold block mb-2">
              Fan favourites
            </span>
            <h2 className="section-title text-2xl md:text-3xl">
              Popular right now
            </h2>
          </div>
          <Link
            href="/menu"
            className="section-link text-sm font-semibold text-terracotta"
          >
            See full menu →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <div key={p.id} className="product-card-animated" style={{ perspective: "1000px" }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
