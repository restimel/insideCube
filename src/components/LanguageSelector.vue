<template>
    <div class="language-selector">
        <span>{{ t('header.language') }}:</span>
        <div class="language-options">
            <button v-for="lang of availableLocales"
                :key="`locale-key-${lang}`"
                @click="changeLanguage(lang)"
                :class="{ active: locale === lang }"
            >
                {{ lang.toLocaleUpperCase(lang) }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t, locale, availableLocales } = useI18n();

const changeLanguage = (lang: string) => {
    locale.value = lang;
    localStorage.setItem('language', lang);
};
</script>

<style scoped>
.language-selector {
    display: flex;
    align-items: center;
}

.language-selector span {
    margin-right: var(--spacing-xs);
}

.language-options {
    display: flex;
}

.language-options button {
    background: var(--color-secondary);
    border: 1px solid var(--color-text-secondary);
    color: var(--color-text-secondary);
    padding: 2px 6px;
    margin: 0 2px;
    cursor: pointer;
    font-size: var(--font-size-sm);
    border-radius: 3px;
    transition: all 0.3s;
}

.language-options button.active {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--color-text-primary);
    font-weight: bold;
}

.language-options button:hover {
    background-color: var(--color-primary-inline-hover);
}

@media (max-width: 768px) {
    .language-selector {
        margin-top: var(--spacing-sm);
        width: 100%;
        justify-content: flex-start;
    }
}

</style>
