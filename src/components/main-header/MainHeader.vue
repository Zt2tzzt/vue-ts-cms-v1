<script setup lang="ts">
import Breadcrumb from './cpns/BreadCrumb.vue'
import UserState from './cpns/UserState.vue'

const props = withDefaults(
	defineProps<{
		isFold: boolean
	}>(),
	{
		isFold: false
	}
)

const emit = defineEmits(['handleFoldChange'])

const handleMenuIconClick = () => {
	emit('handleFoldChange', !props.isFold)
}
</script>

<template>
	<div class="main-header">
		<!-- 图标 -->
		<div class="menu-icon" @click="handleMenuIconClick">
			<el-icon size="28px">
				<component :is="isFold ? 'Expand' : 'Fold'"></component>
			</el-icon>
		</div>

		<div class="content">
			<Breadcrumb></Breadcrumb>
			<UserState></UserState>
		</div>
	</div>
</template>

<style scoped lang="less">
.main-header {
	display: flex;
	align-items: center;
	flex: 1;
	height: 100%;

	.menu-icon {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex: 1;
		padding: 0 18px;
	}
}
</style>
