<template>
    <!-- Cube Properties -->
    <div class="config-section">
        <h3>{{ t('manage.properties') }}</h3>
        <div class="form-group">
            <label for="cubeName">{{ t('fields.name') }}</label>
            <input
                id="cubeName"
                v-model="cubeName"
                type="text"
                :placeholder="t('fields.placeholderName')"
                @change="updateCubeProperty('name', cubeName)"
            >
        </div>
        <div class="form-group">
            <label for="cubeColor">{{ t('fields.color') }}</label>
            <div class="color-picker-wrapper">
                <input
                    id="cubeColor"
                    v-model="cubeColor"
                    type="color"
                    @change="updateCubeProperty('color', cubeColor)"
                >
                <label
                    class="color-value"
                    for="cubeColor"
                >
                    {{ cubeColor }}
                </label>
            </div>
        </div>
    </div>

    <!-- Cube Actions -->
    <div class="config-section">
        <h3>{{ t('manage.actions') }}</h3>
        <div class="action-buttons">
            <button @click="loadCube" class="action-btn load-btn">
                {{ t('actions.load') }}
            </button>
            <button @click="resetCube" class="action-btn reset-btn">
                {{ t('actions.reset') }}
            </button>
        </div>
    </div>

    <!-- Editing Tools -->
    <div class="config-section">
        <h3>{{ t('manage.editingTools') }}</h3>
        <CubeTools />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useCubeStore } from '@/stores/cubeStore';
import { useI18n } from 'vue-i18n';
import CubeTools from '@/components/manage/cubeTools.vue';

const { t } = useI18n();
const cubeStore = useCubeStore();

const activeCube = computed(() => cubeStore.activeCube);
const cubeName = ref(activeCube.value?.name || '');
const cubeColor = ref(activeCube.value?.color || '#000000');

/* Watch for active cube changes */
watch(() => activeCube.value, (newCube) => {
    if (newCube) {
        cubeName.value = newCube.name;
        cubeColor.value = newCube.color;
    }
}, { immediate: true });

/* {{{ actions */

const updateCubeProperty = (property: 'name' | 'color', value: string) => {
    if (!cubeStore.activeCube) {
        cubeStore.createNewCube();
    }

    cubeStore.activeCube![property] = value;
    cubeStore.addToHistory(t('history.updateCube', { property }));
};

const loadCube = () => {
    cubeStore.addToHistory(t('history.loadCube', {name: cubeStore.activeCube?.name}));
};

const resetCube = () => {
    const cubeName = cubeStore.activeCube?.name;

    cubeStore.createNewCube();
    cubeStore.addToHistory(t('history.reset', {name: cubeName}));
};

/* }}} */

</script>

<style scoped>
.config-section {
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-sm);
    border-bottom: var(--field-border);
}

.config-section h3 {
    margin-top: 0;
    margin-bottom: var(--spacing-sm);
    font-size: var(--font-size-md);
    color: var(--color-heading);
}

/* {{{ Color picker */

.color-picker-wrapper {
    display: flex;
    align-items: center;
}

.color-picker-wrapper input[type="color"] {
    width: 40px;
    height: 40px;
    padding: 2px;
    border: var(--field-border);
    border-radius: var(--border-radius-sm);
    background-color: var(--color-background);
}

.color-value {
    margin-left: var(--spacing-sm);
    font-family: var(--font-code);
}

/* }}} */
/* {{{ Action buttons */

.action-buttons {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
}

.action-btn {
    flex: 1;
    padding: var(--spacing-xs) var(--spacing-sm);
    border: 1px solid var(--color-secondary);
    border-radius: var(--border-radius-sm);
    font-weight: bold;
    cursor: pointer;

    --button-bg-color: var(--color-background-soft);
    --button-color: var(--color-text);
}

@media (max-width: 480px) {
    .action-buttons {
        flex-direction: column;
    }
}

/* }}} */

</style>
