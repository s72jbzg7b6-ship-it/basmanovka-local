export function createPlantFilters(plants, activeFilter) {
  const wrap = document.createElement("div");
  wrap.className = "plant-filter-list";

  const badgeCounts = new Map();
  for (const plant of plants) {
    const badges = plant.filters?.badges?.length ? plant.filters.badges : plant.badges;
    for (const badge of new Set(badges)) {
      badgeCounts.set(badge, (badgeCounts.get(badge) ?? 0) + 1);
    }
  }

  const options = [
    { value: "all", label: "Все растения", count: plants.length },
    ...[...badgeCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ru"))
      .slice(0, 8)
      .map(([label, count]) => ({ value: label, label, count }))
  ];

  for (const option of options) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `plant-filter${option.value === activeFilter ? " plant-filter--active" : ""}`;
    button.dataset.filter = option.value;
    button.setAttribute("aria-pressed", String(option.value === activeFilter));
    button.setAttribute("aria-label", `Фильтр: ${option.label}`);
    button.innerHTML = `
      <span>${option.label}</span>
      <strong>${option.count}</strong>
    `;
    wrap.appendChild(button);
  }

  return wrap;
}
