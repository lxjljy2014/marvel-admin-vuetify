<script setup lang="ts">
import type { Component } from 'vue';
import { ref } from 'vue';
import { BaiduMap, GaodeMap, TencentMap } from './components';

interface Map {
  id: string;
  label: string;
  component: Component;
}

const maps: Map[] = [
  { id: 'gaode', label: '高德地图', component: GaodeMap },
  { id: 'tencent', label: '腾讯地图', component: TencentMap },
  { id: 'baidu', label: '百度地图', component: BaiduMap }
];

const activeTab = ref('gaode');
</script>

<template>
  <div class="h-full">
    <VCard :flat="true" title="地图插件" class="h-full card-wrapper">
      <VTabs v-model="activeTab">
        <VTab v-for="item in maps" :key="item.id" :value="item.id">
          {{ item.label }}
        </VTab>
      </VTabs>
      <VWindow v-model="activeTab" class="flex-1-hidden">
        <VWindowItem v-for="item in maps" :key="item.id" :value="item.id">
          <component :is="item.component" />
        </VWindowItem>
      </VWindow>
    </VCard>
  </div>
</template>

<style scoped></style>
