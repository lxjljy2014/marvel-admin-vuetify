<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import VuePdfEmbed from 'vue-pdf-embed';
import { useLoading } from '@sa/hooks';
import { SimpleScrollbar } from '@sa/materials';

const { loading, endLoading } = useLoading(true);

const pdfRef = shallowRef<InstanceType<typeof VuePdfEmbed> | null>(null);
const source = `https://xiaoxian521.github.io/hyperlink/pdf/Cookie%E5%92%8CSession%E5%8C%BA%E5%88%AB%E7%94%A8%E6%B3%95.pdf`;

const showAllPages = ref(false);
const currentPage = ref<undefined | number>(1);
const pageCount = ref(1);

function onPdfRendered() {
  endLoading();

  if (pdfRef.value?.doc) {
    pageCount.value = pdfRef.value.doc.numPages;
  }
}

function showAllPagesChange() {
  currentPage.value = showAllPages.value ? undefined : 1;
}

const rotations = [0, 90, 180, 270];
const currentRotation = ref(0);

function handleRotate() {
  currentRotation.value = (currentRotation.value + 1) % 4;
}

async function handlePrint() {
  await pdfRef.value?.print(undefined, 'test.pdf', true);
}

async function handleDownload() {
  await pdfRef.value?.download('test.pdf');
}
</script>

<template>
  <div class="overflow-hidden">
    <VCard :flat="true" title="PDF 预览" class="h-full card-wrapper">
      <div class="h-full flex-col-stretch">
        <GithubLink link="https://github.com/hrynko/vue-pdf-embed" />
        <WebSiteLink label="文档地址：" link="https://www.npmjs.com/package/vue-pdf-embed" />
        <div class="flex-y-center justify-end gap-12px">
          <VCheckbox
            v-model="showAllPages"
            label="显示所有页面"
            hide-details
            density="compact"
            @update:model-value="showAllPagesChange"
          />
          <ButtonIcon tooltip-content="旋转90度" @click="handleRotate">
            <icon-material-symbols-light-rotate-90-degrees-ccw-outline-rounded />
          </ButtonIcon>
          <ButtonIcon tooltip-content="打印" @click="handlePrint">
            <icon-mdi-printer />
          </ButtonIcon>
          <ButtonIcon tooltip-content="下载" @click="handleDownload">
            <icon-charm-download />
          </ButtonIcon>
        </div>
        <SimpleScrollbar class="flex-1-hidden">
          <VSkeletonLoader v-if="loading" type="text" width="100%" class="mt-12px" />
          <VSkeletonLoader v-if="loading" type="text" width="100%" class="mt-12px" />
          <VSkeletonLoader v-if="loading" type="text" width="100%" class="mt-12px" />
          <VSkeletonLoader v-if="loading" type="text" width="100%" class="mt-12px" />
          <VSkeletonLoader v-if="loading" type="text" width="100%" class="mt-12px" />
          <VSkeletonLoader v-if="loading" type="text" width="100%" class="mt-12px" />
          <VSkeletonLoader v-if="loading" type="text" width="100%" class="mt-12px" />
          <VSkeletonLoader v-if="loading" type="text" width="100%" class="mt-12px" />
          <VSkeletonLoader v-if="loading" type="text" width="100%" class="mt-12px" />
          <VSkeletonLoader v-if="loading" type="text" width="100%" class="mt-12px" />
          <VSkeletonLoader v-if="loading" type="text" width="100%" class="mt-12px" />
          <VSkeletonLoader v-if="loading" type="text" width="100%" class="mt-12px" />
          <VuePdfEmbed
            ref="pdfRef"
            class="container overflow-auto"
            :class="{ 'h-0': loading }"
            :rotation="rotations[currentRotation]"
            :page="currentPage"
            :source="source"
            @rendered="onPdfRendered"
          />
        </SimpleScrollbar>
        <div class="flex-y-center justify-between">
          <div v-if="showAllPages" class="text-18px font-medium">共{{ pageCount }}页</div>
          <VPagination v-else v-model="currentPage" :length="pageCount" :total-visible="5" />
        </div>
      </div>
    </VCard>
  </div>
</template>

<style scoped></style>
