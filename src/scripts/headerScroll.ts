export function initHeaderScroll(): void {
  const header = document.querySelector<HTMLElement>("[data-menu-root]");
  if (!header) return;

  const updateHeaderStyle = () => {
    const scrolled = window.scrollY > 20;

    if (scrolled) {
      header.style.backdropFilter = "blur(12px)";
      header.style.boxShadow = "0 2px 8px rgb(0 0 0 / 0.06)";
      header.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
    } else {
      header.style.backdropFilter = "blur(12px)";
      header.style.boxShadow = "none";
      header.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
    }
  };

  window.addEventListener("scroll", updateHeaderStyle, { passive: true });
  updateHeaderStyle();
}
