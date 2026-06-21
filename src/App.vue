<script lang="ts" setup>
import { useThemeStore } from '@/stores/modules/theme';
const themeStore = useThemeStore();
</script>

<template>
  <VDefaultsProvider
    :defaults="{
      global: {
        rounded: themeStore.themeRadius
      },
      VAppBar: { tile: true, rounded: false },
      VNavigationDrawer: { tile: true, rounded: false },
      VAppBarNavIcon: { size: 40 }
    }"
  >
    <AppProvider>
      <RouterView />
    </AppProvider>
  </VDefaultsProvider>
</template>
