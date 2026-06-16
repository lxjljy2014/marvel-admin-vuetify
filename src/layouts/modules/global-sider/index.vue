<script setup lang="ts">
import { computed } from 'vue';
import { GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { useAppStore } from '@/stores/modules/app';
import { useThemeStore } from '@/stores/modules/theme';
import GlobalLogo from '../global-logo/index.vue';

defineOptions({
  name: 'GlobalSider'
});

const appStore = useAppStore();
const themeStore = useThemeStore();

// const isTopHybridSidebarFirst = computed(() => themeStore.layout.mode === 'top-hybrid-sidebar-first');
// const isTopHybridHeaderFirst = computed(() => themeStore.layout.mode === 'top-hybrid-header-first');
// const darkMenu = computed(
//   () =>
//     !themeStore.darkMode && !isTopHybridSidebarFirst.value && !isTopHybridHeaderFirst.value && themeStore.sider.inverted
// );
const showLogo = computed(() => themeStore.layout.mode === 'vertical');
const menuWrapperClass = computed(() => (showLogo.value ? 'flex-1-hidden' : 'h-full'));
</script>

<template>
  <VNavigationDrawer
    v-model="appStore.siderCollapse"
    :temporary="appStore.fullContent"
    :rail="appStore.rail"
    expand-on-hover
  >
    <template #prepend>
      <GlobalLogo
        v-if="showLogo"
        :show-title="!appStore.siderCollapse"
        :style="{ height: themeStore.header.height + 'px' }"
      />
      <VDivider />
    </template>

    <div :id="GLOBAL_SIDER_MENU_ID" :class="menuWrapperClass"></div>
  </VNavigationDrawer>
</template>

<style scoped></style>
