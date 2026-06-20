# 用户管理模块 Vuetify 4 重写 Spec

## Why

当前 `src/views/manage/user` 路径下的组件完全基于 Naive UI 构建，而项目已迁移至 Vuetify 4 框架。`useNaiveForm` 等 hook 已被删除但仍被引用，导致编译错误。需要将这些组件全面重写为 Vuetify 4 实现，消除 Naive UI 依赖，同时实现响应式布局和提升交互体验。

## What Changes

- 将 `index.vue` 中的 `NCard`、`NDataTable`、`NButton`、`NPopconfirm`、`NTag` 替换为 Vuetify 4 对应组件
- 将 `user-search.vue` 中的 `NCard`、`NCollapse`、`NForm`、`NInput`、`NSelect`、`NButton`、`NSpace` 替换为 Vuetify 4 对应组件
- 将 `user-operate-drawer.vue` 中的 `NDrawer`、`NForm`、`NInput`、`NRadioGroup`、`NSelect`、`NButton` 替换为 Vuetify 4 对应组件
- 创建 `useVuetifyPaginatedTable` hook 替代 `useNaivePaginatedTable`，基于 Vuetify 4 的 `VDataTable` headers 格式
- 创建 Vuetify 版本的 `TableHeaderOperation` 组件替代 Naive UI 版本
- 创建 Vuetify 版本的 `TableColumnSetting` 组件替代 Naive UI 版本
- 使用 `useVuetifyForm` 替代已删除的 `useNaiveForm`
- 使用 Vuetify `useDisplay()` 替代 `appStore.isMobile` 实现响应式断点
- 搭建 Vitest 测试基础设施，编写组件单元测试
- **BREAKING**: 移除所有 Naive UI 组件引用，不再兼容 Naive UI 版本

## Impact

- Affected specs: 用户管理模块的表格展示、搜索筛选、新增/编辑操作
- Affected code:
  - `src/views/manage/user/index.vue` — 主页面重写
  - `src/views/manage/user/modules/user-search.vue` — 搜索组件重写
  - `src/views/manage/user/modules/user-operate-drawer.vue` — 操作抽屉重写
  - `src/hooks/common/table.ts` — 新增 `useVuetifyPaginatedTable` hook
  - `src/components/advanced/table-header-operation.vue` — 重写为 Vuetify 版本
  - `src/components/advanced/table-column-setting.vue` — 重写为 Vuetify 版本

## ADDED Requirements

### Requirement: Vuetify 4 数据表格

系统 SHALL 使用 Vuetify 4 的 `VDataTable` 组件展示用户列表数据，支持远程分页、排序、行选择和列配置。

#### Scenario: 表格数据加载

- **WHEN** 用户进入用户管理页面
- **THEN** 系统自动调用 API 获取用户列表数据并展示在 `VDataTable` 中

#### Scenario: 分页切换

- **WHEN** 用户点击分页控件切换页码或每页条数
- **THEN** 系统使用 Vuetify `useDisplay()` 判断设备类型，移动端显示精简分页，桌面端显示完整分页

#### Scenario: 行选择与批量删除

- **WHEN** 用户勾选表格行并点击批量删除
- **THEN** 系统弹出确认对话框，确认后执行删除操作

### Requirement: Vuetify 4 搜索表单

系统 SHALL 使用 Vuetify 4 的 `VForm`、`VTextField`、`VSelect`、`VExpansionPanels` 组件实现搜索筛选功能。

#### Scenario: 搜索筛选

- **WHEN** 用户在搜索面板中填写条件并点击搜索
- **THEN** 系统验证输入后触发搜索事件，父组件重新加载数据

#### Scenario: 重置搜索

- **WHEN** 用户点击重置按钮
- **THEN** 系统恢复搜索表单为默认值并清除验证状态

### Requirement: Vuetify 4 操作抽屉

系统 SHALL 使用 Vuetify 4 的 `VNavigationDrawer` 组件实现用户新增/编辑操作面板。

#### Scenario: 新增用户

- **WHEN** 用户点击新增按钮
- **THEN** 系统打开右侧抽屉，显示空白表单，标题为"新增用户"

#### Scenario: 编辑用户

- **WHEN** 用户点击表格行的编辑按钮
- **THEN** 系统打开右侧抽屉，表单填充该行数据，标题为"编辑用户"

#### Scenario: 提交表单

- **WHEN** 用户填写表单并点击确认
- **THEN** 系统验证表单，验证通过后提交数据、关闭抽屉并刷新列表

### Requirement: 响应式布局

系统 SHALL 使用 Vuetify 4 的 `VRow`/`VCol` 网格系统和 `useDisplay()` composable 实现响应式布局。

#### Scenario: 桌面端显示

- **WHEN** 屏幕宽度 >= 960px（md 断点）
- **THEN** 表格完整展示所有列，搜索表单使用多列网格布局，抽屉宽度固定 400px

#### Scenario: 平板端显示

- **WHEN** 屏幕宽度在 600px-959px 之间（sm 断点）
- **THEN** 表格支持横向滚动，搜索表单使用双列布局，抽屉宽度自适应

#### Scenario: 移动端显示

- **WHEN** 屏幕宽度 < 600px（xs 断点）
- **THEN** 表格精简分页，搜索表单使用单列布局，抽屉全屏展示

### Requirement: Vuetify 分页表格 Hook

系统 SHALL 提供 `useVuetifyPaginatedTable` composable，封装 Vuetify `VDataTable` 所需的分页、列配置和数据加载逻辑。

#### Scenario: Hook 初始化

- **WHEN** 组件调用 `useVuetifyPaginatedTable`
- **THEN** 返回 Vuetify 格式的 `headers`、`serverItems`、`loading`、`search`、`itemsLength`、`columnChecks`、`getData`、`getDataByPage` 等响应式属性和方法

### Requirement: Vuetify 版 TableHeaderOperation

系统 SHALL 提供 Vuetify 版本的 `TableHeaderOperation` 组件，使用 `VBtn`、`VDialog` 等组件实现表格头部操作按钮。

#### Scenario: 操作按钮交互

- **WHEN** 用户点击新增/删除/刷新按钮
- **THEN** 系统触发对应事件，删除操作弹出 `VDialog` 确认对话框

### Requirement: 单元测试

系统 SHALL 使用 Vitest + @vue/test-utils 为重写后的组件编写单元测试。

#### Scenario: 组件渲染测试

- **WHEN** 运行测试命令
- **THEN** 所有组件能正确挂载并渲染，关键交互逻辑通过测试

## MODIFIED Requirements

### Requirement: 表格列渲染

原 Naive UI 的 TSX 渲染函数（`NTag`、`NButton`、`NPopconfirm`）需改为 Vuetify 4 的 `VChip`、`VBtn`、`VDialog` 实现。列定义格式从 `NaiveUI.TableColumn` 改为 Vuetify `VDataTable` 的 headers + slot 模式。

### Requirement: 表单验证

原 `useNaiveForm` 已删除，需使用已有的 `useVuetifyForm` 替代。表单规则从 Naive UI 格式迁移为 Vuetify `ValidationRule` 格式（已在 `useFormRules` 中完成）。

### Requirement: 确认删除交互

原 `NPopconfirm` 气泡确认改为 `VDialog` 模态确认对话框，交互方式从气泡弹出变为居中弹窗。

## REMOVED Requirements

### Requirement: Naive UI 组件依赖

**Reason**: 项目全面迁移至 Vuetify 4，Naive UI 组件不再使用
**Migration**: 所有 `N*` 前缀组件替换为 `V*` 前缀的 Vuetify 4 对应组件
