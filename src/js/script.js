import { TranslationKey } from "./components/translation-key.js";

const langBall = document.querySelector(".lang-ball");
const categoryFilters = document.querySelector(".project-category-filters");
const projectGallery = document.querySelector(".project-gallery");
const translation = new TranslationKey({
    defaultLanguage: "fr_ca",
    onLanguageChange: renderProjects
});

// Chargement projets de /data/projets
async function loadProjectData(language) {
    const response = await fetch(`./data/projets/${language}.json`);
    if (!response.ok) {
        throw new Error(`Impossible de charger les projets ${language}.`);
    }
    return response.json();
}

// Création de cartes projets
async function renderProjects(language) {
    const data = await loadProjectData(language);
    categoryFilters.replaceChildren();
    projectGallery.replaceChildren();

    const allFilter = document.createElement("button");
    allFilter.className = "project-category-filter";
    allFilter.type = "button";
    allFilter.textContent = translation.translate("projects.filterAll");
    allFilter.dataset.category = "all";
    categoryFilters.append(allFilter);

    data.categories.forEach((category) => {
        const filter = document.createElement("button");
        filter.className = "project-category-filter";
        filter.type = "button";
        filter.textContent = category;
        filter.dataset.category = category;
        categoryFilters.append(filter);
    });

    data.projects.forEach((project) => {
        const card = document.createElement("article");
        card.className = "project-card";
        card.dataset.category = project.category;
        card.innerHTML = `
            <img src="${project.image}" alt="" class="project-card-image">
            <div class="project-card-content">
                <div class="project-card-title-category"> 
                    <i><h3 class="project-card-title">${project.title}</h3></i>
                    <p class="project-card-category">${project.category}</p>
                </div>
                <h4 class="project-card-year">${project.year}</h4>
                <p class="project-card-text">${project.description}</p>
                <a class="project-card-button" href="${project.link}">${translation.translate("projects.openProject")}</a>
                <div class="project-card-tags">
                    ${project.tags.map((tag) => `<span class="project-card-tag">${tag}</span>`).join("")}
                </div>
            </div>
        `;
        projectGallery.append(card);
    });
}

// Filtres
categoryFilters.addEventListener("click", (event) => {
    const filter = event.target.closest(".project-category-filter");
    if (!filter) return;

    document.querySelectorAll(".project-card").forEach((card) => {
        card.hidden = filter.dataset.category !== "all" && card.dataset.category !== filter.dataset.category;
    });
});

// Changer de langue
langBall.addEventListener("click", async () => {
    try {
        await translation.toggle();
        const isEnglish = translation.language === "en_ca";
        langBall.classList.toggle("lang-ball--english", isEnglish);
        langBall.setAttribute("aria-pressed", String(isEnglish));
        langBall.setAttribute("aria-label", isEnglish ? "Passer au français" : "Passer à l'anglais");
    } catch (error) {
        console.error(error);
    }
});

translation.load("fr_ca").catch((error) => console.error(error));