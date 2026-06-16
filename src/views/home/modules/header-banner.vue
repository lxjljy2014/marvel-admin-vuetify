<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/stores/modules/app';
import { useAuthStore } from '@/stores/modules/auth';
import { $t } from '@/locales';

defineOptions({
  name: 'HeaderBanner'
});

const appStore = useAppStore();
const authStore = useAuthStore();

const gap = computed(() => (appStore.isMobile ? 0 : 16));

interface StatisticData {
  id: number;
  label: string;
  value: string;
}

const statisticData = computed<StatisticData[]>(() => [
  {
    id: 0,
    label: $t('page.home.projectCount'),
    value: '25'
  },
  {
    id: 1,
    label: $t('page.home.todo'),
    value: '4/16'
  },
  {
    id: 2,
    label: $t('page.home.message'),
    value: '12'
  }
]);
</script>

<template>
  <VCard>
    <VCardText>
      <VRow :gap="gap">
        <VCol cols="12" md="9" sm="12">
          <div class="flex-y-center">
            <div class="size-72px shrink-0 overflow-hidden rd-1/2">
              <img src="@/assets/imgs/soybean.jpg" class="size-full" />
            </div>
            <div class="pl-12px">
              <h3 class="text-18px font-semibold">
                {{ $t('page.home.greeting', { userName: authStore.userInfo.userName }) }}
              </h3>
              <p class="text-#999 leading-30px">{{ $t('page.home.weatherDesc') }}</p>
            </div>
          </div>
        </VCol>
        <VCol cols="12" md="3" sm="12">
          <div class="flex-center justify-end gap-8">
            <div v-for="item in statisticData" :key="item.id" class="flex-col justify-center items-center gap-2">
              <span class="text-#999">{{ item.label }}</span>
              <span class="text-24px">{{ item.value }}</span>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<style scoped></style>
