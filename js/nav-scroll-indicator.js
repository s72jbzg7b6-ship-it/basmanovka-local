(() => {
  const initIndicator = (nav) => {
    const shell = nav.closest(".topbar__inner");
    if (!shell) return;

    let frame = 0;
    let maxScroll = 0;
    let maxOffset = 0;

    const syncPosition = () => {
      const progress = maxScroll > 0 ? nav.scrollLeft / maxScroll : 0;
      const offset = Math.min(maxOffset, Math.max(0, progress * maxOffset));

      shell.style.setProperty("--nav-cue-offset", `${offset.toFixed(2)}px`);
    };

    const syncMetrics = () => {
      frame = 0;

      const styles = getComputedStyle(shell);
      const trackSize = parseFloat(styles.getPropertyValue("--nav-cue-track-size")) || 138;
      const thumbSize = parseFloat(styles.getPropertyValue("--nav-cue-thumb-size")) || 58;

      maxScroll = Math.max(0, nav.scrollWidth - nav.clientWidth);
      maxOffset = Math.max(0, trackSize - thumbSize);
      syncPosition();
    };

    const requestMetricsSync = () => {
      if (frame) return;
      frame = requestAnimationFrame(syncMetrics);
    };

    syncMetrics();
    nav.addEventListener("scroll", syncPosition, { passive: true });
    window.addEventListener("resize", requestMetricsSync);

    if (document.fonts?.ready) {
      document.fonts.ready.then(requestMetricsSync);
    }

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(requestMetricsSync);
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
