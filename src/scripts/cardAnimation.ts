import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initCardAnimations() {
  const cards = gsap.utils.toArray<HTMLElement>(".gsap-reveal-card");

  if (!cards.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(cards, {
      autoAlpha: 1,
      y: 0,
    });

    return;
  }

  document.documentElement.classList.add("gsap-ready");

  cards.forEach((card) => {
    gsap.to(card, {
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
      ease: "power2.out",

      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        once: true,
      },
    });
  });
}