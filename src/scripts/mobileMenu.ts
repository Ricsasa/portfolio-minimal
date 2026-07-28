/**
 * Mobile-only disclosure for the header menu. At md+ the panel is always
 * visible through CSS, so this only drives the `data-menu-open` flag the
 * mobile styles key off — the desktop layout never reads it.
 */
export function initMobileMenu() {
  const header = document.querySelector<HTMLElement>("[data-menu-root]");
  const toggle =
    document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const panel = document.getElementById("main-menu");
  if (!header || !toggle || !panel) return;

  const setOpen = (open: boolean) => {
    header.dataset.menuOpen = String(open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  setOpen(false);

  toggle.addEventListener("click", () => {
    setOpen(header.dataset.menuOpen !== "true");
  });

  // Jumping to a section should dismiss the panel it was picked from.
  panel.addEventListener("click", (event) => {
    if ((event.target as HTMLElement).closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || header.dataset.menuOpen !== "true") return;
    setOpen(false);
    toggle.focus();
  });

  document.addEventListener("click", (event) => {
    if (header.dataset.menuOpen !== "true") return;
    if (!header.contains(event.target as Node)) setOpen(false);
  });
}
