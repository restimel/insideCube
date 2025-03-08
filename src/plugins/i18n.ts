import { createI18n } from 'vue-i18n';
import fr from '../locales/fr';
import en from '../locales/en';
import { useLanguageStore } from '@/stores/languageStore';

const languageStore = useLanguageStore();
const storedLanguage = languageStore.currentLanguage;

/* Create and configure i18n instance */
const i18n = createI18n({
    legacy: false, /* Use Composition API */
    locale: storedLanguage, /* Set initial locale */
    fallbackLocale: 'en', /* Fallback if translation is missing */
    messages: {
        fr,
        en,
    },
});

export default i18n;
