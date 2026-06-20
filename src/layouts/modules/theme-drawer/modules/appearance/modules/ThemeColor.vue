<script setup lang="ts">
import { useThemeStore } from '@/stores/modules/theme';
import { $t } from '@/locales';
import SettingItem from '../../../components/SettingItem.vue';

defineOptions({
  name: 'ThemeColor'
});

const themeStore = useThemeStore();

function handleUpdateColor(color: string, key: App.Theme.ThemeColorKey) {
  themeStore.updateThemeColors(key, color);
}

const swatches: string[][] = [
  ['#3b82f6', '#6366f1', '#8b5cf6'],
  ['#a855f7', '#0ea5e9', '#06b6d4'],
  ['#f43f5e', '#ef4444', '#ec4899'],
  ['#d946ef', '#f97316', '#f59e0b'],
  ['#eab308', '#84cc16', '#22c55e']
];
</script>

<template>
  <VDivider class="my-6">{{ $t('theme.appearance.themeColor.title') }}</VDivider>
  <div class="flex-col-stretch flex flex-col gap-3">
    <SettingItem key="recommend-color" :label="$t('theme.appearance.recommendColor')">
      <template #suffix>
        <IconTooltip>
          <p>
            <span class="pr-12px">{{ $t('theme.appearance.recommendColorDesc') }}</span>
            <br />
            <VBtn
              variant="text"
              tag="a"
              href="https://uicolors.app/create"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray"
            >
              https://uicolors.app/create
            </VBtn>
          </p>
        </IconTooltip>
      </template>
      <VSwitch v-model="themeStore.recommendColor" />
    </SettingItem>

    <SettingItem
      v-for="(_, key) in themeStore.themeColors"
      :key="key"
      :label="$t(`theme.appearance.themeColor.${key}`)"
    >
      <template v-if="key === 'info'" #suffix>
        <VCheckbox v-model="themeStore.isInfoFollowPrimary" hide-details density="compact" color="primary" size="small">
          <template #label>
            <span class="text-base-text">{{ $t('theme.appearance.themeColor.followPrimary') }}</span>
          </template>
        </VCheckbox>
      </template>
      <div class="w-120px">
        <VColorInput
          v-model="themeStore.themeColors[key]"
          :disabled="key === 'info' && themeStore.isInfoFollowPrimary"
          show-swatches
          :swatches="swatches"
          density="compact"
          variant="outlined"
          pip-location="prepend-inner"
          color-pip
          hide-details
          hide-actions
          :base-color="themeStore.themeColors[key]"
          :color="themeStore.themeColors[key]"
          @update:model-value="color => handleUpdateColor(color, key)"
        />
      </div>
    </SettingItem>
  </div>
</template>

<style scoped></style>
