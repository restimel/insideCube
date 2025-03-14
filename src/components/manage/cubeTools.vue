<template>
    <div class="tools-grid">
        <button v-for="tool in editingTools"
            :key="tool.id"
            class="tool-btn"
            :class="{ active: selectedTool === tool.id }"
            @click="selectTool(tool.id)"
        >
            <span v-if="typeof tool.icon === 'string'"  class="tool-icon">
                {{ tool.icon }}
            </span>
            <component v-else :is="tool.icon" class="tool-icon" />

            <span class="tool-name">{{ t(tool.name) }}</span>
        </button>
    </div>
</template>

<script lang="ts" setup>
import { useCubeStore } from '@/stores/cubeStore';
import type { Tools } from '@/types/Cube';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import IconEndFlag from '@/components/icons/IconEndFlag.vue';
import IconStartFlag from '@/components/icons/IconStartFlag.vue';

type EditingTool = {
    id: Tools;
    name: string;
    icon: any;
}

const editingTools: EditingTool[] = [
    { id: 'hole', name: 'tools.hole', icon: '⬤' },
    { id: 'stairs', name: 'Stairs', icon: '≣' },
    { id: 'start', name: 'tools.start', icon: IconStartFlag },
    { id: 'finish', name: 'tools.finish', icon: IconEndFlag },
    { id: 'delete', name: 'tools.delete', icon: '×' },
];

const { t } = useI18n();
const cubeStore = useCubeStore();

/* Editing tools */
const selectedTool = computed(() => cubeStore.tool);

function selectTool(toolId: Tools) {
    cubeStore.tool = toolId;
}

/* }}} */

</script>
<style scoped>

.tools-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-xs);
}

@media (max-width: 992px) {
    .tools-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

.tool-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xs);
    border: var(--field-border);

    --button-bg-color: var(--color-background-soft);
    --button-color:  var(--color-text);
}

.tool-btn.active {
    --button-bg-color: var(--color-primary);
    --button-color: var(--color-text-primary);
    border-color: var(--color-secondary);
}

.tool-icon {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-xs);
}

.tool-name {
    font-size: var(--font-size-sm);
}

</style>
