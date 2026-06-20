<script setup lang="ts">
import { ref } from 'vue';
import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import { fetchGetUserList } from '@/service/api';
import { defaultTransform, useVuetifyPaginatedTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import UserSearch from './modules/UserSearch.vue';
import UserOperateDrawer from './modules/UserOperateDrawer.vue';

const searchParams = ref<Api.SystemManage.UserSearchParams>({
  current: 1,
  size: 10,
  status: null,
  userName: null,
  userGender: null,
  nickName: null,
  userPhone: null,
  userEmail: null
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
  api: () => fetchGetUserList(searchParams.value),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.value.current = params.page;
    searchParams.value.size = params.pageSize;
  },
  columns: () => [
    { key: 'index', title: $t('common.index'), align: 'center', width: 80, sortable: false },
    { key: 'userName', title: $t('page.manage.user.userName'), align: 'center', minWidth: 100, sortable: false },
    { key: 'userGender', title: $t('page.manage.user.userGender'), align: 'center', width: 100, sortable: false },
    { key: 'nickName', title: $t('page.manage.user.nickName'), align: 'center', minWidth: 100, sortable: false },
    { key: 'userPhone', title: $t('page.manage.user.userPhone'), align: 'center', width: 120, sortable: false },
    { key: 'userEmail', title: $t('page.manage.user.userEmail'), align: 'center', minWidth: 200, sortable: false },
    { key: 'status', title: $t('page.manage.user.userStatus'), align: 'center', width: 100, sortable: false },
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
    <UserSearch v-model:model="searchParams" @search="getDataByPage" />
    <VCard class="flex-col flex-1-hidden" elevation="2" :title="$t('page.manage.user.title')">
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

            <template #item.userGender="{ item }">
              <VChip
                v-if="item.userGender !== null"
                :color="item.userGender === '1' ? 'primary' : 'error'"
                size="small"
                label
              >
                {{ $t(userGenderRecord[item.userGender]) }}
              </VChip>
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
    <UserOperateDrawer
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
