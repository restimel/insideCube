<template>
    <aside v-if="open"
        class="mask"
        @click.stop="emit('close')"
    >
        <aside
            class="dialog"
            @click.stop
        >
            <button
                class="close"
                @click.stop.prevent="emit('close')"
            >
                ×
            </button>
            <slot />
        </aside>
    </aside>
</template>
<script lang="ts" setup>
type Props = {
    open: boolean;
};

defineProps<Props>();
const emit = defineEmits<{
    close: [];
    maskClick: [];
}>();

</script>
<style scoped>
.mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    backdrop-filter: brightness(0.5) blur(2px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dialog {
    position: relative;
    background: var(--color-background);
    border: var(--field-border);
    box-shadow: var(--shadow-lg);
    padding: var(--section-padding);
}

.close {
    position: absolute;
    top: var(--spacing-xs);
    right: var(--spacing-xs);
    border-radius: 25px;
    padding: 0;
    width: 1em;
    height: 1em;
}
</style>
