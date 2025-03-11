<template>
    <section class="panel-container">
        <header class="panel-header">
            {{ props.title }}
            <slot name="header"></slot>
        </header>
        <div class="panel-content">
            <slot></slot>
        </div>
        <footer v-if="slots.footer"
            class="panel-footer"
        >
            <slot name="footer"></slot>
        </footer>
    </section>
</template>

<script setup lang="ts">
import { useSlots } from 'vue';

const props = defineProps<{
    title?: string;
}>();

const slots = useSlots();
</script>

<style scoped>
.panel-container {
    margin-bottom: var(--section-gap);
    background-color: var(--color-background-soft);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    display: grid;
    grid-template-rows: max-content 1fr max-content;
    height: 100%;
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-sm);
    background-color: var(--color-primary);
    color: var(--color-text-primary);
}

.panel-content {
    padding: var(--section-padding);
    overflow-y: auto;
}

.panel-footer {
    padding: var(--spacing-sm);
    display: flex;
    flex-direction: row;
    gap: var(--spacing-sm);
    justify-content: flex-start;
    align-items: center;
    border-top: 1px solid var(--color-border);
}
</style>
