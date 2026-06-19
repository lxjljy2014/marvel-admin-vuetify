<script setup lang="ts">
import { ref } from 'vue';
import { useTabStore } from '../../../stores/modules/tab';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';

const tabStore = useTabStore();
const { routerPushByKey } = useRouterPush();

const tabLabel = ref('');

function changeTabLabel() {
  tabStore.setTabLabel(tabLabel.value);
}

function resetTabLabel() {
  tabStore.resetTabLabel();
}
</script>

<template>
  <div class="flex flex-col gap-16px">
    <VCard :title="$t('page.function.tab.tabOperate.title')" :flat="true" class="card-wrapper">
      <VCardText>
        <VDivider>{{ $t('page.function.tab.tabOperate.addTab') }}</VDivider>
        <VBtn @click="routerPushByKey('about')">{{ $t('page.function.tab.tabOperate.addTabDesc') }}</VBtn>
        <VDivider>{{ $t('page.function.tab.tabOperate.closeTab') }}</VDivider>
        <div class="flex gap-8px">
          <VBtn @click="tabStore.removeActiveTab">
            {{ $t('page.function.tab.tabOperate.closeCurrentTab') }}
          </VBtn>
          <VBtn @click="tabStore.removeTabByRouteName('about')">
            {{ $t('page.function.tab.tabOperate.closeAboutTab') }}
          </VBtn>
        </div>
        <VDivider>{{ $t('page.function.tab.tabOperate.addMultiTab') }}</VDivider>
        <div class="flex gap-8px">
          <VBtn @click="routerPushByKey('function_multi-tab')">
            {{ $t('page.function.tab.tabOperate.addMultiTabDesc1') }}
          </VBtn>
          <VBtn @click="routerPushByKey('function_multi-tab', { query: { a: '1' } })">
            {{ $t('page.function.tab.tabOperate.addMultiTabDesc2') }}
          </VBtn>
        </div>
      </VCardText>
    </VCard>
    <VCard :title="$t('page.function.tab.tabTitle.title')" :flat="true" class="card-wrapper">
      <VCardText>
        <VDivider>{{ $t('page.function.tab.tabTitle.changeTitle') }}</VDivider>
        <div class="flex max-w-240px">
          <VTextField v-model="tabLabel" density="comfortable" variant="outlined" class="flex-1" />
          <VBtn color="primary" @click="changeTabLabel">{{ $t('page.function.tab.tabTitle.change') }}</VBtn>
        </div>
        <VDivider>{{ $t('page.function.tab.tabTitle.resetTitle') }}</VDivider>
        <VBtn color="error" variant="outlined" class="w-80px" @click="resetTabLabel">
          {{ $t('page.function.tab.tabTitle.reset') }}
        </VBtn>
      </VCardText>
    </VCard>
  </div>
</template>
