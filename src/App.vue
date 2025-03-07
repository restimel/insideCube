<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
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
                This project is open source under the MIT License.
                <a href="https://github.com/restimel/insideCube">Contribute on GitHub</a>!
                <i class="cookie">
                    No cookies inside!
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
    min-height: 100vh;
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
