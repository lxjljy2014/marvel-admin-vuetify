<script lang="ts" setup>
import { computed, useSlots } from 'vue';
import type { Anchor } from 'vuetify';

defineOptions({ name: 'IconTooltip' });

interface Props {
  icon?: string;
  localIcon?: string;
  desc?: string;
  placement?: Anchor;
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'mdi-help-circle',
  localIcon: '',
  desc: '',
  placement: 'top'
});

const slots = useSlots();
const hasCustomTrigger = computed(() => Boolean(slots.trigger));

if (!hasCustomTrigger.value && !props.icon && !props.localIcon) {
  throw new Error('icon or localIcon is required when no custom trigger slot is provided');
}
</script>

<template>
  <VTooltip :location="placement">
    <template #activator="{ props: activatorProps }">
      <slot name="trigger">
        <div v-bind="activatorProps" class="cursor-pointer">
          <SvgIcon :icon="icon" :local-icon="localIcon" />
        </div>
      </slot>
    </template>
    <slot>
      <span>{{ desc }}</span>
    </slot>
  </VTooltip>
</template>
