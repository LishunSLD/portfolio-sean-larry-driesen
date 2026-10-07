const DATA_PATH = "./data/";

// Charge les textes et applique les traductions aux éléments marqués.
export class TranslationKey {
    constructor({ defaultLanguage = "fr-CA", onLanguageChange } = {}) {
        this.language = defaultLanguage;
        this.onLanguageChange = onLanguageChange;
        this.translations = {};
    }

    async load(language) {
        const response = await fetch(`${DATA_PATH}${language}.json`);
        if (!response.ok) {
            throw new Error(`Impossible de charger les traductions ${language}.`);
        }

        this.translations = await response.json();
        this.language = language;
        this.apply();
        document.documentElement.lang = language;

        if (this.onLanguageChange) {
            await this.onLanguageChange(language);
        }
    }

    translate(key) {
        return key.split(".").reduce((value, part) => value?.[part], this.translations);
    }

    apply() {
        document.querySelectorAll("[data-i18n-key]").forEach((element) => {
            const text = this.translate(element.dataset.i18nKey);
            if (typeof text === "string") {
                element.textContent = text;
            }
        });

        document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
            const label = this.translate(element.dataset.i18nAriaLabel);
            if (typeof label === "string") {
                element.setAttribute("aria-label", label);
            }
        });
    }

    toggle() {
        return this.load(this.language === "fr-CA" ? "en-CA" : "fr-CA");
    }
}

export default TranslationKey;
