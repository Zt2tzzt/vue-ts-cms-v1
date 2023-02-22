<script setup lang="ts">
import useSystemStore from '@/stores/main/system/system'
import { storeToRefs } from 'pinia'
import { formatUTC } from '@/utils/format'
import { ref } from 'vue'
import type {
	IDepartmentQueryFormData,
	IDepartment,
	IDepartmentQueryParam,
} from '@/types'
import { DEPARTMENT } from '@/global/constance'

const emits = defineEmits(['newClick', 'editClick'])

const systemStore = useSystemStore()
const { pageList, pageTotalCount } = storeToRefs(systemStore)

const currentPage = ref(1)
const pageSize = ref(10)

const fetchPageListData = (formatData: IDepartmentQueryFormData | object = {}) => {
	// 1.获取 offset 和 limit
	const limit = pageSize.value
	const offset = (currentPage.value - 1) * limit
	const queryParam = { size: limit, offset }

	// 2.发送请求
	systemStore.postPageListAction<IDepartmentQueryParam>(DEPARTMENT, {
		...queryParam,
		...formatData
	})
}

fetchPageListData()

const onSizeChange = () => {
	fetchPageListData()
}
const onCurrentChange = () => {
	fetchPageListData()
}

const onDeleteClick = (id: number) => {
	systemStore.deletePageByIdAction(DEPARTMENT, id)
}

const onNewclick = () => {
	emits('newClick')
}

const onEditClick = (itemData: IDepartment) => {
	emits('editClick', itemData)
}

defineExpose({
	fetchPageListData
})
</script>

<template>
	<div class="user-content">
		<div class="header">
			<h3 class="title">部门列表</h3>
			<el-button type="primary" @click="onNewclick">新建部门</el-button>
		</div>

		<div class="table">
			<el-table :data="pageList" stripe border style="width: 100%">
				<el-table-column align="center" type="selection" width="50px"></el-table-column>
				<el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
				<el-table-column align="center" label="部门名称" prop="name" width="200"></el-table-column>
				<el-table-column
					align="center"
					label="部门编号"
					prop="leader"
					width="200"
				></el-table-column>
				<el-table-column
					align="center"
					label="上级部门"
					prop="parentId"
					width="150"
				></el-table-column>
				<el-table-column align="center" label="创建时间" prop="createAt" #default="scope">
					{{ formatUTC(scope.row.createAt) }}
				</el-table-column>
				<el-table-column align="center" label="修改时间" prop="updateAt">
					<template #default="scope">
						{{ formatUTC(scope.row.updateAt) }}
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作" width="250" #default="scope">
					<el-button size="small" icon="Edit" type="primary" text @click="onEditClick(scope.row)"
						>编辑</el-button
					>
					<el-button
						size="small"
						icon="Delete"
						type="danger"
						text
						@click="onDeleteClick(scope.row.id)"
						>删除</el-button
					>
				</el-table-column>
			</el-table>
		</div>

		<div class="pagination">
			<el-pagination
				v-model:current-page="currentPage"
				v-model:page-size="pageSize"
				:page-sizes="[10, 20, 30]"
				layout="total, sizes, prev, pager, next, jumper"
				:total="pageTotalCount"
				@size-change="onSizeChange"
				@current-change="onCurrentChange"
			></el-pagination>
		</div>
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

	.pagination {
		display: flex;
		justify-content: flex-end;
		margin-top: 10px;
	}
}
</style>
