<script setup lang="ts">
import useCounterStore from '@/stores/counter'

const counterStore = useCounterStore()
const onBtnClick = () => counterStore.changeCounterAction(999)
</script>

<template>
	<div class="Main">
		<h2>main: {{ counterStore.counter }}-{{ counterStore.doubleCounter }}</h2>
		<button @click="onBtnClick">修改 counter</button>
	</div>
</template>

<style scoped lang="less">

</style>
