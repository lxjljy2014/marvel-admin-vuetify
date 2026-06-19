<script setup lang="ts">
import { computed, onUnmounted, reactive, watch } from 'vue';
import {
  closeFeedbackDialog,
  feedbackDialog,
  feedbackLoadingBar,
  feedbackMessages,
  feedbackMessageTypeColorMap,
  feedbackNotifications,
  loadingBarApi,
  messageApi,
  dialogApi,
  notificationApi
} from '@/plugins/vuetify-feedback';

defineOptions({
  name: 'AppProvider'
});

window.$loadingBar = loadingBarApi;
window.$dialog = dialogApi;
window.$message = messageApi;
window.$notification = notificationApi;

const dialogVisible = computed({
  get: () => feedbackDialog.visible,
  set: (val: boolean) => {
    if (!val) {
      closeFeedbackDialog();
    }
  }
});

const dialogTypeIconMap: Record<string, string> = {
  info: 'mdi-information',
  success: 'mdi-check-circle',
  warning: 'mdi-alert',
  error: 'mdi-alert-circle'
};

const dialogTypeColorMap: Record<string, string> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error'
};

const notificationTypeColorMap: Record<string, string> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error'
};

const loadingBarProgress = reactive({ width: '0%', opacity: 0 });

let loadingBarTimer: ReturnType<typeof setInterval> | undefined;
let loadingBarFinishTimer: ReturnType<typeof setTimeout> | undefined;

watch(
  () => feedbackLoadingBar.loading,
  loading => {
    if (loading) {
      clearTimeout(loadingBarFinishTimer);
      loadingBarProgress.opacity = 1;
      loadingBarProgress.width = '0%';
      clearInterval(loadingBarTimer);
      let progress = 0;
      loadingBarTimer = setInterval(() => {
        progress += (100 - progress) * 0.05;
        if (progress > 95) progress = 95;
        loadingBarProgress.width = `${progress}%`;
      }, 100);
    } else {
      clearInterval(loadingBarTimer);
      loadingBarProgress.width = '100%';
      loadingBarFinishTimer = setTimeout(() => {
        loadingBarProgress.opacity = 0;
        setTimeout(() => {
          loadingBarProgress.width = '0%';
        }, 300);
      }, 300);
    }
  }
);

watch(
  () => feedbackLoadingBar.error,
  error => {
    if (error) {
      clearInterval(loadingBarTimer);
      loadingBarProgress.width = '100%';
      loadingBarFinishTimer = setTimeout(() => {
        loadingBarProgress.opacity = 0;
        setTimeout(() => {
          loadingBarProgress.width = '0%';
        }, 300);
      }, 300);
    }
  }
);

onUnmounted(() => {
  clearInterval(loadingBarTimer);
  clearTimeout(loadingBarFinishTimer);
});

function onSnackbarMessageClose(id: number) {
  const index = feedbackMessages.findIndex(m => m.id === id);
  if (index > -1) {
    const item = feedbackMessages[index];
    item.onLeave?.();
    feedbackMessages.splice(index, 1);
  }
}

function onSnackbarNotificationClose(id: number) {
  const index = feedbackNotifications.findIndex(n => n.id === id);
  if (index > -1) {
    const item = feedbackNotifications[index];
    item.onClose?.();
    feedbackNotifications.splice(index, 1);
  }
}

async function handlePositiveClick() {
  await feedbackDialog.onPositiveClick?.();
  feedbackDialog.visible = false;
}

async function handleNegativeClick() {
  await feedbackDialog.onNegativeClick?.();
  feedbackDialog.visible = false;
}
</script>

<template>
  <slot></slot>

  <VSnackbar
    v-for="msg in feedbackMessages"
    :key="msg.id"
    :model-value="true"
    :color="feedbackMessageTypeColorMap[msg.type]"
    :timeout="msg.duration > 0 ? msg.duration : -1"
    location="top"
    @update:model-value="onSnackbarMessageClose(msg.id)"
  >
    <div class="flex items-center gap-8px">
      <VIcon v-if="msg.type === 'loading'" icon="mdi-loading" size="small" class="animate-spin" />
      <VIcon v-else-if="msg.type === 'success'" icon="mdi-check-circle" size="small" />
      <VIcon v-else-if="msg.type === 'error'" icon="mdi-alert-circle" size="small" />
      <VIcon v-else-if="msg.type === 'warning'" icon="mdi-alert" size="small" />
      <VIcon v-else icon="mdi-information" size="small" />
      <span>{{ msg.content }}</span>
    </div>
  </VSnackbar>

  <VDialog v-model="dialogVisible" :persistent="!feedbackDialog.maskClosable" max-width="420">
    <VCard>
      <VCardTitle class="flex items-center gap-8px pt-4 px-6">
        <VIcon
          v-if="feedbackDialog.type"
          :icon="dialogTypeIconMap[feedbackDialog.type ?? 'info']"
          :color="dialogTypeColorMap[feedbackDialog.type ?? 'info']"
        />
        <span>{{ feedbackDialog.title }}</span>
      </VCardTitle>
      <VCardText class="px-6 py-3">
        {{ feedbackDialog.content }}
      </VCardText>
      <VCardActions class="px-6 pb-4">
        <VSpacer />
        <VBtn v-if="feedbackDialog.negativeText" variant="text" @click="handleNegativeClick">
          {{ feedbackDialog.negativeText }}
        </VBtn>
        <VBtn
          v-if="feedbackDialog.positiveText"
          :color="dialogTypeColorMap[feedbackDialog.type ?? 'info']"
          variant="text"
          @click="handlePositiveClick"
        >
          {{ feedbackDialog.positiveText }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VSnackbar
    v-for="n in feedbackNotifications"
    :key="n.id"
    :model-value="true"
    :color="notificationTypeColorMap[n.type ?? 'info']"
    :timeout="n.duration && n.duration > 0 ? n.duration : -1"
    location="top right"
    @update:model-value="onSnackbarNotificationClose(n.id)"
  >
    <div class="flex-col gap-4px">
      <div v-if="n.title" class="font-medium">{{ n.title }}</div>
      <div class="text-sm">{{ n.content }}</div>
      <div v-if="n.action" class="mt-2">
        <component :is="n.action()" />
      </div>
    </div>
  </VSnackbar>

  <div
    class="fixed top-0 left-0 z-[9999] h-2px"
    :style="{
      width: loadingBarProgress.width,
      opacity: loadingBarProgress.opacity,
      backgroundColor: feedbackLoadingBar.error ? 'rgb(var(--v-theme-error))' : 'rgb(var(--v-theme-primary))',
      transition: 'width 0.2s ease, opacity 0.3s ease'
    }"
  ></div>
</template>
