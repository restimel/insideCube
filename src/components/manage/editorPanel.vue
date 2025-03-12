<template>
    <div class="editor-content">
        <div v-if="activeCube"
            class="cube-editor-placeholder" ref="editorContainer"
        >
            <LevelEditor v-for="(_level, levelIdx) in activeCube.levels"
                :key="`level-editor-${levelIdx}`"
                :index="levelIdx"
            />
        </div>
        <div v-else class="no-cube">
            {{ t('cube.noSelection') }}
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useCubeStore } from '@/stores/cubeStore';
import { useI18n } from 'vue-i18n';
import LevelEditor from '@/components/cube/levelEditor.vue';

const { t } = useI18n();

/* Initialize the cube store */
const cubeStore = useCubeStore();

const activeCube = computed(() => cubeStore.activeCube);

</script>
<style scoped>
</style>
