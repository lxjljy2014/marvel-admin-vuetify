<script setup lang="ts">
import { ref } from 'vue';
import { actionDelegationMiddleware, useAutoRequest } from '@sa/alova/client';
import { alova } from '@/service-alova/request';

const getLastTime = alova.Get<{ time: string }>('/mock/getLastTime', { cacheFor: null });
const isStop = ref(false);
const { loading, data } = useAutoRequest(getLastTime, {
  pollingTime: 3000,
  initialData: {
    time: ''
  },
  async middleware(_, next) {
    await actionDelegationMiddleware('autoRequest:3')(_, () => Promise.resolve());
    if (!isStop.value) {
      next();
    }
  }
});

const toggleStop = () => {
  isStop.value = !isStop.value;
};
</script>

<template>
  <div class="flex flex-col gap-16px">
    <VAlert type="info">
      {{ $t('page.alova.scenes.pollingRequestTips') }}
    </VAlert>
    <VBtn color="primary" @click="toggleStop">
      <VIcon v-if="isStop" icon="mdi-play" class="mr-2" />
      <VIcon v-else icon="mdi-stop" class="mr-2" />
      {{ isStop ? $t('page.alova.scenes.startRequest') : $t('page.alova.scenes.stopRequest') }}
    </VBtn>
    <div class="flex items-center gap-8px">
      <span>{{ $t('page.alova.scenes.refreshTime') }}: {{ data.time || '--' }}</span>
      <VProgressCircular v-if="loading" indeterminate :size="12" />
    </div>
  </div>
</template>
