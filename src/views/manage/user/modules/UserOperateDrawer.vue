<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
import { jsonClone } from '@sa/utils';
import { enableStatusOptions, userGenderOptions } from '@/constants/business';
import { fetchGetAllRoles } from '@/service/api';
import { useFormRules, useVuetifyForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'UserOperateDrawer'
});

type TableOperateType = 'add' | 'edit';

interface Props {
  operateType: TableOperateType;
  rowData?: Api.SystemManage.User | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { mdAndUp } = useDisplay();
const drawerWidth = computed(() => (mdAndUp.value ? 400 : undefined));

const { formRef, valid, validate, restoreValidation } = useVuetifyForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<TableOperateType, string> = {
    add: $t('page.manage.user.addUser'),
    edit: $t('page.manage.user.editUser')
  };
  return titles[props.operateType];
});

type Model = Pick<
  Api.SystemManage.User,
  'userName' | 'userGender' | 'nickName' | 'userPhone' | 'userEmail' | 'userRoles' | 'status'
>;

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    userName: '',
    userGender: null,
    nickName: '',
    userPhone: '',
    userEmail: '',
    userRoles: [],
    status: null
  };
}

type RuleKey = Extract<keyof Model, 'userName' | 'status'>;

const rules: Record<RuleKey, App.Global.FormRule[]> = {
  userName: [defaultRequiredRule],
  status: [defaultRequiredRule]
};

const roleOptions = ref<CommonType.Option<string>[]>([]);

async function getRoleOptions() {
  const { error, data } = await fetchGetAllRoles();

  if (!error) {
    const options = data.map(item => ({
      label: item.roleName,
      value: item.roleCode
    }));

    const userRoleOptions = model.value.userRoles.map(item => ({
      label: item,
      value: item
    }));

    roleOptions.value = [...userRoleOptions, ...options];
  }
}

function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, jsonClone(props.rowData));
  }
}

function closeDrawer() {
  visible.value = false;
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
</script>

<template>
  <VNavigationDrawer v-model="visible" location="right" temporary :width="drawerWidth" :mobile-breakpoint="0">
    <div class="flex items-center p-4">
      <span class="text-xl font-medium">{{ title }}</span>
      <VSpacer />
      <VBtn icon variant="text" @click="closeDrawer">
        <VIcon>mdi-close</VIcon>
      </VBtn>
    </div>

    <VDivider />

    <VForm ref="formRef" v-model="valid" class="p-4 pt-0">
      <VTextField
        v-model="model.userName"
        :label="$t('page.manage.user.userName')"
        :placeholder="$t('page.manage.user.form.userName')"
        :rules="rules.userName"
        variant="outlined"
        density="comfortable"
        class="mb-2"
      />

      <VRadioGroup v-model="model.userGender" :label="$t('page.manage.user.userGender')" density="compact" class="mb-2">
        <VRadio v-for="item in userGenderOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
      </VRadioGroup>

      <VTextField
        v-model="model.nickName"
        :label="$t('page.manage.user.nickName')"
        :placeholder="$t('page.manage.user.form.nickName')"
        variant="outlined"
        density="comfortable"
        class="mb-2"
      />

      <VTextField
        v-model="model.userPhone"
        :label="$t('page.manage.user.userPhone')"
        :placeholder="$t('page.manage.user.form.userPhone')"
        variant="outlined"
        density="comfortable"
        class="mb-2"
      />

      <VTextField
        v-model="model.userEmail"
        :label="$t('page.manage.user.userEmail')"
        :placeholder="$t('page.manage.user.form.userEmail')"
        variant="outlined"
        density="comfortable"
        class="mb-2"
      />

      <VRadioGroup
        v-model="model.status"
        :label="$t('page.manage.user.userStatus')"
        :rules="rules.status"
        density="compact"
        class="mb-2"
      >
        <VRadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
      </VRadioGroup>

      <VSelect
        v-model="model.userRoles"
        :label="$t('page.manage.user.userRole')"
        :placeholder="$t('page.manage.user.form.userRole')"
        :items="roleOptions"
        item-title="label"
        item-value="value"
        multiple
        chips
        variant="outlined"
        density="comfortable"
        class="mb-2"
      />
    </VForm>

    <template #append>
      <VDivider />
      <div class="flex gap-4 justify-end p-4">
        <VBtn variant="text" @click="closeDrawer">{{ $t('common.cancel') }}</VBtn>
        <VBtn color="primary" variant="flat" @click="handleSubmit">{{ $t('common.confirm') }}</VBtn>
      </div>
    </template>
  </VNavigationDrawer>
</template>

<style scoped></style>
