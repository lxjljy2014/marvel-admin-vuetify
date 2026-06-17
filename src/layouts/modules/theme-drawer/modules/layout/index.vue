<script setup lang="ts">
import { useThemeStore } from '@/stores/modules/theme';
import LayoutMode from './modules/LayoutMode.vue';
import TabSettings from './modules/TabSettings.vue';
import HeaderSettings from './modules/HeaderSettings.vue';
import SiderSettings from './modules/SiderSettings.vue';
import FooterSettings from './modules/FooterSettings.vue';
import ContentSettings from './modules/ContentSettings.vue';

defineOptions({
  name: 'LayoutSettings'
});

const themeStore = useThemeStore();
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <LayoutMode />
    <TabSettings />
    <HeaderSettings />
    <!-- The top menu mode does not have a sidebar -->
    <SiderSettings v-if="themeStore.layout.mode !== 'horizontal'" />
    <FooterSettings />
    <ContentSettings />
  </div>
</template>

<style scoped></style>
