<script setup lang="ts">
import ThemeSchema from './modules/ThemeSchema.vue';
import ThemeColor from './modules/ThemeColor.vue';
import ThemeRadius from './modules/ThemeRadius.vue';

defineOptions({
  name: 'AppearanceSettings'
});
</script>

<template>
  <div class="flex-col-stretch">
    <ThemeSchema />
    <ThemeColor />
    <ThemeRadius />
  </div>
</template>

<style scoped></style>
