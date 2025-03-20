<template>
    <div class="level-editor"
        :style="styles"
    >
        <div class="level-name">
            <input
                v-model="levelName"
                type="text"
                :placeholder="t('cube.levelName')"
                @change="updateLevelName"
            >
        </div>
        <svg v-if="level"
            class="level-grid"
            xmlns="http://www.w3.org/2000/svg"
            :width="200"
            :height="200"
            :viewBox="`-6 -6 ${15 * colMax + 6} ${15 * rowMax + 6}`"
        >
            <SymbolsSvg />

            <g v-for="(row, rowIndex) in level.cells"
                :key="rowIndex"
            >
                <g v-for="(cell, cellIndex) in row"
                    :key="`cell-${cellIndex}`"
                >
                    <g
                        class="level-cell"
                        @click="activateCell(rowIndex, cellIndex)"
                    >
                        <rect
                            :x="cellIndex * 15"
                            :y="rowIndex * 15"
                            width="10"
                            height="10"
                        />

                        <CellItemsSvg
                            :cell="cell"
                            :x="cellIndex"
                            :y="rowIndex"
                            :z="index"
                            :start="activeCube?.start"
                            :end="activeCube?.end"
                        />
                    </g>
                    <rect
                        class="level-right-wall"
                        :class="{ wall: !cell.r }"
                        :x="cellIndex * 15 + 10"
                        :y="rowIndex * 15"
                        width="5"
                        height="10"
                        @click="activateRightWall(rowIndex, cellIndex)"
                    />
                    <rect
                        class="level-down-wall"
                        :class="{ wall: !cell.d }"
                        :x="cellIndex * 15"
                        :y="rowIndex * 15 + 10"
                        width="10"
                        height="5"
                        @click="activateDownWall(rowIndex, cellIndex)"
                    />
                    <rect
                        class="level-corner"
                        :class="{ wall: displayCorner(cell, rowIndex, cellIndex) }"
                        :x="cellIndex * 15 + 10"
                        :y="rowIndex * 15 + 10"
                        width="5"
                        height="5"
                    />
                </g>
            </g>

            <rect
                class="border"
                x="-3"
                y="-3"
                :width="15 * colMax"
                :height="15 * rowMax"
            />
        </svg>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCubeStore } from '@/stores/cubeStore';
import type { Cell } from '@/types/Cube';
import SymbolsSvg from '@/components/cube/symbolsSvg.vue';
import CellItemsSvg from '@/components/cube/cellItemsSvg.vue';

const { t } = useI18n();
const cubeStore = useCubeStore();

type Props = {
    index: number;
};

const props = defineProps<Props>();

const activeCube = computed(() => {
    return cubeStore.activeCube;
});

const level = computed(() => {
    return activeCube.value?.levels[props.index];
});
const styles = computed(() => ({
    '--cube-color': activeCube.value?.color,
}));
const levelName = ref(level.value?.name ?? '');

watch(level, () => {
    levelName.value = level.value?.name ?? '';
});

function updateLevelName() {
    cubeStore.updateLevelName(props.index, levelName.value);
}

const rowMax = computed(() => cubeStore.dimensions.rows);
const colMax = computed(() => cubeStore.dimensions.cells);

function activateCell(row: number, col: number) {
    cubeStore.toolCell(props.index, row, col);
}

function activateRightWall(row: number, col: number) {
    cubeStore.toggleWall(props.index, row, col, 'r');
}

function activateDownWall(row: number, col: number) {
    cubeStore.toggleWall(props.index, row, col, 'd');
}

function displayCorner(cell: Cell, row: number, col: number): boolean {
    const levelValue = level.value!;

    return !cell.r || !cell.d || !levelValue.cells[row + 1][col].r || !levelValue.cells[row][col + 1].d;
}
</script>

<style scoped>
.level-editor {
    --cube-color-alternate: hsl(from var(--cube-color) h s calc(l - (clamp(0, l - 20, 1) * 40 - 20)));
    --cube-color-hover: hsl(from var(--cube-color) calc(h + 20) calc(s - 20) l);
    --cube-color-alternate-hover: hsl(from var(--cube-color-alternate) calc(h + 20) calc(s - 20) l);

    --cube-color1: var(--cube-color);
    --cube-color2: var(--cube-color-alternate);

    --icon-color: var(--cube-color2);
}
.level-cell {
    fill: var(--cube-color1);
    stroke: var(--cube-color1);
    cursor: pointer;
}

.level-right-wall,
.level-down-wall {
    cursor: pointer;
    fill: var(--cube-color1);
    stroke: var(--cube-color1);
}

.level-corner {
    fill: var(--cube-color1);
    stroke: var(--cube-color1);
}

.level-right-wall.wall,
.level-down-wall.wall,
.level-corner.wall {
    fill: var(--cube-color2);
    stroke: var(--cube-color2);
}

.level-cell:hover,
.level-right-wall:hover,
.level-down-wall:hover {
    --cube-color1: var(--cube-color-alternate-hover);
    --cube-color2: var(--cube-color-hover);
}

.border {
    fill: none;
    stroke: var(--cube-color2);
    stroke-width: 6;
}
</style>
