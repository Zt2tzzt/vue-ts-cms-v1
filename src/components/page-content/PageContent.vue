<script setup lang="ts">
import useSystemStore from '@/stores/main/system/system'
import { storeToRefs } from 'pinia'
import { formatUTC } from '@/utils/format'
import { computed, onUnmounted, ref } from 'vue'
import type { IDepartment } from '@/types'
import type { IContentConfig } from '@/types'
import usePermission from '@/hooks/usePermissions'

const props = defineProps<{
	contentConfig: IContentConfig
}>()
const emits = defineEmits(['newClick', 'editClick'])
const pageName = computed(() => props.contentConfig.pageName)

// 增删改查，权限控制
const permission = {
	isCreate: usePermission(pageName.value + ':create'),
	isDelete: usePermission(pageName.value + ':delete'),
	isUpdate: usePermission(pageName.value + ':update'),
	isQuery: usePermission(pageName.value + ':query')
}

// 页面数据
const systemStore = useSystemStore()
const { pageList, pageTotalCount } = storeToRefs(systemStore)

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)

// 查询
type FetchPageListDataType = <T>(formData?: T | object) => void
const fetchPageListData: FetchPageListDataType = (formatData = {}) => {
	if (!permission.isQuery) return

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

// 增、删、改后，将页面重置到第一页
const onSubscribe = systemStore.$onAction(({ name, after }) => {
	after(() => {
		if (
			['deletePageByIdAction', 'postNewPageRecordAction', 'pathEditPageRecordByIdAction'].includes(
				name
			)
		) {
			currentPage.value = 1
		}
	})
})

onUnmounted(() => {
	onSubscribe()
})

defineExpose({
	fetchPageListData
})
</script>

<template>
	<div class="user-content">
		<!--  头部  -->
		<div class="header">
			<h3 class="title">{{ contentConfig?.header?.title ?? `数据列表` }}</h3>
			<el-button v-if="permission.isCreate" type="primary" @click="onNewclick">{{
				contentConfig?.header?.btnLabel ?? `新建数据`
			}}</el-button>
		</div>

		<!-- 列表 -->
		<div class="table">
			<el-table
				:data="pageList"
				stripe
				border
				style="width: 100%"
				v-bind="contentConfig?.childrenTree"
			>
				<template v-for="item of contentConfig.propList" :key="item.prop">
					<!-- 处理 timer、handler 列 -->
					<template v-if="item.gener === 'timer'">
						<el-table-column align="center" v-bind="item" #default="scope">
							{{ formatUTC(scope.row.createAt) }}
						</el-table-column>
					</template>

					<template v-else-if="item.gener === 'handler'">
						<el-table-column align="center" v-bind="item" #default="scope">
							<el-button
								v-if="permission.isUpdate"
								size="small"
								icon="Edit"
								type="primary"
								text
								@click="onEditClick(scope.row)"
								>编辑</el-button
							>
							<el-button
								v-if="permission.isDelete"
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
