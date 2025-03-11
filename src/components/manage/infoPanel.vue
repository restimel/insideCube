<template>
<!-- Stats Section -->
    <div class="info-section">
        <h3>{{ t('manage.statistics') }}</h3>
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-label">{{ t('fields.complexity') }}</div>
                <div class="stat-value">{{ stats.complexity }}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Cells?:</div>
                <div class="stat-value">{{ stats.cellCount }}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Filled?:</div>
                <div class="stat-value">{{ stats.filledCells }}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Density?:</div>
                <div class="stat-value">{{ stats.density }}%</div>
            </div>
        </div>
    </div>

    <!-- Preview Section -->
    <div class="info-section">
        <h3>{{ t('manage.preview') }}</h3>
        <div class="preview-container">
            <!-- Placeholder for preview component -->
            <CubeLogo :cube="activeCube" />
        </div>
    </div>

    <!-- History Section -->
    <div class="info-section">
        <h3>{{ t('manage.history') }}</h3>
        <div class="history-actions">
            <button
                @click="undo"
                :disabled="!canUndo"
                class="history-btn primary-button"
            >
                {{ t('actions.undo') }}
            </button>
            <button
                @click="redo"
                :disabled="!canRedo"
                class="history-btn primary-button"
            >
                {{ t('actions.redo') }}
            </button>
        </div>
        <div class="history-list">
            <div
                v-for="(action, index) in history.slice().reverse()"
                :key="index"
                class="history-item"
                :class="{
                    active: history.length - index - 1 === cubeStore.historyIndex,
                }"
                @click="goto(history.length - index - 1)"
            >
                <span class="history-time">{{ formatTime(action.timestamp) }}</span>
                <span class="history-action">{{ action.description }}</span>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, reactive, type Ref } from 'vue';
import { useCubeStore } from '@/stores/cubeStore';
import CubeLogo from '@/components/cubeLogo.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

/* Initialize the cube store */
const cubeStore = useCubeStore();

const activeCube = computed(() => cubeStore.activeCube);

/* {{{ history */

const history = computed(() => cubeStore.history);
const canUndo = computed(() => cubeStore.historyIndex > 0);
const canRedo = computed(() => cubeStore.historyIndex < cubeStore.history.length - 1);

function goto(index: number) {
    cubeStore.undo(index);
}

function undo() {
    cubeStore.undo();
}

function redo() {
    cubeStore.redo();
}

const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

/* }}} */
/* {{{ Statistics data */

type Stats = {
    complexity: string;
    cellCount: number;
    filledCells: number;
    density: Ref<number>;
};

const stats = reactive<Stats>({
    complexity: 'Medium',
    cellCount: 36,
    filledCells: 42,
    density: computed((): number => {
        return Math.round((stats.filledCells / stats.cellCount) * 100);
    }),
});

/* }}} */

</script>
<style scoped>

/* {{{ Config sections */

.info-section {
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-sm);
    border-bottom: var(--field-border);
}

.info-section h3 {
    margin-top: 0;
    margin-bottom: var(--spacing-sm);
    font-size: var(--font-size-md);
    color: var(--color-heading);
}

/* }}} */
/* {{{ Stats grid */

.stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-sm);
}

@media (max-width: 480px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }
}

.stat-item {
    padding: var(--spacing-xs);
    background-color: var(--color-background-soft);
    border-radius: var(--border-radius-sm);
}

.stat-label {
    font-size: var(--font-size-sm);
    color: var(--color-text-information);
}

.stat-value {
    font-size: var(--font-size-md);
    font-weight: bold;
}

/* }}} */
/* {{{ Preview container */

.preview-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--spacing-sm);
}

/* }}} */
/* {{{ History */

.history-actions {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
}

@media (max-width: 480px) {
    .history-actions {
        flex-direction: column;
    }
}

.history-btn {
    flex: 1;
}

.history-list {
    max-height: 150px;
    overflow-y: auto;
    background-color: var(--color-background);
    border-radius: var(--border-radius-sm);
    padding: var(--spacing-xs);
}

.history-item {
    padding: var(--spacing-xs);
    border-bottom: 1px solid var(--color-border);
    font-size: var(--font-size-sm);
    cursor: pointer;
}

.history-item.active {
    background-color: var(--color-primary-inline-hover);
}

.history-item:hover {
    background-color: var(--color-background-soft);
}

.history-item:last-child {
    border-bottom: none;
}

.history-time {
    color: var(--color-text-information);
    margin-right: var(--spacing-xs);
}

/* }}} */

</style>
