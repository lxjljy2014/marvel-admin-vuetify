<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';
import { useFormRules, useVuetifyForm } from '@/hooks/common/form';

defineOptions({
  name: 'ResetPwd'
});

const { toggleLoginModule } = useRouterPush();
const { valid, formRef, validate } = useVuetifyForm();
const { formRules, createConfirmPwdRule } = useFormRules();

interface FormModel {
  phone: string;
  code: string;
  password: string;
  confirmPassword: string;
}

const model: FormModel = reactive({
  phone: '',
  code: '',
  password: '',
  confirmPassword: ''
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
type RuleRecord = Partial<Record<keyof FormModel, App.Global.FormRule[]>>;
const rules = computed<RuleRecord>(() => {
  return {
    phone: formRules.phone,
    code: formRules.code,
    password: formRules.pwd,
    confirmPassword: createConfirmPwdRule(model.password)
  };
});

async function handleSubmit() {
  await validate();
  if (valid.value) {
    window.$message?.success($t('page.login.common.validateSuccess'));
  }
}
</script>

<template>
  <VForm ref="formRef" v-model="valid" @keyup.enter="handleSubmit">
    <VTextField
      v-model="model.phone"
      :placeholder="$t('page.login.common.phonePlaceholder')"
      label="手机号"
      :rules="rules.phone"
      variant="outlined"
      density="comfortable"
      prepend-inner-icon="mdi-phone"
      class="mb-2"
      color="primary"
    />

    <VTextField
      v-model="model.code"
      :placeholder="$t('page.login.common.codePlaceholder')"
      label="验证码"
      :rules="rules.code"
      variant="outlined"
      density="comfortable"
      prepend-inner-icon="mdi-shield-key"
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
      autocomplete="new-password"
      class="mb-2"
      color="primary"
      @click:append-inner="showPassword = !showPassword"
    />

    <VTextField
      v-model="model.confirmPassword"
      :placeholder="$t('page.login.common.confirmPasswordPlaceholder')"
      label="确认密码"
      :rules="rules.confirmPassword"
      :type="showConfirmPassword ? 'text' : 'password'"
      :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
      variant="outlined"
      density="comfortable"
      prepend-inner-icon="mdi-lock-check"
      validate-on="input lazy"
      class="mb-2"
      color="primary"
      @click:append-inner="showConfirmPassword = !showConfirmPassword"
    />

    <div class="flex flex-col gap-4">
      <VBtn color="primary" size="large" rounded block @click="handleSubmit">
        {{ $t('common.confirm') }}
      </VBtn>
      <VBtn variant="text" border="sm" size="large" rounded block @click="toggleLoginModule('pwd-login')">
        {{ $t('page.login.common.back') }}
      </VBtn>
    </div>
  </VForm>
</template>

<style scoped></style>
