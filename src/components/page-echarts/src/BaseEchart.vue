<script setup lang="ts">
import { onMounted, onUnmounted, ref, watchEffect, type WatchStopHandle } from 'vue'
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

// 注册地图
if (props.mapData) echarts.registerMap(props.mapData.mapName, props.mapData.geoJSON)

const echartResize = debounce(() => {
  echartInstance.resize()
}, 300)

let stop: WatchStopHandle

onMounted(() => {
  echartInstance = echarts.init(containerRef.value!, 'light', {
    renderer: 'canvas'
  })

  // 方案一
  /* watch(
		() => props.options,
		newVal => {
			echartInstance.setOption(newVal)
		}
	) */

  // 方案二
  stop = watchEffect(() => echartInstance.setOption(props.options))

  window.addEventListener('resize', echartResize)
})

onUnmounted(() => {
  stop?.()
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
