<script setup lang="ts">
import GlobalContent from '../modules/global-content/index.vue';

defineOptions({
  name: 'BlankLayout'
});
</script>

<template>
  <VApp>
    <GlobalContent :show-padding="false" />
  </VApp>
</template>

<style scoped></style>
