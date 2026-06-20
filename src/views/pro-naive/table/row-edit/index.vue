<script setup lang="ts">
import { ref } from 'vue';
import { $t } from '@/locales';

interface DataSourceType {
  id: string;
  title?: string;
  now?: number;
  rate?: number;
}

const editableKeys = ref<string[]>([]);
const tableData = ref<DataSourceType[]>([
  {
    id: '1',
    now: Date.now(),
    rate: 4,
    title: `${$t('page.proNaive.table.rowEdit.task')}1`
  },
  {
    id: '2',
    now: Date.now(),
    rate: 3,
    title: `${$t('page.proNaive.table.rowEdit.task')}2`
  },
  {
    id: '3',
    now: Date.now(),
    rate: 5,
    title: `${$t('page.proNaive.table.rowEdit.task')}3`
  }
]);

const headers = [
  { title: $t('page.proNaive.table.rowEdit.name'), key: 'title', align: 'start' as const, width: 200 },
  { title: $t('page.proNaive.table.rowEdit.time'), key: 'now', align: 'start' as const, width: 200 },
  { title: $t('page.proNaive.table.rowEdit.score'), key: 'rate', align: 'start' as const },
  {
    title: $t('page.proNaive.table.rowEdit.action'),
    key: 'action',
    align: 'start' as const,
    width: 120,
    sortable: false
  }
];

function isEditing(id: string) {
  return editableKeys.value.includes(id);
}

function startEditing(id: string) {
  if (!editableKeys.value.includes(id)) {
    editableKeys.value.push(id);
  }
}

function cancelEditing(id: string) {
  editableKeys.value = editableKeys.value.filter(key => key !== id);
}

function saveRow(id: string) {
  cancelEditing(id);
  window.$message?.success('Saved');
}

function addRow() {
  const newId = Date.now().toString();
  tableData.value.push({
    id: newId,
    now: Date.now(),
    rate: 0,
    title: ''
  });
  startEditing(newId);
}

function deleteRow(index: number) {
  const item = tableData.value[index];
  if (item) {
    cancelEditing(item.id);
    tableData.value.splice(index, 1);
  }
}

function handleReset() {
  tableData.value = [
    {
      id: '1',
      now: Date.now(),
      rate: 4,
      title: `${$t('page.proNaive.table.rowEdit.task')}1`
    },
    {
      id: '2',
      now: Date.now(),
      rate: 3,
      title: `${$t('page.proNaive.table.rowEdit.task')}2`
    },
    {
      id: '3',
      now: Date.now(),
      rate: 5,
      title: `${$t('page.proNaive.table.rowEdit.task')}3`
    }
  ];
  editableKeys.value = [];
}

function handleSubmit() {
  window.$message?.success(JSON.stringify(tableData.value));
}

function formatDate(timestamp: number) {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleString();
}
</script>

<template>
  <div>
    <VCard :title="$t('page.proNaive.table.rowEdit.title')">
      <template #append>
        <div class="flex gap-2">
          <VBtn variant="outlined" @click="handleReset">
            {{ $t('page.proNaive.table.rowEdit.reset') }}
          </VBtn>
          <VBtn color="primary" @click="handleSubmit">
            {{ $t('page.proNaive.table.rowEdit.submit') }}
          </VBtn>
        </div>
      </template>

      <VDataTable :headers="headers" :items="tableData" :items-per-page="-1">
        <template #item.title="{ item, index }">
          <template v-if="isEditing(item.id)">
            <VTextField v-model="tableData[index].title" variant="outlined" density="compact" hide-details />
          </template>
          <template v-else>
            {{ item.title }}
          </template>
        </template>

        <template #item.now="{ item, index }">
          <template v-if="isEditing(item.id)">
            <VTextField
              v-model="tableData[index].now"
              type="datetime-local"
              variant="outlined"
              density="compact"
              hide-details
            />
          </template>
          <template v-else>
            {{ formatDate(item.now || 0) }}
          </template>
        </template>

        <template #item.rate="{ item, index }">
          <template v-if="isEditing(item.id)">
            <VTextField
              v-model.number="tableData[index].rate"
              type="number"
              variant="outlined"
              density="compact"
              hide-details
              min="0"
              max="5"
            />
          </template>
          <template v-else>
            <VRating :model-value="item.rate" readonly density="compact" />
          </template>
        </template>

        <template #item.action="{ item, index }">
          <div class="flex gap-1">
            <template v-if="isEditing(item.id)">
              <VBtn size="small" variant="text" color="primary" @click="saveRow(item.id)">
                {{ $t('page.proNaive.table.rowEdit.save') }}
              </VBtn>
            </template>
            <template v-else>
              <VBtn size="small" variant="text" color="primary" @click="startEditing(item.id)">
                {{ $t('page.proNaive.table.rowEdit.edit') }}
              </VBtn>
              <VBtn size="small" variant="text" color="error" @click="deleteRow(index)">
                {{ $t('page.proNaive.table.rowEdit.delete') }}
              </VBtn>
            </template>
          </div>
        </template>

        <template #top>
          <div class="flex justify-end pa-4">
            <VBtn color="primary" @click="addRow">
              <VIcon start>mdi-plus</VIcon>
              Add Row
            </VBtn>
          </div>
        </template>
      </VDataTable>
    </VCard>
  </div>
</template>

<style scoped></style>
