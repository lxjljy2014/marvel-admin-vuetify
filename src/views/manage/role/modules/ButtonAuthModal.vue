<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { $t } from '@/locales';

defineOptions({
  name: 'ButtonAuthModal'
});

interface Props {
  roleId: number;
}

defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

function closeModal() {
  visible.value = false;
}

const title = computed(() => $t('common.edit') + $t('page.manage.role.buttonAuth'));

type ButtonConfig = {
  id: number;
  label: string;
  code: string;
};

const tree = shallowRef<ButtonConfig[]>([]);

async function getAllButtons() {
  tree.value = [
    { id: 1, label: 'button1', code: 'code1' },
    { id: 2, label: 'button2', code: 'code2' },
    { id: 3, label: 'button3', code: 'code3' },
    { id: 4, label: 'button4', code: 'code4' },
    { id: 5, label: 'button5', code: 'code5' },
    { id: 6, label: 'button6', code: 'code6' },
    { id: 7, label: 'button7', code: 'code7' },
    { id: 8, label: 'button8', code: 'code8' },
    { id: 9, label: 'button9', code: 'code9' },
    { id: 10, label: 'button10', code: 'code10' }
  ];
}

const checks = shallowRef<number[]>([]);

async function getChecks() {
  checks.value = [1, 2, 3, 4, 5];
}

function handleSubmit() {
  window.$message?.success?.($t('common.modifySuccess'));

  closeModal();
}

function init() {
  getAllButtons();
  getChecks();
}

init();
</script>

<template>
  <VDialog v-model="visible" :max-width="480">
    <VCard :title="title">
      <VCardText>
        <div class="h-280px overflow-y-auto">
          <VCheckbox
            v-for="item in tree"
            :key="item.id"
            v-model="checks"
            :value="item.id"
            :label="item.label"
            color="primary"
            density="compact"
            hide-details
          />
        </div>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn variant="text" @click="closeModal">{{ $t('common.cancel') }}</VBtn>
        <VBtn variant="text" @click="handleSubmit">{{ $t('common.confirm') }}</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped></style>
