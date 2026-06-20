<script setup lang="ts">
import { computed, ref } from 'vue';
import { $t } from '@/locales';

interface TableData {
  now: number;
  src: any;
  no: string;
  title: string;
  length: string;
}

const loading = ref(false);
const searchForm = ref<SearchForm>({
  name: '',
  createTime: '',
  responseTime: ''
});

const tableData = ref<TableData[]>([]);
const page = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);

const headers = computed(() => [
  { title: $t('page.proNaive.table.remote.replicableText'), key: 'title', align: 'start' as const },
  { title: $t('page.proNaive.table.remote.tags'), key: 'tags', align: 'start' as const },
  { title: $t('page.proNaive.table.remote.dateFormatting'), key: 'now', align: 'start' as const },
  { title: $t('page.proNaive.table.remote.image'), key: 'src', align: 'start' as const, width: 200 }
]);

interface SearchForm {
  name: string;
  createTime: string;
  responseTime: string;
  [key: string]: string;
}

const searchColumns = computed(() => [
  { title: $t('page.proNaive.table.remote.name'), key: 'name', type: 'text' },
  { title: $t('page.proNaive.table.remote.createTime'), key: 'createTime', type: 'date' },
  { title: $t('page.proNaive.table.remote.responseTime'), key: 'responseTime', type: 'date' }
]);

function fetchList() {
  loading.value = true;
  setTimeout(() => {
    tableData.value = [
      {
        now: Date.now(),
        src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
        no: '3',
        title: 'Wonderwall',
        length: '4:18'
      },
      { now: Date.now(), src: '', no: '', title: "Don't Look Back in Anger", length: '4:48' },
      { now: Date.now(), src: undefined, no: '12', title: 'Champagne Supernova', length: '7:27' },
      { now: Date.now(), src: null, no: '33', title: 'Wonderwall', length: '4:18' },
      { now: Date.now(), src: [], no: '44', title: "Don't Look Back in Anger", length: '4:48' },
      {
        now: Date.now(),
        src: [
          'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
          'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
        ],
        no: '122',
        title: 'Champagne Supernova',
        length: '7:27'
      },
      { now: Date.now(), src: '', no: '333', title: 'Wonderwall', length: '4:18' },
      { now: Date.now(), src: '', no: '4444', title: "Don't Look Back in Anger", length: '4:48' },
      { now: Date.now(), src: '', no: '1222', title: 'Champagne Supernova', length: '7:27' },
      { now: Date.now(), src: '', no: '33333', title: 'Wonderwall', length: '4:18' }
    ];
    totalItems.value = 987;
    loading.value = false;
  }, 1500);
}

function handleSearch() {
  page.value = 1;
  fetchList();
}

function handleReset() {
  searchForm.value = { name: '', createTime: '', responseTime: '' };
  page.value = 1;
  fetchList();
}

function handlePageChange(newPage: number) {
  page.value = newPage;
  fetchList();
}

function handleItemsPerPageChange(newItemsPerPage: number) {
  itemsPerPage.value = newItemsPerPage;
  page.value = 1;
  fetchList();
}

function formatDate(timestamp: number) {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleString();
}

function renderImages(src: any) {
  if (!src) return '';
  if (Array.isArray(src)) {
    return src
      .filter(Boolean)
      .map((url: string) => `<img src="${url}" style="max-width: 100px; max-height: 50px; margin-right: 8px;" />`)
      .join('');
  }
  if (typeof src === 'string' && src) {
    return `<img src="${src}" style="max-width: 100px; max-height: 50px;" />`;
  }
  return '';
}

// Fetch initial data
fetchList();
</script>

<template>
  <div>
    <VCard :title="$t('page.proNaive.table.remote.filterCondition')" class="mb-4">
      <VCardText>
        <VForm @submit.prevent="handleSearch">
          <VRow>
            <VCol v-for="col in searchColumns" :key="col.key" cols="12" sm="6" md="4">
              <VTextField
                v-model="searchForm[col.key]"
                :label="col.title"
                :type="col.type"
                variant="outlined"
                density="comfortable"
              />
            </VCol>
          </VRow>

          <div class="flex gap-2 mt-4">
            <VBtn type="submit" color="primary" :loading="loading">
              {{ $t('common.search') }}
            </VBtn>
            <VBtn variant="outlined" @click="handleReset">
              {{ $t('common.reset') }}
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>

    <VCard :title="$t('page.proNaive.table.remote.title')">
      <VDataTableServer
        :headers="headers"
        :items="tableData"
        :loading="loading"
        :items-length="totalItems"
        :page="page"
        :items-per-page="itemsPerPage"
        @update:page="handlePageChange"
        @update:items-per-page="handleItemsPerPageChange"
      >
        <template #item.title="{ item }">
          <span class="text-primary" style="cursor: pointer">{{ item.title }}</span>
        </template>

        <template #item.tags="{ item }">
          <VChip size="small" color="primary" variant="outlined">
            {{ item.title }}
          </VChip>
        </template>

        <template #item.now="{ item }">
          <span>{{ formatDate(item.now) }}</span>
        </template>

        <template #item.src="{ item }">
          <div v-html="renderImages(item.src)"></div>
        </template>
      </VDataTableServer>
    </VCard>
  </div>
</template>

<style scoped></style>
