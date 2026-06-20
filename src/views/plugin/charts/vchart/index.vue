<script setup lang="ts">
import { useVChart } from '@/hooks/common/vchart';
import {
  barMarkPointSpec,
  circularProgressTickSpec,
  histogramDifferentBinSpec,
  liquidChartSmartInvertSpec,
  rankingBarSpec,
  shapeWordCloudSpec,
  stackedDashAreaSpec
} from './data';

const { domRef: stackedDashAreaRef } = useVChart(() => stackedDashAreaSpec);
const { domRef: barMarkPointRef } = useVChart(() => barMarkPointSpec);
const { domRef: histogramDifferentBinRef } = useVChart(() => histogramDifferentBinSpec);
const { domRef: rankingBarRef } = useVChart(() => rankingBarSpec);
const { domRef: shapeWordCloudRef } = useVChart(() => shapeWordCloudSpec);
const { domRef: circularProgressTickRef } = useVChart(() => circularProgressTickSpec);
const { domRef: liquidChartSmartInvertRef } = useVChart(() => liquidChartSmartInvertSpec);
</script>

<template>
  <div class="flex flex-col gap-4">
    <VCard title="VChart">
      <VCardText>
        <WebSiteLink label="More Demos: " link="https://www.visactor.com/vchart/example" />
      </VCardText>
    </VCard>

    <VCard title="Stacked Dash Area Chart">
      <VCardText>
        <div ref="stackedDashAreaRef" class="h-400px" />
      </VCardText>
    </VCard>

    <VCard title="Bar Mark Point Chart">
      <VCardText>
        <div ref="barMarkPointRef" class="h-400px" />
      </VCardText>
    </VCard>

    <VCard title="Histogram Different Bin Chart">
      <VCardText>
        <div ref="histogramDifferentBinRef" class="h-400px" />
      </VCardText>
    </VCard>

    <VCard title="Ranking Bar Chart">
      <VCardText>
        <div ref="rankingBarRef" class="h-400px" />
      </VCardText>
    </VCard>

    <VCard title="Circular Progress Tick Chart">
      <VCardText>
        <div ref="circularProgressTickRef" class="h-400px" />
      </VCardText>
    </VCard>

    <VCard title="Liquid Chart Smart Invert Chart">
      <VCardText>
        <div ref="liquidChartSmartInvertRef" class="h-400px" />
      </VCardText>
    </VCard>

    <VCard title="Shape Word Cloud Chart">
      <VCardText>
        <div ref="shapeWordCloudRef" class="h-400px" />
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped></style>
