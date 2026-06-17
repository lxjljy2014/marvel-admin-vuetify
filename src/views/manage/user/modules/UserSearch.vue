<script setup lang="ts">
import { computed, ref, toRaw } from 'vue';
import { jsonClone } from '@sa/utils';
import { enableStatusOptions, userGenderOptions } from '@/constants/business';
import { useFormRules, useVuetifyForm } from '@/hooks/common/form';
import { translateOptions } from '@/utils/common';
import { $t } from '@/locales';

defineOptions({
  name: 'UserSearch'
});

interface Emits {
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, valid, validate, restoreValidation } = useVuetifyForm();

const panel = ref(['user-search']);

const model = defineModel<Api.SystemManage.UserSearchParams>('model', { required: true });

type RuleKey = Extract<keyof Api.SystemManage.UserSearchParams, 'userEmail' | 'userPhone'>;

const rules = computed<Record<RuleKey, App.Global.FormRule[]>>(() => {
  const { patternRules } = useFormRules();

  return {
    userEmail: [patternRules.email],
    userPhone: [patternRules.phone]
  };
});

const defaultModel = jsonClone(toRaw(model.value));

function resetModel() {
  Object.assign(model.value, defaultModel);
}

async function reset() {
  await restoreValidation();
  resetModel();
}

async function search() {
  await validate();
  emit('search');
}
</script>

<template>
  <VCard class="card-wrapper">
    <VExpansionPanels v-model="panel" static elevation="0">
      <VExpansionPanel value="user-search">
        <VExpansionPanelTitle>{{ $t('common.search') }}</VExpansionPanelTitle>
        <VExpansionPanelText>
          <VForm ref="formRef" v-model="valid">
            <VRow>
              <VCol cols="12" sm="6" md="3">
                <VTextField
                  v-model="model.userName"
                  :label="$t('page.manage.user.userName')"
                  :placeholder="$t('page.manage.user.form.userName')"
                  variant="outlined"
                  density="compact"
                  clearable
                  color="primary"
                  hide-details
                />
              </VCol>
              <VCol cols="12" sm="6" md="3">
                <VSelect
                  v-model="model.userGender"
                  :label="$t('page.manage.user.userGender')"
                  :placeholder="$t('page.manage.user.form.userGender')"
                  :items="translateOptions(userGenderOptions)"
                  item-title="label"
                  item-value="value"
                  variant="outlined"
                  density="compact"
                  clearable
                  color="primary"
                  hide-details
                />
              </VCol>
              <VCol cols="12" sm="6" md="3">
                <VTextField
                  v-model="model.nickName"
                  :label="$t('page.manage.user.nickName')"
                  :placeholder="$t('page.manage.user.form.nickName')"
                  variant="outlined"
                  density="compact"
                  clearable
                  color="primary"
                  hide-details
                />
              </VCol>
              <VCol cols="12" sm="6" md="3">
                <VTextField
                  v-model="model.userPhone"
                  :label="$t('page.manage.user.userPhone')"
                  :placeholder="$t('page.manage.user.form.userPhone')"
                  :rules="rules.userPhone"
                  variant="outlined"
                  density="compact"
                  clearable
                  color="primary"
                  hide-details
                />
              </VCol>
              <VCol cols="12" sm="6" md="3">
                <VTextField
                  v-model="model.userEmail"
                  :label="$t('page.manage.user.userEmail')"
                  :placeholder="$t('page.manage.user.form.userEmail')"
                  :rules="rules.userEmail"
                  variant="outlined"
                  density="compact"
                  clearable
                  color="primary"
                  hide-details
                />
              </VCol>
              <VCol cols="12" sm="6" md="3">
                <VSelect
                  v-model="model.status"
                  :label="$t('page.manage.user.userStatus')"
                  :placeholder="$t('page.manage.user.form.userStatus')"
                  :items="translateOptions(enableStatusOptions)"
                  item-title="label"
                  item-value="value"
                  variant="outlined"
                  density="compact"
                  clearable
                  color="primary"
                  hide-details
                />
              </VCol>
              <VCol cols="12" sm="6" md="6">
                <div class="flex gap-2 justify-end">
                  <VBtn variant="outlined" @click="reset">
                    <template #prepend>
                      <VIcon icon="mdi-refresh" />
                    </template>
                    {{ $t('common.reset') }}
                  </VBtn>
                  <VBtn variant="outlined" color="primary" @click="search">
                    <template #prepend>
                      <VIcon icon="mdi-magnify" />
                    </template>
                    {{ $t('common.search') }}
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </VCard>
</template>

<style scoped></style>
