<script setup lang="ts">
import { onMounted, onUnmounted, ref, watchEffect } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption, EChartsType } from 'echarts'
import debounce from '@/utils/debounce'

const props = defineProps<{
	options: EChartsOption
	mapData?: {
		mapName: string
		geoJSON: any
	}
}>()

const containerRef = ref<HTMLElement>()
let echartInstance: EChartsType

if (props.mapData) echarts.registerMap(props.mapData.mapName, props.mapData.geoJSON)

const echartResize = debounce(() => {
	echartInstance.resize()
}, 300)

onMounted(() => {
	echartInstance = echarts.init(containerRef.value!, 'light', {
		renderer: 'canvas'
	})

	/* watch(
		() => props.options,
		newVal => {
			echartInstance.setOption(newVal)
		}
	) */

	watchEffect(() => echartInstance.setOption(props.options))

	window.addEventListener('resize', echartResize)
})

onUnmounted(() => {
	window.removeEventListener('resize', echartResize)
})
</script>

<template>
	<div class="base-echart">
		<div class="container" ref="containerRef"></div>
	</div>
</template>

<style scoped lang="less">
.container {
	height: 300px;
}
</style>
