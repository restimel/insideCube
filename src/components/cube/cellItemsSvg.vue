<template>
    <use v-if="!!cell.b"
        href="#hole"
        :x="x * 15"
        :y="y * 15"
        :width="10"
        :height="10"
    />
    <use v-if="isStart"
        href="#startFlag"
        :x="x * 15"
        :y="y * 15"
        :width="10"
        :height="10"
    />
    <use v-if="isEnd"
        href="#endFlag"
        :x="x * 15"
        :y="y * 15"
        :width="10"
        :height="10"
    />
</template>
<script setup lang="ts">
import type { Cell, CellPosition } from '@/types/Cube';
import { computed } from 'vue';

type Props = {
    cell: Cell;
    x: number;
    y: number;
    z: number;
    start?: CellPosition;
    end?: CellPosition;
};

const props = defineProps<Props>();

const isStart = computed<boolean>(() => {
    const start = props.start;

    return (
        !!start &&
        start.z === props.z &&
        start.x === props.x &&
        start.y === props.y
    );
});

const isEnd = computed<boolean>(() => {
    const end = props.end;

    return (
        !!end &&
        end.z === props.z &&
        end.x === props.x &&
        end.y === props.y
    );
});
</script>
<style scoped>

</style>
