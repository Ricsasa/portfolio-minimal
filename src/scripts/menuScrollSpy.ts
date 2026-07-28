import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initMenuScrollSpy() {
  const nav = document.querySelector<HTMLElement>("[data-scroll-spy]");
  if (!nav) return;

  const accentRoot = nav.closest<HTMLElement>("[data-accent-root]") ?? nav;

  const links = new Map<string, HTMLAnchorElement>();
  nav
    .querySelectorAll<HTMLAnchorElement>("[data-section-link]")
    .forEach((link) => links.set(link.dataset.sectionLink!, link));
  if (!links.size) return;

  const sections = gsap.utils
    .toArray<HTMLElement>("[data-section]")
    .filter((section) => links.has(section.dataset.section!));
  if (!sections.length) return;

  let activeId: string | null = null;

  const setActive = (id: string) => {
    if (id === activeId) return;
    activeId = id;

    links.forEach((link, linkId) => {
      if (linkId === id) {
        link.setAttribute("data-active", "true");
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("data-active");
        link.removeAttribute("aria-current");
      }
    });

    const accent = document.querySelector<HTMLElement>(`[data-section="${id}"]`)
      ?.dataset.accent;
    if (accent) accentRoot.style.setProperty("--header-accent", accent);

    // replaceState so the hash never adds history entries while scrolling.
    history.replaceState(null, "", `#${id}`);
  };

  sections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onToggle: (self) => {
        if (self.isActive) setActive(section.dataset.section!);
      },
    });
  });

  if (!activeId) setActive(sections[0].dataset.section!);

  window.addEventListener("load", () => ScrollTrigger.refresh());
}
