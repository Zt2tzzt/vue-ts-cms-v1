<script setup lang="ts"></script>

<template>
	<div class="app">
		<h1>app</h1>
		<router-link to="/main">主题</router-link>
		<router-link to="/login">登录</router-link>

		<router-view></router-view>
	</div>
</template>

<style scoped lang="less"></style>
