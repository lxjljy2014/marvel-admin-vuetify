<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { jsonClone } from '@sa/utils';
import { enableStatusOptions } from '@/constants/business';
import { useVuetifyForm } from '@/hooks/common/form';
import { translateOptions } from '@/utils/common';
import { $t } from '@/locales';

defineOptions({
  name: 'RoleSearch'
});

interface Emits {
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, valid, validate, restoreValidation } = useVuetifyForm();

const panel = ref([]);

const model = defineModel<Api.SystemManage.RoleSearchParams>('model', { required: true });

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
      <VExpansionPanel value="role-search" :hover="false">
        <VExpansionPanelTitle>{{ $t('common.search') }}</VExpansionPanelTitle>
        <VExpansionPanelText>
          <VForm ref="formRef" v-model="valid">
            <VRow dense>
              <VCol cols="12" sm="6" md="3">
                <VTextField
                  v-model="model.roleName"
                  :label="$t('page.manage.role.roleName')"
                  :placeholder="$t('page.manage.role.form.roleName')"
                  variant="outlined"
                  density="compact"
                  clearable
                  color="primary"
                  hide-details
                />
              </VCol>
              <VCol cols="12" sm="6" md="3">
                <VTextField
                  v-model="model.roleCode"
                  :label="$t('page.manage.role.roleCode')"
                  :placeholder="$t('page.manage.role.form.roleCode')"
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
                  :label="$t('page.manage.role.roleStatus')"
                  :placeholder="$t('page.manage.role.form.roleStatus')"
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
              <VCol cols="12" sm="6" md="3">
                <div class="flex gap-2 justify-end">
                  <VBtn variant="outlined" color="warning" @click="reset">
                    <template #prepend>
                      <VIcon icon="mdi-restore" />
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
