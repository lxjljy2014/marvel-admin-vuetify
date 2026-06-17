<script setup lang="ts">
import { useFullscreen } from '@vueuse/core';
import { GLOBAL_HEADER_MENU_ID } from '@/constants/app';
import { useAppStore } from '@/stores/modules/app';
import { useThemeStore } from '@/stores/modules/theme';
import GlobalLogo from '../global-logo/index.vue';
import GlobalBreadcrumb from '../global-breadcrumb/index.vue';
import GlobalSearch from '../global-search/index.vue';
import ThemeButton from './components/theme-button.vue';
import UserAvatar from './components/user-avatar.vue';
import { useTheme } from 'vuetify';

defineOptions({
  name: 'GlobalHeader'
});

interface Props {
  /** Whether to show the logo */
  showLogo?: App.Global.HeaderProps['showLogo'];
  /** Whether to show the menu toggler */
  showMenuToggler?: App.Global.HeaderProps['showMenuToggler'];
  /** Whether to show the menu */
  showMenu?: App.Global.HeaderProps['showMenu'];
}

defineProps<Props>();

const appStore = useAppStore();
const themeStore = useThemeStore();
const theme = useTheme();
const { isFullscreen, toggle } = useFullscreen();

function handleSwitch(e: PointerEvent) {
  themeStore.toggleThemeScheme();

  if (themeStore.themeScheme === 'auto') {
    return;
  }
  theme.setTransitionOrigin(e);
  theme.change(themeStore.themeScheme, {
    duration: '500ms'
  });
}
</script>

<template>
  <VAppBar density="comfortable" :extended="!appStore.fullContent" :height="appStore.fullContent ? '52' : undefined">
    <template #default>
      <div v-show="!appStore.fullContent" class="w-full flex items-center justify-between">
        <VAppBarNavIcon @click="appStore.toggleRail()"></VAppBarNavIcon>
        <GlobalLogo v-if="showLogo" class="h-full" :style="{ width: themeStore.sider.width + 'px' }" />
        <div v-if="showMenu" :id="GLOBAL_HEADER_MENU_ID" class="h-full flex-y-center flex-1-hidden"></div>
        <div v-else class="h-full flex-y-center flex-1-hidden">
          <GlobalBreadcrumb v-if="!appStore.isMobile" class="ml-12px" />
        </div>
        <VSpacer></VSpacer>
        <div class="h-full flex-y-center justify-end">
          <GlobalSearch v-if="themeStore.header.globalSearch.visible" />
          <FullScreen v-if="!appStore.isMobile" :full="isFullscreen" @click="toggle" />
          <LangSwitch
            v-if="themeStore.header.multilingual.visible"
            :lang="appStore.locale"
            :lang-options="appStore.localeOptions"
            @change-lang="appStore.changeLocale"
          />
          <ThemeSchemaSwitch
            :theme-schema="themeStore.themeScheme"
            :is-dark="themeStore.darkMode"
            @switch="handleSwitch"
          />
          <ThemeButton />
          <UserAvatar />
        </div>
      </div>
      <slot v-if="appStore.fullContent" name="tab" />
    </template>

    <template #extension>
      <slot name="tab" />
    </template>
  </VAppBar>
</template>

<style scoped></style>
