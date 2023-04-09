<script setup lang="ts">
import { computed } from 'vue'
import BaseEchart from './BaseEchart.vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const props = defineProps<{
  labels: string[]
  values: number[]
}>()

const options = computed<EChartsOption>(() => ({
  title: {
    text: '支持鼠标滚动缩放'
  },
  grid: {
    bottom: '5%'
  },
  xAxis: {
    data: props.labels,
    axisLabel: {
      inside: true,
      color: '#fff'
    },
    z: 10
  },
  yAxis: {
    axisLabel: {
      color: '#999'
    }
  },
  dataZoom: [
    {
      type: 'inside'
    }
  ],
  series: [
    {
      type: 'bar',
      showBackground: true,
      // 系列图形的样式(每个item的样式)
      // 可以被放到每一项中,针对每一项设置
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ])
      },
      // 图形的高亮: 鼠标悬浮时候的状态: hover
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#2378f7' },
            { offset: 0.7, color: '#2378f7' },
            { offset: 1, color: '#83bff6' }
          ])
        }
      },
      data: props.values
    }
  ]
}))
</script>

<template>
  <div class="bar-echart">
    <BaseEchart :options="options"></BaseEchart>
  </div>
</template>

<style scoped lang="less"></style>
