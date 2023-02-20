<script setup lang="ts">
import useSystemStore from '@/stores/main/system/user'
import { storeToRefs } from 'pinia'

const systemStore = useSystemStore()
systemStore.postUsersAction()
const { users } = storeToRefs(systemStore)
</script>

<template>
	<div class="user-content">
		<div class="header">
			<h3 class="title">用户列表</h3>
			<el-button type="primary">新建用户</el-button>
		</div>

		<div class="table">
			<el-table :data="users" stripe border style="width: 100%">
				<el-table-column align="center" type="selection" width="50px"></el-table-column>
				<el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
				<el-table-column align="center" label="用户名" prop="name" width="200"></el-table-column>
				<el-table-column
					align="center"
					label="真是姓名"
					prop="realname"
					width="200"
				></el-table-column>
				<el-table-column
					align="center"
					label="手机号码"
					prop="cellphone"
					width="250"
				></el-table-column>
				<el-table-column align="center" label="状态" prop="enable" width="100"></el-table-column>
				<el-table-column align="center" label="创建时间" prop="createAt"></el-table-column>
				<el-table-column align="center" label="修改时间" prop="updateAt"></el-table-column>
				<el-table-column align="center" label="操作" width="250">
					<el-button size="small" icon="Edit" type="primary" text>编辑</el-button>
					<el-button size="small" icon="Delete" type="danger" text>删除</el-button>
				</el-table-column>
			</el-table>
		</div>

		<div class="pagination">分页</div>
	</div>
</template>

<style scoped lang="less">
.user-content {
	margin-top: 20px;
	padding: 20px;
	background-color: #fff;

	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 10px;

		.title {
			font-size: 22px;
		}
	}

	.table {
		:deep(.el-table__cell) {
			padding: 12px 0;
		}

		.el-button {
			margin-left: 10;
			padding: 5px 8px;
		}
	}
}
</style>
