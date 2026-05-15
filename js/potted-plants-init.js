import { PlantCareSection } from "./components/PlantCareSection.js?v=20260425-alpha-scroll-top-v2";

const PLANT_CARE_VERSION = "20260425-alpha-scroll-top-v2";

async function initPlantCare() {
  const mount = document.getElementById("plant-care-root");
  if (!mount) return;

  const response = await fetch(`../js/plant-care/plantCareData.json?v=${PLANT_CARE_VERSION}`);
  if (!response.ok) {
    throw new Error(`Failed to load plant data: ${response.status}`);
  }
  const payload = await response.json();
  const isLegacyArray = Array.isArray(payload);
  const plants = isLegacyArray ? payload : payload?.plants;
  if (!Array.isArray(plants)) {
    throw new Error("Plant data must include a plants array");
  }

  const section = new PlantCareSection(mount, isLegacyArray ? { plants, hero: null } : payload);
  section.render();
}

initPlantCare().catch((error) => {
  console.error("Plant care section failed to initialize", error);
  const mount = document.getElementById("plant-care-root");
  if (mount) {
    mount.innerHTML = `
      <div class="notice">
        <strong>Справочный блок временно недоступен</strong>
        Не удалось загрузить карточки растений. Обновите страницу или проверьте локальный сервер.
      </div>
    `;
  }
});
