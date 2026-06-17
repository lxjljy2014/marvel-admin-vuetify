<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
import { jsonClone } from '@sa/utils';
import { enableStatusOptions } from '@/constants/business';
import { useFormRules, useVuetifyForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import MenuAuthModal from './MenuAuthModal.vue';
import ButtonAuthModal from './ButtonAuthModal.vue';

defineOptions({
  name: 'RoleOperateDrawer'
});

type TableOperateType = 'add' | 'edit';

interface Props {
  operateType: TableOperateType;
  rowData?: Api.SystemManage.Role | null;
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

const menuAuthVisible = ref(false);
const buttonAuthVisible = ref(false);

const title = computed(() => {
  const titles: Record<TableOperateType, string> = {
    add: $t('page.manage.role.addRole'),
    edit: $t('page.manage.role.editRole')
  };
  return titles[props.operateType];
});

type Model = Pick<Api.SystemManage.Role, 'roleName' | 'roleCode' | 'roleDesc' | 'status'>;

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    roleName: '',
    roleCode: '',
    roleDesc: '',
    status: null
  };
}

type RuleKey = Exclude<keyof Model, 'roleDesc'>;

const rules: Record<RuleKey, App.Global.FormRule[]> = {
  roleName: [defaultRequiredRule],
  roleCode: [defaultRequiredRule],
  status: [defaultRequiredRule]
};

const roleId = computed(() => props.rowData?.id || -1);

const isEdit = computed(() => props.operateType === 'edit');

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
  }
});
</script>

<template>
  <Teleport to="#add-navigation-drawer">
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
          v-model="model.roleName"
          :label="$t('page.manage.role.roleName')"
          :placeholder="$t('page.manage.role.form.roleName')"
          :rules="rules.roleName"
          variant="outlined"
          density="comfortable"
          class="mb-2"
        />

        <VTextField
          v-model="model.roleCode"
          :label="$t('page.manage.role.roleCode')"
          :placeholder="$t('page.manage.role.form.roleCode')"
          :rules="rules.roleCode"
          variant="outlined"
          density="comfortable"
          class="mb-2"
        />

        <VRadioGroup
          v-model="model.status"
          :label="$t('page.manage.role.roleStatus')"
          :rules="rules.status"
          density="compact"
          class="mb-2"
        >
          <VRadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
        </VRadioGroup>

        <VTextField
          v-model="model.roleDesc"
          :label="$t('page.manage.role.roleDesc')"
          :placeholder="$t('page.manage.role.form.roleDesc')"
          variant="outlined"
          density="comfortable"
          class="mb-2"
        />

        <div v-if="isEdit" class="flex gap-2">
          <VBtn variant="outlined" @click="menuAuthVisible = true">{{ $t('page.manage.role.menuAuth') }}</VBtn>
          <MenuAuthModal v-model:visible="menuAuthVisible" :role-id="roleId" />
          <VBtn variant="outlined" @click="buttonAuthVisible = true">{{ $t('page.manage.role.buttonAuth') }}</VBtn>
          <ButtonAuthModal v-model:visible="buttonAuthVisible" :role-id="roleId" />
        </div>
      </VForm>

      <template #append>
        <VDivider />
        <div class="flex gap-4 justify-end p-4">
          <VBtn variant="text" @click="closeDrawer">{{ $t('common.cancel') }}</VBtn>
          <VBtn color="primary" variant="flat" @click="handleSubmit">{{ $t('common.confirm') }}</VBtn>
        </div>
      </template>
    </VNavigationDrawer>
  </Teleport>
</template>

<style scoped></style>
