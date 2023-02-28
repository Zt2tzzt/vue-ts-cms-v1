<script setup lang="ts">
import LoginPanel from './cpns/LoginPanel.vue'
</script>

<template>
	<div class="login">
		<LoginPanel></LoginPanel>
	</div>
</template>

<style scoped lang="less">
.login {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background-image: url(@/assets/img/login-bg.svg);
}
</style>
