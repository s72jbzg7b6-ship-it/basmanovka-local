function getPrimaryImage(plant) {
  return plant.imageUrl || plant.gallery?.[0] || "";
}

function getLightSummary(plant) {
  const levels = Array.isArray(plant.filters?.lightLevel) ? plant.filters.lightLevel : [];

  if (levels.includes("direct_sun")) {
    return { key: "direct_sun", value: "прямое солнце" };
  }

  if (levels.includes("bright_indirect")) {
    return { key: "bright_indirect", value: "яркий рассеянный свет" };
  }

  if (levels.includes("partial_shade")) {
    return { key: "partial_shade", value: "полутень" };
  }

  return { key: "shade", value: "тень" };
}

function getWateringSummary(plant) {
  const watering = plant.filters?.watering;

  if (watering === "frequent") {
    return { key: "frequent", value: "частый полив" };
  }

  if (watering === "moderate") {
    return { key: "moderate", value: "умеренный полив" };
  }

  return { key: "rare", value: "редкий полив" };
}

function renderLightIcon(kind) {
  const icons = {
    shade: "../assets/plant-care/icons/light-outline.png",
    partial_shade: "../assets/plant-care/icons/light-half.png",
    bright_indirect: "../assets/plant-care/icons/light-full.png",
    direct_sun: "../assets/plant-care/icons/light-full.png"
  };

  const src = icons[kind] || icons.bright_indirect;
  return `<img src="${src}" alt="" loading="lazy" decoding="async" aria-hidden="true" />`;
}

function renderWateringIcon(kind) {
  const icons = {
    rare: "../assets/plant-care/icons/watering-rare.png",
    moderate: "../assets/plant-care/icons/watering-moderate.png",
    frequent: "../assets/plant-care/icons/watering-frequent.png"
  };

  return `<img src="${icons[kind] || icons.moderate}" alt="" loading="lazy" decoding="async" aria-hidden="true" />`;
}

export function createPlantCard(plant) {
  const article = document.createElement("article");
  article.className = "plant-card";
  article.id = `plant-${plant.id}`;
  article.dataset.plantId = plant.id;

  const imageSrc = getPrimaryImage(plant);

  const imageMarkup = imageSrc
    ? `<img src="${imageSrc}" alt="${plant.imageAlt}" loading="lazy" decoding="async" referrerpolicy="no-referrer" />`
    : `<div class="plant-card__placeholder" aria-hidden="true">🌿</div>`;

  const badges = plant.badges
    .slice(0, 4)
    .map((badge) => `<span class="plant-badge">${badge}</span>`)
    .join("");

  const light = getLightSummary(plant);
  const watering = getWateringSummary(plant);
  const facts = [
    {
      label: "Свет",
      value: plant.quickFacts.lightLabel || light.value,
      icon: renderLightIcon(light.key),
      iconClass: "plant-card__fact-icon--light"
    },
    {
      label: "Полив",
      value: plant.quickFacts.wateringLabel || watering.value,
      icon: renderWateringIcon(watering.key),
      iconClass: "plant-card__fact-icon--watering"
    }
  ]
    .map(
      (fact) => `
        <div class="plant-card__fact" title="${fact.value}" aria-label="${fact.label}: ${fact.value}">
          <dt>${fact.label}</dt>
          <dd>
            <span class="plant-card__fact-icon ${fact.iconClass}" aria-hidden="true">${fact.icon}</span>
          </dd>
        </div>
      `
    )
    .join("");

  article.innerHTML = `
    <button
      class="plant-card__summary"
      type="button"
      aria-haspopup="dialog"
      aria-expanded="false"
      aria-controls="plant-care-modal"
      aria-label="Открыть карточку растения ${plant.name}"
    >
      <div class="plant-card__image">${imageMarkup}</div>
      <div class="plant-card__body">
        <div class="plant-card__eyebrow">Комнатное растение</div>
        <h3 class="plant-card__title">${plant.name}</h3>
        <div class="plant-card__badges">${badges}</div>
        <div class="plant-card__footer">
          <dl class="plant-card__facts">${facts}</dl>
          <div class="plant-card__toggle">Подробнее</div>
        </div>
      </div>
    </button>
  `;

  return article;
}
