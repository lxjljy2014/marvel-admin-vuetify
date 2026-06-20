<script setup lang="ts">
interface Props {
  url: string;
}

defineProps<Props>();
</script>

<template>
  <div class="h-full">
    <iframe id="iframePage" class="size-full border-0" :src="url" frameborder="0"></iframe>
  </div>
</template>

<style scoped></style>
