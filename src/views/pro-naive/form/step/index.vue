<script setup lang="ts">
import { ref } from 'vue';
import { $t } from '@/locales';

const step = ref(1);
const submitting = ref(false);
const { formRef: formRef1, valid: valid1, validate: validate1 } = useVuetifyForm();
const { formRef: formRef2, valid: valid2, validate: validate2 } = useVuetifyForm();

interface Step1Form {
  form1Field: string;
}

interface Step2Form {
  form2Field: string;
}

const step1Form = ref<Step1Form>({ form1Field: '' });
const step2Form = ref<Step2Form>({ form2Field: '' });

function delay(time: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, time);
  });
}

async function toNextStep() {
  await validate1();
  if (valid1.value) {
    step.value = 2;
  }
}

function toPrevStep() {
  step.value = 1;
}

async function handleSubmit() {
  await validate2();
  if (valid2.value) {
    submitting.value = true;
    await delay(1000);
    window.$message?.success(
      JSON.stringify({
        ...step1Form.value,
        ...step2Form.value
      })
    );
    submitting.value = false;
  }
}

function useVuetifyForm() {
  const formRef = ref<any>(null);
  const valid = ref<boolean | null>(null);

  async function validate() {
    await formRef.value?.validate();
  }

  return {
    formRef,
    valid,
    validate
  };
}
</script>

<template>
  <div>
    <VCard :title="$t('page.proNaive.form.step.title')">
      <VCardText>
        <div class="flex flex-col items-center">
          <VStepper
            v-model="step"
            :items="[
              { title: $t('page.proNaive.form.step.step1.title'), value: 1 },
              { title: $t('page.proNaive.form.step.step2.title'), value: 2 }
            ]"
            class="mb-8"
            style="max-width: 60%"
          />

          <template v-if="step === 1">
            <VForm ref="formRef1" v-model="valid1" style="width: 100%; max-width: 500px">
              <VTextField
                v-model="step1Form.form1Field"
                :label="$t('page.proNaive.form.step.step1.field')"
                :rules="[v => !!v || 'Required']"
                variant="outlined"
                density="comfortable"
                class="mb-4"
              />
              <VBtn color="primary" @click="toNextStep">
                {{ $t('page.proNaive.form.step.step1.nextStep') }}
              </VBtn>
            </VForm>
          </template>

          <template v-if="step === 2">
            <VForm ref="formRef2" v-model="valid2" style="width: 100%; max-width: 500px">
              <VTextField
                v-model="step2Form.form2Field"
                :label="$t('page.proNaive.form.step.step2.field')"
                :rules="[v => !!v || 'Required']"
                variant="outlined"
                density="comfortable"
                class="mb-4"
              />
              <div class="flex gap-4">
                <VBtn :disabled="submitting" @click="toPrevStep">
                  {{ $t('page.proNaive.form.step.step2.prevStep') }}
                </VBtn>
                <VBtn color="primary" :loading="submitting" @click="handleSubmit">
                  {{ $t('page.proNaive.form.step.step2.submit') }}
                </VBtn>
              </div>
            </VForm>
          </template>
        </div>
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped></style>
