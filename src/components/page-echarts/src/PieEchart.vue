<script setup lang="ts">
import { computed } from 'vue'
import BaseEchart from './BaseEchart.vue'
import type { EChartsOption } from 'echarts'
import type { IChartData1 } from '../types'

const props = defineProps<{
	pieData: IChartData1[]
}>()

const option = computed<EChartsOption>(() => ({
	// 手指放上去的时候显示的文本
	tooltip: {
		trigger: 'item'
	},
	// 图例:
	legend: {
		orient: 'horizontal',
		left: 'left'
	},
	series: [
		{
			name: '访问来源',
			type: 'pie',
			radius: '50%',
			bottom: '-10%',
			data: props.pieData,
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}
	]
}))
</script>

<template>
	<div class="pie-echart">
		<BaseEchart :options="option"></BaseEchart>
	</div>
</template>

<style scoped lang="less"></style>
