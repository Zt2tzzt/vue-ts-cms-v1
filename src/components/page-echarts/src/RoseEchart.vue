<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import { computed } from 'vue'
import BaseEchart from './BaseEchart.vue'
import type { IChartData1 } from '../types'

const props = defineProps<{
	roseData: IChartData1[]
}>()

const option = computed(() => ({
	toolbox: {
		show: true,
		feature: {
			mark: { show: true },
			dataView: { show: true, readOnly: false },
			restore: { show: true },
			saveAsImage: { show: true }
		}
	},
	legend: {
		orient: 'vertical',
		left: 'left'
	},
	tooltip: {
		trigger: 'item'
	},
	series: [
		{
			name: '访问来源',
			type: 'pie',
			// 内半径/外半径的大小
			radius: [10, 160],
			// 设置区域的位置
			center: ['50%', '50%'],
			bottom: '-15%',
			roseType: 'area', // 圆心角一样, 通过半径的不同表示大小
			itemStyle: {
				borderRadius: 8
			},
			data: props.roseData,
			label: {
				show: false
			}
		}
	]
}))
</script>

<template>
	<div class="rose-echart">
		<BaseEchart :options="option as EChartsOption"></BaseEchart>
	</div>
</template>

<style scoped lang="less"></style>
