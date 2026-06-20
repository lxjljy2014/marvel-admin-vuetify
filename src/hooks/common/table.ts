import { computed, effectScope, onScopeDispose, reactive, ref, shallowRef, watch } from 'vue';
import type { Ref } from 'vue';
import { useDisplay } from 'vuetify';
import { useBoolean, useTable } from '@sa/hooks';
import type { PaginationData, TableColumnCheck } from '@sa/hooks';
import type { FlatResponseData } from '@sa/axios';
import { jsonClone } from '@sa/utils';
import { useAppStore } from '@/stores/modules/app';
import { $t } from '@/locales';

export type VuetifyTableHeader = {
  key: string;
  title: string;
  align?: 'start' | 'center' | 'end';
  width?: number;
  minWidth?: number;
  sortable?: boolean;
};

export type UseVuetifyPaginatedTableOptions<ResponseData, ApiData> = {
  api: () => Promise<ResponseData>;
  transform: (response: ResponseData) => PaginationData<ApiData>;
  columns: () => VuetifyTableHeader[];
  getColumnVisible?: (header: VuetifyTableHeader) => boolean;
  onPaginationParamsChange?: (params: { page: number; pageSize: number }) => void | Promise<void>;
  showTotal?: boolean;
  immediate?: boolean;
};

export function useVuetifyPaginatedTable<ResponseData, ApiData>(
  options: UseVuetifyPaginatedTableOptions<ResponseData, ApiData>
) {
  const scope = effectScope();
  const appStore = useAppStore();
  const { mobile } = useDisplay();

  const isMobile = computed(() => mobile.value);

  const itemsLength = ref(0);

  const result = useTable<ResponseData, ApiData, VuetifyTableHeader, true>({
    api: options.api,
    transform: options.transform,
    columns: options.columns,
    pagination: true,
    immediate: options.immediate ?? true,
    getColumnChecks: cols => getVuetifyColumnChecks(cols, options.getColumnVisible),
    getColumns: getVuetifyColumns,
    onFetched: data => {
      itemsLength.value = data.total;
    }
  });

  const serverPagination = reactive({
    page: 1,
    itemsPerPage: 10,
    async onUpdatePage(page: number) {
      serverPagination.page = page;
      await options.onPaginationParamsChange?.({ page, pageSize: serverPagination.itemsPerPage });
      await result.getData();
    },
    async onUpdateItemsPerPage(itemsPerPage: number) {
      serverPagination.itemsPerPage = itemsPerPage;
      serverPagination.page = 1;
      await options.onPaginationParamsChange?.({ page: 1, pageSize: itemsPerPage });
      await result.getData();
    }
  });

  const serverItems = computed(() => result.data.value);

  const headers = computed(() => result.columns.value);

  async function getDataByPage(page: number = 1) {
    serverPagination.page = page;
    await options.onPaginationParamsChange?.({ page, pageSize: serverPagination.itemsPerPage });
    await result.getData();
  }

  async function onLoad({ page, itemsPerPage }: { page: number; itemsPerPage: number }) {
    serverPagination.page = page;
    serverPagination.itemsPerPage = itemsPerPage;
    await options.onPaginationParamsChange?.({ page, pageSize: itemsPerPage });
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
    loading: result.loading,
    empty: result.empty,
    data: result.data,
    headers,
    columnChecks: result.columnChecks,
    reloadColumns: result.reloadColumns,
    getData: result.getData,
    getDataByPage,
    serverItems,
    itemsLength,
    serverPagination,
    isMobile,
    onLoad
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

  function handleEdit(id: TableData[keyof TableData]) {
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

function getVuetifyColumnChecks(
  headers: VuetifyTableHeader[],
  getColumnVisible?: (header: VuetifyTableHeader) => boolean
): TableColumnCheck[] {
  return headers.map(header => ({
    key: header.key,
    title: header.title,
    checked: true,
    fixed: 'unFixed' as const,
    visible: getColumnVisible?.(header) ?? true
  }));
}

function getVuetifyColumns(headers: VuetifyTableHeader[], checks: TableColumnCheck[]): VuetifyTableHeader[] {
  const checkedKeys = new Set(checks.filter(c => c.checked).map(c => c.key));
  return headers.filter(h => checkedKeys.has(h.key));
}
