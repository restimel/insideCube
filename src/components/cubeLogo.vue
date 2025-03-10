<template>
    <div v-if="cube"
        class="cube-logo"
        :style="`--color: ${cube.color}`"
    >
        {{ letter }}
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Cube } from '@/types/Cube';

const props = defineProps<{
    cube: Cube | null;
}>();

const cube = computed(() => props.cube);
const letter = computed(() => {
    return cube.value?.name.charAt(0) || '?';
});

</script>
<style scoped>

.cube-logo {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius);
    --cube-color: var(--color, var(--vt-c-text-light-2));
    background-color: var(--cube-color);
    /* use black color if the color is light
     * and white if the color is dark */
    color: hsl(from var(--cube-color) 0 0 calc(clamp(0, 60 - l, 1) * 100%));
    font-weight: bold;
    font-size: var(--font-size-lg);
    margin-inline-end: var(--spacing-sm);
}

</style>
