<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import { preferences } from '@vben/preferences';

import { AiEditor } from 'aieditor';

import 'aieditor/dist/style.css';

const props = defineProps<{
  content: string | undefined;
  placeholder: string;
}>();

const emit = defineEmits<{
  (e: 'onChange', content: string): void;
}>();

const divRef = ref();
let aiEditor: AiEditor | null = null;

onMounted(() => {
  aiEditor = new AiEditor({
    element: divRef.value as Element,
    toolbarSize: 'small',
    placeholder: props.placeholder,
    content: props.content,
    draggable: false,
    theme: preferences.theme.mode === 'auto' ? 'dark' : preferences.theme.mode,
    onChange: (editor) => {
      emit('onChange', editor.getHtml());
    },
  });
});

onUnmounted(() => {
  aiEditor?.destroy();
});
</script>

<template>
  <div ref="divRef" class="editor-container"></div>
</template>

<style scoped>
.editor-container {
  height: 300px;
}
</style>
