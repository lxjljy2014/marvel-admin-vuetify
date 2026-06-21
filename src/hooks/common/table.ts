import { computed, effectScope, onScopeDispose, reactive, shallowRef, watch } from 'vue';
import type { Ref } from 'vue';
import { useDisplay } from 'vuetify';
import type { DataTableHeader } from 'vuetify';
import { useBoolean, useTable } from '@sa/hooks';
import type { PaginationData, TableColumnCheck } from '@sa/hooks';
import type { FlatResponseData } from '@sa/axios';
import { jsonClone } from '@sa/utils';
import { useAppStore } from '@/stores/modules/app';
import { $t } from '@/locales';

export type UseVuetifyPaginatedTableOptions<ResponseData, ApiData> = {
  api: () => Promise<ResponseData>;
  transform: (response: ResponseData) => PaginationData<ApiData>;
  columns: () => DataTableHeader[];
  getColumnVisible?: (header: DataTableHeader) => boolean;
  onPaginationParamsChange?: (params: { page: number; pageSize: number }) => void | Promise<void>;
  showTotal?: boolean;
};

export function useVuetifyPaginatedTable<ResponseData, ApiData>(
  options: UseVuetifyPaginatedTableOptions<ResponseData, ApiData>
) {
  const scope = effectScope();
  const appStore = useAppStore();
  const { mobile } = useDisplay();

  const isMobile = computed(() => mobile.value);

  const result = useTable<ResponseData, ApiData, DataTableHeader, true>({
    ...options,
    pagination: true,
    getColumnChecks: cols => getColumnChecks(cols, options.getColumnVisible),
    getColumns,
    onFetched: data => {
      pagination.itemCount = data.total;
      pagination.pageSize = data.pageSize;
    }
  });

  const pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    async onUpdatePage(page: number) {
      pagination.page = page;
      await options.onPaginationParamsChange?.({ page, pageSize: pagination.pageSize });
      await result.getData();
    },
    async onUpdatePageSize(pageSize: number) {
      pagination.pageSize = pageSize;
      pagination.page = 1;
      await options.onPaginationParamsChange?.({ page: 1, pageSize: pageSize });
      await result.getData();
    }
  });

  async function getDataByPage(page: number = 1) {
    pagination.page = page;
    await options.onPaginationParamsChange?.({ page, pageSize: pagination.pageSize });
    await result.getData();
  }

  scope.run(() => {
    watch(
      () => appStore.locale,
      () => {
        result.reloadColumns();
      }
    );
  });

  onScopeDispose(() => {
    scope.stop();
  });

  return {
    ...result,
    getDataByPage,
    pagination,
    isMobile
  };
}

export function useTableOperate<TableData, K extends keyof TableData = keyof TableData>(
  data: Ref<TableData[]>,
  idKey: K,
  getData: () => Promise<void>
) {
  const { bool: drawerVisible, setTrue: openDrawer, setFalse: closeDrawer } = useBoolean();

  const operateType = shallowRef<'add' | 'edit'>('add');

  function handleAdd() {
    operateType.value = 'add';
    openDrawer();
  }

  const editingData = shallowRef<TableData | null>(null);

  function handleEdit(id: TableData[K]) {
    operateType.value = 'edit';
    const findItem = data.value.find(item => item[idKey] === id) || null;
    editingData.value = jsonClone(findItem);

    openDrawer();
  }

  const checkedRowKeys = shallowRef<TableData[K][]>([]);

  async function onBatchDeleted() {
    window.$message?.success($t('common.deleteSuccess'));

    checkedRowKeys.value = [];

    await getData();
  }

  async function onDeleted() {
    window.$message?.success($t('common.deleteSuccess'));

    await getData();
  }

  return {
    drawerVisible,
    openDrawer,
    closeDrawer,
    operateType,
    handleAdd,
    editingData,
    handleEdit,
    checkedRowKeys,
    onBatchDeleted,
    onDeleted
  };
}

export function defaultTransform<ApiData>(
  response: FlatResponseData<any, Api.Common.PaginatingQueryRecord<ApiData>>
): PaginationData<ApiData> {
  const { data, error } = response;

  if (!error) {
    const { records, current, size, total } = data;

    return {
      data: records,
      pageNum: current,
      pageSize: size,
      total
    };
  }

  return {
    data: [],
    pageNum: 1,
    pageSize: 10,
    total: 0
  };
}

function getColumnChecks(
  headers: DataTableHeader[],
  getColumnVisible?: (header: DataTableHeader) => boolean
): TableColumnCheck[] {
  return headers.map(header => ({
    key: header.key as string,
    title: header.title as string,
    checked: true,
    fixed: 'unFixed' as const,
    visible: getColumnVisible?.(header) ?? true
  }));
}

function getColumns<Column extends DataTableHeader<any>>(
  cols: Column[],
  checks: TableColumnCheck[]
): DataTableHeader[] {
  const columnMap = new Map(cols.map(h => [h.key, h]));

  const filteredColumns = checks
    .filter(item => item.checked)
    .map(check => {
      return {
        ...columnMap.get(check.key),
        fixed: check.fixed !== 'unFixed' ? (check.fixed === 'left' ? 'start' : 'end') : undefined
      } as Column;
    });

  return filteredColumns;
}
