<template>
    <div class="cube-manager">
        <!-- Configuration Panel -->
        <PanelSection class="config-panel panel-aside">
            <template #header>
                <h2>{{ t('manage.configuration') }}</h2>
            </template>

            <ConfigurationPanel />
        </PanelSection>

        <!-- Main Editing Area -->
        <PanelSection class="editing-area">
            <template #header>
                <h2>{{ activeCube?.name || t('cube.noSelection') }}</h2>
            </template>
            <template #footer>
                <button @click="saveCube" class="primary-button">{{ t('actions.save') }}</button>
            </template>

            <EditorPanel class="editor-content" />
        </PanelSection>

        <PanelSection class="info-panel panel-aside">
            <template #header>
                <h2>{{ t('manage.information') }}</h2>
            </template>

            <InfoPanel />
        </PanelSection>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCubeStore } from '@/stores/cubeStore';
import PanelSection from '@/components/scaffold/panelSection.vue';
import InfoPanel from '@/components/manage/infoPanel.vue';
import ConfigurationPanel from '@/components/manage/configurationPanel.vue';
import EditorPanel from '@/components/manage/editorPanel.vue';

const { t } = useI18n();

/* Initialize the cube store */
const cubeStore = useCubeStore();

/* Reactive state for the component */
const activeCube = computed(() => cubeStore.activeCube);

/* Methods */

const saveCube = () => {
    const cube = cubeStore.activeCube;

    if (!cube) {
        return;
    }

    cubeStore.setCube(cube);
    cubeStore.addToHistory(t('history.saveCube', { name: cube.name }), true);
};

</script>

<style scoped>
/* Global layout */
.cube-manager {
    display: grid;
    grid-template-columns: 300px 1fr 300px;
    grid-template-rows: auto;
    grid-template-areas: "config editor info";
    gap: var(--section-gap);
    max-width: var(--container-width);
    margin: 0 auto;
    padding: var(--spacing-sm);
    height: calc(100vh - var(--header-height) - var(--footer-height) - var(--spacing-sm) * 2);
}

/* Panel styles */
.config-panel {
    grid-area: config;
}

.editing-area {
    grid-area: editor;
}

.info-panel {
    grid-area: info;
}

/* Panel headers */
.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-sm);
    background-color: var(--color-primary);
    color: var(--color-text-primary);
}

.panel-header h2 {
    margin: 0;
    font-size: var(--font-size-lg);
}

.toggle-panel-btn {
    width: 30px;
    height: 30px;
    background-color: transparent;
    border: 1px solid var(--color-text-primary);
    color: var(--color-text-primary);
    border-radius: 50%;
    font-size: var(--font-size-lg);
    line-height: 1;
    cursor: pointer;
}

/* Options panel */
.options-panel {
    margin-top: var(--spacing-sm);
    padding: var(--spacing-sm);
    background-color: var(--color-background-soft);
    border-radius: var(--border-radius-sm);
}

/* Editor header */
.editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-sm);
    background-color: var(--color-primary);
    color: var(--color-text-primary);
}

.editor-header h2 {
    margin: 0;
    font-size: var(--font-size-lg);
}

/* Editor content */
.editor-content {
    flex: 1;
    padding: var(--spacing-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
}

.cube-editor-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-background-mute);
    border-radius: var(--border-radius);
}

/* Grid for cube editing */
.grid-container {
    display: grid;
    gap: 2px;
    background-color: var(--color-border);
    padding: 2px;
    border-radius: var(--border-radius-sm);
}

.grid-row {
    display: contents;
}

.grid-cell {
    background-color: var(--color-background);
    aspect-ratio: 1/1;
    min-width: 30px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.grid-cell.filled {
    background-color: var(--color-primary);
}

.grid-cell:hover {
    background-color: var(--color-primary-inline-hover);
}

/* Responsive design */
@media (max-width: 1200px) {
    .cube-manager {
        grid-template-columns: 250px 1fr 250px;
    }
}

@media (max-width: 992px) {
    .cube-manager {
        grid-template-columns: 200px 1fr 200px;
    }
}

@media (max-width: 768px) {
    .cube-manager {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr auto;
        grid-template-areas:
            "config"
            "editor"
            "info";
        height: auto;
        min-height: calc(100vh - var(--header-height) - var(--footer-height) - var(--spacing-sm) * 2);
    }

    .panel-aside {
        max-height: 300px;
    }

    .editing-area {
        min-height: 400px;
    }
}

</style>
