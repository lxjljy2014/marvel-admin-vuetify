<script setup lang="ts">
import { computed } from 'vue';
import { themeSchemaRecord } from '@/constants/app';
import { useThemeStore } from '@/stores/modules/theme';
import { $t } from '@/locales';
import SettingItem from '../../../components/SettingItem.vue';
import { useTheme } from 'vuetify';

defineOptions({
  name: 'ThemeSchema'
});

const themeStore = useThemeStore();
const theme = useTheme();

const icons: Record<UnionKey.ThemeScheme, string> = {
  light: 'mdi-white-balance-sunny',
  dark: 'mdi-weather-night',
  auto: 'mdi-brightness-auto'
};

function handleSegmentChange(e: PointerEvent) {
  themeStore.setThemeScheme(themeStore.themeScheme);
  theme.setTransitionOrigin(e);
  theme.change(themeStore.themeScheme, {
    duration: '500ms'
  });
}

function handleGrayscaleChange(value: boolean | null) {
  themeStore.setGrayscale(Boolean(value));
}

function handleColourWeaknessChange(value: boolean | null) {
  themeStore.setColourWeakness(Boolean(value));
}

const showSiderInverted = computed(() => !themeStore.darkMode && themeStore.layout.mode.includes('vertical'));
</script>

<template>
  <VDivider class="my-6">{{ $t('theme.appearance.themeSchema.title') }}</VDivider>

  <div class="flex items-center justify-center">
    <VTabs
      :key="themeStore.themeScheme"
      v-model="themeStore.themeScheme"
      density="compact"
      class="relative w-214px mb-8"
      inset
      @click="handleSegmentChange($event)"
    >
      <VTab v-for="(_, key) in themeSchemaRecord" :key="key" :value="key">
        <VIcon :icon="icons[key]"></VIcon>
      </VTab>
    </VTabs>
  </div>
  <Transition name="sider-inverted">
    <SettingItem v-if="showSiderInverted" :label="$t('theme.layout.sider.inverted')">
      <VSwitch v-model="themeStore.sider.inverted" hide-details />
    </SettingItem>
  </Transition>
  <SettingItem :label="$t('theme.appearance.grayscale')">
    <VSwitch :model-value="themeStore.grayscale" hide-details @update:model-value="handleGrayscaleChange" />
  </SettingItem>
  <SettingItem :label="$t('theme.appearance.colourWeakness')">
    <VSwitch :model-value="themeStore.colourWeakness" hide-details @update:model-value="handleColourWeaknessChange" />
  </SettingItem>
</template>

<style scoped>
.sider-inverted-enter-active,
.sider-inverted-leave-active {
  --uno: h-22px transition-all-300;
}

.sider-inverted-enter-from,
.sider-inverted-leave-to {
  --uno: translate-x-20px opacity-0 h-0;
}
</style>
