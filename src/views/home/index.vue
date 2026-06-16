<script setup lang="ts">
import HeaderBanner from './modules/header-banner.vue';
import CardData from './modules/card-data.vue';
import LineChart from './modules/line-chart.vue';
import PieChart from './modules/pie-chart.vue';
import ProjectNews from './modules/project-news.vue';
import CreativityBanner from './modules/creativity-banner.vue';
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
