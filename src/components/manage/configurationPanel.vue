<template>
    <!-- Editing Tools -->
    <div class="config-section">
        <h3>{{ t('manage.editingTools') }}</h3>
        <CubeTools />
    </div>

    <!-- Cube Actions -->
    <div class="config-section">
        <h3>{{ t('manage.actions') }}</h3>
        <div class="action-buttons">
            <button @click="openLoad = true" class="action-btn load-btn">
                {{ t('actions.load') }}
            </button>
            <button @click="resetCube" class="action-btn reset-btn">
                {{ t('actions.reset') }}
            </button>
        </div>

        <DialogModal
            :open="openLoad"
            @close="openLoad = false"
            @maskClick="openLoad = false"
        >
            <CubeSelect
                class="select-cube-loader"
                :value="selectedCubeName"
                @change="changeCubeSelection"
            />
            <footer class="modal-footer">
                <button @click="loadCube" class="primary-button">
                    {{ t('actions.load') }}
                </button>
                <button @click="openLoad = false">
                    {{ t('actions.cancel') }}
                </button>
            </footer>
        </DialogModal>

    </div>

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
        <ToggleField
            :label="t('manage.moreConfiguration')"
            class="additionalSettings"
            :open="openMoreSetting"
            @toggle="toggleSettings"
        >
            <div class="form-group">
                <label for="cubeLevelSize">{{ t('fields.levelSize') }}</label>
                <input
                    id="cubeLevelSize"
                    v-model="cubeLevelSize"
                    type="number"
                    min="1"
                    @change="updateCubeSize('levels', cubeLevelSize)"
                >
            </div>
            <div class="form-group">
                <label for="cubeRowSize">{{ t('fields.rowSize') }}</label>
                <input
                    id="cubeRowSize"
                    v-model="cubeRowSize"
                    type="number"
                    min="1"
                    @change="updateCubeSize('rows', cubeRowSize)"
                >
            </div>
            <div class="form-group">
                <label for="cubeCellSize">{{ t('fields.cellSize') }}</label>
                <input
                    id="cubeCellSize"
                    v-model="cubeCellSize"
                    type="number"
                    min="1"
                    @change="updateCubeSize('cells', cubeCellSize)"
                >
            </div>
        </ToggleField>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useCubeStore } from '@/stores/cubeStore';
import { useI18n } from 'vue-i18n';
import CubeTools from '@/components/manage/cubeTools.vue';
import ToggleField from '@/components/toggleField.vue';
import DialogModal from '@/components/dialogModal.vue';
import CubeSelect from '@/components/cube/cubeSelect.vue';
import type { Dimensions } from '@/types/Cube';

const { t } = useI18n();
const cubeStore = useCubeStore();

const activeCube = computed(() => cubeStore.activeCube);
const cubeName = ref(activeCube.value?.name || '');
const cubeColor = ref(activeCube.value?.color || '#000000');
const cubeLevelSize = ref(cubeStore.dimensions.levels);
const cubeRowSize = ref(cubeStore.dimensions.rows);
const cubeCellSize = ref(cubeStore.dimensions.cells);
const openMoreSetting = ref(false);

/* Watch for active cube changes */
watch(() => activeCube.value, (newCube) => {
    if (newCube) {
        cubeName.value = newCube.name;
        cubeColor.value = newCube.color;
    }
}, { immediate: true });

watch(() => cubeStore.dimensions, (newDimensions) => {
    if (newDimensions) {
        cubeLevelSize.value = newDimensions.levels;
        cubeRowSize.value = newDimensions.rows;
        cubeCellSize.value = newDimensions.cells;
    }
}, { immediate: true });

/* {{{ properties */

function toggleSettings(status: boolean) {
    openMoreSetting.value = status;
}

/* }}} */
/* {{{ actions */

const updateCubeProperty = (property: 'name' | 'color', value: string) => {
    cubeStore.updateCubeProperty(property, value);
};

function updateCubeSize(dimension: keyof Dimensions, value: number) {
    cubeStore.updateCubeSize(dimension, value);
}

const openLoad = ref(false);
const selectedCubeName = ref(activeCube.value?.name);

function changeCubeSelection(value: string) {
    selectedCubeName.value = value;
}

function loadCube() {
    const cubeName = selectedCubeName.value;

    if (cubeStore.selectCube(cubeName, true)) {
        cubeStore.addToHistory('history.loadCube', {name: cubeName});
        openLoad.value = false;
    }
};

const resetCube = () => {
    const cubeName = cubeStore.activeCube?.name;

    cubeStore.createNewCube();
    cubeStore.addToHistory('history.reset', {name: cubeName});
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

.additionalSettings {
    margin-left: calc(var(--section-padding) * -1);
    margin-right: calc(var(--section-padding) * -1);
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

.select-cube-loader {
    min-width: 500px;
}

@media (max-width: 550px) {
    .select-cube-loader {
        min-width: calc(100vw - 2 * var(--section-padding));
    }
}

.modal-footer {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-xs);
    justify-content: flex-end;
    margin-top: var(--spacing-md);
}

/* }}} */

</style>
