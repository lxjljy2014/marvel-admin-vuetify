<script setup lang="ts">
import { computed, ref } from 'vue';
import { $t } from '@/locales';

const loading = ref(false);
const loading2 = ref(false);
const collapsed = ref(false);

interface SearchForm {
  appName?: string;
  appStatus?: string;
  createTime?: string;
  responseDate?: string;
  endTime?: string;
  [key: string]: string | undefined;
}

const searchForm = ref<SearchForm>({});
const searchForm2 = ref<SearchForm>({});

const searchColumns = computed(() => [
  {
    title: $t('page.proNaive.form.query.appName'),
    key: 'appName',
    type: 'text'
  },
  {
    title: $t('page.proNaive.form.query.createTime'),
    key: 'createTime',
    type: 'date'
  },
  {
    title: $t('page.proNaive.form.query.appStatus'),
    key: 'appStatus',
    type: 'text'
  },
  {
    title: $t('page.proNaive.form.query.responseDate'),
    key: 'responseDate',
    type: 'datetime-local'
  },
  {
    title: $t('page.proNaive.form.query.endDate'),
    key: 'endTime',
    type: 'date'
  }
]);

const searchColumns2 = computed(() => {
  return Array.from({ length: 20 }, (_, i) => ({
    title: `${$t('page.proNaive.form.query.field')}${i}`,
    key: `field${i}`,
    type: 'text'
  }));
});

function delay(time: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, time);
  });
}

async function handleSearch() {
  loading.value = true;
  await delay(1500);
  window.$message?.success(JSON.stringify(searchForm.value));
  loading.value = false;
}

function handleReset() {
  searchForm.value = {};
}

async function handleSearch2() {
  loading2.value = true;
  await delay(1500);
  window.$message?.success(JSON.stringify(searchForm2.value));
  loading2.value = false;
}

function handleReset2() {
  searchForm2.value = {};
}
</script>

<template>
  <div>
    <VCard :title="$t('page.proNaive.form.query.title1')" class="mb-4">
      <VCardText>
        <VForm @submit.prevent="handleSearch">
          <VRow>
            <VCol v-for="col in searchColumns" :key="col.key" cols="12" sm="6" md="4">
              <VTextField
                v-if="col.type === 'text'"
                v-model="searchForm[col.key]"
                :label="col.title"
                variant="outlined"
                density="comfortable"
              />
              <VTextField
                v-else
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

    <VCard :title="$t('page.proNaive.form.query.title2')">
      <VCardText>
        <VForm @submit.prevent="handleSearch2">
          <VRow>
            <VCol
              v-for="col in searchColumns2.slice(0, collapsed ? 4 : searchColumns2.length)"
              :key="col.key"
              cols="12"
              sm="6"
              md="4"
            >
              <VTextField v-model="searchForm2[col.key]" :label="col.title" variant="outlined" density="comfortable" />
            </VCol>
          </VRow>

          <div class="flex gap-2 mt-4">
            <VBtn type="submit" color="primary" :loading="loading2">
              {{ $t('common.search') }}
            </VBtn>
            <VBtn variant="outlined" @click="handleReset2">
              {{ $t('common.reset') }}
            </VBtn>
            <VBtn variant="text" @click="collapsed = !collapsed">
              {{ collapsed ? '展开' : '收起' }}
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped></style>
