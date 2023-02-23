<script setup lang="ts">
import type { ElForm } from 'element-plus'
import { reactive, ref } from 'vue'
import type { IDepartmentFormItem } from '@/views/main/system/department/config/search.config';
import type { IDepartmentQueryFormData } from '@/types'

interface IProps {
	searchConfig: {
		labelWidth?: string
		formItems: IDepartmentFormItem[]
	}
}
const props = defineProps<IProps>()
const emits = defineEmits(['queryClick', 'resetClick'])

// 初始化表单
const initialForm = props.searchConfig.formItems.reduce((accumulate, item) => {
	accumulate[item.prop] = item.initialvalue as keyof IDepartmentQueryFormData
	return accumulate
}, {} as IDepartmentQueryFormData)
const searchForm = reactive(initialForm)

// 重置
const formRef = ref<InstanceType<typeof ElForm>>()
const onResetClick = () => {
	formRef.value?.resetFields()
	emits('resetClick')
}

// 查询
const onQueryClick = () => {
	emits('queryClick', { ...searchForm })
}
</script>

<template>
	<div class="page-search">
		<!-- 表单 -->
		<el-form :model="searchForm" ref="formRef" label-width="80px" size="large">
			<el-row :gutter="20">

				<template v-for="item of searchConfig.formItems" :key="item.prop">
					<el-col :span="8">
						<el-form-item :label="item.label" :prop="item.prop">

							<template v-if="item.type === 'input'">
								<el-input
									v-model="searchForm[item.prop]"
									:placeholder="item.placeholder"
								></el-input>
							</template>

							<template v-if="item.type === 'date-picker'">

								<el-date-picker
									v-model="searchForm[item.prop]"
									type="daterange"
									range-separator="-"
									start-placeholder="开始时间"
									end-placeholder="结束时间"
								></el-date-picker>
							</template>

							<!-- <template v-if="item.type === 'select'">
								<el-select
									v-model="searchForm[item.prop]"
									:placeholder="item.placeholder"
									style="width: ;100%"
								>
									<template v-for="option in item.options" :key="option.value">
										<el-option :label="option.label" :value="option.value"></el-option>
									</template>
								</el-select>
							</template> -->

						</el-form-item>
					</el-col>
				</template>
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
