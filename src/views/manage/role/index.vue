<script setup lang="ts">
import { ref } from 'vue';
import { enableStatusRecord } from '@/constants/business';
import { fetchGetRoleList } from '@/service/api';
import { defaultTransform, useVuetifyPaginatedTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import RoleOperateDrawer from './modules/RoleOperateDrawer.vue';
import RoleSearch from './modules/RoleSearch.vue';

const searchParams = ref<Api.SystemManage.RoleSearchParams>({
  current: 1,
  size: 10,
  roleName: null,
  roleCode: null,
  status: null
});

const {
  headers,
  columnChecks,
  data,
  getData,
  getDataByPage,
  loading,
  serverItems,
  itemsLength,
  serverPagination,
  onLoad
} = useVuetifyPaginatedTable({
  api: () => fetchGetRoleList(searchParams.value),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.value.current = params.page;
    searchParams.value.size = params.pageSize;
  },
  columns: () => [
    { key: 'index', title: $t('common.index'), align: 'center', width: 80, sortable: false },
    { key: 'roleName', title: $t('page.manage.role.roleName'), align: 'center', minWidth: 120, sortable: false },
    { key: 'roleCode', title: $t('page.manage.role.roleCode'), align: 'center', minWidth: 120, sortable: false },
    { key: 'roleDesc', title: $t('page.manage.role.roleDesc'), minWidth: 120, sortable: false },
    { key: 'status', title: $t('page.manage.role.roleStatus'), align: 'center', width: 100, sortable: false },
    { key: 'operate', title: $t('common.operate'), align: 'center', width: 160, sortable: false }
  ]
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onBatchDeleted, onDeleted } =
  useTableOperate(data, 'id', getData);

const deleteDialogVisible = ref(false);
const deleteTargetId = ref<number | null>(null);

async function handleBatchDelete() {
  await onBatchDeleted();
}

function handleDelete(id: number) {
  deleteTargetId.value = id;
  deleteDialogVisible.value = true;
}

function confirmDelete() {
  deleteDialogVisible.value = false;
  if (deleteTargetId.value !== null) {
    console.log(deleteTargetId.value);
    onDeleted();
    deleteTargetId.value = null;
  }
}

function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px">
    <RoleSearch v-model:model="searchParams" @search="getDataByPage" />
    <VCard class="flex-col flex-1-hidden" elevation="2" :title="$t('page.manage.role.title')">
      <template #append>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <VCardText class="flex-grow flex-col">
        <VSheet border class="flex-grow flex-col">
          <VDataTableServer
            v-model="checkedRowKeys"
            :headers="headers"
            :items="serverItems"
            :items-length="itemsLength"
            :loading="loading ? 'primary' : false"
            :page="serverPagination.page"
            :items-per-page="serverPagination.itemsPerPage"
            :items-per-page-options="[10, 15, 20, 25, 30]"
            fixed-header
            show-select
            select-strategy="page"
            item-value="id"
            gridlines="all"
            density="comfortable"
            class="flex-grow [&_.v-table\_\_wrapper]:flex-basis-0!"
            @update:options="onLoad"
          >
            <template #header.data-table-select="{ allSelected, selectAll, someSelected }">
              <VCheckboxBtn
                :indeterminate="someSelected && !allSelected"
                :model-value="allSelected"
                color="primary"
                @update:model-value="selectAll(!allSelected)"
              ></VCheckboxBtn>
            </template>
            <template #item.data-table-select="{ internalItem, isSelected, toggleSelect }">
              <VCheckboxBtn
                :model-value="isSelected(internalItem)"
                color="primary"
                @update:model-value="toggleSelect(internalItem)"
              ></VCheckboxBtn>
            </template>
            <template #item.index="{ index }">
              {{ index + 1 }}
            </template>

            <template #item.status="{ item }">
              <VChip
                v-if="item.status !== null"
                :color="item.status === '1' ? 'success' : 'warning'"
                size="small"
                label
              >
                {{ $t(enableStatusRecord[item.status]) }}
              </VChip>
            </template>

            <template #item.operate="{ item }">
              <div class="flex gap-2 justify-center">
                <VBtn size="small" variant="outlined" color="primary" @click="edit(item.id)">
                  {{ $t('common.edit') }}
                </VBtn>
                <VBtn size="small" variant="outlined" color="error" @click="handleDelete(item.id)">
                  {{ $t('common.delete') }}
                </VBtn>
              </div>
            </template>
          </VDataTableServer>
        </VSheet>
      </VCardText>
    </VCard>
    <RoleOperateDrawer
      v-model:visible="drawerVisible"
      :operate-type="operateType"
      :row-data="editingData"
      @submitted="getDataByPage"
    />

    <VDialog v-model="deleteDialogVisible" max-width="400">
      <VCard>
        <VCardText>{{ $t('common.confirmDelete') }}</VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="deleteDialogVisible = false">{{ $t('common.cancel') }}</VBtn>
          <VBtn color="error" variant="text" @click="confirmDelete">{{ $t('common.confirm') }}</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style lang="scss" scoped></style>
