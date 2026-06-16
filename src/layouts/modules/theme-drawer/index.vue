<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAppStore } from '@/stores/modules/app';
import { $t } from '@/locales';
import AppearanceSettings from './modules/appearance/index.vue';
import LayoutSettings from './modules/layout/index.vue';
import GeneralSettings from './modules/general/index.vue';
import ConfigOperation from './modules/config-operation.vue';
import PresetSettings from './modules/preset/index.vue';

defineOptions({
  name: 'ThemeDrawer'
});

const appStore = useAppStore();
const activeTab = ref('appearance');

const drawerWidth = computed(() => {
  const width = 400;

  if (appStore.isMobile) {
    return `min(90vw, ${width}px)`;
  }

  return width;
});
</script>

<template>
  <VDefaultsProvider
    :defaults="{
      VTabs: { style: '--v-border-color: transparent' },
      VTab: { class: 'text-none', ripple: false, minWidth: 60 },
      VSwitch: { minWidth: 40, density: 'compact', hideDetails: true, color: 'primary' }
    }"
  >
    <VNavigationDrawer
      v-model="appStore.themeDrawerVisible"
      :width="drawerWidth"
      location="right"
      temporary
      @update:model-value="appStore.themeDrawerVisible = $event"
    >
      <template #prepend>
        <VList>
          <VListItem :title="$t('theme.themeDrawerTitle')">
            <template #append>
              <VIconBtn mdi-close variant="text" rounded="lg" @click="appStore.themeDrawerVisible = false">
                <VIcon>mdi-close</VIcon>
              </VIconBtn>
            </template>
          </VListItem>
        </VList>
        <VDivider></VDivider>
      </template>
      <VSheet class="pa-4">
        <VTabs v-model="activeTab" inset density="compact" fixed-tabs class="mb-4">
          <VTab value="appearance">{{ $t('theme.tabs.appearance') }}</VTab>
          <VTab value="layout">{{ $t('theme.tabs.layout') }}</VTab>
          <VTab value="general">{{ $t('theme.tabs.general') }}</VTab>
          <VTab value="preset">{{ $t('theme.tabs.preset') }}</VTab>
        </VTabs>
        <VTabsWindow v-model="activeTab">
          <VTabsWindowItem value="appearance">
            <AppearanceSettings />
          </VTabsWindowItem>
          <VTabsWindowItem value="layout">
            <LayoutSettings />
          </VTabsWindowItem>
          <VTabsWindowItem value="general">
            <GeneralSettings />
          </VTabsWindowItem>
          <VTabsWindowItem value="preset">
            <PresetSettings />
          </VTabsWindowItem>
        </VTabsWindow>
      </VSheet>
      <template #append>
        <VDivider />
        <div class="pa-4">
          <ConfigOperation />
        </div>
      </template>
    </VNavigationDrawer>
  </VDefaultsProvider>
</template>
