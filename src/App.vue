<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

</script>

<template>
	<div class="app">
		<ElConfigProvider :locale="zhCn">
			<router-view></router-view>
		</ElConfigProvider>
	</div>
</template>

<style scoped lang="less">
.app {
	width: 100vw;
	height: 100vh;
}
</style>
