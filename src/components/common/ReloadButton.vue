<script setup lang="ts">
defineOptions({
  name: 'ReloadButton'
});

interface Props {
  loading?: boolean;
}

defineProps<Props>();
</script>

<template>
  <VBtn icon size="40" rounded="lg">
    <VIcon icon="mdi-refresh" size="small" :class="{ 'animate-spin animate-duration-750': loading }"></VIcon>
  </VBtn>
</template>

<style scoped></style>
