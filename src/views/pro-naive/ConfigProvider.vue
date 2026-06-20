<script setup lang="tsx">
import { computed } from 'vue';
import { useAppStore } from '@/stores/modules/app';

const appStore = useAppStore();

const currentLocale = computed(() => {
  return appStore.locale === 'zh-CN' ? 'zh' : 'en';
});

// Export for potential child component usage
defineExpose({ locale: currentLocale });
</script>

<template>
  <div class="h-full">
    <slot></slot>
  </div>
</template>
