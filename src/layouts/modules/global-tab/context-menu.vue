<script setup lang="ts">
import { computed } from 'vue';
import { useTabStore } from '@/stores/modules/tab';
import { $t } from '@/locales';

defineOptions({
  name: 'ContextMenu'
});

interface Props {
  /** ClientX */
  x: number;
  /** ClientY */
  y: number;
  tabId: string;
  excludeKeys?: App.Global.DropdownKey[];
  disabledKeys?: App.Global.DropdownKey[];
}

const props = withDefaults(defineProps<Props>(), {
  excludeKeys: () => [],
  disabledKeys: () => []
});

const visible = defineModel<boolean>('visible');

const { removeTab, clearTabs, clearLeftTabs, clearRightTabs, fixTab, unfixTab, isTabRetain, homeTab } = useTabStore();

type DropdownOption = {
  key: App.Global.DropdownKey;
  label: string;
  icon?: string;
  disabled?: boolean;
};

const options = computed(() => {
  const opts: DropdownOption[] = [
    {
      key: 'closeCurrent',
      label: $t('dropdown.closeCurrent'),
      icon: 'mdi-close'
    },
    {
      key: 'closeOther',
      label: $t('dropdown.closeOther'),
      icon: 'mdi-view-column'
    },
    {
      key: 'closeLeft',
      label: $t('dropdown.closeLeft'),
      icon: 'mdi-format-horizontal-align-left'
    },
    {
      key: 'closeRight',
      label: $t('dropdown.closeRight'),
      icon: 'mdi-format-horizontal-align-right'
    },
    {
      key: 'closeAll',
      label: $t('dropdown.closeAll'),
      icon: 'mdi-minus'
    }
  ];

  if (props.tabId !== homeTab?.id) {
    if (isTabRetain(props.tabId)) {
      opts.push({
        key: 'unpin',
        label: $t('dropdown.unpin'),
        icon: 'mdi-pin-off-outline'
      });
    } else {
      opts.push({
        key: 'pin',
        label: $t('dropdown.pin'),
        icon: 'mdi-pin-outline'
      });
    }
  }

  const { excludeKeys, disabledKeys } = props;

  const result = opts.filter(opt => !excludeKeys.includes(opt.key));

  disabledKeys.forEach(key => {
    const opt = result.find(item => item.key === key);

    if (opt) {
      opt.disabled = true;
    }
  });

  return result;
});

function hideDropdown() {
  visible.value = false;
}

const dropdownAction: Record<App.Global.DropdownKey, () => void> = {
  closeCurrent() {
    removeTab(props.tabId);
  },
  closeOther() {
    clearTabs([props.tabId]);
  },
  closeLeft() {
    clearLeftTabs(props.tabId);
  },
  closeRight() {
    clearRightTabs(props.tabId);
  },
  closeAll() {
    clearTabs();
  },
  pin() {
    fixTab(props.tabId);
  },
  unpin() {
    unfixTab(props.tabId);
  }
};

function handleDropdown(optionKey: App.Global.DropdownKey) {
  dropdownAction[optionKey]?.();
  hideDropdown();
}
</script>

<template>
  <VMenu :model-value="visible" :target="[x, y]" location="bottom start" :offset="5" @update:model-value="hideDropdown">
    <VList density="compact" nav prepend-gap="12">
      <VListItem
        v-for="option in options"
        :key="option.key"
        :disabled="option.disabled"
        min-height="32"
        @click="handleDropdown(option.key)"
      >
        <template #prepend>
          <VIcon v-if="option.icon" :icon="option.icon" size="small" />
        </template>
        <VListItemTitle>{{ option.label }}</VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>
</template>

<style scoped></style>
