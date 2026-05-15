(() => {
  const initIndicator = (nav) => {
    const shell = nav.closest(".topbar__inner");
    if (!shell) return;

    let frame = 0;

    const sync = () => {
      frame = 0;

      const maxScroll = Math.max(0, nav.scrollWidth - nav.clientWidth);
      const progress = maxScroll > 0 ? nav.scrollLeft / maxScroll : 0;
      const styles = getComputedStyle(shell);
      const trackSize = parseFloat(styles.getPropertyValue("--nav-cue-track-size")) || 138;
      const thumbSize = parseFloat(styles.getPropertyValue("--nav-cue-thumb-size")) || 58;
      const maxOffset = Math.max(0, trackSize - thumbSize);
      const offset = Math.min(maxOffset, Math.max(0, progress * maxOffset));

      shell.style.setProperty("--nav-cue-offset", `${offset.toFixed(2)}px`);
    };

    const requestSync = () => {
      if (frame) return;
      frame = requestAnimationFrame(sync);
    };

    sync();
    nav.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);

    if (document.fonts?.ready) {
      document.fonts.ready.then(requestSync);
    }

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(requestSync);
      observer.observe(nav);
      Array.from(nav.children).forEach((item) => observer.observe(item));
    }
  };

  const init = () => {
    document.querySelectorAll(".nav").forEach(initIndicator);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
