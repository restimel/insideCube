<template>
    <section
        :style="styles"
        class="cube-preview-container"
        @click="showPreview = true"
    >
        <div class="cube-preview">
            <LevelPreview v-for="(level, levelIdx) in activeCube?.levels"
                :key="`level-preview-${levelIdx}`"
                :cells="level.cells"
                :index="levelIdx"
                :start="activeCube?.start"
                :end="activeCube?.end"
                :size="50"
                :showOnly="showOnly"
            />
        </div>

        <DialogModal
            :open="showPreview"
            @close="closePreview"
            @maskClick="closePreview"
        >
            <h2>
                {{ activeCube?.name }}
            </h2>
            <div class="cube-preview">
                <LevelPreview v-for="(level, levelIdx) in activeCube?.levels"
                    :key="`level-preview-${levelIdx}`"
                    :cells="level.cells"
                    :index="levelIdx"
                    :start="activeCube?.start"
                    :end="activeCube?.end"
                    :size="150"
                    :showOnly="showOnly"
                />
            </div>
        </DialogModal>
    </section>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCubeStore } from '@/stores/cubeStore';
import LevelPreview from '@/components/cube/levelPreview.vue';
import DialogModal from '@/components/dialogModal.vue';
import type { SimpleCellPosition } from '@/types/Cube';

type Props = {
    showOnly?: SimpleCellPosition[];
};

defineProps<Props>();
const cubeStore = useCubeStore();

const showPreview = ref(false);

const activeCube = computed(() => {
    return cubeStore.activeCube;
});

const styles = computed(() => ({
    '--cube-color': activeCube.value?.color,
}));

function closePreview() {
    showPreview.value = false;
}

</script>
<style scoped>
.cube-preview {
    line-height: 0;
}

</style>
