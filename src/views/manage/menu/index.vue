<script setup lang="ts">
import { ref } from 'vue';
import { yesOrNoRecord } from '@/constants/common';
import { enableStatusRecord, menuTypeRecord } from '@/constants/business';
import { fetchGetAllPages, fetchGetMenuList } from '@/service/api';
import { defaultTransform, useVuetifyPaginatedTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import SvgIcon from '@/components/custom/SvgIcon.vue';
import MenuOperateModal, { type OperateType } from './modules/MenuOperateModal.vue';

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
  api: () => fetchGetMenuList(),
  transform: response => defaultTransform(response),
  columns: () => [
    { key: 'index', title: $t('common.index'), align: 'center', minWidth: 70, sortable: false },
    { key: 'id', title: $t('page.manage.menu.id'), align: 'center', sortable: false },
    { key: 'menuType', title: $t('page.manage.menu.menuType'), align: 'center', minWidth: 100, sortable: false },
    { key: 'menuName', title: $t('page.manage.menu.menuName'), align: 'center', minWidth: 120, sortable: false },
    { key: 'icon', title: $t('page.manage.menu.icon'), align: 'center', minWidth: 80, sortable: false },
    { key: 'routeName', title: $t('page.manage.menu.routeName'), align: 'center', minWidth: 120, sortable: false },
    { key: 'routePath', title: $t('page.manage.menu.routePath'), align: 'center', minWidth: 120, sortable: false },
    { key: 'status', title: $t('page.manage.menu.menuStatus'), align: 'center', minWidth: 100, sortable: false },
    { key: 'hideInMenu', title: $t('page.manage.menu.hideInMenu'), align: 'center', minWidth: 100, sortable: false },
    { key: 'parentId', title: $t('page.manage.menu.parentId'), align: 'center', minWidth: 120, sortable: false },
    { key: 'order', title: $t('page.manage.menu.order'), align: 'center', minWidth: 70, sortable: false },
    { key: 'operate', title: $t('common.operate'), align: 'center', width: 230, sortable: false, fixed: 'end' }
  ]
});

const { checkedRowKeys, onBatchDeleted, onDeleted } = useTableOperate(data, 'id', getData);

const operateType = ref<OperateType>('add');

const editingData = ref<Api.SystemManage.Menu | null>(null);

const modalVisible = ref(false);

function handleAdd() {
  operateType.value = 'add';
  editingData.value = null;
  modalVisible.value = true;
}

async function handleBatchDelete() {
  console.log(checkedRowKeys.value);
  await onBatchDeleted();
}

const deleteDialogVisible = ref(false);
const deleteTargetId = ref<number | null>(null);

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

function handleEdit(item: Api.SystemManage.Menu) {
  operateType.value = 'edit';
  editingData.value = { ...item };
  modalVisible.value = true;
}

function handleAddChildMenu(item: Api.SystemManage.Menu) {
  operateType.value = 'addChild';
  editingData.value = { ...item };
  modalVisible.value = true;
}

const allPages = ref<string[]>([]);

async function getAllPages() {
  const { data: pages } = await fetchGetAllPages();
  allPages.value = pages || [];
}

function init() {
  getAllPages();
}

init();
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px">
    <VCard class="flex-1-hidden" elevation="2" :title="$t('page.manage.menu.title')">
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
      <VCardText class="h-[calc(100%-56px)] overflow-hidden">
        <VSheet border class="flex-col h-full">
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
            class="flex-grow"
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
            <template #item.menuType="{ item }">
              <VChip :color="item.menuType === '2' ? 'primary' : undefined" size="small" label>
                {{ $t(menuTypeRecord[item.menuType]) }}
              </VChip>
            </template>
            <template #item.menuName="{ item }">
              {{ item.i18nKey ? $t(item.i18nKey) : item.menuName }}
            </template>
            <template #item.icon="{ item }">
              <div class="flex-center">
                <SvgIcon
                  :icon="item.iconType === '1' ? item.icon : undefined"
                  :local-icon="item.iconType === '2' ? item.icon : undefined"
                  class="text-icon"
                />
              </div>
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
            <template #item.hideInMenu="{ item }">
              <VChip :color="item.hideInMenu ? 'error' : undefined" size="small" label>
                {{ $t(yesOrNoRecord[item.hideInMenu ? 'Y' : 'N']) }}
              </VChip>
            </template>
            <template #item.operate="{ item }">
              <div class="flex gap-2 justify-center">
                <VBtn
                  v-if="item.menuType === '1'"
                  size="small"
                  variant="outlined"
                  color="primary"
                  @click="handleAddChildMenu(item)"
                >
                  {{ $t('page.manage.menu.addChildMenu') }}
                </VBtn>
                <VBtn size="small" variant="outlined" color="primary" @click="handleEdit(item)">
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

    <MenuOperateModal
      v-model:visible="modalVisible"
      :operate-type="operateType"
      :row-data="editingData"
      :all-pages="allPages"
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

<style lang="scss" scoped>
:deep(.v-table .v-table__wrapper) {
  flex: 1 1 0;
}
</style>
