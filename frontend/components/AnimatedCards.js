"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Card from "./Card";
import { ClockIcon, PinIcon, CupIcon } from "./icons";

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedCards() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const cards = sectionRef.current.querySelectorAll(".info-card");

      gsap.from(cards, {
        opacity: 0,
        y: 80,
        scale: 0.95,
        duration: 1.2,
        stagger: 0.15,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="px-4 sm:px-6 -mt-6 sm:-mt-8 relative">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3.5 md:gap-4">
        <div className="info-card">
          <Card icon={<ClockIcon className="w-6 h-6" />} title="Opening hours">
            Mon–Fri 7:00–19:00<br />Sat–Sun 8:00–18:00
          </Card>
        </div>
        <div className="info-card">
          <Card icon={<PinIcon className="w-6 h-6" />} title="Find us">
            Bole Road, Addis Ababa<br />2 min from Edna Mall
          </Card>
        </div>
        <div className="info-card">
          <Card icon={<CupIcon className="w-6 h-6" />} title="Today's pick">
            Yoto signature latte — try the new seasonal blend
          </Card>
        </div>
      </div>
    </section>
  );
}
