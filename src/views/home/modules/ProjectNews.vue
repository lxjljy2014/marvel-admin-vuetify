<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({
  name: 'ProjectNews'
});

type NewsItem =
  | {
      id: number;
      title: string;
      subtitle: string;
    }
  | {
      type: 'divider' | 'subheader';
      title?: string;
      inset?: boolean;
    };

const newses = computed<NewsItem[]>(() => [
  { id: 1, title: $t('page.home.projectNews.desc1'), subtitle: '2021-05-28 22:22:22' },
  { type: 'divider', inset: true },
  { id: 2, title: $t('page.home.projectNews.desc2'), subtitle: '2021-10-27 10:24:54' },
  { type: 'divider', inset: true },
  { id: 3, title: $t('page.home.projectNews.desc3'), subtitle: '2021-10-31 22:43:12' },
  { type: 'divider', inset: true },
  { id: 4, title: $t('page.home.projectNews.desc4'), subtitle: '2021-11-03 20:33:31' },
  { type: 'divider', inset: true },
  { id: 5, title: $t('page.home.projectNews.desc5'), subtitle: '2021-11-07 22:45:32' }
]);
</script>

<template>
  <VCard class="card-wrapper" :title="$t('page.home.projectNews.title')">
    <template #append>
      <VBtn variant="text" color="primary" size="small">
        {{ $t('page.home.projectNews.moreNews') }}
      </VBtn>
    </template>
    <VDivider></VDivider>
    <VList :items="newses" lines="two" item-props>
      <template #prepend>
        <SoybeanAvatar class="size-48px! mr-4" />
      </template>
    </VList>
  </VCard>
</template>

<style scoped></style>
