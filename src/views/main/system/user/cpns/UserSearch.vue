<script setup lang="ts">
import type { ElForm } from 'element-plus'
import { reactive, ref } from 'vue'
import type { IUserQueryFormData } from '@/types'

const emits = defineEmits(['queryClick', 'resetClick'])

const searchForm = reactive<IUserQueryFormData>({
	name: '',
	realname: '',
	cellphone: '',
	enable: 1,
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
	<div class="user-search">
		
		<!-- 表单 -->
		<el-form :model="searchForm" ref="formRef" label-width="80px" size="large">
			<el-row :gutter="20">
				<el-col :span="8">
					<el-form-item label="用户名" prop="name">
						<el-input v-model="searchForm.name" placeholder="请输入查询的用户名"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="真实姓名" prop="realname">
						<el-input v-model="searchForm.realname" placeholder="请输入查询的真是姓名"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="手机号码" prop="cellphone">
						<el-input v-model="searchForm.cellphone" placeholder="请输入查询的手机号码"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="状态" prop="enable">
						<el-select
							v-model="searchForm.enable"
							placeholder="请选择查询的状态"
							style="width: 100%"
						>
							<el-option label="启用" :value="1"></el-option>
							<el-option label="禁用" :value="0"></el-option>
						</el-select>
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
.user-search {
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
