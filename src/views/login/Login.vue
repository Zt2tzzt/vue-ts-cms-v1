<script setup lang="ts">
import ztRequest from '@/service'

ztRequest.get({
	url: '/home/multidata'
}).then(res => {
	console.log('res:', res)
})
</script>

<template>
	<div class="Login">
		<h1>Login</h1>
	</div>
</template>

<style scoped lang="less">

</style>

