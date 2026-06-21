<script setup lang="ts" generic="T extends Record<string, unknown>, K = never">
import { computed, ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import type { TableColumnCheck } from '@sa/hooks';
import { $t } from '@/locales';

defineOptions({
  name: 'TableColumnSetting'
});

const columns = defineModel<TableColumnCheck[]>('columns', {
  required: true
});

const menuVisible = ref(false);

const tooltipRecord: Record<TableColumnCheck['fixed'], App.I18n.I18nKey> = {
  left: 'datatable.fixed.right',
  right: 'datatable.fixed.unFixed',
  unFixed: 'datatable.fixed.left'
};

function handleFixed(column: TableColumnCheck) {
  const fixedOptions: TableColumnCheck['fixed'][] = ['left', 'right', 'unFixed'];
  const index = fixedOptions.findIndex(item => item === column.fixed);
  const nextIndex = index === fixedOptions.length - 1 ? 0 : index + 1;
  column.fixed = fixedOptions[nextIndex];
}

const visibleStats = computed(() => {
  let total = 0;
  let checked = 0;

  columns.value.forEach(column => {
    if (!column.visible) return;

    total += 1;
    if (column.checked) checked += 1;
  });

  return { total, checked };
});

const selectAllChecked = computed(() => {
  const { total, checked } = visibleStats.value;

  return total > 0 && checked === total;
});

const selectAllIndeterminate = computed(() => {
  const { total, checked } = visibleStats.value;

  return checked > 0 && checked < total;
});

function toggleSelectAll(checked: boolean) {
  columns.value.forEach(column => {
    if (!column.visible) return;

    column.checked = checked;
  });
}

const selectAllModel = computed({
  get: () => selectAllChecked.value,
  set: (val: boolean) => toggleSelectAll(val)
});
</script>

<template>
  <VMenu v-model="menuVisible" :close-on-content-click="false" location="bottom end">
    <template #activator="{ props: activatorProps }">
      <VBtn variant="outlined" color="primary" size="small" v-bind="activatorProps">
        <template #prepend>
          <VIcon icon="mdi-cog-outline"></VIcon>
        </template>
        {{ $t('common.columnSetting') }}
      </VBtn>
    </template>
    <VCard min-width="240">
      <div class="pa-2">
        <VCheckbox
          v-model="selectAllModel"
          :indeterminate="selectAllIndeterminate"
          :disabled="visibleStats.total === 0"
          :label="$t('common.selectAll')"
          density="compact"
          hide-details
          class="flex-1"
        />
      </div>
      <VDivider />
      <VueDraggable
        v-model="columns"
        :animation="150"
        filter=".none_draggable"
        class="column-setting-scroll max-h-[200px] overflow-y-auto pa-2"
      >
        <div
          v-for="item in columns"
          :key="item.key"
          class="h-36px flex-y-center justify-between gap-6px"
          :class="{ hidden: !item.visible }"
        >
          <div class="h-full flex-y-center flex-1 rd-4px hover:(bg-primary bg-opacity-20)">
            <VIcon icon="mdi-drag" class="mr-8px h-full cursor-move text-icon" />
            <VCheckbox v-model="item.checked" density="compact" hide-details class="none_draggable flex-1">
              <template #label>
                <template v-if="typeof item.title === 'function'">
                  <component :is="item.title" />
                </template>
                <template v-else>{{ item.title }}</template>
              </template>
            </VCheckbox>
          </div>
          <ButtonIcon
            :disabled="!item.checked"
            :focusable="false"
            :tooltip-content="$t(tooltipRecord[item.fixed!])"
            @click="handleFixed(item)"
          >
            <VIcon v-if="item.fixed === 'unFixed'" icon="mdi-pin" />
            <VIcon v-else-if="item.fixed === 'left'" icon="mdi-pin" class="rotate-270" />
            <VIcon v-else icon="mdi-pin-off" />
          </ButtonIcon>
        </div>
      </VueDraggable>
    </VCard>
  </VMenu>
</template>

<style scoped lang="scss">
@use '../../styles/scss/scrollbar';
.column-setting-scroll {
  @include scrollbar.scrollbar();
}
</style>
