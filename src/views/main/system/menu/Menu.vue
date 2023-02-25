<template>
	<div class="menu">
		<PageContent :content-config="contentConfig"></PageContent>
	</div>
</template>

<script setup lang="ts" name="menu">
import PageContent from '@/components/page-content/PageContent.vue'
import contentConfig from './config/content.config'
</script>

<style scoped></style>
