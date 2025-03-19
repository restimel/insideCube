<template>
    <div class="cube-summary">
        <CubeLogo :cube="cube" />
        <div class="cube-info">
            <div class="cube-name">
                {{ cube?.name || t('cube.noSelection') }}
            </div>
            <div class="cube-details" v-if="cube">
                {{ t('cube.levels', {
                    count: cube.levels.length,
                    sizeCol: cube.levels[0]?.cells[0]?.length ?? 0,
                    sizeRow: cube.levels[0]?.cells.length ?? 0,
                }) }}
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCubeStore } from '@/stores/cubeStore';
import CubeLogo from '@/components/cubeLogo.vue';

type Props = {
    name: string | undefined;
};

const props = defineProps<Props>();
const { t } = useI18n();
const cubeStore = useCubeStore();

const cube = computed(() => {
    const name = props.name;

    if (!name) {
        return;
    }

    return cubeStore.getCubeByName(name);
});

</script>
<style scoped>

.cube-summary {
    display: flex;
    align-items: center;
    margin-block-end: var(--spacing-xs);
}

.cube-info {
    flex: 1;
}

.cube-name {
    font-weight: bold;
}

.cube-details {
    font-size: var(--font-size-sm);
    color: var(--color-text-information);
}

.cube-select {
    width: 100%;
    padding: var(--field-padding);
    border-radius: var(--border-radius-sm);
    border: var(--field-border);
}

</style>
