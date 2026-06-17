<script setup lang="ts">
import type { Anchor } from 'vuetify';

defineOptions({
  name: 'ButtonIcon',
  inheritAttrs: false
});

interface Props {
  /** Button class */
  class?: string | Record<string, boolean>;
  /** Iconify icon name */
  icon?: string;
  /** Tooltip content */
  tooltipContent?: string;
  /** Tooltip placement */
  tooltipPlacement?: Anchor;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  icon: '',
  tooltipContent: '',
  tooltipPlacement: 'bottom'
});
</script>

<template>
  <VTooltip :location="tooltipPlacement" :disabled="!tooltipContent">
    <template #activator="{ props: activatorProps }">
      <VIconBtn
        icon-size="20"
        size="40"
        variant="text"
        :icon="icon"
        rounded="lg"
        :class="props.class"
        v-bind="{ ...activatorProps, ...$attrs }"
      ></VIconBtn>
    </template>
    {{ tooltipContent }}
  </VTooltip>
</template>

<style scoped></style>
