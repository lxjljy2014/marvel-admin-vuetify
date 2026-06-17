<script setup lang="ts">
import { useThemeStore } from '@/stores/modules/theme';
import { $t } from '@/locales';
import SettingItem from '../../../components/SettingItem.vue';

defineOptions({
  name: 'ThemeRadius'
});

const themeStore = useThemeStore();
</script>

<template>
  <VDivider class="my-6">{{ $t('theme.appearance.themeRadius.title') }}</VDivider>
  <TransitionGroup tag="div" name="setting-list" class="flex-col-stretch gap-12px">
    <SettingItem key="1" :label="$t('theme.appearance.themeRadius.title')">
      <VNumberInput
        v-model="themeStore.themeRadius"
        control-variant="split"
        variant="outlined"
        density="compact"
        hide-details
        max-width="150"
        color="primary"
        :step="1"
        :min="0"
        :max="16"
      />
    </SettingItem>
  </TransitionGroup>
</template>

<style scoped></style>
