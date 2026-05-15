import { createSimilarPlants } from "./SimilarPlants.js?v=20260425-catalog100";

export function createPlantDetails(plant, allPlants) {
  const details = document.createElement("div");
  details.className = "plant-details";
  const lead = plant.seo?.description || plant.description?.[0] || "";

  const facts = [
    { icon: "💧", label: "Полив", value: plant.quickFacts.wateringLabel },
    { icon: "☀️", label: "Освещение", value: plant.quickFacts.lightLabel },
    { icon: "🌡", label: "Температура", value: plant.quickFacts.temperatureLabel },
    { icon: "🌱", label: "Сложность в уходе", value: plant.quickFacts.difficultyLabel },
    { icon: "🐾", label: "Безопасность для животных", value: plant.quickFacts.safetyLabel }
  ];

  details.innerHTML = `
    <div class="plant-details__top">
      <div class="plant-details__title-wrap">
        <div class="plant-card__eyebrow">SEO-справочник Basmanovka.by</div>
        <h3 class="plant-details__title" id="plant-modal-title">${plant.name}</h3>
        <p class="plant-details__lead">${lead}</p>
      </div>
      <div class="plant-details__meta">
        <div class="plant-card__badges">
          ${plant.badges.map((badge) => `<span class="plant-badge">${badge}</span>`).join("")}
        </div>
        <div class="plant-details__facts">
          ${facts
            .map(
              (fact) => `
            <div class="plant-fact">
              <span class="plant-fact__icon">${fact.icon}</span>
              <div>
                <strong>${fact.label}</strong>
                <span>${fact.value}</span>
              </div>
            </div>`
            )
            .join("")}
        </div>
      </div>
    </div>
    <div class="plant-details__content">
      <div class="plant-details__column">
        <h4 class="plant-details__subhead">Описание</h4>
        ${plant.description.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        <h4 class="plant-details__subhead">Преимущества</h4>
        <ul class="plant-details__list">
          ${plant.benefits.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
      <div class="plant-details__column">
        <h4 class="plant-details__subhead">Уход</h4>
        <dl class="plant-care-list">
          <div><dt>Освещение</dt><dd>${plant.care.light}</dd></div>
          <div><dt>Полив</dt><dd>${plant.care.watering}</dd></div>
          <div><dt>Температура</dt><dd>${plant.care.temperature}</dd></div>
          <div><dt>Влажность</dt><dd>${plant.care.humidity}</dd></div>
          <div><dt>Почва</dt><dd>${plant.care.soil}</dd></div>
        </dl>
        <div class="plant-details__hint"><strong>Подсказка:</strong> ${plant.careHint}</div>
      </div>
    </div>
  `;

  details.appendChild(createSimilarPlants(allPlants, plant.similarIds));
  return details;
}
