<script setup lang="ts">
import MainMenu from '@/components/main-menu/MainMenu.vue';
import MainHeader from '@/components/main-header/MainHeader.vue';
import { ref } from 'vue';

const isFold = ref(false)
const handleFoldChange = (flag: boolean) => {
	isFold.value = flag
}
</script>

<template>
	<div class="main">
		<el-container class="main-container">
			<el-aside :width="isFold ? `60px` : '200px'">
				<MainMenu :is-fold="isFold"></MainMenu>
			</el-aside>
			<el-container>
				<el-header>
					<MainHeader :is-fold="isFold" @handleFoldChange="handleFoldChange"></MainHeader>
				</el-header>
				<el-main>
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<style scoped lang="less">
.main {
	height: 100%;
	.main-container {
		height: 100%;
	}
	.el-aside {
		overflow-x: hidden;
		overflow-y: auto;
		line-height: 200px;
		text-align: left;
		cursor: pointer;
		background-color: #001529;
		scrollbar-width: none; /* firefox */
		-ms-overflow-style: none; /* IE */
		transition: width 0.3s ease;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	.el-main {
		background-color: #f0f2f5;
	}
}
</style>
