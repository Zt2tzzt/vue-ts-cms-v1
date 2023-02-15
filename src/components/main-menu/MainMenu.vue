<script setup lang="ts">
import useLoginStore from '@/stores/login/login'
import { useRouter } from 'vue-router';
import type { IUserMenuChild } from '@/types';

withDefaults(defineProps<{
	isFold: boolean
}>(), {
	isFold: false
})

const loginStore = useLoginStore()
const userMenu = loginStore.userMenu

const router = useRouter()
const handleItemClick = (item: IUserMenuChild) => {
	const url = item.url
	router.push(url)
}
</script>

<template>
	<div class="main-menu">
		<!-- logo -->
		<div class="logo">
			<img class="img" src="@/assets/img/logo.svg" alt="" >
			<h2 class="title" v-show="!isFold">ZT 后台管理系统</h2>
		</div>

		<!-- menu -->
		<div class="menu">
			<el-menu
				default-active="3"
				:collapse="isFold"
				text-color="#b7bdc3"
				active-text-color="#fff"
				background-color="#001529"
			>

				<!-- 渲染整个菜单 -->
				<template v-for="item of userMenu" :key="item.id">
					<el-sub-menu :index="item.id + ''">
						<template #title>
							<el-icon>
								<Component :is="item.icon.split('-icon-').pop()"></Component>
							</el-icon>
							<span>{{ item.name }}</span>
						</template>
						<template v-for="subitem of item.children" :key="subitem.id">
							<el-menu-item
								:index="subitem.id + ''"
								@click="handleItemClick(subitem)"
							>
								{{ subitem.name }}
							</el-menu-item>
						</template>
					</el-sub-menu>
				</template>

			</el-menu>
		</div>
	</div>
</template>

<style scoped lang="less">
.main-menu {
	height: 100%;
	background-color: #001529;
	.logo {
		display: flex;
		height: 20px;
		padding: 12px 10px 8px 10px;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		overflow: hidden;

		.img {
			height: 100%;
			margin: 0 10px;
		}

		.title {
			font-size: 16px;
			font-weight: 700;
			color: #fff;
			white-space: nowrap;
		}
	}

	.el-menu {
		border-right: none;
		user-select: none;

		.el-sub-menu {
			.el-menu-item {
				padding-left: 50px !important;
				background-color: #0c2135;
			}
			.el-menu-item:hover {
				color: #fff;
			}
			.el-menu-item.is-active {
				color: #fff;
				background-color: #0a60bd;
			}
		}
	}
}
</style>
