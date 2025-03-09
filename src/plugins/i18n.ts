import { createI18n } from 'vue-i18n';
import fr from '../locales/fr';
import en from '../locales/en';

/* Create and configure i18n instance */
const i18n = createI18n({
    legacy: false, /* Use Composition API */
    locale: 'en', /* Set initial locale */
    fallbackLocale: 'en', /* Fallback if translation is missing */
    messages: {
        fr,
        en,
    },
});

export default i18n;
