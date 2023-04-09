<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import { computed } from 'vue'
import BaseEchart from './BaseEchart.vue'

const props = defineProps<{
  labels: string[]
  values: number[]
}>()

const options = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {},
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: props.labels
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '分类销量统计',
      type: 'line',
      stack: '总量',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: props.values
    }
  ]
}))
</script>

<template>
  <div class="line-echart">
    <BaseEchart :options="options"></BaseEchart>
  </div>
</template>

<style scoped lang="less"></style>
