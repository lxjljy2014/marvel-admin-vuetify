<script setup lang="ts">
import { reactive } from 'vue';
import { utils, writeFile } from 'xlsx';
import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import { fetchGetUserList } from '@/service/api';
import { useVuetifyPaginatedTable, defaultTransform, type VuetifyTableHeader } from '@/hooks/common/table';
import { $t } from '@/locales';

const searchParams = reactive<Api.SystemManage.UserSearchParams>({
  current: 1,
  size: 999,
  status: null,
  userName: null,
  userGender: null,
  nickName: null,
  userPhone: null,
  userEmail: null
});

const { headers, data, loading, serverItems, itemsLength, serverPagination, onLoad } = useVuetifyPaginatedTable({
  api: () => fetchGetUserList(searchParams),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.current = params.page;
    searchParams.size = params.pageSize;
  },
  columns: () => [
    { key: 'index', title: $t('common.index'), align: 'center', width: 80, sortable: false },
    { key: 'userName', title: $t('page.manage.user.userName'), align: 'center', minWidth: 100, sortable: false },
    { key: 'userGender', title: $t('page.manage.user.userGender'), align: 'center', width: 100, sortable: false },
    { key: 'nickName', title: $t('page.manage.user.nickName'), align: 'center', minWidth: 100, sortable: false },
    { key: 'userPhone', title: $t('page.manage.user.userPhone'), align: 'center', width: 120, sortable: false },
    { key: 'userEmail', title: $t('page.manage.user.userEmail'), align: 'center', minWidth: 200, sortable: false },
    { key: 'status', title: $t('page.manage.user.userStatus'), align: 'center', width: 100, sortable: false }
  ]
});

function exportExcel() {
  const exportHeaders = headers.value.slice(1);

  const excelList = data.value.map(item => exportHeaders.map(h => getTableValue(h, item)));

  const titleList = exportHeaders.map(h => h.title || null);

  excelList.unshift(titleList);

  const workBook = utils.book_new();

  const workSheet = utils.aoa_to_sheet(excelList);

  workSheet['!cols'] = exportHeaders.map(h => ({
    width: Math.round((h.width || h.minWidth || 120) / 10 || 20)
  }));

  utils.book_append_sheet(workBook, workSheet, '用户列表');

  writeFile(workBook, '用户数据.xlsx');
}

function getTableValue(header: VuetifyTableHeader, item: Api.SystemManage.User) {
  const { key } = header;

  if (key === 'status') {
    return (item.status && $t(enableStatusRecord[item.status])) || null;
  }

  if (key === 'userGender') {
    return (item.userGender && $t(userGenderRecord[item.userGender])) || null;
  }

  // @ts-expect-error the key may not exist in the type
  return item[key] || null;
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <VCard :flat="true" class="card-wrapper sm:flex-1-hidden" title="Excel导出">
      <template #append>
        <div class="flex justify-end lt-sm:w-200px">
          <VBtn size="small" variant="outlined" color="primary" @click="exportExcel">
            <template #prepend>
              <icon-file-icons-microsoft-excel class="text-icon" />
            </template>
            导出excel
          </VBtn>
        </div>
      </template>

      <VCardText class="flex-grow flex-col">
        <VSheet border class="flex-grow flex-col">
          <VDataTableServer
            :headers="headers"
            :items="serverItems"
            :items-length="itemsLength"
            :loading="loading ? 'primary' : false"
            :page="serverPagination.page"
            :items-per-page="serverPagination.itemsPerPage"
            :items-per-page-options="[10, 15, 20, 25, 30]"
            fixed-header
            item-value="id"
            gridlines="all"
            density="comfortable"
            class="flex-grow [&_.v-table__wrapper]:flex-basis-0!"
            @update:options="onLoad"
          >
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
          </VDataTableServer>
        </VSheet>
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped></style>
