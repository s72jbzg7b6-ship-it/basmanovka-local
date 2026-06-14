(() => {
  const getOpenMenus = () => document.querySelectorAll(".phone-menu[open]");

  const closeOpenMenus = (target) => {
    getOpenMenus().forEach((menu) => {
      if (target.closest(".phone-menu__panel")) return;
      if (target.closest(".phone-menu__trigger")) return;
      menu.removeAttribute("open");
    });
  };

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    closeOpenMenus(target);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    getOpenMenus().forEach((menu) => {
      menu.removeAttribute("open");
    });
  });
})();
