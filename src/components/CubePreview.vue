<template>
    <div class="cube">
        <canvas class="canvas" ref="canvas" />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import type {
    Shape,
    ShapeProjection,
} from '@/types/Geometries.d';
import { shapeProjection } from '@/utils/geometries';

const MAX = 1000;

let ctx: CanvasRenderingContext2D;
let canvas: HTMLCanvasElement;
let canvasWidth: number = 0;
let canvasHeight: number = 0;

const props = defineProps<{
    shapes: Shape[];
    /** deg */
    rotateX: number;
    /** deg */
    rotateY: number;
    /** deg */
    rotateZ: number;
}>();

onMounted(() => {
    const canvasEl = canvas!;
    ctx = canvasEl.getContext('2d')!;
    canvasWidth = canvasEl.width;
    canvasHeight = canvasEl.height;
    draw();
});

watch(props, () => {
    draw();
});

/* {{{ projections */


const wallProjection = computed<ShapeProjection[]>(() => {
    const rX = props.rotateX * Math.PI / 180;
    const rY = props.rotateY * Math.PI / 180;
    const rZ = props.rotateZ * Math.PI / 180;

    return shapeProjection(props.shapes, rX, rY, rZ);
});

/* }}} */
/* {{{ draw */

const offsetX = computed<number>(() => {
    const aRatio = aspectRatio.value;

    if (aRatio > 0) {
        return (aRatio / 2) / ratio.value + MAX;
    }

    return MAX;
});

const offsetY = computed<number>(() => {
    const aRatio = aspectRatio.value;

    if (aRatio < 0) {
        return (-aRatio / 2) / ratio.value + MAX;
    }

    return MAX;
});

const ratio = computed(() => {
    return Math.min(
        canvasWidth / 2000,
        canvasHeight / 2000
    );
});

const aspectRatio = computed(() => {
    return canvasWidth - canvasHeight;
});

function x(value: number): number {
    return (value + offsetX.value) * ratio.value;
}

function y(value: number): number {
    return (value + offsetY.value) * ratio.value;
}

function w(value: number): number {
    return value * ratio.value;
}

/*
 * function h(value: number): number {
 *     return value * ratio.value;
 * }
 */

function getGradient(shape: ShapeProjection) {
    const [x1, y1] = shape.box[0];
    const [x2, y2] = shape.box[1];
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    const maxDist = Math.max(
        Math.abs(x1 - centerX),
        Math.abs(y1 - centerY)
    );
    const minDist = Math.min(
        Math.abs(x1 - centerX),
        Math.abs(y1 - centerY)
    );
    const fillGradient = ctx.createRadialGradient(x(centerX), y(centerY), w(minDist) * 0.2, x(centerX), y(centerY), w(maxDist) * 1.7);
    fillGradient.addColorStop(0, shape.fill);
    fillGradient.addColorStop(1, '#FFFFFF');

    return fillGradient;
}

function drawShapes(shapes: ShapeProjection[]) {
    shapes.forEach((shape) => {
        ctx.save();

        ctx.fillStyle = shape.gradient ? getGradient(shape) : shape.fill;
        ctx.strokeStyle = shape.stroke;

        switch (shape.type) {
            case 'text': {
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                shape.text.forEach((charPoint) => {
                    charPoint.forEach((point, index) => {
                        if (index) {
                            ctx.lineTo(x(point[0]), y(point[1]));
                        } else {
                            ctx.moveTo(x(point[0]), y(point[1]));
                        }
                    });
                });
                ctx.stroke();
                break;
            }
            case 'rect': {
                ctx.beginPath();
                shape.points.forEach((point, index) => {
                    if (index) {
                        ctx.lineTo(x(point[0]), y(point[1]));
                    } else {
                        ctx.moveTo(x(point[0]), y(point[1]));
                    }
                });
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                if (shape.adds) {
                    drawShapes(shape.adds);
                }

                break;
            }
        }
        ctx.restore();
    });
}

function draw() {
    if (!ctx) {
        return;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    drawShapes(wallProjection.value);

    /* shadow */
    ctx.fillStyle = '#22222244';
    ctx.beginPath();
    ctx.moveTo(x(-500), y(850));
    ctx.lineTo(x(700), y(850));
    ctx.lineTo(x(500), y(1000));
    ctx.lineTo(x(-700), y(1000));
    ctx.fill();
    ctx.closePath();
}

/* }}} */

</script>

<style scoped>

.cube {
    width: 100%;
}

.canvas {
    width: 100%;
}
</style>
