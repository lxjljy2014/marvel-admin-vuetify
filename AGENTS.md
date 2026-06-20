# Project Rules

## General

- Follow the existing code style and patterns.
- Use pnpm for running project commands.
- Keep code in TypeScript unless migration is required.

## Styling

- 样式统一使用 UnoCSS 工具类，不使用 Vuetify 内置的工具类。
- 常见 Vuetify → UnoCSS 替换对照：

  | Vuetify                                   | UnoCSS                                    | 说明                                                       |
  | ----------------------------------------- | ----------------------------------------- | ---------------------------------------------------------- |
  | `d-flex`                                  | `flex`                                    | 弹性布局                                                   |
  | `d-inline-flex`                           | `inline-flex`                             | 行内弹性布局                                               |
  | `d-none` / `d-block`                      | `hidden` / `block`                        | 显示/隐藏                                                  |
  | `flex-column`                             | `flex-col`                                | 纵向排列                                                   |
  | `ga-{n}`                                  | `gap-{n}`                                 | 间距（注意值映射：Vuetify `ga-2`=8px, UnoCSS `gap-2`=8px） |
  | `pa-{n}` / `ma-{n}`                       | `p-{n}` / `m-{n}`                         | 全方向内/外边距（Vuetify 4px基数, UnoCSS 4px基数，值一致） |
  | `px-{n}` / `py-{n}`                       | `px-{n}` / `py-{n}`                       | 水平/垂直内边距（值一致）                                  |
  | `mx-{n}` / `my-{n}`                       | `mx-{n}` / `my-{n}`                       | 水平/垂直外边距（值一致）                                  |
  | `pt-{n}` / `pb-{n}` / `pl-{n}` / `pr-{n}` | `pt-{n}` / `pb-{n}` / `pl-{n}` / `pr-{n}` | 单方向内边距（值一致）                                     |
  | `mt-{n}` / `mb-{n}` / `ml-{n}` / `mr-{n}` | `mt-{n}` / `mb-{n}` / `ml-{n}` / `mr-{n}` | 单方向外边距（值一致）                                     |
  | `align-center`                            | `items-center`                            | 垂直居中                                                   |
  | `align-start` / `align-end`               | `items-start` / `items-end`               | 垂直对齐                                                   |
  | `justify-center`                          | `justify-center`                          | 水平居中（一致）                                           |
  | `justify-space-between`                   | `justify-between`                         | 两端对齐                                                   |
  | `justify-space-around`                    | `justify-around`                          | 等间距对齐                                                 |
  | `justify-end`                             | `justify-end`                             | 末尾对齐（一致）                                           |
  | `text-h1`~`text-h6`                       | `text-{size} font-{weight}`               | 标题排版（如 `text-h6` → `text-xl font-medium`）           |
  | `text-body-1`~`text-body-2`               | `text-{size}`                             | 正文排版                                                   |
  | `text-caption`                            | `text-xs`                                 | 说明文字                                                   |
  | `rounded-{n}`                             | `rounded-{n}`                             | 圆角（项目已通过 UnoCSS shortcuts 映射）                   |

- Vuetify 组件的 props（如 `variant`、`density`、`color`、`size`）仍正常使用，仅样式类需替换。
- 项目自定义的 UnoCSS shortcuts 优先使用：`flex-center`、`flex-y-center`、`flex-x-center`、`flex-col`、`flex-col-stretch`、`flex-1-hidden`、`card-wrapper` 等。

## Stack

- Framework: Vue 3 + Vite
- UI Library: Vuetify
- Enabled Features: ESLint, Vuetify MCP, Pinia, Vue I18n, Vue Router, UnoCSS + Wind4
