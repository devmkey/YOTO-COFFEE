"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  y = 60,
  duration = 1.2,
  stagger = 0.1,
}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;
      const items = el.querySelectorAll("[data-animate]");

      if (items.length > 0) {
        gsap.from(items, {
          opacity: 0,
          y,
          duration,
          delay,
          stagger,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      } else {
        gsap.from(el, {
          opacity: 0,
          y,
          duration,
          delay,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
