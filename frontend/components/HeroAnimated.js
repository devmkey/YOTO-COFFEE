"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

export default function HeroAnimated() {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const overlayRef = useRef(null);
  const paragraphRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.from(imageRef.current, {
        scale: 1.3,
        duration: 2.5,
        ease: "power3.out",
      });

      tl.from(
        overlayRef.current,
        {
          opacity: 0,
          duration: 1.5,
        },
        0
      );

      const chars = containerRef.current.querySelectorAll(".hero-char");
      tl.fromTo(
        chars,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.8,
          stagger: 0.04,
          ease: "expo.out",
        },
        0.3
      );

      const paraEl = paragraphRef.current;
      tl.fromTo(
        paraEl,
        { opacity: 0, yPercent: 30 },
        {
          opacity: 1,
          yPercent: 0,
          duration: 1.8,
          ease: "expo.out",
        },
        1.0
      );

      const buttons = containerRef.current.querySelectorAll(".hero-btn");
      tl.fromTo(
        buttons,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "expo.out",
        },
        1.3
      );

      gsap.to(imageRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: containerRef }
  );

  // split into WORDS so each word is its own line — then split each
  // word into characters so the stagger animation still works per-letter
  const headingWords = "Yoto Coffee".split(" ");

  return (
    <section
      ref={containerRef}
      className="relative text-cream overflow-hidden min-h-screen flex items-center"
    >
      <div ref={imageRef} className="absolute inset-0 -z-20">
        <Image
          src="/images/interior-hero.jpg"
          alt="Inside the Yoto coffee house"
          fill
          priority
          sizes="500vw"
          className="object-cover"
        />
      </div>
      <div ref={overlayRef} className="absolute inset-0 bg-coffeeDark/70 -z-10" />

      <div className="relative z-10 w-full flex flex-col justify-center items-start gap-6 md:gap-8 px-8 md:px-20 lg:px-28 py-16 md:py-24">
        {/* Heading — two lines, one word per line */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[0.95] font-serif text-cream hero-heading flex flex-col items-start shrink-0">
          {headingWords.map((word, wIndex) => (
            <span key={wIndex} className="overflow-hidden block">
              {word.split("").map((char, cIndex) => (
                <span
                  key={cIndex}
                  className="hero-char inline-block"
                  style={{ opacity: 0 }}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h1>

        {/* Supporting content — divider, paragraph, buttons */}
        <div className="flex flex-col md:pt-4">
          <div className="w-16 h-[2px] bg-[#c8a46b] mb-6" />

          <p
            ref={paragraphRef}
            className="text-[#E2D3BB] max-w-md mb-6 text-lg leading-relaxed"
            style={{ opacity: 0 }}
          >
            Yoto is a neighbourhood coffee house serving honest espresso,
            slow-brewed coffee and fresh pastries — made for lingering.
          </p>

          <div className="flex gap-3 flex-wrap">
            <div className="hero-btn" style={{ opacity: 0 }}>
              <Button href="/menu" variant="secondary">
                View menu
              </Button>
            </div>
            <div className="hero-btn" style={{ opacity: 0 }}>
              <Button href="/contact" variant="outlineLight">
                Find us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}