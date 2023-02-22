<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { IDepartmentCreateFormData, IDepartment, IDepartmentEditFormData } from '@/types'
import useMainStore from '@/stores/main/main'
import useSystemStore from '@/stores/main/system/system'
import { storeToRefs } from 'pinia';
import { DEPARTMENT } from '@/global/constance';

const showdialog = ref(false)
const isAdd = ref(true) // 新建：true；修改：false
const editId = ref(-1)

// 表单属性
const formData = reactive<IDepartmentCreateFormData>({
	name: '',
	leader: '',
	parentId: ''
})


type OpenDialogParamType = {
	isNew?: boolean
	itemData?: IDepartment
}

// 设置 dialog 是否显示
const setModalVisible = ({isNew = true, itemData}: OpenDialogParamType) => {
	showdialog.value = true
	isAdd.value = isNew
	if (!isNew && itemData) {
		// 编辑
		Object.keys({...formData}).forEach((key) => {
			if (key in itemData) {
				(formData[key as keyof IDepartmentCreateFormData] as any) = itemData[key as keyof IDepartment]
			}
		})
		editId.value = itemData.id
	} else {
		// 新建
		Object.keys({...formData}).forEach(key => {
			formData[key as keyof IDepartmentCreateFormData] = ''
		})
		editId.value = -1
	}
}

// 获取 roles / departments 数据
const mainStore = useMainStore()
const { entireDepartments } = storeToRefs(mainStore)

// 点击“确认”
const systemStore = useSystemStore()
const onConfigClick = () => {
	showdialog.value = false
	if (!isAdd.value && editId.value !== -1) {
		// 编辑
		const { ...editFormData} = formData
		systemStore.pathEditPageRecordByIdAction<IDepartmentEditFormData>(DEPARTMENT, editId.value, editFormData)
	} else {
		// 新增
		systemStore.postNewPageRecordAction<IDepartmentCreateFormData>(DEPARTMENT, {...formData})
	}
}

defineExpose({
	setModalVisible
})
</script>

<template>
	<div class="user-modal">
		<el-dialog
			v-model="showdialog"
			:title="isAdd ? '新建部门' : '修改部门'"
			width="30%"
			destroy-on-close
			center
		>
			<div class="form">
				<el-form :model="formData" label-width="80px" size="large">
					<el-form-item label="部门名称" prop="name">
						<el-input v-model="formData.name" placeholder="请输入部门名称"></el-input>
					</el-form-item>
					<el-form-item label="部门编号" prop="leader">
						<el-input v-model="formData.leader" placeholder="请输入部门编号"></el-input>
					</el-form-item>
					<el-form-item label="选择部门" prop="parentId">
						<el-select
							v-model="formData.parentId"
							placeholder="请选择部门"
							style="width: 100%"
						>
							<template v-for="item of entireDepartments" :key="item.id">
								<el-option :label="item.name" :value="item.id"></el-option>
							</template>
						</el-select>
					</el-form-item>
				</el-form>
			</div>

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="showdialog = false"> 取消 </el-button>
					<el-button type="primary" @click="onConfigClick"> 确定 </el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<style scoped lang="less"></style>
