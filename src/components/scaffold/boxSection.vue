<template>
    <div class="box-section">
        <h2 v-if="props.title">
            {{ props.title }}
        </h2>
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    title?: string;
}>();
</script>

<style scoped>
.box-section {
    margin-bottom: var(--section-gap);
    padding: var(--section-padding);
    border-radius: var(--border-radius);
    background-color: var(--color-background-soft);
    box-shadow: var(--shadow-sm);
}

h2 {
    margin-bottom: var(--spacing-xs);
    color: var(--color-text);
}
</style>
