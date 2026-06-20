<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouterPush } from '@/hooks/common/router';
import { useCaptcha } from '@/hooks/business/captcha';
import { $t } from '@/locales';
import { useFormRules, useVuetifyForm } from '@/hooks/common/form';

defineOptions({
  name: 'Register'
});

const { toggleLoginModule } = useRouterPush();
const { label, isCounting, loading, getCaptcha } = useCaptcha();
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

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
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
    // request to register
    window.$message?.success($t('page.login.common.validateSuccess'));
  }
}
</script>

<template>
  <VForm ref="formRef" v-model="valid" @keyup.enter="handleSubmit">
    <VTextField
      v-model="model.phone"
      :label="$t('page.login.common.phonePlaceholder')"
      :rules="rules.phone"
      variant="outlined"
      density="comfortable"
      prepend-inner-icon="mdi-phone"
      class="mb-2"
      color="primary"
    />

    <div class="flex items-center gap-4">
      <VTextField
        v-model="model.code"
        :placeholder="$t('page.login.common.codePlaceholder')"
        label="验证码"
        :rules="rules.code"
        variant="outlined"
        density="comfortable"
        class="flex-1 mb-2"
        autocomplete="off"
        color="primary"
        prepend-inner-icon="mdi-shield-key"
      >
        <template #append>
          <VBtn
            :disabled="isCounting"
            :loading="loading"
            color="primary"
            variant="outlined"
            height="48"
            @click="getCaptcha(model.phone)"
          >
            {{ label }}
          </VBtn>
        </template>
      </VTextField>
    </div>

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
      autocomplete="new-password"
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
