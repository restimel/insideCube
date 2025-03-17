<template>
    <div
        class="toggle-field"
        :class="{
            expanded: isVisible,
            collapsed: !isVisible,
        }"
    >
        <div
            class="toggle-field-header"
            @click.prevent.stop="toggleVisibility"
        >
            <button
                type="button"
                class="toggle-button"
                :aria-label="isVisible ? 'Hide content' : 'Show content'"
                @click.prevent.stop="toggleVisibility"
            >
                <span class="caret"></span>
            </button>
            <label class="toggle-field-label">{{ label }}</label>
        </div>

        <transition name="scale-fade">
            <div class="toggle-field-content" v-if="isVisible">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
    /** Label to display for the toggle field */
    label: string;

    /** Initial state (visible or hidden) */
    open?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    open: false,
    containerClass: '',
});

const emit = defineEmits<{
    toggle: [boolean];
}>();

/* Track visibility state */
const isVisible = ref(props.open);

watch(() => props.open, (newValue: boolean) => {
    isVisible.value = newValue;
});

const toggleVisibility = () => {
    const newValue = !isVisible.value;
    isVisible.value = newValue;
    emit('toggle', newValue);
};

</script>

<style scoped>
.toggle-field {
    border: var(--field-border);
    border-radius: var(--border-radius);
    overflow: hidden;
}

.toggle-field-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-sm);
    background-color: var(--color-background-light);
    cursor: pointer;
}

.toggle-field-label {
    font-weight: 600;
    color: var(--color-secondary);
}

.toggle-button {
    --button-color: var(--color-secondary);
    font-size: var(--font-size-md);
}

.toggle-field-content {
    padding: var(--spacing-sm);
    background-color: var(--color-background);
}

.collapsed .caret:before {
    content: '+';
    display: inline-block;
    border: 1px solid currentColor;
    width: 1em;
    height: 1em;
    line-height: 1em;
    border-radius: 50px; /* circle */
}

.expanded .caret:before {
    content: '-';
    display: inline-block;
    border: 1px solid currentColor;
    width: 1em;
    height: 1em;
    line-height: 1em;
    border-radius: 50px; /* circle */
}

/* Transition classes */
.scale-fade-enter-active, .scale-fade-leave-active {
    transition: max-height 0.4s ease, padding 0.3s ease;
    overflow-y: hidden;
}
.scale-fade-enter-from, .scale-fade-leave-to {
    padding-top: 0;
    padding-bottom: 0;
    max-height: 0;
}
.scale-fade-enter-to, .scale-fade-leave-from {
    max-height: 700px;
}
</style>
