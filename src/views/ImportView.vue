<template>
    <div class="import-export-container">
        <!-- Active cube selection -->
        <BoxSection :title="t('cube.active')">
            <div v-if="cubes.size > 0"
                class="active-cube"
            >
                <CubeLogo :cube="activeCube" />
                <div class="cube-info">
                    <div class="cube-name">{{ activeCube?.name || t('cube.noSelection') }}</div>
                    <div class="cube-details" v-if="activeCube">
                        {{ t('cube.levels', activeCube.levels.length) }}
                    </div>
                </div>
            </div>
            <select
                v-model="selectedCubeName"
                class="cube-select"
                @change="handleCubeChange"
            >
                <option v-for="[cubeName] in cubes"
                    :key="cubeName"
                    :value="cubeName"
                >
                    {{ cubeName }}
                </option>
            </select>
            <div v-if="cubes.size === 0"
                class="no-cubes"
            >
                {{ t('cube.noCubes') }}
            </div>
        </BoxSection>

        <!-- Import cubes -->
        <BoxSection :title="t('cube.import')">
            <textarea
                v-model="importJson"
                :placeholder="t('cube.pasteJSON')"
                class="json-textarea"
            ></textarea>
            <div class="checkbox-option">
                <label>
                    <input type="checkbox" v-model="replaceExisting">
                    {{ t('cube.edition.replace') }}
                </label>
            </div>
            <template #footer>
                <button @click="importCubes" class="action-button primary-button">
                    {{ t('actions.import') }}
                </button>
                <MessageDisplay
                    :message="importMessage"
                    :type="importTypeMessage"
                    @dismissed="importMessage = ''"
                />
            </template>
        </BoxSection>

        <!-- Export cubes -->
        <BoxSection :title="t('cube.export')">
            <div
                class="cube-selection"
                :class="{
                    disabled: cubes.size === 0,
                }"
            >
                <div class="selection-header">
                    <label>
                        <input
                            type="checkbox"
                            v-model="selectAll"
                        >
                        {{ t('actions.selectAll') }}
                    </label>
                </div>
                <div v-if="cubes.size > 0"
                    class="cube-list"
                >
                    <div v-for="[cubeName, cube] in cubes"
                        :key="cubeName"
                        class="cube-item"
                    >
                        <label class="cube-checkbox">
                            <input
                                type="checkbox"
                                :checked="selectedCubesForExport.has(cubeName)"
                                @input="toggleSelection(cubeName)"
                            >
                            <span class="cube-label">{{ cubeName }}</span>
                            <span class="cube-color-dot" :style="`--cube-color: ${cube.color}`"></span>
                        </label>
                    </div>
                </div>
                <div v-else class="no-cubes">
                    {{ t('cube.noCubes') }}
                </div>
                <aside v-if="selectedCubesForExport.size"
                    class="selected-cubes-info"
                >
                    {{ t('cube.cubes', { count: selectedCubesForExport.size }) }}
                </aside>
            </div>
            <textarea
                v-model="exportJson"
                readonly
                :placeholder="t('cube.exportJson')"
                class="json-textarea"
            ></textarea>
            <template #footer>
                <button @click="copyToClipboard" class="action-button primary-button">
                    {{ t('actions.copy') }}
                </button>
                <MessageDisplay
                    :message="exportMessage"
                    :type="exportMessageType"
                    @dismissed="exportMessage = ''"
                />
            </template>
        </BoxSection>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useCubeStore } from '@/stores/cubeStore';
import type { CubeName } from '@/types/Cube';
import BoxSection from '@/components/scaffold/panelSection.vue';
import { useI18n } from 'vue-i18n';
import MessageDisplay from '@/components/MessageDisplay.vue';
import CubeLogo from '@/components/cubeLogo.vue';

const { t } = useI18n();

/* Initialize the cube store */
const cubeStore = useCubeStore();

/* References to store values */
const cubes = computed(() => cubeStore.cubes);
const activeCube = computed(() => cubeStore.activeCube);

/* {{{ Selected cube handling */

const selectedCubeName = ref<CubeName | null>(activeCube.value?.name || null);

/* Handle cube selection change */
const handleCubeChange = () => {
    if (selectedCubeName.value) {
        cubeStore.selectCube(selectedCubeName.value);
    }
};

/* }}} */
/* {{{ Import functionality */

const importJson = ref('');
const importMessage = ref('');
const importTypeMessage = ref<MessageType>('success');
const replaceExisting = ref(true);

/** Import cubes from JSON */
const importCubes = () => {
    try {
        if (!importJson.value.trim()) {
            importMessage.value = t('messages.enterJsonData');
            importTypeMessage.value = 'error';
            return;
        }

        const result = cubeStore.import(importJson.value, replaceExisting.value);

        if (result.type === 'success') {
            importMessage.value = t(result.message, result.details as number);
            importTypeMessage.value = result.type;
            importJson.value = '';
        } else {
            importMessage.value = t(result.message, { details: result.details });
            importTypeMessage.value = result.type;
        }
    } catch (err) {
        const errorMessage = (err as Error)?.message ?? '';
        importMessage.value = t('messages.importError', {
            error: errorMessage,
        });
        importTypeMessage.value = 'error';
    }
};

/* }}} */
/* {{{ Export functionality */

const exportJson = ref('');
const exportMessage = ref('');
const exportMessageType = ref<MessageType>('success');
const selectedCubesForExport = ref<Set<CubeName>>(new Set());
const selectAll = computed({
    get: () => {
        return Array.from(cubes.value.keys()).every((cubeName) => selectedCubesForExport.value.has(cubeName));
    },
    set: (value: boolean) => {
        if (value) {
            for (const cubeName of cubes.value.keys()) {
                selectedCubesForExport.value.add(cubeName);
            }
        } else {
            selectedCubesForExport.value.clear();
        }
    },
});

watch(selectedCubesForExport, () => {
    exportSelectedCubes();
}, { deep: true });

/** Initialize checkboxes for all cubes */
const initializeCheckboxes = () => {
    for (const [cubeName] of cubes.value) {
        if (!selectedCubesForExport.value.has(cubeName)) {
            selectedCubesForExport.value.add(cubeName);
        }
    }
};

onMounted(initializeCheckboxes);

/** Toggle 1 cube selection */
const toggleSelection = (cubeName: CubeName) => {
    if (selectedCubesForExport.value.has(cubeName)) {
        selectedCubesForExport.value.delete(cubeName);
    } else {
        selectedCubesForExport.value.add(cubeName);
    }
};

/** Export selected cubes */
const exportSelectedCubes = () => {
    const selectedCubeNames = Array.from(selectedCubesForExport.value);

    if (selectedCubeNames.length === 0) {
        exportJson.value = '';
        exportMessage.value = t('messages.selectAtLeastOneCube');
        exportMessageType.value = 'warning';
        return;
    }

    exportJson.value = cubeStore.export(selectedCubeNames);
    exportMessage.value = '';
};

/** Copy JSON to clipboard */
const copyToClipboard = () => {
    if (!exportJson.value) {
        exportMessage.value = t('messages.nothingToCopy');
        exportMessageType.value = 'error';
        return;
    }

    navigator.clipboard.writeText(exportJson.value)
        .then(() => {
            exportMessage.value = t('messages.copiedToClipboard');
            exportMessageType.value = 'success';
        })
        .catch(() => {
            exportMessage.value = t('messages.copyError');
            exportMessageType.value = 'error';
        });
};

/* }}} */
</script>

<style scoped>
.import-export-container {
    max-width: var(--max-section-width);
    margin: 0 auto;
    padding: var(--section-padding);
}

/* {{{ cube selection */

.active-cube {
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

/* }}} */
/* {{{ import/export */

.json-textarea {
    width: 100%;
    min-height: 150px;
    padding: var(--field-padding);
    border-radius: var(--border-radius-sm);
    border: var(--field-border);
    font-family: var(--font-code);
    resize: vertical;
}

.action-button {
    padding: 8px 16px;
    border: none;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    font-weight: bold;
    margin-right: var(--spacing-xs);
}

/* TODO */
.message {
    font-size: 0.9em;
    padding: 4px 8px;
    border-radius: 4px;
}

.cube-selection {
    margin-bottom: var(--field-margin);
    border: var(--field-border);
    border-radius: var(--border-radius-sm);
    padding: var(--field-padding);
    background-color: var(--color-background);
}

.cube-selection.disabled {
    background-color: var(--color-background-mute);
}

.selection-header {
    margin-bottom: var(--field-margin);
    padding-bottom: var(--field-padding);
    border-bottom: var(--field-border);
}

.cube-list {
    max-height: 200px;
    overflow-y: auto;
}

.cube-item {
    margin-bottom: var(--field-margin);
}

.cube-checkbox {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.cube-label {
    margin-left: var(--spacing-xs);
    flex: 1;
}

.cube-color-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin-inline-end: var(--spacing-sm);
    background-color: var(--cube-color);
}

.selected-cubes-info,
.no-cubes {
    color: var(--color-text-information);
    font-style: italic;
    padding: var(--spacing-xs) 0;
}
</style>
