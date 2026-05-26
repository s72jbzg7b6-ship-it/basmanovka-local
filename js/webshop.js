(() => {
  const root = document.querySelector("[data-webshop-root]");
  if (!root) return;

  const tokenKey = "BASMANOVKA_WEBSHOP_TOKEN";
  const apiBaseKey = "BASMANOVKA_WEBSHOP_API_URL";
  const explicitApiBase =
    root.dataset.apiBase ||
    window.BASMANOVKA_WEBSHOP_API_URL ||
    window.localStorage.getItem(apiBaseKey) ||
    "";
  const apiBaseUrl = explicitApiBase.trim() ? explicitApiBase.trim().replace(/\/+$/, "") : "";

  const demoItems = [
    {
      id: "demo-antir",
      category: "Экзотика",
      name: "Antir Antibes Rose",
      attribute1: "80 см",
      attribute2: null,
      attribute3: "23 см",
      availableQty: 1280,
      finalPrice: "8.45",
      imageUrl: "../assets/plant-care/anturium.webp",
      packSize: 5,
    },
    {
      id: "demo-chr",
      category: "Хризантема",
      name: "Chr T Limoncello",
      attribute1: "70 см",
      attribute2: "75 гр",
      attribute3: "23 см",
      availableQty: 350,
      finalPrice: "9.35",
      imageUrl: "../assets/plant-care/gortenziya.webp",
      packSize: 10,
    },
    {
      id: "demo-gerbera",
      category: "Эустома",
      name: "Gerbera Pastel Mix",
      attribute1: "60 см",
      attribute2: null,
      attribute3: "17 см",
      availableQty: 560,
      finalPrice: "7.80",
      imageUrl: "../assets/plant-care/gerbera.webp",
      packSize: 10,
    },
    {
      id: "demo-orchid",
      category: "Экзотика",
      name: "Phalaenopsis White",
      attribute1: "65 см",
      attribute2: null,
      attribute3: "12 см",
      availableQty: 96,
      finalPrice: "18.90",
      imageUrl: "../assets/plant-care/orhideya-falenopsis.webp",
      packSize: 4,
    },
    {
      id: "demo-calla",
      category: "Сезонные",
      name: "Calla Mix",
      attribute1: "45 см",
      attribute2: null,
      attribute3: "14 см",
      availableQty: 120,
      finalPrice: "11.20",
      imageUrl: "../assets/plant-care/kalla.webp",
      packSize: 5,
    },
    {
      id: "demo-spath",
      category: "Зелёные",
      name: "Spathiphyllum Sensation",
      attribute1: "75 см",
      attribute2: null,
      attribute3: "24 см",
      availableQty: 80,
      finalPrice: "21.60",
      imageUrl: "../assets/plant-care/spatifillum.webp",
      packSize: 2,
    },
  ];

  const elements = {
    cartItems: root.querySelector("[data-webshop-cart-items]"),
    cartTotal: root.querySelector("[data-webshop-cart-total]"),
    categories: root.querySelector("[data-webshop-categories]"),
    checkout: root.querySelector("[data-webshop-checkout]"),
    count: root.querySelector("[data-webshop-count]"),
    delivery: root.querySelector("[data-webshop-delivery]"),
    focusLogin: root.querySelector("[data-webshop-focus-login]"),
    loginForm: root.querySelector("[data-webshop-login]"),
    logout: root.querySelector("[data-webshop-logout]"),
    products: root.querySelector("[data-webshop-products]"),
    search: root.querySelector("[data-webshop-search]"),
    session: root.querySelector("[data-webshop-session]"),
    sessionName: root.querySelector("[data-webshop-session-name]"),
    status: root.querySelector("[data-webshop-status]"),
    total: root.querySelector("[data-webshop-total]"),
  };

  const state = {
    cart: null,
    category: "",
    catalog: null,
    categories: [],
    items: [],
    localCart: new Map(),
    mode: apiBaseUrl ? "api" : "demo",
    query: "",
    token: window.sessionStorage.getItem(tokenKey),
    user: null,
  };

  const currencyFormatter = new Intl.NumberFormat("ru-BY", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  function formatMoney(value) {
    const parsed = Number(String(value ?? "0").replace(",", "."));
    return `${currencyFormatter.format(Number.isFinite(parsed) ? parsed : 0)} BYN`;
  }

  function formatDate(value) {
    if (!value) return "уточняется";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("ru-BY", {
      day: "2-digit",
      month: "long",
      weekday: "short",
    }).format(date);
  }

  function parseMoneyToCents(value) {
    if (value === null || value === undefined || value === "") return null;
    const parsed = Number(String(value).trim().replace(",", "."));
    return Number.isFinite(parsed) ? Math.round(parsed * 100) : null;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function setStatus(kind, title, message) {
    elements.status.className = `webshop-status webshop-status--${kind}`;
    elements.status.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(message)}</span>`;
  }

  function apiUrl(path, params) {
    if (!apiBaseUrl) {
      throw new Error("API base URL is not configured");
    }

    const url = new URL(path.startsWith("/") ? path : `/${path}`, `${apiBaseUrl}/`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          url.searchParams.set(key, String(value));
        }
      });
    }
    return url.toString();
  }

  async function request(path, options = {}) {
    const headers = new Headers(options.headers);
    if (state.token) headers.set("Authorization", `Bearer ${state.token}`);
    if (options.json !== undefined) headers.set("Content-Type", "application/json");

    const response = await fetch(apiUrl(path, options.params), {
      body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
      headers,
      method: options.method ?? "GET",
    });
    const contentType = response.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message = payload?.message || payload?.error || "Запрос не выполнен";
      throw new Error(Array.isArray(message) ? message.join(". ") : message);
    }

    return payload;
  }

  function normalizePack(value) {
    const pack = Number(value);
    return Number.isFinite(pack) && pack > 0 ? pack : 1;
  }

  function getPackAwareMaxQuantity(maxQuantity, packSize) {
    if (typeof maxQuantity !== "number" || !Number.isFinite(maxQuantity)) return null;
    const pack = normalizePack(packSize);
    return Math.floor(Math.max(0, Math.trunc(maxQuantity)) / pack) * pack;
  }

  function normalizeQuantity(value, packSize, maxQty = null) {
    const pack = normalizePack(packSize);
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) return 0;

    const rounded = Math.ceil(Math.trunc(numeric) / pack) * pack;
    const packedMax = getPackAwareMaxQuantity(maxQty, pack);
    return packedMax === null ? rounded : Math.min(rounded, packedMax);
  }

  function getCartLine(itemId) {
    if (state.mode === "api" && state.cart?.items) {
      return state.cart.items.find((line) => line.catalogItemId === itemId);
    }
    return null;
  }

  function getLineQuantity(itemId) {
    const apiLine = getCartLine(itemId);
    if (apiLine) return apiLine.quantity ?? 0;
    return state.localCart.get(itemId) ?? 0;
  }

  function calculatePurchaseLimitMaxQuantity(item, line) {
    const purchaseLimit = state.cart?.purchaseLimit;
    if (!purchaseLimit?.enabled || !purchaseLimit.amount || !purchaseLimit.usedAmount) {
      return null;
    }

    const amountCents = parseMoneyToCents(purchaseLimit.amount);
    const usedCents = parseMoneyToCents(purchaseLimit.usedAmount);
    const unitPriceCents = parseMoneyToCents(line?.unitFinalPrice ?? item.finalPrice);
    if (amountCents === null || usedCents === null || unitPriceCents === null || unitPriceCents <= 0) {
      return null;
    }

    const currentQuantity = line?.quantity ?? 0;
    const parsedLineTotalCents = parseMoneyToCents(line?.lineTotal);
    const currentLineTotalCents = parsedLineTotalCents ?? Math.max(0, currentQuantity) * unitPriceCents;
    const availableForThisLineCents = Math.max(0, amountCents - usedCents + currentLineTotalCents);
    return Math.floor(availableForThisLineCents / unitPriceCents);
  }

  function getMaxQuantity(item) {
    const line = getCartLine(item.id);
    const currentQuantity = line?.quantity ?? 0;
    const parsedAvailable = Number(item.availableQty);
    const stockMaxQuantity = Number.isFinite(parsedAvailable)
      ? state.mode === "api"
        ? parsedAvailable + currentQuantity
        : parsedAvailable
      : null;
    const purchaseLimitMaxQuantity = calculatePurchaseLimitMaxQuantity(item, line);
    const finiteValues = [stockMaxQuantity, purchaseLimitMaxQuantity].filter(
      (value) => typeof value === "number" && Number.isFinite(value),
    );
    return finiteValues.length ? Math.max(0, Math.trunc(Math.min(...finiteValues))) : null;
  }

  function adjustItemAvailability(itemId, quantityDelta) {
    if (state.mode !== "api" || quantityDelta === 0) return;
    const item = state.items.find((product) => product.id === itemId);
    if (!item || typeof item.availableQty !== "number") return;
    item.availableQty = Math.max(0, item.availableQty - quantityDelta);
  }

  function getCartLines() {
    if (state.mode === "api" && state.cart?.items) {
      return state.cart.items.map((line) => ({
        id: line.catalogItemId,
        name: line.item?.name ?? "Товар",
        quantity: line.quantity,
        total: Number(line.lineTotal ?? 0),
      }));
    }

    return [...state.localCart.entries()].map(([id, quantity]) => {
      const item = state.items.find((product) => product.id === id);
      return {
        id,
        name: item?.name ?? "Товар",
        quantity,
        total: quantity * Number(item?.finalPrice ?? 0),
      };
    });
  }

  function getCartTotal() {
    if (state.mode === "api" && state.cart) return Number(state.cart.totalAmount ?? 0);
    return getCartLines().reduce((sum, line) => sum + line.total, 0);
  }

  function getImageUrl(item) {
    if (item.imageUrl) return item.imageUrl;
    if (state.mode === "api" && item.image?.status && item.image.status !== "missing") {
      return apiUrl(`/catalog/active/items/${encodeURIComponent(item.id)}/image`, {
        variant: "thumbnail",
        v: item.image.storageKey,
      });
    }
    return "../assets/plant-care/anturium.webp";
  }

  function currentItems() {
    const query = state.query.trim().toLowerCase();
    return state.items.filter((item) => {
      const matchesCategory = !state.category || item.category === state.category;
      const matchesQuery =
        !query ||
        [item.name, item.category, item.attribute1, item.attribute2, item.attribute3]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      return matchesCategory && matchesQuery;
    });
  }

  function renderSession() {
    const isSignedIn = Boolean(state.user);
    elements.loginForm.hidden = isSignedIn;
    elements.logout.hidden = !isSignedIn;
    elements.session.hidden = !isSignedIn;
    if (isSignedIn) {
      elements.sessionName.textContent = state.user.client?.name || state.user.login || "клиент";
    }
  }

  function renderCategories() {
    const categories = ["", ...state.categories];
    elements.categories.innerHTML = categories
      .map((category) => {
        const label = category || "Все";
        const active = category === state.category ? " webshop-category--active" : "";
        return `<button class="webshop-category${active}" type="button" data-category="${escapeHtml(category)}">${escapeHtml(label)}</button>`;
      })
      .join("");
  }

  function renderCart() {
    const lines = getCartLines();
    const total = getCartTotal();
    elements.cartTotal.textContent = formatMoney(total);
    elements.checkout.disabled = state.mode !== "api" || !state.user || lines.length === 0;

    if (!lines.length) {
      elements.cartItems.innerHTML = '<p class="webshop-empty">Корзина пуста</p>';
      return;
    }

    elements.cartItems.innerHTML = lines
      .map((line) => `
        <div class="webshop-cart-line">
          <div>
            <strong>${escapeHtml(line.name)}</strong>
            <span>${line.quantity} шт</span>
          </div>
          <b>${formatMoney(line.total)}</b>
        </div>
      `)
      .join("");
  }

  function renderProducts() {
    const items = currentItems();
    elements.count.textContent = `${items.length} ${items.length === 1 ? "товар" : "товаров"}`;

    if (!items.length) {
      elements.products.innerHTML = `
        <div class="webshop-empty-state">
          <strong>Ничего не найдено</strong>
          <span>Измените поиск или категорию.</span>
        </div>
      `;
      renderCart();
      return;
    }

    elements.products.innerHTML = items
      .map((item) => {
        const quantity = getLineQuantity(item.id);
        const pack = normalizePack(item.packSize);
        const priceVisible = state.mode === "demo" || item.finalPrice;
        const canOrder = state.mode === "demo" || (state.user && item.finalPrice);
        const available = Number.isFinite(Number(item.availableQty)) ? Number(item.availableQty) : null;
        const maxQuantity = getMaxQuantity(item);
        const maxQty = getPackAwareMaxQuantity(maxQuantity, pack) ?? 0;
        const attributes = [item.attribute1, item.attribute2, item.attribute3].filter(Boolean);

        return `
          <article class="webshop-product" data-product-id="${escapeHtml(item.id)}">
            <div class="webshop-product__image">
              <img src="${escapeHtml(getImageUrl(item))}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async" />
            </div>
            <div class="webshop-product__body">
              <span class="webshop-product__category">${escapeHtml(item.category)}</span>
              <h3>${escapeHtml(item.name)}</h3>
              <div class="webshop-product__attrs">
                ${attributes.map((attribute) => `<span>${escapeHtml(attribute)}</span>`).join("")}
              </div>
              <div class="webshop-product__meta">
                <strong>${priceVisible ? formatMoney(item.finalPrice) : "Цена после входа"}</strong>
                <span>${available === null ? "остатки после входа" : `${available} шт в наличии`}</span>
              </div>
            </div>
            <div class="webshop-qty" aria-label="Количество">
              <button type="button" data-product-action="minus" ${!canOrder || quantity <= 0 ? "disabled" : ""}>−</button>
              <input inputmode="numeric" value="${quantity}" data-product-action="input" ${!canOrder ? "disabled" : ""} />
              <button type="button" data-product-action="plus" ${!canOrder || maxQty <= 0 ? "disabled" : ""}>+</button>
              <button type="button" data-product-action="max" ${!canOrder || maxQty <= 0 ? "disabled" : ""}>MAX</button>
              <span>×${pack}</span>
            </div>
          </article>
        `;
      })
      .join("");
    renderCart();
  }

  function renderSummary() {
    elements.total.textContent = state.catalog?.totalItems ?? state.items.length;
    elements.delivery.textContent = formatDate(state.catalog?.deliveryDate);
  }

  function renderAll() {
    renderSummary();
    renderSession();
    renderCategories();
    renderProducts();
  }

  async function hydrateUser() {
    if (!state.token || state.mode !== "api") return;
    try {
      state.user = await request("/auth/me");
    } catch {
      state.token = null;
      window.sessionStorage.removeItem(tokenKey);
    }
  }

  async function loadCart() {
    if (!state.user || state.mode !== "api") {
      state.cart = null;
      return;
    }
    state.cart = await request("/cart");
  }

  async function loadCatalog() {
    if (!apiBaseUrl) {
      state.mode = "demo";
      state.catalog = {
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        totalItems: demoItems.length,
      };
      state.items = demoItems;
      state.categories = [...new Set(demoItems.map((item) => item.category))];
      setStatus(
        "info",
        "Витрина готова",
        "После подключения клиентского доступа здесь появится актуальный каталог, цены и оформление заказа.",
      );
      return;
    }

    try {
      state.mode = "api";
      await hydrateUser();
      const [summary, filters, itemsResult] = await Promise.all([
        request("/catalog/active"),
        request("/catalog/active/filters"),
        loadAllCatalogItems(),
      ]);
      state.catalog = summary;
      state.items = itemsResult.items ?? [];
      state.catalog.totalItems = itemsResult.totalItems ?? state.catalog.totalItems ?? state.items.length;
      state.categories = filters.categories ?? summary.categories ?? [];
      await loadCart();
      setStatus(
        "success",
        "Каталог подключён",
        state.user ? "Цены и остатки показаны для вашего клиента." : "Войдите, чтобы увидеть ваши цены и оформить заказ.",
      );
    } catch (error) {
      state.mode = "demo";
      state.catalog = {
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        totalItems: demoItems.length,
      };
      state.items = demoItems;
      state.categories = [...new Set(demoItems.map((item) => item.category))];
      setStatus(
        "warning",
        "Каталог временно недоступен",
        `${error.message}. Показан интерфейс вебшопа без отправки заказа.`,
      );
    }
  }

  async function loadAllCatalogItems() {
    const limit = 200;
    let offset = 0;
    let totalItems = null;
    const collected = [];

    while (offset < 3000) {
      const page = await request("/catalog/active/items", { params: { limit, offset } });
      const items = page.items ?? [];
      collected.push(...items);
      totalItems = typeof page.totalItems === "number" ? page.totalItems : totalItems;

      if (!items.length || (totalItems !== null && collected.length >= totalItems)) break;
      offset += items.length || limit;
    }

    return {
      items: collected,
      totalItems: totalItems ?? collected.length,
    };
  }

  async function setQuantity(item, nextQuantity) {
    const pack = normalizePack(item.packSize);
    const maxQty = getMaxQuantity(item);
    const quantity = normalizeQuantity(nextQuantity, pack, maxQty);

    if (state.mode === "api") {
      const previousQuantity = getLineQuantity(item.id);
      state.cart = quantity <= 0
        ? await request(`/cart/items/${encodeURIComponent(item.id)}`, {
            json: { expectedVersion: state.cart?.version },
            method: "DELETE",
          })
        : await request(`/cart/items/${encodeURIComponent(item.id)}`, {
            json: {
              expectedVersion: state.cart?.version,
              quantity,
            },
            method: "PUT",
          });
      const nextSavedQuantity = getLineQuantity(item.id);
      adjustItemAvailability(item.id, nextSavedQuantity - previousQuantity);
    } else {
      if (quantity > 0) state.localCart.set(item.id, quantity);
      else state.localCart.delete(item.id);
    }
    renderProducts();
  }

  elements.categories.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category ?? "";
    renderAll();
  });

  elements.search.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderProducts();
  });

  elements.products.addEventListener("click", async (event) => {
    const control = event.target.closest("[data-product-action]");
    if (!control) return;
    const card = control.closest("[data-product-id]");
    const item = state.items.find((product) => product.id === card?.dataset.productId);
    if (!item) return;
    const current = getLineQuantity(item.id);
    const pack = normalizePack(item.packSize);
    const action = control.dataset.productAction;
    const maxQty = getPackAwareMaxQuantity(getMaxQuantity(item), pack) ?? current + pack;
    const nextQuantity =
      action === "minus" ? current - pack :
      action === "max" ? maxQty :
      current + pack;
    try {
      await setQuantity(item, nextQuantity);
      setStatus("success", "Корзина обновлена", "Количество сохранено с учётом кратности.");
    } catch (error) {
      setStatus("warning", "Не удалось обновить корзину", error.message);
    }
  });

  elements.products.addEventListener("change", async (event) => {
    const input = event.target.closest('[data-product-action="input"]');
    if (!input) return;
    const card = input.closest("[data-product-id]");
    const item = state.items.find((product) => product.id === card?.dataset.productId);
    if (!item) return;
    try {
      await setQuantity(item, input.value);
      setStatus("success", "Корзина обновлена", "Количество приведено к допустимой кратности.");
    } catch (error) {
      setStatus("warning", "Не удалось обновить корзину", error.message);
      renderProducts();
    }
  });

  elements.loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (state.mode !== "api") {
      setStatus("warning", "Вход недоступен", "Сначала подключите backend URL вебшопа.");
      return;
    }
    const formData = new FormData(elements.loginForm);
    try {
      const response = await request("/auth/login", {
        json: {
          login: formData.get("login"),
          password: formData.get("password"),
        },
        method: "POST",
      });
      state.token = response.accessToken;
      window.sessionStorage.setItem(tokenKey, state.token);
      state.user = await request("/auth/me");
      elements.loginForm.reset();
      await loadCatalog();
      renderAll();
    } catch (error) {
      setStatus("warning", "Войти не получилось", error.message);
    }
  });

  elements.logout.addEventListener("click", async () => {
    try {
      if (state.mode === "api" && state.token) {
        await request("/auth/logout", { method: "POST" });
      }
    } catch {
      // Local session still needs to be cleared.
    }
    state.token = null;
    state.user = null;
    state.cart = null;
    window.sessionStorage.removeItem(tokenKey);
    await loadCatalog();
    renderAll();
  });

  elements.checkout.addEventListener("click", async () => {
    if (state.mode !== "api" || !state.user || !state.cart?.items?.length) return;
    try {
      const response = await request("/cart/checkout", {
        json: { expectedVersion: state.cart.version },
        method: "POST",
      });
      state.cart = await request("/cart");
      renderAll();
      setStatus("success", "Заказ оформлен", `Создан заказ №${response.order?.orderNumber ?? response.order?.id ?? ""}.`);
    } catch (error) {
      setStatus("warning", "Заказ не оформлен", error.message);
    }
  });

  elements.focusLogin.addEventListener("click", () => {
    elements.loginForm.querySelector("input")?.focus();
    elements.loginForm.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  loadCatalog()
    .then(renderAll)
    .catch((error) => {
      setStatus("warning", "Не удалось открыть вебшоп", error.message);
      state.items = demoItems;
      state.categories = [...new Set(demoItems.map((item) => item.category))];
      renderAll();
    });
})();
