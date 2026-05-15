import { createPlantCard } from "./PlantCard.js?v=20260425-cropped-icons";
import { createPlantDetails } from "./PlantDetails.js?v=20260425-cropped-icons";
import { createPlantFilters } from "./PlantFilters.js?v=20260425-cropped-icons";

function getPrimaryImage(plant) {
  return plant.imageUrl || plant.gallery?.[0] || "";
}

function createModalMedia(plant) {
  const media = document.createElement("div");
  media.className = "plant-modal__hero";

  const gallery = document.createElement("div");
  gallery.className = "plant-modal__gallery plant-modal__gallery--single";

  const item = document.createElement("div");
  item.className = "plant-modal__gallery-item plant-modal__gallery-item--primary";

  const imageSrc = getPrimaryImage(plant);
  const imageAlt = plant.imageAlt || `${plant.name} в горшке`;

  if (imageSrc) {
    const img = document.createElement("img");
    img.src = imageSrc;
    img.alt = imageAlt;
    img.loading = "eager";
    img.decoding = "async";
    img.referrerPolicy = "no-referrer";
    img.fetchPriority = "high";
    item.appendChild(img);
  } else {
    item.innerHTML = `<div class="plant-card__placeholder" aria-hidden="true">🌿</div>`;
  }

  gallery.appendChild(item);
  media.appendChild(gallery);
  return media;
}

export class PlantCareSection {
  constructor(root, payload) {
    this.root = root;
    this.hero = payload?.hero ?? null;
    this.plants = [...(payload?.plants ?? [])].sort((a, b) => a.name.localeCompare(b.name, "ru"));
    this.activeId = null;
    this.activeFilter = "all";
    this.visibleLetters = [];
    this.letterTargets = new Map();
    this.activeLetter = null;
    this.lastTrigger = null;
    this.handleEscape = this.handleEscape.bind(this);
    this.handlePageScroll = this.handlePageScroll.bind(this);
    this.syncStickyOffset = this.syncStickyOffset.bind(this);
    this.syncScrollTopButton = this.syncScrollTopButton.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.scrollQueued = false;
    this.topbarObserver = null;
  }

  render() {
    this.root.innerHTML = `
      <section class="section section--plant-care">
        <div class="section__header section__header--stack">
          <div>
            <div class="section-kicker">SEO-справочник по растениям</div>
            <h2 class="section__title">Популярные горшечные растения и уход за ними</h2>
            <p class="section__subtitle">
              Подборка из ${this.plants.length} справочных карточек с популярными комнатными и
              контейнерными растениями для дома, офиса, балкона и витрины: с быстрыми фильтрами,
              SEO-данными и подробными модальными карточками без маркетплейсной подачи.
            </p>
          </div>
        </div>
        ${this.renderHero()}
        <div class="plant-care-toolbar">
          <p class="plant-care-toolbar__note">
            Карточки помогают быстро оценить освещение, полив и общий характер растения, а
            полная информация открывается во всплывающем окне без перегрузки страницы.
          </p>
          <div class="plant-care-toolbar__filters" aria-label="Быстрые фильтры по растениям"></div>
        </div>
        <div class="plant-care-catalog">
          <aside class="plant-care-index" aria-label="Алфавитный навигатор по растениям" hidden></aside>
          <div class="plant-care-catalog__main">
            <div class="plant-care-grid"></div>
            <div class="plant-care-empty" hidden>
              <strong>По этому фильтру пока нет карточек.</strong>
              Попробуйте снять фильтр и посмотреть всю справочную подборку по горшечным растениям.
            </div>
          </div>
        </div>
      </section>
      <div class="plant-modal" hidden aria-hidden="true">
        <div class="plant-modal__backdrop" data-close-modal></div>
        <div
          class="plant-modal__dialog"
          id="plant-care-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="plant-modal-title"
        >
          <button class="plant-modal__close" type="button" aria-label="Закрыть" data-close-modal>✕</button>
          <div class="plant-modal__scroll">
            <div class="plant-modal__content"></div>
          </div>
        </div>
      </div>
      <button class="plant-scroll-top" type="button" aria-label="Вернуться вверх" aria-hidden="true" tabindex="-1">
        Вверх
      </button>
    `;

    this.grid = this.root.querySelector(".plant-care-grid");
    this.filters = this.root.querySelector(".plant-care-toolbar__filters");
    this.alphaIndex = this.root.querySelector(".plant-care-index");
    this.emptyState = this.root.querySelector(".plant-care-empty");
    this.modal = this.root.querySelector(".plant-modal");
    this.modalContent = this.root.querySelector(".plant-modal__content");
    this.scrollTopButton = this.root.querySelector(".plant-scroll-top");
    this.modal.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-modal]")) this.closeModal();
    });
    this.scrollTopButton?.addEventListener("click", this.scrollToTop);

    this.syncStickyOffset();
    if (!this.topbarObserver && "ResizeObserver" in window) {
      const topbar = document.querySelector(".topbar");
      if (topbar) {
        this.topbarObserver = new ResizeObserver(() => this.syncStickyOffset());
        this.topbarObserver.observe(topbar);
      }
    }

    this.renderFilters();
    this.drawCards();
    this.renderStructuredData();
    window.addEventListener("scroll", this.handlePageScroll, { passive: true });
    window.addEventListener("resize", this.syncStickyOffset, { passive: true });
  }

  renderHero() {
    if (!this.hero?.heroImageUrl) return "";

    return `
      <div class="plant-care-cover">
        <div class="plant-care-cover__media">
          <img
            src="${this.hero.heroImageUrl}"
            alt="${this.hero.heroImageAlt || "Популярные горшечные растения"}"
            loading="lazy"
            decoding="async"
            referrerpolicy="no-referrer"
          />
        </div>
        <div class="plant-care-cover__overlay" aria-hidden="true"></div>
      </div>
    `;
  }

  drawCards() {
    this.grid.innerHTML = "";
    this.letterTargets.clear();
    const plants = this.getVisiblePlants();
    this.emptyState.hidden = plants.length > 0;
    this.visibleLetters = [];
    const seenLetters = new Set();

    for (const plant of plants) {
      const card = createPlantCard(plant);
      const letter = this.getLetter(plant.name);

      if (!seenLetters.has(letter)) {
        seenLetters.add(letter);
        this.visibleLetters.push(letter);
        this.letterTargets.set(letter, card);
        card.dataset.alphaAnchor = "true";
      }

      const summary = card.querySelector(".plant-card__summary");
      summary.addEventListener("click", () => this.openModal(plant.id, summary));
      summary.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          this.openModal(plant.id, summary);
        }
      });

      this.grid.appendChild(card);
    }

    this.renderAlphabet();
    this.syncActiveLetter(this.visibleLetters[0] ?? null);
    this.handlePageScroll();
  }

  renderFilters() {
    this.filters.innerHTML = "";
    const filterList = createPlantFilters(this.plants, this.activeFilter);
    filterList.querySelectorAll(".plant-filter").forEach((button) => {
      const handleFilterSelect = () => {
        this.activeFilter = button.dataset.filter;
        this.renderFilters();
        this.drawCards();
        this.filters
          .querySelectorAll(".plant-filter")
          .forEach((item) => item.dataset.filter === this.activeFilter && item.focus());
      };

      button.addEventListener("click", handleFilterSelect);
      button.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleFilterSelect();
        }
      });
    });
    this.filters.appendChild(filterList);
  }

  renderAlphabet() {
    if (!this.alphaIndex) return;

    if (this.visibleLetters.length === 0) {
      this.alphaIndex.hidden = true;
      this.alphaIndex.innerHTML = "";
      return;
    }

    const buttons = this.visibleLetters
      .map((letter) => {
        const isActive = letter === this.activeLetter;
        return `
          <button
            class="plant-care-index__letter${isActive ? " plant-care-index__letter--active" : ""}"
            type="button"
            data-letter="${letter}"
            aria-label="Перейти к растениям на букву ${letter}"
            aria-current="${isActive ? "true" : "false"}"
          >
            ${letter}
          </button>
        `;
      })
      .join("");

    this.alphaIndex.hidden = false;
    this.alphaIndex.innerHTML = `
      <div class="plant-care-index__rail">
        <div class="plant-care-index__label">А-Я</div>
        <div class="plant-care-index__letters">${buttons}</div>
      </div>
    `;

    this.alphaIndex.querySelectorAll("[data-letter]").forEach((button) => {
      const selectLetter = () => this.scrollToLetter(button.dataset.letter, button);
      button.addEventListener("click", selectLetter);
      button.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectLetter();
        }
      });
    });
  }

  getVisiblePlants() {
    if (this.activeFilter === "all") return this.plants;

    return this.plants.filter((plant) => {
      const badges = plant.filters?.badges?.length ? plant.filters.badges : plant.badges;
      return badges.includes(this.activeFilter);
    });
  }

  getLetter(name) {
    return (name || "").trim().charAt(0).toUpperCase();
  }

  getScrollOffset() {
    const computedOffset = parseFloat(
      getComputedStyle(this.root).getPropertyValue("--plant-card-scroll-offset")
    );
    if (Number.isFinite(computedOffset) && computedOffset > 0) {
      return computedOffset;
    }

    const topbar = document.querySelector(".topbar");
    return (topbar?.offsetHeight || 88) + 14;
  }

  syncStickyOffset() {
    const topbarInner = document.querySelector(".topbar__inner");
    const topbar = document.querySelector(".topbar");
    const rawHeaderHeight =
      topbarInner?.getBoundingClientRect().height ||
      topbarInner?.offsetHeight ||
      topbar?.offsetHeight ||
      88;
    const headerHeight = Math.max(88, Math.min(160, Math.ceil(rawHeaderHeight)));
    const stickyTop = headerHeight + 2;
    const scrollOffset = stickyTop + 8;

    this.root.style.setProperty("--plant-index-top", `${stickyTop}px`);
    this.root.style.setProperty("--plant-index-max-height", `calc(100vh - ${stickyTop + 12}px)`);
    this.root.style.setProperty("--plant-card-scroll-offset", `${scrollOffset}px`);
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  syncScrollTopButton(forceState = null) {
    if (!this.scrollTopButton) return;

    const isVisible = typeof forceState === "boolean" ? forceState : window.scrollY > 96;
    this.scrollTopButton.classList.toggle("plant-scroll-top--visible", isVisible);
    this.scrollTopButton.setAttribute("aria-hidden", isVisible ? "false" : "true");
    this.scrollTopButton.tabIndex = isVisible ? 0 : -1;
  }

  scrollToLetter(letter, trigger = null) {
    const target = this.letterTargets.get(letter);
    if (!target) return;

    if (trigger) trigger.focus();
    this.syncActiveLetter(letter);
    this.syncScrollTopButton(true);

    const top = window.scrollY + target.getBoundingClientRect().top - this.getScrollOffset();
    window.scrollTo({
      top: Math.max(0, top),
      behavior: "smooth"
    });
  }

  syncActiveLetter(letter) {
    this.activeLetter = letter;

    this.alphaIndex?.querySelectorAll("[data-letter]").forEach((button) => {
      const isActive = button.dataset.letter === letter;
      button.classList.toggle("plant-care-index__letter--active", isActive);
      button.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  handlePageScroll() {
    if (this.scrollQueued) return;
    this.scrollQueued = true;

    requestAnimationFrame(() => {
      this.scrollQueued = false;

      if (!this.visibleLetters.length) {
        this.syncActiveLetter(null);
        return;
      }

      const threshold = this.getScrollOffset() + 18;
      let currentLetter = this.visibleLetters[0];

      for (const letter of this.visibleLetters) {
        const target = this.letterTargets.get(letter);
        if (!target) continue;

        if (target.getBoundingClientRect().top <= threshold) {
          currentLetter = letter;
        } else {
          break;
        }
      }

      this.syncScrollTopButton();
      this.syncActiveLetter(currentLetter);
    });
  }

  openModal(id, trigger = null) {
    const plant = this.plants.find((item) => item.id === id);
    if (!plant) return;
    this.activeId = id;

    this.root.querySelectorAll(".plant-card__summary[aria-expanded='true']").forEach((button) => {
      button.setAttribute("aria-expanded", "false");
    });

    if (trigger) this.lastTrigger = trigger;
    if (this.lastTrigger?.isConnected) this.lastTrigger.setAttribute("aria-expanded", "true");

    this.modalContent.innerHTML = "";
    const details = createPlantDetails(plant, this.plants);
    details.querySelectorAll("[data-target-plant]").forEach((button) => {
      const openTargetPlant = () => this.openModal(button.dataset.targetPlant);
      button.addEventListener("click", openTargetPlant);
      button.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openTargetPlant();
        }
      });
    });
    const media = createModalMedia(plant);

    this.modalContent.appendChild(media);
    this.modalContent.appendChild(details);
    this.modal.hidden = false;
    this.modal.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => this.modal.classList.add("plant-modal--open"));
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", this.handleEscape);
    this.modal.querySelector(".plant-modal__scroll").scrollTop = 0;
    this.modal.querySelector(".plant-modal__close")?.focus();
  }

  closeModal({ restoreFocus = true } = {}) {
    this.activeId = null;
    this.modal.classList.remove("plant-modal--open");
    this.modal.hidden = true;
    this.modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", this.handleEscape);

    if (this.lastTrigger?.isConnected) {
      this.lastTrigger.setAttribute("aria-expanded", "false");
      if (restoreFocus) this.lastTrigger.focus();
    }
  }

  renderStructuredData() {
    this.root.querySelector("[data-plant-jsonld]")?.remove();

    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Популярные горшечные растения Basmanovka.by",
      numberOfItems: this.plants.length,
      itemListElement: this.plants.map((plant, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Article",
          headline: plant.seo?.title || plant.name,
          name: plant.name,
          description: plant.seo?.description || plant.description?.[0] || "",
          image: getPrimaryImage(plant),
          keywords: plant.seo?.keywords?.join(", ") || "",
          url: `${window.location.href.split("#")[0]}#plant-${plant.id}`,
          inLanguage: "ru"
        }
      }))
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.plantJsonld = "true";
    script.textContent = JSON.stringify(itemList);
    this.root.appendChild(script);
  }

  handleEscape(event) {
    if (event.key === "Escape") this.closeModal();
  }
}
