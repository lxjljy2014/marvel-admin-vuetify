<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app';
defineOptions({
  name: 'GlobalFooter'
});

const appStore = useAppStore();
</script>

<template>
  <VFooter v-if="!appStore.fullContent" class="flex-center" app :rounded="false">
    <a href="https://github.com/soybeanjs/soybean-admin/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">
      Copyright MIT © 2021 Marvel
    </a>
  </VFooter>
</template>

<style scoped></style>
