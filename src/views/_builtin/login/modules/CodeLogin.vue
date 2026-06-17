<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useRouterPush } from '@/hooks/common/router';
import { useCaptcha } from '@/hooks/business/captcha';
import { useFormRules, useVuetifyForm } from '@/hooks/common/form';

import { $t } from '@/locales';

defineOptions({
  name: 'CodeLogin'
});

const { toggleLoginModule } = useRouterPush();
const { label, isCounting, loading, getCaptcha } = useCaptcha();
const { valid, formRef, validate } = useVuetifyForm();
const { formRules } = useFormRules();

interface FormModel {
  phone: string;
  code: string;
}

const model: FormModel = reactive({
  phone: '',
  code: ''
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  return {
    phone: formRules.phone,
    code: formRules.code
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
      color="primary"
      class="mb-2"
    />

    <div class="flex items-center gap-4 mb-4">
      <VTextField
        v-model="model.code"
        :placeholder="$t('page.login.common.codePlaceholder')"
        label="验证码"
        :rules="rules.code"
        variant="outlined"
        density="comfortable"
        class="flex-1 mb-2"
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
