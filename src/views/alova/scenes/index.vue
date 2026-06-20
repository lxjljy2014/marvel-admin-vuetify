<script setup lang="ts">
import { $t } from '@/locales';
import CaptchaVerification from './modules/CaptchaVerification.vue';
import BrowserVisibilityRequest from './modules/BrowserVisibilityRequest.vue';
import PollingRequest from './modules/PollingRequest.vue';
import NetworkToggleRequest from './modules/NetworkToggleRequest.vue';
import CrossComponentRequest from './modules/CrossComponentRequest.vue';
</script>

<template>
  <div class="flex flex-col gap-4">
    <VCard :title="$t('page.alova.scenes.captchaSend')">
      <VCardText>
        <CaptchaVerification class="w-1/3" />
      </VCardText>
    </VCard>

    <VCard :title="$t('page.alova.scenes.autoRequest')">
      <VCardText>
        <div class="flex gap-4">
          <BrowserVisibilityRequest />
          <PollingRequest />
          <NetworkToggleRequest />
        </div>
      </VCardText>
    </VCard>

    <VCard :title="$t('page.alova.scenes.requestCrossComponent')">
      <VCardText>
        <CrossComponentRequest />
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped></style>
