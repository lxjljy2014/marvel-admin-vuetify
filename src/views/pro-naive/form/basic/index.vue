<script setup lang="ts">
import { ref } from 'vue';
import { $t } from '@/locales';
import { useFormRules, useVuetifyForm } from '@/hooks/common/form';

const submitting = ref(false);
const { formRef, valid, validate } = useVuetifyForm();
const { defaultRequiredRule } = useFormRules();

interface SpecItem {
  name: string;
  items: Array<{ name: string }>;
}

interface FormModel {
  appName: string;
  appStatus: number | null;
  createTime: number | null;
  responseDate: number | null;
  attributes: SpecItem[];
}

const model = ref<FormModel>({
  appName: '',
  appStatus: null,
  createTime: null,
  responseDate: null,
  attributes: [
    {
      name: $t('page.proNaive.form.basic.color'),
      items: [
        { name: $t('page.proNaive.form.basic.specificationColorRed') },
        { name: $t('page.proNaive.form.basic.specificationColorOrange') }
      ]
    }
  ]
});

const rules = {
  appName: [defaultRequiredRule],
  appStatus: [defaultRequiredRule],
  responseDate: [defaultRequiredRule]
};

function delay(time: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, time);
  });
}

function fillValues() {
  model.value.appName = $t('page.proNaive.form.basic.appName');
  model.value.appStatus = 0;
  model.value.responseDate = Date.now();
}

function addSpecificationItem() {
  model.value.attributes.push({
    name: $t('page.proNaive.form.basic.color'),
    items: [
      { name: $t('page.proNaive.form.basic.specificationColorRed') },
      { name: $t('page.proNaive.form.basic.specificationColorOrange') }
    ]
  });
}

function removeSpecificationItem(index: number) {
  model.value.attributes.splice(index, 1);
}

function addSpecValue(specIndex: number) {
  model.value.attributes[specIndex].items.push({ name: '' });
}

function removeSpecValue(specIndex: number, itemIndex: number) {
  model.value.attributes[specIndex].items.splice(itemIndex, 1);
}

async function handleSubmit() {
  await validate();
  if (valid.value) {
    submitting.value = true;
    await delay(1000);
    window.$message?.success(JSON.stringify(model.value));
    submitting.value = false;
  }
}

function handleReset() {
  model.value = {
    appName: '',
    appStatus: null,
    createTime: null,
    responseDate: null,
    attributes: [
      {
        name: $t('page.proNaive.form.basic.color'),
        items: [
          { name: $t('page.proNaive.form.basic.specificationColorRed') },
          { name: $t('page.proNaive.form.basic.specificationColorOrange') }
        ]
      }
    ]
  };
}
</script>

<template>
  <div>
    <VCard :title="$t('page.proNaive.form.basic.title')">
      <template #append>
        <div class="flex gap-2">
          <VBtn @click="fillValues">{{ $t('page.proNaive.form.basic.fillValue') }}</VBtn>
          <VBtn @click="handleReset">{{ $t('page.proNaive.form.basic.reset') }}</VBtn>
          <VBtn color="primary" :loading="submitting" @click="handleSubmit">
            {{ $t('page.proNaive.form.basic.submit') }}
          </VBtn>
        </div>
      </template>

      <VCardText>
        <VForm ref="formRef" v-model="valid">
          <VRow>
            <VCol cols="12" md="4">
              <VTextField
                v-model="model.appName"
                :label="$t('page.proNaive.form.basic.appName')"
                :rules="rules.appName"
                variant="outlined"
                density="comfortable"
              />
            </VCol>

            <VCol cols="12" md="4">
              <VSelect
                v-model="model.appStatus"
                :label="$t('page.proNaive.form.basic.appStatus')"
                :items="[
                  { title: $t('page.proNaive.form.basic.normal'), value: 0 },
                  { title: $t('page.proNaive.form.basic.anomaly'), value: 1 }
                ]"
                :rules="rules.appStatus"
                variant="outlined"
                density="comfortable"
              />
            </VCol>

            <VCol cols="12" md="4">
              <VTextField
                v-model="model.createTime"
                :label="$t('page.proNaive.form.basic.createTime')"
                type="date"
                variant="outlined"
                density="comfortable"
              />
            </VCol>

            <VCol cols="12" md="4">
              <VTextField
                v-model="model.responseDate"
                :label="$t('page.proNaive.form.basic.responseDate')"
                :rules="rules.responseDate"
                type="datetime-local"
                variant="outlined"
                density="comfortable"
              />
            </VCol>
          </VRow>

          <VDivider class="my-4" />

          <div class="mb-4">
            <h3 class="text-h6 mb-2">{{ $t('page.proNaive.form.basic.specificationInfo') }}</h3>

            <VCard v-for="(spec, specIndex) in model.attributes" :key="specIndex" variant="outlined" class="mb-4">
              <VCardTitle class="flex items-center justify-between">
                <span>{{ $t('page.proNaive.form.basic.specificate') }}{{ specIndex + 1 }}</span>
                <VBtn
                  v-if="model.attributes.length > 1"
                  icon
                  size="small"
                  variant="text"
                  color="error"
                  @click="removeSpecificationItem(specIndex)"
                >
                  <VIcon>mdi-delete</VIcon>
                </VBtn>
              </VCardTitle>

              <VCardText>
                <VTextField
                  v-model="spec.name"
                  :label="$t('page.proNaive.form.basic.specificationName')"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  style="max-width: 230px"
                />

                <div v-for="(item, itemIndex) in spec.items" :key="itemIndex" class="flex items-center gap-2 mb-2">
                  <VTextField v-model="item.name" variant="outlined" density="comfortable" style="max-width: 104px" />
                  <VBtn
                    v-if="spec.items.length > 1"
                    icon
                    size="small"
                    variant="text"
                    color="error"
                    @click="removeSpecValue(specIndex, itemIndex)"
                  >
                    <VIcon>mdi-delete</VIcon>
                  </VBtn>
                </div>

                <VBtn variant="text" color="primary" @click="addSpecValue(specIndex)">
                  {{ $t('page.proNaive.form.basic.add') }}
                </VBtn>
              </VCardText>
            </VCard>

            <VBtn variant="outlined" color="primary" @click="addSpecificationItem">
              {{ $t('page.proNaive.form.basic.addSpecificateItem') }}
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped></style>
