<script setup lang="ts">
import HeaderBanner from './modules/HeaderBanner.vue';
import CardData from './modules/CardData.vue';
import LineChart from './modules/LineChart.vue';
import PieChart from './modules/PieChart.vue';
import ProjectNews from './modules/ProjectNews.vue';
import CreativityBanner from './modules/CreativityBanner.vue';
</script>

<template>
  <div>
    <VRow :gap="16">
      <VCol cols="12">
        <VAlert :title="$t('common.tip')" type="warning" :text="$t('page.home.branchDesc')"></VAlert>
      </VCol>
    </VRow>
    <VRow :gap="16">
      <VCol cols="12">
        <HeaderBanner />
      </VCol>
    </VRow>
    <VRow :gap="16">
      <VCol cols="12">
        <CardData />
      </VCol>
    </VRow>
    <VRow :gap="16">
      <VCol cols="12" md="7" sm="12">
        <LineChart />
      </VCol>
      <VCol cols="12" md="5" sm="12">
        <PieChart />
      </VCol>
    </VRow>
    <VRow :gap="16">
      <VCol cols="12" md="7" sm="12">
        <ProjectNews />
      </VCol>
      <VCol cols="12" md="5" sm="12">
        <CreativityBanner />
      </VCol>
    </VRow>
  </div>
</template>

<style scoped></style>
