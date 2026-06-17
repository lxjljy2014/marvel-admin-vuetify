<script setup lang="ts">
import { themeTabModeOptions } from '@/constants/app';
import { useThemeStore } from '@/stores/modules/theme';
import { translateOptions } from '@/utils/common';
import { $t } from '@/locales';
import SettingItem from '../../../components/SettingItem.vue';

defineOptions({
  name: 'TabSettings'
});

const themeStore = useThemeStore();
</script>

<template>
  <VDivider class="my-6">{{ $t('theme.layout.tab.title') }}</VDivider>
  <TransitionGroup tag="div" name="setting-list" class="flex-col-stretch gap-12px">
    <SettingItem key="1" :label="$t('theme.layout.tab.visible')">
      <VSwitch v-model="themeStore.tab.visible" />
    </SettingItem>
    <SettingItem v-if="themeStore.tab.visible" key="2" :label="$t('theme.layout.tab.cache')">
      <template #suffix>
        <IconTooltip :desc="$t('theme.layout.tab.cacheTip')" />
      </template>
      <VSwitch v-model="themeStore.tab.cache" />
    </SettingItem>
    <SettingItem v-if="themeStore.tab.visible" key="3" :label="$t('theme.layout.tab.height')">
      <VNumberInput
        v-model="themeStore.tab.height"
        control-variant="split"
        hide-details
        density="compact"
        variant="outlined"
        color="primary"
        max-width="150"
      />
    </SettingItem>
    <SettingItem v-if="themeStore.tab.visible" key="4" :label="$t('theme.layout.tab.mode.title')">
      <VSelect
        v-model="themeStore.tab.mode"
        :items="translateOptions(themeTabModeOptions)"
        item-props
        item-value="value"
        item-title="label"
        size="small"
        max-width="150"
        density="compact"
        variant="outlined"
        color="primary"
        hide-details
      />
    </SettingItem>
    <SettingItem v-if="themeStore.tab.visible" key="5" :label="$t('theme.layout.tab.closeByMiddleClick')">
      <template #suffix>
        <IconTooltip :desc="$t('theme.layout.tab.closeByMiddleClickTip')" />
      </template>
      <VSwitch v-model="themeStore.tab.closeTabByMiddleClick" />
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
