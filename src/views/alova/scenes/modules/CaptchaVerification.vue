<script setup lang="ts">
import { computed } from 'vue';
import { actionDelegationMiddleware, useCaptcha, useForm } from '@sa/alova/client';
import { useFormRules, useVuetifyForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { sendCaptcha, verifyCaptcha } from '@/service-alova/api';

defineOptions({
  name: 'CaptchaVerification'
});

const { loading, send, countdown } = useCaptcha(sendCaptcha, {
  middleware: actionDelegationMiddleware('captcha:send')
});
const label = computed(() => {
  return countdown.value > 0
    ? $t('page.login.codeLogin.reGetCode', { time: countdown.value })
    : $t('page.login.codeLogin.getCode');
});
const {
  form,
  loading: submiting,
  send: submit
} = useForm(formData => verifyCaptcha(formData.phone, formData.code), {
  initialForm: {
    phone: '',
    code: ''
  }
});

const { formRef, valid, validate } = useVuetifyForm();

const rules = computed<Record<keyof typeof form.value, App.Global.FormRule[]>>(() => {
  const { formRules } = useFormRules();

  return {
    phone: formRules.phone,
    code: formRules.code
  };
});

async function handleSubmit() {
  await validate();
  if (valid.value) {
    await submit();
    window.$message?.success($t('page.login.common.validateSuccess'));
  }
}
</script>

<template>
  <VForm ref="formRef" v-model="valid" @keyup.enter="handleSubmit">
    <VTextField
      v-model="form.phone"
      :placeholder="$t('page.login.common.phonePlaceholder')"
      :maxlength="11"
      :rules="rules.phone"
      variant="outlined"
      density="comfortable"
      color="primary"
      class="mb-2"
    />
    <div class="flex items-center gap-4 mb-4">
      <VTextField
        v-model="form.code"
        :placeholder="$t('page.login.common.codePlaceholder')"
        :rules="rules.code"
        variant="outlined"
        density="comfortable"
        color="primary"
        class="flex-1 mb-2"
      >
        <template #append>
          <VBtn
            size="large"
            :disabled="countdown > 0"
            :loading="loading"
            variant="outlined"
            height="48"
            @click="send(form.phone)"
          >
            {{ label }}
          </VBtn>
        </template>
      </VTextField>
    </div>
    <div class="flex flex-col gap-18px w-full">
      <VBtn color="primary" size="large" rounded="pill" block :loading="submiting" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </VBtn>
    </div>
  </VForm>
</template>
