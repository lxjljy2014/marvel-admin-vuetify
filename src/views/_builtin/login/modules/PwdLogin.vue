<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { loginModuleRecord } from '@/constants/app';
import { useAuthStore } from '@/stores/modules/auth';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useVuetifyForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'PwdLogin'
});

const authStore = useAuthStore();
const { toggleLoginModule } = useRouterPush();
const { valid, formRef, validate } = useVuetifyForm();
const { formRules } = useFormRules();

interface FormModel {
  userName: string;
  password: string;
}

const model: FormModel = reactive({
  userName: 'Soybean',
  password: '123456'
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  return {
    userName: formRules.userName,
    password: formRules.pwd
  };
});

async function handleSubmit() {
  await validate();

  if (valid.value) {
    await authStore.login(model.userName, model.password);
  }
}

type AccountKey = 'super' | 'admin' | 'user';

interface Account {
  key: AccountKey;
  label: string;
  userName: string;
  password: string;
}

const accounts = computed<Account[]>(() => [
  {
    key: 'super',
    label: $t('page.login.pwdLogin.superAdmin'),
    userName: 'Super',
    password: '123456'
  },
  {
    key: 'admin',
    label: $t('page.login.pwdLogin.admin'),
    userName: 'Admin',
    password: '123456'
  },
  {
    key: 'user',
    label: $t('page.login.pwdLogin.user'),
    userName: 'User',
    password: '123456'
  }
]);

async function handleAccountLogin(account: Account) {
  await authStore.login(account.userName, account.password);
}

const showPassword = ref(false);
</script>

<template>
  <VForm ref="formRef" v-model="valid" @keyup.enter="handleSubmit">
    <VTextField
      v-model="model.userName"
      :placeholder="$t('page.login.common.userNamePlaceholder')"
      label="用户名"
      :rules="rules.userName"
      variant="outlined"
      density="comfortable"
      prepend-inner-icon="mdi-account"
      class="mb-2"
      color="primary"
    />

    <VTextField
      v-model="model.password"
      :placeholder="$t('page.login.common.passwordPlaceholder')"
      label="密码"
      :rules="rules.password"
      :type="showPassword ? 'text' : 'password'"
      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      variant="outlined"
      density="comfortable"
      prepend-inner-icon="mdi-lock"
      color="primary"
      @click:append-inner="showPassword = !showPassword"
    />

    <div class="flex items-center justify-between mb-4">
      <VCheckbox color="primary" :label="$t('page.login.pwdLogin.rememberMe')" hide-details density="compact" />
      <VBtn variant="text" color="primary" size="small" @click="toggleLoginModule('reset-pwd')">
        {{ $t('page.login.pwdLogin.forgetPassword') }}
      </VBtn>
    </div>

    <VBtn :loading="authStore.loginLoading" color="primary" size="large" block rounded @click="handleSubmit">
      {{ $t('common.confirm') }}
    </VBtn>

    <div class="flex items-center justify-between mt-4 gap-3">
      <VBtn variant="text" class="flex-1" border="thin" @click="toggleLoginModule('code-login')">
        {{ $t(loginModuleRecord['code-login']) }}
      </VBtn>
      <VBtn variant="text" class="flex-1" border="sm" @click="toggleLoginModule('register')">
        {{ $t(loginModuleRecord.register) }}
      </VBtn>
    </div>

    <VDivider class="my-6">
      <template #default>
        <span class="text-sm text-gray-500">
          {{ $t('page.login.pwdLogin.otherAccountLogin') }}
        </span>
      </template>
    </VDivider>

    <div class="flex items-center justify-center gap-3">
      <VBtn
        v-for="item in accounts"
        :key="item.key"
        color="primary"
        variant="elevated"
        @click="handleAccountLogin(item)"
      >
        {{ item.label }}
      </VBtn>
    </div>
  </VForm>
</template>

<style scoped></style>
