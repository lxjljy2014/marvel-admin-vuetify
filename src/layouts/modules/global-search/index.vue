<script lang="ts" setup>
import { computed, ref, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { useDebounceFn } from '@vueuse/core';
import { useRouteStore } from '@/stores/modules/route';
import { useAppStore } from '@/stores/modules/app';
import { $t } from '@/locales';

defineOptions({ name: 'GlobalSearch' });

const router = useRouter();
const appStore = useAppStore();
const routeStore = useRouteStore();

const isMobile = computed(() => appStore.isMobile);

const keyword = ref('');
const activePath = ref('');
const resultOptions = shallowRef<App.Global.Menu[]>([]);

const handleSearch = useDebounceFn(search, 300);

function search() {
  resultOptions.value = routeStore.searchMenus.filter(menu => {
    const trimKeyword = keyword.value.toLocaleLowerCase().trim();
    const title = (menu.i18nKey ? $t(menu.i18nKey) : menu.label).toLocaleLowerCase();
    return trimKeyword && title.includes(trimKeyword);
  });
  activePath.value = resultOptions.value[0]?.routePath ?? '';
}

function handleClose() {
  // handle with setTimeout to prevent user from seeing some operations
  setTimeout(() => {
    resultOptions.value = [];
    keyword.value = '';
  }, 200);
}

/** key enter */
function handleEnter(e: Event, value: string) {
  console.log(e);
  console.log(value);
  if (resultOptions.value?.length === 0 || activePath.value === '') return;
  handleClose();
  router.push(activePath.value);
}

const commandPaletteItems = computed<any[]>(() => {
  return resultOptions.value.map(item => {
    return {
      ...item,
      title: item.label,
      value: item.routeKey,
      prependIcon: item.icon,
      appendIcon: '$enter',
      onClick: handleEnter
    };
  });
});

function handleSearchChange(_value: string) {
  handleSearch();
}
</script>

<template>
  <VCommandPalette
    v-model:search="keyword"
    :items="commandPaletteItems"
    :search-props="{ autocomplete: 'off' }"
    hotkey="ctrl+k"
    :max-width="isMobile ? undefined : 630"
    :fullscreen="isMobile"
    :placeholder="$t('common.keywordSearch')"
    :list-props="{
      color: 'primary',
      prependGap: '16',
      nav: true,
      activatable: true,
      activeColor: 'primary'
    }"
    offset-top="Ovh"
    max-height="600"
    class="rd-8px"
    :content-props="{
      padding: '0 8px'
    }"
    @update:search="handleSearchChange"
  >
    <template #activator="{ props }">
      <VBtn variant="text" prepend-icon="mdi-magnify" height="40" v-bind="props">
        搜索
        <template #append>
          <VHotkey keys="ctrl+k" display-mode="icon" variant="outlined" platform="auto" />
        </template>
      </VBtn>
    </template>
    <template #input.append-inner>
      <VKbd elevation="0" class="opacity-60 self-center py-1">Esc</VKbd>
    </template>
    <template #no-data>
      <div class="flex-col justify-center items-center gap-4">
        <VIcon icon="mdi-text-box-search-outline" size="120" />
        <span>您的搜索结果将显示在这里</span>
      </div>
    </template>
    <template #append>
      <VDivider />
      <div class="flex pa-3 gap-1 text-body-small items-center opacity-70">
        <VHotkey keys="arrowup" display-mode="icon" variant="elevated" platform="auto" />
        <VHotkey keys="arrowdown" display-mode="icon" variant="elevated" platform="auto" />
        <div class="mr-3">{{ $t('common.switch') }}</div>
        <VHotkey keys="enter" display-mode="icon" variant="elevated" platform="auto" />
        <div class="mr-3">{{ $t('common.confirm') }}</div>
        <VKbd>Esc</VKbd>
        <div class="mr-3">{{ $t('common.close') }}</div>
      </div>
    </template>
  </VCommandPalette>
</template>

<style lang="scss" scoped>
.contentClass {
}
</style>
