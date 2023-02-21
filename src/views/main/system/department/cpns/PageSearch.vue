<script setup lang="ts">
import type { ElForm } from 'element-plus'
import { reactive, ref } from 'vue'
import type { IDepartmentQueryFormData } from '@/types'

const emits = defineEmits(['queryClick', 'resetClick'])

const searchForm = reactive<IDepartmentQueryFormData>({
	name: '',
	leader: '',
	createAt: ''
})

const formRef = ref<InstanceType<typeof ElForm>>()

const onResetClick = () => {
	formRef.value?.resetFields()
	emits('resetClick')
}
const onQueryClick = () => {
	emits('queryClick', { ...searchForm })
}
</script>

<template>
	<div class="page-search">
		<!-- 表单 -->
		<el-form :model="searchForm" ref="formRef" label-width="80px" size="large">
			<el-row :gutter="20">
				<el-col :span="8">
					<el-form-item label="部门名" prop="name">
						<el-input v-model="searchForm.name" placeholder="请输入查询的部门名称"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="部门领导" prop="leader">
						<el-input v-model="searchForm.leader" placeholder="请输入查询的部门领导"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="创建时间" prop="createAt">
						<el-date-picker
							v-model="searchForm.createAt"
							type="daterange"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
						></el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>

		<!-- 按钮 -->
		<div class="btns">
			<el-button icon="Refresh" @click="onResetClick">重置</el-button>
			<el-button icon="Search" type="primary" @click="onQueryClick">查询</el-button>
		</div>
	</div>
</template>

<style scoped lang="less">
.page-search {
	background-color: #fff;
	padding: 20px;

	.el-form-item {
		padding: 20px 30px;
		margin-bottom: 0;
	}

	.btns {
		text-align: right;
		padding: 0 50px 10px 0;

		.el-button {
			height: 30px;
		}
	}
}
</style>
