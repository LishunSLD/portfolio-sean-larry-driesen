import { TranslationKey } from "./components/translation-key.js";

const langBall = document.querySelector(".lang-ball");
const categoryFilters = document.querySelector(".project-category-filters");
const projectGallery = document.querySelector(".project-gallery");
const projectPopup = document.querySelector(".project-popup");
const projectPopupMain = document.querySelector(".project-popup-main");
const projectPopupProcess = document.querySelector(".project-popup-process");
const projectPopupClose = document.querySelector(".project-popup-close");
const translation = new TranslationKey({
    defaultLanguage: "fr",
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
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", `${translation.translate("projects.openProject")}: ${project.title}`);
        card.innerHTML = `
            <img src="${project.image}" alt="${project.alt}" class="project-card-image" loading="lazy">
            <div class="project-card-content">
                <div class="project-card-title-category"> 
                    <i><h3 class="project-card-title">${project.title}</h3></i>
                    <p class="project-card-category">${project.category[0]}</p>
                </div>
                <h4 class="project-card-year">${project.year}</h4>
                <p class="project-card-text">${project.description}</p>
                <a class="project-card-button" href="${project.link}">${translation.translate("projects.openProject")}</a>
                <div class="project-card-tags">
                    ${project.tags.map((tag) => `<span class="project-card-tag">${tag}</span>`).join("")}
                </div>
            </div>
        `;
        card.addEventListener("click", () => openProjectPopup(project));
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openProjectPopup(project);
            }
        });
        card.querySelector(".project-card-button").addEventListener("click", (event) => {
            event.preventDefault();
        });
        projectGallery.append(card);
    });
}

// Remplit et ouvre la popup du projet sélectionné.
function openProjectPopup(project) {
    projectPopupMain.replaceChildren();
    projectPopupProcess.replaceChildren();

    const title = document.createElement("h2");
    title.id = "project-popup-title";
    title.textContent = project.title;

    const image = document.createElement("img");
    image.className = "project-popup-image";
    image.src = project.image;
    image.alt = project.title;

    const description = document.createElement("p");
    description.textContent = project.description;

    const details = document.createElement("p");
    details.className = "project-popup-details";
    details.textContent = `${project.category} · ${project.year}`;

    const tags = document.createElement("div");
    tags.className = "project-popup-tags";
    project.tags.forEach((tag) => {
        const tagElement = document.createElement("span");
        tagElement.className = "project-card-tag";
        tagElement.textContent = tag;
        tags.append(tagElement);
    });

    projectPopupMain.append(title, image, details, description, tags);

    if (project.link) {
        const link = document.createElement("a");
        link.className = "project-popup-link";
        link.href = project.link;
        link.target = "_blank";
        link.rel = "noreferrer";
        link.textContent = translation.translate("projects.visitProject");
        projectPopupMain.append(link);
    }

    const process = project.creationProcess;
    if (process && (process.p1)) {
        const processTitle = document.createElement("h3");
        processTitle.textContent = translation.translate("projects.creationProcess");
        projectPopupProcess.append(processTitle);

        const processLayout = document.createElement("div");
        processLayout.className = "project-popup-process-layout";

        if (process.p1) {
            const processDescription = document.createElement("div");
            processDescription.className = "project-card-process-description";
            processDescription.innerHTML = 
            `<section>
                <div class="project-card-process-description-pr-container">
                <h3>${process.p1_title}</h3>
                <p>${process.p1}</p>
                </div>
                <img src="${process.p1_images}" alt="Support Image" loading="lazy">
            </section>
            <section>
                <div class="project-card-process-description-pr-container">
                <h3>${process.p2_title}</h3>
                <p>${process.p2}</p>
                </div>
                <img src="${process.p2_images}" alt="Support Image" loading="lazy">
            </section>
            <section>
                <div class="project-card-process-description-pr-container">
                <h3>${process.p3_title}</h3>
                <p>${process.p3}</p>
                </div>
                <img src="${process.p3_images}" alt="Support Image" loading="lazy">
            </section>
            <section>
                <div class="project-card-process-description-pr-container">
                <h3>${process.p4_title}</h3>
                <p>${process.p4}</p>
                </div>
                <img src="${process.p4_images}" alt="Support Image" loading="lazy">
            </section>
            <section>
                <div class="project-card-process-description-pr-container">
                <h3>${process.p5_title}</h3>
                <p>${process.p5}</p>
                </div>
                <img src="${process.p5_images}" alt="Support Image" loading="lazy">
            </section>
            <section>
                <div class="project-card-process-description-pr-container">
                <h3>${process.p6_title}</h3>
                <p>${process.p6}</p>
                </div>
                <img src="${process.p6_images}" alt="Support Image" loading="lazy">
            </section>`;
            processLayout.append(processDescription);
        }

        projectPopupProcess.append(processLayout);
    }

    projectPopup.showModal();
}

projectPopupClose.addEventListener("click", () => projectPopup.close());
projectPopup.addEventListener("click", (event) => {
    if (event.target === projectPopup) projectPopup.close();
});

// Filtres
categoryFilters.addEventListener("click", (event) => {
    const filter = event.target.closest(".project-category-filter");
    if (!filter) return;

    const selectedCategory = filter.dataset.category;

    document.querySelectorAll(".project-card").forEach((card) => {
        const cardCategories = card.dataset.category.split(",").map(cat => cat.trim());
        
        if (selectedCategory === "all" || cardCategories.includes(selectedCategory)) {
            card.style.display = ""; 
        } else {
            card.style.display = "none"; 
        }
    });
});

// Changer de langue
langBall.addEventListener("click", async () => {
    try {
        await translation.toggle();
        const isEnglish = translation.language === "en-CA";
        langBall.classList.toggle("lang-ball--english", isEnglish);
        langBall.setAttribute("aria-pressed", String(isEnglish));
        langBall.setAttribute("aria-label", isEnglish ? "Passer au français" : "Passer à l'anglais");
    } catch (error) {
        console.error(error);
    }
});

translation.load("fr-CA").catch((error) => console.error(error));