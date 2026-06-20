<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { enableStatusOptions, menuIconTypeOptions, menuTypeOptions } from '@/constants/business';
import { fetchGetAllRoles } from '@/service/api';
import { useFormRules, useVuetifyForm } from '@/hooks/common/form';
import { getLocalIcons } from '@/utils/icon';
import { $t } from '@/locales';
import SvgIcon from '@/components/custom/SvgIcon.vue';
import { getLayoutAndPage, getPathParamFromRoutePath, getRoutePathByRouteName } from './shared';

defineOptions({
  name: 'MenuOperateModal'
});

export type OperateType = 'add' | 'edit' | 'addChild';

interface Props {
  operateType: OperateType;
  rowData?: Api.SystemManage.Menu | null;
  allPages: string[];
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, valid, validate, restoreValidation } = useVuetifyForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<OperateType, string> = {
    add: $t('page.manage.menu.addMenu'),
    addChild: $t('page.manage.menu.addChildMenu'),
    edit: $t('page.manage.menu.editMenu')
  };
  return titles[props.operateType];
});

type Model = Pick<
  Api.SystemManage.Menu,
  | 'menuType'
  | 'menuName'
  | 'routeName'
  | 'routePath'
  | 'component'
  | 'order'
  | 'i18nKey'
  | 'icon'
  | 'iconType'
  | 'status'
  | 'parentId'
  | 'keepAlive'
  | 'constant'
  | 'href'
  | 'hideInMenu'
  | 'activeMenu'
  | 'multiTab'
  | 'fixedIndexInTab'
> & {
  query: NonNullable<Api.SystemManage.Menu['query']>;
  buttons: NonNullable<Api.SystemManage.Menu['buttons']>;
  layout: string;
  page: string;
  pathParam: string;
};

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    menuType: '1',
    menuName: '',
    routeName: '',
    routePath: '',
    pathParam: '',
    component: '',
    layout: '',
    page: '',
    i18nKey: null,
    icon: '',
    iconType: '1',
    parentId: 0,
    status: '1',
    keepAlive: false,
    constant: false,
    order: 0,
    href: null,
    hideInMenu: false,
    activeMenu: null,
    multiTab: false,
    fixedIndexInTab: null,
    query: [],
    buttons: []
  };
}

type RuleKey = Extract<keyof Model, 'menuName' | 'status' | 'routeName' | 'routePath'>;

const rules: Record<RuleKey, App.Global.FormRule[]> = {
  menuName: [defaultRequiredRule],
  status: [defaultRequiredRule],
  routeName: [defaultRequiredRule],
  routePath: [defaultRequiredRule]
};

const disabledMenuType = computed(() => props.operateType === 'edit');

const localIcons = getLocalIcons();
const localIconOptions = localIcons.map(item => ({
  label: item,
  value: item
}));

const showLayout = computed(() => model.value.parentId === 0);

const showPage = computed(() => model.value.menuType === '2');

const pageOptions = computed(() => {
  const allPages = [...props.allPages];

  if (model.value.routeName && !allPages.includes(model.value.routeName)) {
    allPages.unshift(model.value.routeName);
  }

  const opts: CommonType.Option[] = allPages.map(page => ({
    label: page,
    value: page
  }));

  return opts;
});

const layoutOptions: CommonType.Option[] = [
  {
    label: 'base',
    value: 'base'
  },
  {
    label: 'blank',
    value: 'blank'
  }
];

const roleOptions = ref<CommonType.Option<string>[]>([]);

async function getRoleOptions() {
  const { error, data } = await fetchGetAllRoles();

  if (!error) {
    const options = data.map(item => ({
      label: item.roleName,
      value: item.roleCode
    }));

    roleOptions.value = [...options];
  }
}

function handleInitModel() {
  model.value = createDefaultModel();

  if (!props.rowData) return;

  if (props.operateType === 'addChild') {
    const { id } = props.rowData;

    Object.assign(model.value, { parentId: id });
  }

  if (props.operateType === 'edit') {
    const { component, ...rest } = props.rowData;

    const { layout, page } = getLayoutAndPage(component);
    const { path, param } = getPathParamFromRoutePath(rest.routePath);

    Object.assign(model.value, rest, { layout, page, routePath: path, pathParam: param });
  }

  if (!model.value.query) {
    model.value.query = [];
  }
  if (!model.value.buttons) {
    model.value.buttons = [];
  }
}

function closeDrawer() {
  visible.value = false;
}

function handleUpdateRoutePathByRouteName() {
  if (model.value.routeName) {
    model.value.routePath = getRoutePathByRouteName(model.value.routeName);
  } else {
    model.value.routePath = '';
  }
}

function handleUpdateI18nKeyByRouteName() {
  if (model.value.routeName) {
    model.value.i18nKey = `route.${model.value.routeName}` as App.I18n.I18nKey;
  } else {
    model.value.i18nKey = null;
  }
}

function handleCreateButton() {
  const buttonItem: Api.SystemManage.MenuButton = {
    code: '',
    desc: ''
  };

  return buttonItem;
}

function addQueryItem() {
  model.value.query.push({ key: '', value: '' });
}

function removeQueryItem(index: number) {
  model.value.query.splice(index, 1);
}

function addButtonItem() {
  model.value.buttons.push(handleCreateButton());
}

function removeButtonItem(index: number) {
  model.value.buttons.splice(index, 1);
}

async function handleSubmit() {
  await validate();
  if (valid.value) {
    window.$message?.success($t('common.updateSuccess'));
    closeDrawer();
    emit('submitted');
  }
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
    getRoleOptions();
  }
});

watch(
  () => model.value.routeName,
  () => {
    handleUpdateRoutePathByRouteName();
    handleUpdateI18nKeyByRouteName();
  }
);
</script>

<template>
  <VDialog v-model="visible" :max-width="800">
    <VCard :title="title">
      <VCardText class="overflow-y-auto" style="max-height: 480px">
        <VForm ref="formRef" v-model="valid">
          <VRow>
            <VCol cols="12" sm="6">
              <VRadioGroup
                v-model="model.menuType"
                :label="$t('page.manage.menu.menuType')"
                :rules="rules.menuName"
                density="compact"
                :disabled="disabledMenuType"
              >
                <VRadio v-for="item in menuTypeOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
              </VRadioGroup>
            </VCol>
            <VCol cols="12" sm="6">
              <VTextField
                v-model="model.menuName"
                :label="$t('page.manage.menu.menuName')"
                :placeholder="$t('page.manage.menu.form.menuName')"
                :rules="rules.menuName"
                variant="outlined"
                density="comfortable"
              />
            </VCol>
            <VCol cols="12" sm="6">
              <VTextField
                v-model="model.routeName"
                :label="$t('page.manage.menu.routeName')"
                :placeholder="$t('page.manage.menu.form.routeName')"
                :rules="rules.routeName"
                variant="outlined"
                density="comfortable"
              />
            </VCol>
            <VCol cols="12" sm="6">
              <VTextField
                v-model="model.routePath"
                :label="$t('page.manage.menu.routePath')"
                :placeholder="$t('page.manage.menu.form.routePath')"
                :rules="rules.routePath"
                disabled
                variant="outlined"
                density="comfortable"
              />
            </VCol>
            <VCol cols="12" sm="6">
              <VTextField
                v-model="model.pathParam"
                :label="$t('page.manage.menu.pathParam')"
                :placeholder="$t('page.manage.menu.form.pathParam')"
                variant="outlined"
                density="comfortable"
              />
            </VCol>
            <VCol v-if="showLayout" cols="12" sm="6">
              <VSelect
                v-model="model.layout"
                :label="$t('page.manage.menu.layout')"
                :placeholder="$t('page.manage.menu.form.layout')"
                :items="layoutOptions"
                item-title="label"
                item-value="value"
                variant="outlined"
                density="comfortable"
              />
            </VCol>
            <VCol v-if="showPage" cols="12" sm="6">
              <VSelect
                v-model="model.page"
                :label="$t('page.manage.menu.page')"
                :placeholder="$t('page.manage.menu.form.page')"
                :items="pageOptions"
                item-title="label"
                item-value="value"
                variant="outlined"
                density="comfortable"
              />
            </VCol>
            <VCol cols="12" sm="6">
              <VTextField
                v-model="model.i18nKey"
                :label="$t('page.manage.menu.i18nKey')"
                :placeholder="$t('page.manage.menu.form.i18nKey')"
                variant="outlined"
                density="comfortable"
              />
            </VCol>
            <VCol cols="12" sm="6">
              <VTextField
                v-model="model.order"
                :label="$t('page.manage.menu.order')"
                :placeholder="$t('page.manage.menu.form.order')"
                type="number"
                variant="outlined"
                density="comfortable"
              />
            </VCol>
            <VCol cols="12" sm="6">
              <VRadioGroup v-model="model.iconType" :label="$t('page.manage.menu.iconTypeTitle')" density="compact">
                <VRadio
                  v-for="item in menuIconTypeOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="$t(item.label)"
                />
              </VRadioGroup>
            </VCol>
            <VCol cols="12" sm="6">
              <VTextField
                v-if="model.iconType === '1'"
                v-model="model.icon"
                :label="$t('page.manage.menu.icon')"
                :placeholder="$t('page.manage.menu.form.icon')"
                variant="outlined"
                density="comfortable"
              >
                <template #append-inner>
                  <SvgIcon v-if="model.icon" :icon="model.icon" class="text-icon" />
                </template>
              </VTextField>
              <VSelect
                v-if="model.iconType === '2'"
                v-model="model.icon"
                :label="$t('page.manage.menu.icon')"
                :placeholder="$t('page.manage.menu.form.localIcon')"
                :items="localIconOptions"
                item-title="label"
                item-value="value"
                variant="outlined"
                density="comfortable"
              >
                <template #item="{ props: itemProps, item }">
                  <VListItem v-bind="itemProps">
                    <template #prepend>
                      <SvgIcon :local-icon="item.value" class="text-icon mr-2" />
                    </template>
                  </VListItem>
                </template>
                <template #selection="{ item }">
                  <div class="flex-y-center gap-2">
                    <SvgIcon :local-icon="item.value" class="text-icon" />
                    <span>{{ item.label }}</span>
                  </div>
                </template>
              </VSelect>
            </VCol>
            <VCol cols="12" sm="6">
              <VRadioGroup
                v-model="model.status"
                :label="$t('page.manage.menu.menuStatus')"
                :rules="rules.status"
                density="compact"
              >
                <VRadio
                  v-for="item in enableStatusOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="$t(item.label)"
                />
              </VRadioGroup>
            </VCol>
            <VCol cols="12" sm="6">
              <VSwitch
                v-model="model.keepAlive"
                :label="$t('page.manage.menu.keepAlive')"
                color="primary"
                density="compact"
                hide-details
              />
            </VCol>
            <VCol cols="12" sm="6">
              <VSwitch
                v-model="model.constant"
                :label="$t('page.manage.menu.constant')"
                color="primary"
                density="compact"
                hide-details
              />
            </VCol>
            <VCol cols="12" sm="6">
              <VTextField
                v-model="model.href"
                :label="$t('page.manage.menu.href')"
                :placeholder="$t('page.manage.menu.form.href')"
                variant="outlined"
                density="comfortable"
              />
            </VCol>
            <VCol cols="12" sm="6">
              <VSwitch
                v-model="model.hideInMenu"
                :label="$t('page.manage.menu.hideInMenu')"
                color="primary"
                density="compact"
                hide-details
              />
            </VCol>
            <VCol v-if="model.hideInMenu" cols="12" sm="6">
              <VSelect
                v-model="model.activeMenu"
                :label="$t('page.manage.menu.activeMenu')"
                :placeholder="$t('page.manage.menu.form.activeMenu')"
                :items="pageOptions"
                item-title="label"
                item-value="value"
                clearable
                variant="outlined"
                density="comfortable"
              />
            </VCol>
            <VCol cols="12" sm="6">
              <VSwitch
                v-model="model.multiTab"
                :label="$t('page.manage.menu.multiTab')"
                color="primary"
                density="compact"
                hide-details
              />
            </VCol>
            <VCol cols="12" sm="6">
              <VTextField
                v-model="model.fixedIndexInTab"
                :label="$t('page.manage.menu.fixedIndexInTab')"
                :placeholder="$t('page.manage.menu.form.fixedIndexInTab')"
                type="number"
                clearable
                variant="outlined"
                density="comfortable"
              />
            </VCol>
            <VCol cols="12">
              <div class="text-body-2 mb-2">{{ $t('page.manage.menu.query') }}</div>
              <VRow v-for="(queryItem, index) in model.query" :key="index" class="mb-2" align="center">
                <VCol cols="5">
                  <VTextField
                    v-model="queryItem.key"
                    :placeholder="$t('page.manage.menu.form.queryKey')"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  />
                </VCol>
                <VCol cols="5">
                  <VTextField
                    v-model="queryItem.value"
                    :placeholder="$t('page.manage.menu.form.queryValue')"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  />
                </VCol>
                <VCol cols="2" class="flex gap-1">
                  <VBtn icon size="x-small" variant="text" @click="addQueryItem">
                    <VIcon size="16">mdi-plus</VIcon>
                  </VBtn>
                  <VBtn icon size="x-small" variant="text" @click="removeQueryItem(index)">
                    <VIcon size="16">mdi-minus</VIcon>
                  </VBtn>
                </VCol>
              </VRow>
              <VBtn size="small" variant="outlined" @click="addQueryItem">
                <VIcon start size="16">mdi-plus</VIcon>
                {{ $t('common.add') }}
              </VBtn>
            </VCol>
            <VCol cols="12">
              <div class="text-body-2 mb-2">{{ $t('page.manage.menu.button') }}</div>
              <VRow v-for="(buttonItem, index) in model.buttons" :key="index" class="mb-2" align="center">
                <VCol cols="5">
                  <VTextField
                    v-model="buttonItem.code"
                    :placeholder="$t('page.manage.menu.form.buttonCode')"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  />
                </VCol>
                <VCol cols="5">
                  <VTextField
                    v-model="buttonItem.desc"
                    :placeholder="$t('page.manage.menu.form.buttonDesc')"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  />
                </VCol>
                <VCol cols="2" class="flex gap-1">
                  <VBtn icon size="x-small" variant="text" @click="addButtonItem">
                    <VIcon size="16">mdi-plus</VIcon>
                  </VBtn>
                  <VBtn icon size="x-small" variant="text" @click="removeButtonItem(index)">
                    <VIcon size="16">mdi-minus</VIcon>
                  </VBtn>
                </VCol>
              </VRow>
              <VBtn size="small" variant="outlined" @click="addButtonItem">
                <VIcon start size="16">mdi-plus</VIcon>
                {{ $t('common.add') }}
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn variant="text" @click="closeDrawer">{{ $t('common.cancel') }}</VBtn>
        <VBtn color="primary" variant="flat" @click="handleSubmit">{{ $t('common.confirm') }}</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped></style>
