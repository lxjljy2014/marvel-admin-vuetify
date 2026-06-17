<script setup lang="ts">
import { $t } from '@/locales';
import CaptchaVerification from './modules/CaptchaVerification.vue';
import BrowserVisibilityRequest from './modules/BrowserVisibilityRequest.vue';
import PollingRequest from './modules/PollingRequest.vue';
import NetworkToggleRequest from './modules/NetworkToggleRequest.vue';
import CrossComponentRequest from './modules/CrossComponentRequest.vue';
</script>

<template>
  <NSpace vertical :size="16">
    <NCard :title="$t('page.alova.scenes.captchaSend')" :bordered="false" size="small" segmented class="card-wrapper">
      <CaptchaVerification class="w-1/3" />
    </NCard>
    <NCard :title="$t('page.alova.scenes.autoRequest')" :bordered="false" size="small" segmented class="card-wrapper">
      <NSpace :wrap="false">
        <BrowserVisibilityRequest />
        <PollingRequest />
        <NetworkToggleRequest />
      </NSpace>
    </NCard>
    <NCard
      :title="$t('page.alova.scenes.requestCrossComponent')"
      :bordered="false"
      size="small"
      segmented
      class="card-wrapper"
    >
      <CrossComponentRequest />
    </NCard>
  </NSpace>
</template>

<style scoped></style>
