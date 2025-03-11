<template>
    <div class="editor-content">
        <!-- Placeholder for actual cube editor component -->
        <div class="cube-editor-placeholder" ref="editorContainer">
            <p v-if="!activeCube">
                Please select or create a cube first (To remove)
            </p>
            <div v-else class="grid-container" :style="gridContainerStyle">
                <div
                    v-for="(row, rowIndex) in gridData"
                    :key="`row-${rowIndex}`"
                    class="grid-row"
                >
                    <div
                        v-for="(cell, colIndex) in row"
                        :key="`cell-${rowIndex}-${colIndex}`"
                        class="grid-cell"
                        :class="{ filled: cell }"
                        @click="toggleCell(rowIndex, colIndex)"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCubeStore } from '@/stores/cubeStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

/* Initialize the cube store */
const cubeStore = useCubeStore();

const activeCube = computed(() => cubeStore.activeCube);

const options = {
    showGrid: true,
    autoSave: false,
    gridSize: '6',
};
const gridSize = computed(() => parseInt(options.gridSize));
const gridData = ref(Array(gridSize.value).fill(null).map(() => Array(gridSize.value).fill(false)));

const gridContainerStyle = computed(() => ({
    gridTemplateColumns: `repeat(${gridSize.value}, 1fr)`,
}));

/*
 * watch(() => options.gridSize, (newSize) => {
 *     const size = parseInt(newSize);
 *     gridData.value = Array(size).fill(null).map(() => Array(size).fill(false));
 *     cubeStore.addToHistory(`Changed grid size to ${size}x${size}`);
 * });
 */

function toggleCell(rowIndex: number, colIndex: number) {
    cubeStore.addToHistory(`TODO: Toggled cell at ${rowIndex},${colIndex}`);
};

</script>
<style scoped>
</style>
