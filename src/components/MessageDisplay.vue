<template>
    <span v-if="visible"
        :class="['message', type]"
        @click="clearMessage"
        @mouseover="stopTimer"
        @mouseleave="startTimer"
    >
        {{ message }}
    </span>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';

interface Props {
    message: string;
    type: MessageType;
    duration?: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    dismissed: [];
}>();

const visible = ref(true);
const timeoutId = ref<number>(0);

const clearMessage = () => {
    visible.value = false;
    clearTimeout(timeoutId.value);
    emit('dismissed');
};

function stopTimer() {
    clearTimeout(timeoutId.value);
}

function startTimer() {
    if (visible.value) {
        stopTimer();
        timeoutId.value = setTimeout(clearMessage, props.duration || 5000);
    }
}

watch(() => props.message, (newMessage) => {
    if (newMessage) {
        visible.value = true;
        startTimer();
    }
}, { immediate: true });

onBeforeUnmount(() => {
    stopTimer();
});
</script>

<style scoped>
.message {
    cursor: pointer;
    transition: opacity 0.3s ease;
}

.message.success {
    color: var(--color-success);
}

.message.error {
    color: var(--color-error);
}

.message.warning {
    color: var(--color-warning);
}
</style>
