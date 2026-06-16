<script setup lang="ts">
import { useThemeStore } from '@/stores/modules/theme';
import { $t } from '@/locales';
import SettingItem from '../../../components/setting-item.vue';

defineOptions({
  name: 'HeaderSettings'
});

const themeStore = useThemeStore();
</script>

<template>
  <VDivider class="my-6">{{ $t('theme.layout.header.title') }}</VDivider>
  <TransitionGroup tag="div" name="setting-list" class="flex-col-stretch gap-12px">
    <SettingItem key="1" :label="$t('theme.layout.header.height')">
      <VNumberInput
        v-model:value="themeStore.header.height"
        control-variant="split"
        hide-details
        density="compact"
        variant="outlined"
        color="primary"
        max-width="150"
      />
    </SettingItem>
    <SettingItem key="2" :label="$t('theme.layout.header.breadcrumb.visible')">
      <VSwitch v-model="themeStore.header.breadcrumb.visible" />
    </SettingItem>
    <SettingItem
      v-if="themeStore.header.breadcrumb.visible"
      key="3"
      :label="$t('theme.layout.header.breadcrumb.showIcon')"
    >
      <VSwitch v-model:value="themeStore.header.breadcrumb.showIcon" />
    </SettingItem>
  </TransitionGroup>
</template>

<style scoped>
.setting-list-move,
.setting-list-enter-active,
.setting-list-leave-active {
  --uno: transition-all-300;
}

.setting-list-enter-from,
.setting-list-leave-to {
  --uno: opacity-0 -translate-x-30px;
}

.setting-list-leave-active {
  --uno: absolute;
}
</style>
