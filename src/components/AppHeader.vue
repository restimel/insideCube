<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import LanguageSelector from './LanguageSelector.vue';

const { t } = useI18n();

const isMenuOpen = ref(false);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
    <header class="app-header">
        <div class="container">
            <div class="logo">
                <RouterLink to="/">InsideCube</RouterLink>
            </div>

            <!-- Burger Menu for mobile -->
            <div class="menu-toggle" @click="toggleMenu">
                <span></span>
                <span></span>
                <span></span>
            </div>

            <!-- Navigation Menu -->
            <nav :class="{ 'open': isMenuOpen }">
                <ul>
                    <li><RouterLink to="/manage">{{ t('header.manage') }}</RouterLink></li>
                    <li><RouterLink to="/lost">{{ t('header.lost') }}</RouterLink></li>
                    <li><RouterLink to="/help">{{ t('header.help') }}</RouterLink></li>
                    <li><LanguageSelector /></li>
                </ul>
            </nav>
        </div>
    </header>
</template>

<style scoped>
.app-header {
    background-color: var(--color-secondary);
    color: var(--color-text-secondary);
    height: var(--header-height);
    display: flex;
    align-items: center;
}

.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100vw;
    max-width: 100vw;
}

.logo a {
    color: var(--color-text-secondary);
    font-size: var(--font-size-xl);
    font-weight: bold;
    text-decoration: none;
}

nav ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
}

nav ul li {
    margin-left: var(--spacing-md);
}

nav ul li a {
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: color 0.3s;
}

nav ul li a:hover,
nav ul li a.router-link-active {
    color: var(--color-primary);
}

.menu-toggle {
    display: none;
    flex-direction: column;
    cursor: pointer;
}

.menu-toggle span {
    background: var(--color-background);
    height: 3px;
    width: 25px;
    margin: 3px 0;
    border-radius: 3px;
}

@media (max-width: 768px) {
    .menu-toggle {
        display: flex;
    }

    nav {
        position: absolute;
        top: var(--header-height);
        left: 0;
        right: 0;
        background-color: var(--color-secondary);
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }

    nav.open {
        max-height: 300px;
    }

    nav ul {
        flex-direction: column;
        padding: var(--spacing-sm);
    }

    nav ul li {
        margin: var(--spacing-xs) 0;
    }
}
</style>
