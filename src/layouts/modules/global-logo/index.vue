<script setup lang="ts">
import { $t } from '@/locales';

defineOptions({
  name: 'GlobalLogo'
});
</script>

<template>
  <VList>
    <VListItem>
      <VListItemTitle>{{ $t('system.title') }}</VListItemTitle>
      <template #prepend>
        <SystemLogo class="size-32px" />
      </template>
    </VListItem>
  </VList>
</template>

<style scoped></style>
