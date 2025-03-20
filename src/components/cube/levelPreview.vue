<template>
    <svg
        class="level-preview"
        xmlns="http://www.w3.org/2000/svg"
        :width="svgSize"
        :height="svgSize"
        :viewBox="`-6 -6 ${15 * colMax + 6} ${15 * rowMax + 6}`"
    >
        <SymbolsSvg />

        <rect
            class="level-background"
            x="-3"
            y="-3"
            :width="15 * colMax"
            :height="15 * rowMax"
        />

        <g v-for="(row, rowIndex) in cells"
            :key="rowIndex"
        >
            <g v-for="(cell, cellIndex) in row"
                :key="`cell-${cellIndex}`"
            >
                <g v-if="display.get(rowIndex)?.get(cellIndex)"
                    class="level-cell-container"
                >
                    <rect
                        class="level-cell"
                        :x="cellIndex * 15"
                        :y="rowIndex * 15"
                        :width="10 + (cell.r ? 5 : 0)"
                        :height="10 + (cell.d ? 5 : 0)"
                    />
                    <rect v-if="cell.r && cell.d && (!row[cellIndex + 1]?.d || !cells[rowIndex + 1]?.[cellIndex]?.r)"
                        class="level-corner"
                        :x="cellIndex * 15 + 11"
                        :y="rowIndex * 15 + 11"
                        :width="5"
                        :height="5"
                    />

                    <CellItemsSvg
                        :cell="cell"
                        :x="cellIndex"
                        :y="rowIndex"
                        :z="index"
                        :start="start"
                        :end="end"
                    />
                </g>
            </g>
        </g>
    </svg>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import SymbolsSvg from '@/components/cube/symbolsSvg.vue';
import CellItemsSvg from '@/components/cube/cellItemsSvg.vue';
import type { Cell, CellPosition, SimpleCellPosition } from '@/types/Cube';

type Props = {
    cells: Cell[][];
    index: number;
    showOnly?: SimpleCellPosition[];
    start?: CellPosition;
    end?: CellPosition;
    size?: number;
};

const props = defineProps<Props>();

const svgSize = computed(() => props.size ?? 100);
const rowMax = computed(() => props.cells.length);
const colMax = computed(() => props.cells[0].length);
const display = computed<Map<number, Map<number, boolean>>>(() => {
    const list = props.showOnly;
    const defaultValue = !list;
    const index = props.index;
    const cellDisplay = new Map<number, Map<number, boolean>>(
        Array.from({ length: rowMax.value }, (_r, rowIdx) => [
            rowIdx,
            new Map(Array.from({ length: colMax.value }, (_c, colIdx) => [
                colIdx,
                defaultValue,
            ])),
        ])
    );

    if (list) {
        list.forEach(([row, col, level]) => {
            if (level === index) {
                cellDisplay.get(row)?.set(col, true);
            }
        });
    }

    return cellDisplay;
});
</script>
<style scoped>
.level-preview {
    --cube-color-alternate: hsl(from var(--cube-color) h s calc(l - (clamp(0, l - 20, 1) * 40 - 20)));

    --cube-color1: var(--cube-color);
    --cube-color2: var(--cube-color-alternate);

    --icon-color: var(--cube-color2);
}

.level-background {
    fill: var(--cube-color2);
    stroke: var(--cube-color2);
    stroke-width: 6;
}

.level-cell {
    fill: var(--cube-color1);
    stroke: var(--cube-color1);
}

.level-corner {
    fill: var(--cube-color2);
    stroke: var(--cube-color2);
}
</style>
