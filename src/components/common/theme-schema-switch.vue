<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';
import type { Anchor } from 'vuetify';

defineOptions({ name: 'ThemeSchemaSwitch' });

interface Props {
  /** Theme schema */
  themeSchema: UnionKey.ThemeScheme;
  /** Show tooltip */
  showTooltip?: boolean;
  /** Tooltip placement */
  tooltipPlacement?: Anchor;
}

const props = withDefaults(defineProps<Props>(), {
  showTooltip: true,
  tooltipPlacement: 'bottom'
});

interface Emits {
  (e: 'switch', event: PointerEvent): void;
}

const emit = defineEmits<Emits>();

function handleSwitch(event: PointerEvent) {
  emit('switch', event);
}

const icons: Record<UnionKey.ThemeScheme, string> = {
  light: 'mdi-weather-sunny',
  dark: 'mdi-weather-night',
  auto: 'mdi-brightness-auto'
};

const icon = computed(() => icons[props.themeSchema]);

const tooltipContent = computed(() => {
  if (!props.showTooltip) return '';

  return $t('icon.themeSchema');
});
</script>

<template>
  <ButtonIcon
    :icon="icon"
    :tooltip-content="tooltipContent"
    :tooltip-placement="tooltipPlacement"
    @click="handleSwitch($event)"
  />
</template>

<style scoped></style>
