<template>
    <defs>
        <symbol id="hole" viewBox="0 0 11 11">
            <circle cx="5" cy="5" r="4"
                class="hole"
            />
        </symbol>
        <SymbolStartFlag />
        <SymbolEndFlag />
    </defs>
</template>
<script setup lang="ts">
import SymbolStartFlag from '@/components/icons/svg/symbolStartFlag.vue';
import SymbolEndFlag from '@/components/icons/svg/symbolEndFlag.vue';
</script>
<style scoped>
.hole {
    fill: var(--cube-color2);
    stroke: none;
}
</style>
