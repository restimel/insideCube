import { defineStore } from 'pinia';

/* Define available languages */
export type Language = 'fr' | 'en';

export const locales: Language[] = [
    'en',
    'fr',
];
locales.sort();

const DEFAULT_LOCALE = 'en';

function getLocale(local?: string | null): Language {
    /*
     * TODO if null/undefined
     * navigator.languages || [navigator.language || navigator.userLanguage]
     */

    if (locales.includes(local as Language)) {
        return local as Language;
    }

    return DEFAULT_LOCALE;
}

export const useLanguageStore = defineStore('language', {
    state: () => ({
        currentLanguage: getLocale(localStorage.getItem('language')),
    }),

    actions: {
        /* Change language and save to localStorage for persistence */
        setLanguage(lang: Language) {
            const locale = getLocale(lang);
            this.currentLanguage = locale;
            localStorage.setItem('language', locale);
        },
    },
});
