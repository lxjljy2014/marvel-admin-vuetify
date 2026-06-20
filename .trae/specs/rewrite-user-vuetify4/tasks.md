# Tasks

- [x] Task 1: 创建 `useVuetifyPaginatedTable` hook
  - [x] SubTask 1.1: 在 `src/hooks/common/table.ts` 中新增 `useVuetifyPaginatedTable` 函数，基于 Vuetify `VDataTable` 的 headers 格式（`{ key, title, align, width, sortable }`）生成列定义
  - [x] SubTask 1.2: 实现分页逻辑，使用 Vuetify `useDisplay()` 替代 `appStore.isMobile`，返回 `serverPagination`（page/itemsPerPage）、`onLoad` 回调等 VDataTable server-side 模式所需的属性
  - [x] SubTask 1.3: 实现列配置（columnChecks）逻辑，将 `TableColumnCheck` 映射为 Vuetify headers 的显示/隐藏
  - [x] SubTask 1.4: 复用 `defaultTransform` 和 `useTableOperate` 函数（无需修改），确保与现有 API 层兼容

- [x] Task 2: 重写 `TableHeaderOperation` 组件为 Vuetify 版本
  - [x] SubTask 2.1: 将 `NSpace` 替换为 flex 布局，`NButton` 替换为 `VBtn`（使用 `variant="outlined"` 和 `size="small"`）
  - [x] SubTask 2.2: 将 `NPopconfirm` 替换为 `VDialog` 确认对话框模式
  - [x] SubTask 2.3: 移除 `NaiveUI.Align` 类型依赖，使用 Vuetify 的对齐方式
  - [x] SubTask 2.4: 保留 `columns` model、`add`/`delete`/`refresh` 事件和 `prefix`/`suffix` 插槽

- [x] Task 3: 重写 `TableColumnSetting` 组件为 Vuetify 版本
  - [x] SubTask 3.1: 将 `NPopover` 替换为 `VMenu`，`NButton` 替换为 `VBtn`
  - [x] SubTask 3.2: 将 `NCheckbox` 替换为 `VCheckbox`，`NDivider` 替换为 `VDivider`
  - [x] SubTask 3.3: 保留 `VueDraggable` 拖拽排序、全选/反选、列固定切换功能
  - [x] SubTask 3.4: 移除 `NaiveUI.TableColumnCheck` 和 `NaiveUI.TableColumnFixed` 类型依赖

- [x] Task 4: 重写 `user-search.vue` 搜索组件
  - [x] SubTask 4.1: 将 `NCard` 替换为 `VCard`，`NCollapse`/`NCollapseItem` 替换为 `VExpansionPanels`/`VExpansionPanel`
  - [x] SubTask 4.2: 将 `NForm`/`NFormItemGi` 替换为 `VForm`/`VRow`+`VCol` 响应式网格布局
  - [x] SubTask 4.3: 将 `NInput` 替换为 `VTextField`（`variant="outlined"` `density="comfortable"`），`NSelect` 替换为 `VSelect`
  - [x] SubTask 4.4: 将 `NButton` 替换为 `VBtn`，`NSpace` 替换为 flex 布局
  - [x] SubTask 4.5: 使用 `useVuetifyForm` 替代 `useNaiveForm`，适配 Vuetify 表单验证规则
  - [x] SubTask 4.6: 实现响应式布局：移动端单列、平板双列、桌面端六列

- [x] Task 5: 重写 `user-operate-drawer.vue` 操作抽屉组件
  - [x] SubTask 5.1: 将 `NDrawer`/`NDrawerContent` 替换为 `VNavigationDrawer`（`location="right"` `temporary`），移动端使用全屏模式
  - [x] SubTask 5.2: 将 `NForm`/`NFormItem` 替换为 `VForm`，使用 Vuetify 布局组件
  - [x] SubTask 5.3: 将 `NInput` 替换为 `VTextField`，`NRadioGroup`/`NRadio` 替换为 `VRadioGroup`/`VRadio`
  - [x] SubTask 5.4: 将 `NSelect`（多选角色）替换为 `VSelect`（`multiple` `chips`）
  - [x] SubTask 5.5: 使用 `useVuetifyForm` 替代 `useNaiveForm`，适配验证规则
  - [x] SubTask 5.6: 底部操作栏使用 `VBtn`，取消为 `variant="text"`，确认为 `color="primary"`

- [x] Task 6: 重写 `index.vue` 主页面
  - [x] SubTask 6.1: 将 `NCard` 替换为 `VCard`，`NDataTable` 替换为 `VDataTable`（server-side 模式）
  - [x] SubTask 6.2: 使用 `useVuetifyPaginatedTable` hook 替代 `useNaivePaginatedTable`
  - [x] SubTask 6.3: 表格列渲染从 TSX 渲染函数改为 `VDataTable` 的 slot 模式：`NTag` → `VChip`，`NButton` → `VBtn`，`NPopconfirm` → `VDialog`
  - [x] SubTask 6.4: 实现行选择功能，使用 `VDataTable` 的 `v-model:selected` 替代 `v-model:checked-row-keys`
  - [x] SubTask 6.5: 实现响应式布局：桌面端表格固定高度、移动端自适应高度
  - [x] SubTask 6.6: 移除所有 Naive UI 导入（`NButton`、`NPopconfirm`、`NTag`、`NCard`、`NDataTable`）

- [x] Task 7: 搭建 Vitest 测试基础设施并编写单元测试
  - [x] SubTask 7.1: 安装 vitest、@vue/test-utils、happy-dom 依赖，创建 `vitest.config.ts`
  - [x] SubTask 7.2: 为 `user-search.vue` 编写测试：渲染验证、表单绑定、搜索/重置交互
  - [x] SubTask 7.3: 为 `user-operate-drawer.vue` 编写测试：打开/关闭、表单填充、提交验证
  - [x] SubTask 7.4: 为 `index.vue` 编写测试：表格渲染、分页、行选择、编辑/删除交互

# Task Dependencies

- [Task 4] depends on [Task 1] — user-search 需要 useVuetifyPaginatedTable 的 getDataByPage
- [Task 5] depends on [Task 1] — user-operate-drawer 需要 useTableOperate（已在 Task 1 中确认兼容）
- [Task 6] depends on [Task 1, Task 2, Task 3] — index.vue 依赖 hook 和 TableHeaderOperation/TableColumnSetting 组件
- [Task 7] depends on [Task 4, Task 5, Task 6] — 测试需要在所有组件重写完成后编写
