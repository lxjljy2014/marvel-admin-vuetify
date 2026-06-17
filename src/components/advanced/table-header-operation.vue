<script setup lang="ts">
import { ref } from 'vue';
import type { TableColumnCheck } from '@sa/hooks';
import { $t } from '@/locales';

defineOptions({
  name: 'TableHeaderOperation'
});

interface Props {
  disabledDelete?: boolean;
  loading?: boolean;
}

defineProps<Props>();

interface Emits {
  (e: 'add'): void;
  (e: 'delete'): void;
  (e: 'refresh'): void;
}

const emit = defineEmits<Emits>();

const columns = defineModel<TableColumnCheck[]>('columns', {
  default: () => []
});

const deleteDialogVisible = ref(false);

function add() {
  emit('add');
}

function confirmBatchDelete() {
  deleteDialogVisible.value = false;
  emit('delete');
}

function refresh() {
  emit('refresh');
}
</script>

<template>
  <div class="flex flex-wrap gap-2 justify-end lt-sm:w-200px">
    <slot name="prefix"></slot>
    <slot name="default">
      <VBtn variant="outlined" color="primary" @click="add">
        <template #prepend>
          <VIcon icon="mdi-plus" />
        </template>
        {{ $t('common.add') }}
      </VBtn>
      <VDialog v-model="deleteDialogVisible" max-width="400">
        <template #activator="{ props: activatorProps }">
          <VBtn variant="outlined" color="error" :disabled="disabledDelete" v-bind="activatorProps">
            <template #prepend>
              <VIcon icon="mdi-delete" />
            </template>
            {{ $t('common.batchDelete') }}
          </VBtn>
        </template>
        <VCard>
          <VCardText>{{ $t('common.confirmDelete') }}</VCardText>
          <VCardActions>
            <VSpacer />
            <VBtn variant="text" @click="deleteDialogVisible = false">{{ $t('common.cancel') }}</VBtn>
            <VBtn color="error" variant="text" @click="confirmBatchDelete">{{ $t('common.confirm') }}</VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    </slot>
    <VBtn variant="outlined" @click="refresh">
      <template #prepend>
        <VIcon icon="mdi-refresh" :class="{ 'animate-spin': loading }" />
      </template>
      {{ $t('common.refresh') }}
    </VBtn>
    <TableColumnSetting v-model:columns="columns" />
    <slot name="suffix"></slot>
  </div>
</template>

<style scoped></style>
