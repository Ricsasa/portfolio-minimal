/**
 * Scroll-entry reveals for the section cards.
 *
 * Elements marked `.reveal` fade and rise into place the first time they cross
 * into the viewport, staggered by the `--index` custom property their wrapper
 * sets. The hidden state and the transition live in `global.css`; this file
 * only decides when each element flips to revealed.
 */

export function initCardAnimations(): void {
  const targets = Array.from(
    document.querySelectorAll<HTMLElement>(".reveal"),
  );

  if (!targets.length) return;

  const reveal = (element: HTMLElement) =>
    element.setAttribute("data-revealed", "true");

  // Without support, or when motion is unwelcome, show everything at once.
  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    targets.forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        reveal(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      });
    },
    // Hold the reveal until the card is a little way into view.
    { rootMargin: "0px 0px -15% 0px" },
  );

  targets.forEach((target) => observer.observe(target));
}
