import { computed, effectScope, onScopeDispose, reactive, ref, shallowRef, watch } from 'vue';
import type { Ref } from 'vue';
import type { PaginationProps } from 'naive-ui';
import { useDisplay } from 'vuetify';
import { useBoolean, useTable } from '@sa/hooks';
import type { PaginationData, TableColumnCheck, UseTableOptions } from '@sa/hooks';
import type { FlatResponseData } from '@sa/axios';
import { jsonClone } from '@sa/utils';
import { useAppStore } from '@/stores/modules/app';
import { $t } from '@/locales';

export type UseNaiveTableOptions<ResponseData, ApiData, Pagination extends boolean> = Omit<
  UseTableOptions<ResponseData, ApiData, NaiveUI.TableColumn<ApiData>, Pagination>,
  'pagination' | 'getColumnChecks' | 'getColumns'
> & {
  /**
   * get column visible
   *
   * @param column
   *
   * @default true
   *
   * @returns true if the column is visible, false otherwise
   */
  getColumnVisible?: (column: NaiveUI.TableColumn<ApiData>) => boolean;
};

const SELECTION_KEY = '__selection__';

const EXPAND_KEY = '__expand__';

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

export function useNaiveTable<ResponseData, ApiData>(options: UseNaiveTableOptions<ResponseData, ApiData, false>) {
  const scope = effectScope();
  const appStore = useAppStore();

  const result = useTable<ResponseData, ApiData, NaiveUI.TableColumn<ApiData>, false>({
    ...options,
    getColumnChecks: cols => getColumnChecks(cols, options.getColumnVisible),
    getColumns
  });

  // calculate the total width of the table this is used for horizontal scrolling
  const scrollX = computed(() => getScrollX(result.columns.value));

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
    scrollX
  };
}

type PaginationParams = Pick<PaginationProps, 'page' | 'pageSize'>;

type UseNaivePaginatedTableOptions<ResponseData, ApiData> = UseNaiveTableOptions<ResponseData, ApiData, true> & {
  paginationProps?: Omit<PaginationProps, 'page' | 'pageSize' | 'itemCount'>;
  /**
   * whether to show the total count of the table
   *
   * @default true
   */
  showTotal?: boolean;
  onPaginationParamsChange?: (params: PaginationParams) => void | Promise<void>;
};

export function useNaivePaginatedTable<ResponseData, ApiData>(
  options: UseNaivePaginatedTableOptions<ResponseData, ApiData>
) {
  const scope = effectScope();
  const appStore = useAppStore();

  const isMobile = computed(() => appStore.isMobile);

  const showTotal = computed(() => options.showTotal ?? true);

  const pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    showSizePicker: true,
    pageSizes: [10, 15, 20, 25, 30],
    prefix: showTotal.value ? page => $t('datatable.itemCount', { total: page.itemCount }) : undefined,
    onUpdatePage(page) {
      pagination.page = page;
    },
    onUpdatePageSize(pageSize) {
      pagination.pageSize = pageSize;
      pagination.page = 1;
    },
    ...options.paginationProps
  }) as PaginationProps;

  // this is for mobile, if the system does not support mobile, you can use `pagination` directly
  const mobilePagination = computed(() => {
    const p: PaginationProps = {
      ...pagination,
      pageSlot: isMobile.value ? 3 : 9,
      prefix: !isMobile.value && showTotal.value ? pagination.prefix : undefined
    };

    return p;
  });

  const paginationParams = computed(() => {
    const { page, pageSize } = pagination;

    return {
      page,
      pageSize
    };
  });

  const result = useTable<ResponseData, ApiData, NaiveUI.TableColumn<ApiData>, true>({
    ...options,
    pagination: true,
    getColumnChecks: cols => getColumnChecks(cols, options.getColumnVisible),
    getColumns,
    onFetched: data => {
      pagination.itemCount = data.total;
      pagination.pageSize = data.pageSize;
    }
  });

  const scrollX = computed(() => getScrollX(result.columns.value));

  async function getDataByPage(page: number = 1) {
    if (page !== pagination.page) {
      pagination.page = page;

      return;
    }

    await result.getData();
  }

  scope.run(() => {
    watch(
      () => appStore.locale,
      () => {
        result.reloadColumns();
      }
    );

    watch(paginationParams, async newVal => {
      await options.onPaginationParamsChange?.(newVal);

      await result.getData();
    });
  });

  onScopeDispose(() => {
    scope.stop();
  });

  return {
    ...result,
    scrollX,
    getDataByPage,
    pagination,
    mobilePagination
  };
}

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

  const operateType = shallowRef<NaiveUI.TableOperateType>('add');

  function handleAdd() {
    operateType.value = 'add';
    openDrawer();
  }

  /** the editing row data */
  const editingData = shallowRef<TableData | null>(null);

  function handleEdit(id: TableData[keyof TableData]) {
    operateType.value = 'edit';
    const findItem = data.value.find(item => item[idKey] === id) || null;
    editingData.value = jsonClone(findItem);

    openDrawer();
  }

  /** the checked row keys of table */
  const checkedRowKeys = shallowRef<TableData[K][]>([]);

  /** the hook after the batch delete operation is completed */
  async function onBatchDeleted() {
    window.$message?.success($t('common.deleteSuccess'));

    checkedRowKeys.value = [];

    await getData();
  }

  /** the hook after the delete operation is completed */
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

function getColumnChecks<Column extends NaiveUI.TableColumn<any>>(
  cols: Column[],
  getColumnVisible?: (column: Column) => boolean
) {
  const checks: TableColumnCheck[] = [];

  cols.forEach(column => {
    if (isTableColumnHasKey(column)) {
      checks.push({
        key: column.key as string,
        title: column.title!,
        checked: true,
        fixed: column.fixed ?? 'unFixed',
        visible: getColumnVisible?.(column) ?? true
      });
    } else if (column.type === 'selection') {
      checks.push({
        key: SELECTION_KEY,
        title: $t('common.check'),
        checked: true,
        fixed: column.fixed ?? 'unFixed',
        visible: getColumnVisible?.(column) ?? false
      });
    } else if (column.type === 'expand') {
      checks.push({
        key: EXPAND_KEY,
        title: $t('common.expandColumn'),
        checked: true,
        fixed: column.fixed ?? 'unFixed',
        visible: getColumnVisible?.(column) ?? false
      });
    }
  });

  return checks;
}

function getColumns<Column extends NaiveUI.TableColumn<any>>(cols: Column[], checks: TableColumnCheck[]) {
  const columnMap = new Map<string, Column>();

  cols.forEach(column => {
    if (isTableColumnHasKey(column)) {
      columnMap.set(column.key as string, column);
    } else if (column.type === 'selection') {
      columnMap.set(SELECTION_KEY, column);
    } else if (column.type === 'expand') {
      columnMap.set(EXPAND_KEY, column);
    }
  });

  const filteredColumns = checks
    .filter(item => item.checked)
    .map(check => {
      return {
        ...columnMap.get(check.key),
        fixed: check.fixed
      } as Column;
    });

  return filteredColumns;
}

export function isTableColumnHasKey<T>(column: NaiveUI.TableColumn<T>): column is NaiveUI.TableColumnWithKey<T> {
  return Boolean((column as NaiveUI.TableColumnWithKey<T>).key);
}

function getScrollX<T>(columns: NaiveUI.TableColumn<T>[], minWidth: number = 120) {
  return columns.reduce((acc, column) => {
    return acc + Number(column.width ?? column.minWidth ?? minWidth);
  }, 0);
}
