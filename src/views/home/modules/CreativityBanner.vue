<script setup lang="ts">
import { $t } from '@/locales';

defineOptions({
  name: 'CreativityBanner'
});
</script>

<template>
  <VCard :title="$t('page.home.creativity')" class="h-full card-wrapper">
    <div class="h-full flex-center">
      <SvgIcon local-icon="banner" class="text-400px text-primary sm:text-320px" />
    </div>
  </VCard>
</template>

<style scoped></style>
