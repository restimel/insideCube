<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
    <section class="app">
        <AppHeader />
        <main>
            <RouterView />
        </main>
        <footer>
            <p>
                &copy; {{ new Date().getFullYear() }}.
                {{ t('footer.openSource') }}
                <a href="https://github.com/restimel/insideCube">
                    {{ t('footer.contribute') }}
                </a>!
                <i class="cookie">
                    {{ t('footer.cookies') }}
                </i>
            </p>
        </footer>
    </section>
</template>

<style scoped>

/* Grid layout to keep header and footer always visible */
.app {
    display: grid;
    grid-template-rows: var(--header-height) 1fr var(--footer-height);
    height: 100vh;
    width: 100vw;
}

header {
    grid-row: 1;
    position: sticky;
    top: 0;
    z-index: 100;
}

main {
    grid-row: 2;
    overflow: auto;
    padding: var(--spacing-sm);
    height: 100%;
}

footer {
    grid-row: 3;
    background-color: var(--color-secondary);
    color: var(--color-text-secondary);
    text-align: center;
    padding: var(--spacing-xs);
}

.cookie {
    margin-inline-start: var(--spacing-lg);
}

</style>
