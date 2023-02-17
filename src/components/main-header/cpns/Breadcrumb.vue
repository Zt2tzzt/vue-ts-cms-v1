<script setup lang="ts">
import useLoginStore from '@/stores/login/login'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { mapPathToBreadcrumb } from '@/utils/map-path'

const route = useRoute()
const loginStore = useLoginStore()

const breadcrumbs = computed(() => mapPathToBreadcrumb(route.path, loginStore.userMenus))
</script>

<template>
	<div class="breadcrumb">
		<el-breadcrumb separator-icon="CaretRight">
			<template v-for="item in breadcrumbs" :key="item.name">
				<el-breadcrumb-item :to="item.path">
					{{ item.name }}
				</el-breadcrumb-item>
			</template>
		</el-breadcrumb>
	</div>
</template>

<style scoped lang="less">
</style>
