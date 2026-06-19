<script lang="ts" setup>
import printJS from 'print-js';

function printTable() {
  printJS({
    printable: [
      { name: 'soybean', wechat: 'honghuangdc', remark: '欢迎来技术交流' },
      { name: 'soybean', wechat: 'honghuangdc', remark: '欢迎来技术交流' }
    ],
    properties: ['name', 'wechat', 'remark'],
    type: 'json'
  });
}
function printImage() {
  printJS({
    printable: [
      'https://i.loli.net/2021/11/24/1J6REWXiHomU2kM.jpg',
      'https://i.loli.net/2021/11/24/1J6REWXiHomU2kM.jpg'
    ],
    type: 'image',
    header: 'Multiple Images',
    imageStyle: 'width:100%;'
  });
}
</script>

<template>
  <div class="h-full">
    <VCard :flat="true" title="打印" class="card-wrapper">
      <VBtn color="primary" class="mr-10px" @click="printTable">打印表格</VBtn>
      <VBtn color="primary" @click="printImage">打印图片</VBtn>
      <template #actions>
        <GithubLink label="printJS：" link="https://github.com/crabbly/Print.js" class="mt-10px" />
      </template>
    </VCard>
  </div>
</template>

<style scoped></style>
