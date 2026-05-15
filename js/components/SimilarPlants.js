function getPrimaryImage(plant) {
  return plant.imageUrl || plant.gallery?.[0] || "";
}

export function createSimilarPlants(allPlants, similarIds) {
  const wrap = document.createElement("div");
  wrap.className = "similar-plants";

  const cards = similarIds
    .map((id) => allPlants.find((plant) => plant.id === id))
    .filter(Boolean)
    .slice(0, 3);

  wrap.innerHTML = `
    <h4 class="plant-details__subhead">Похожие растения</h4>
    <p class="similar-plants__note">Можно открыть соседние карточки и быстро сравнить условия ухода.</p>
    <div class="similar-plants__grid"></div>
  `;

  const grid = wrap.querySelector(".similar-plants__grid");

  for (const plant of cards) {
    const imageSrc = getPrimaryImage(plant);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "similar-plants__item";
    button.dataset.targetPlant = plant.id;
    button.setAttribute("aria-label", `Открыть похожее растение ${plant.name}`);
    button.innerHTML = `
      <div class="similar-plants__thumb">
        ${
          imageSrc
            ? `<img src="${imageSrc}" alt="${plant.imageAlt}" loading="lazy" decoding="async" referrerpolicy="no-referrer" />`
            : `<div class="similar-plants__fallback">🌿</div>`
        }
      </div>
      <span>${plant.name}</span>
    `;
    grid.appendChild(button);
  }

  return wrap;
}
