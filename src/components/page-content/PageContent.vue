<script setup lang="ts">
import useSystemStore from '@/stores/main/system/system'
import { storeToRefs } from 'pinia'
import { formatUTC } from '@/utils/format'
import { computed, ref } from 'vue'
import type { IDepartment } from '@/types'
import type { IDepartmentProp } from '@/views/main/system/department/config/content.config';

interface IProps {
	contentConfig: {
		pageName: string
		header?: {
			title: string
			btnLabel: string
		}
		propList: IDepartmentProp[]
	}
}
const props = defineProps<IProps>()
const emits = defineEmits(['newClick', 'editClick'])
const pageName = computed(() => props.contentConfig.pageName)

// 页面数据
const systemStore = useSystemStore()
const { pageList, pageTotalCount } = storeToRefs(systemStore)

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)

// 查询
const fetchPageListData = <T>(formatData: T | object = {}) => {
	// 1.获取 offset 和 limit
	const limit = pageSize.value
	const offset = (currentPage.value - 1) * limit
	const queryParam = { size: limit, offset }

	// 2.发送请求
	systemStore.postPageListAction(pageName.value, {
		...queryParam,
		...formatData
	})
}
fetchPageListData()

// 分页器
const onSizeChange = () => {
	fetchPageListData()
}
const onCurrentChange = () => {
	fetchPageListData()
}

// 删除
const onDeleteClick = (id: number) => {
	systemStore.deletePageByIdAction(pageName.value, id)
}

// 新增
const onNewclick = () => {
	emits('newClick')
}

// 修改
const onEditClick = (itemData: IDepartment) => {
	emits('editClick', itemData)
}

defineExpose({
	fetchPageListData
})
</script>

<template>
	<div class="user-content">
		<!--  头部  -->
		<div class="header">
			<h3 class="title">{{ contentConfig?.header?.title ?? `数据列表` }}</h3>
			<el-button type="primary" @click="onNewclick">{{
				contentConfig?.header?.btnLabel ?? `新建数据`
			}}</el-button>
		</div>

		<!-- 列表 -->
		<div class="table">
			<el-table :data="pageList" stripe border style="width: 100%">

				<template v-for="item of contentConfig.propList" :key="item.prop">

					<!-- 很多页面都有的列。分情况处理 -->
					<template v-if="item.gener === 'timer'">
						<el-table-column align="center" v-bind="item" #default="scope">
							{{ formatUTC(scope.row.createAt) }}
						</el-table-column>
					</template>

					<template v-else-if="item.gener === 'handler'">
						<el-table-column align="center" v-bind="item" #default="scope">
							<el-button
								size="small"
								icon="Edit"
								type="primary"
								text
								@click="onEditClick(scope.row)"
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
					</template>

					<!-- 较为通用的列 -->
					<template v-else>
						<el-table-column align="center" v-bind="item"></el-table-column>
					</template>

				</template>

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
