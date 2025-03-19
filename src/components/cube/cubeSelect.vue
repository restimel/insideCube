<template>
    <div
        class="select"
        @click="toggleOpen(true)"
    >
        <input
            class="cube-select-input"
            ref="cube-select-input"
            @focus="toggleOpen(true, true)"
            @blur="toggleOpen(false, true)"
            @keydown.down="moveDown"
            @keydown.up="moveUp"
            @keydown.prevent.enter="selectItem()"
            @keydown.escape="toggleOpen(false)"
        />

        <div
            class="cube-select-main"
            ref="cube-select-main"
            @click.stop
            @mousedown.stop="toggleOpen()"
        >
            <CubeSummary :name="value ?? undefined" />
            <IconCaret class="caret" />
        </div>

        <Teleport to="body">
            <section v-if="open"
                class="select-list"
                :style="position"
                @click.stop="toggleOpen(true)"
                @mousedown.stop="toggleOpen(true)"
            >
                <CubeSummary v-for="(cubeName, index) in list"
                    :key="`select-${cubeName}-${index}`"
                    :class="{
                        'select-item': true,
                        selected: cubeName === value,
                        active: index === active,
                    }"
                    :name="cubeName"
                    @click.stop="selectItem(cubeName)"
                />
            </section>
        </Teleport>
    </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, Teleport, useTemplateRef, watch } from 'vue';
import { useCubeStore } from '@/stores/cubeStore';
import CubeSummary from '@/components/cube/cubeSummary.vue';
import PositionObserver from '@thednp/position-observer';
import IconCaret from '../icons/IconCaret.vue';

type Props = {
    value?: string | null;
};

const props = defineProps<Props>();
const emit = defineEmits<{
    change: [string];
}>();
const cubeStore = useCubeStore();
const hiddenInput = useTemplateRef('cube-select-input');
const mainElement = useTemplateRef('cube-select-main');

const active = ref(-1);
const updateDOM = ref(0);
const open = ref(false);

watch(open, () => {
    if (open.value) {
        hiddenInput.value?.focus();
    }
});

function forceChange() {
    updateDOM.value++;
}

let observer: PositionObserver;

onMounted(() => {
    observer = new PositionObserver(() => {
        forceChange();
    });

    if (mainElement.value) {
        observer.observe(mainElement.value);
    }
});

onBeforeUnmount(() => {
    observer?.disconnect();
});

const position = computed(() => {
    /* eslint-disable-next-line @typescript-eslint/no-unused-expressions -- force update */
    updateDOM.value;

    const rect = mainElement.value?.getBoundingClientRect();

    if (!rect) {
        return '';
    }

    return `
        --left: ${rect.left}px;
        --right: ${rect.right}px;
        --bottom: ${rect.bottom}px;
        --top: ${rect.top}px;
        --width: ${rect.width}px;
        --height: ${rect.height}px;
    `;
});

const list = computed(() => {
    return Array.from(cubeStore.cubes.keys());
});

let timerOpen = 0;
let keepValue = false;
/* `delayed` is used to by-pass blur or focus when interacting with inner elements */
function toggleOpen(value = !open.value, delayed = false, force = false) {
    clearTimeout(timerOpen);

    if (keepValue && !force) {
        return;
    }

    if (!delayed) {
        keepValue = true;
        setTimeout(() => {
            keepValue = false;
            if (open.value) {
                hiddenInput.value?.focus();
            }
        }, 30);
    }

    if (value === open.value) {
        return;
    }

    if (delayed) {
        timerOpen = setTimeout(toggleOpen, 20, value, false, force);
        return;
    }

    open.value = value;

    if (!value) {
        active.value = -1;
    }
}

function selectItem(item?: string) {
    if (!item) {
        item = list.value[active.value];
    }

    if (!item) {
        return;
    }

    if (item === props.value) {
        return;
    }

    emit('change', item);
    toggleOpen(false, false, true);
}

function moveDown() {
    let value = active.value + 1;

    if (value >= list.value.length) {
        value = 0;
    }

    active.value = value;
}

function moveUp() {
    let value = active.value - 1;

    if (value < 0) {
        value = list.value.length - 1;
    }

    active.value = value;
}

</script>
<style scoped>
.select {
    width: 100%;
    border-radius: var(--border-radius-sm);
    font-family: var(--font-text);
    font-size: var(--font-size-md);
    cursor: pointer;
}

.cube-select-input {
    position: fixed;
    height: 0;
    width: 0;
    z-index: -1;
    opacity: 0;
}

.cube-select-main {
    position: relative;
    background: var(--color-background);
    border: var(--field-border);
    padding: var(--field-padding);
    border-radius: var(--border-radius-sm);
}

.caret {
    position: absolute;
    right: var(--spacing-xs);
    top: 50%;
    transform: translate(0, -50%);
}

.select-list {
    position: fixed;
    top: var(--bottom);
    left: var(--left);
    width: var(--width);
    background: var(--color-background-soft);
    box-shadow: var(--shadow-md);
    display: flex;
    flex-direction: column;
    padding: var(--field-padding);
    z-index: 2000;
}

.select-item {
    background: var(--color-background);
    cursor: pointer;
}
.select-item:hover,
.select-item.active {
    background: var(--color-primary-inline-hover);
}
.select-item.selected {
    background: var(--color-primary);
    color: var(--color-text-primary);
}
</style>
