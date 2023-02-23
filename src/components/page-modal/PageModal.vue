<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { IDepartmentCreateFormData, IDepartment, IDepartmentEditFormData } from '@/types'
import useSystemStore from '@/stores/main/system/system'
import type { IDepartmentFormItem } from '@/views/main/system/department/config/modal.config';

const props = defineProps<{
	modalConfig: {
		pageName: string
		header: {
			newBtnLabel: string
			editBtnLabel: string
		},
		formItems: IDepartmentFormItem[]
	}
}>()
const pageName = computed(() => props.modalConfig.pageName)

const showdialog = ref(false)
const isAdd = ref(true) // 新建：true；修改：false
const editId = ref(-1)

// 表单属性
const initialFormData: IDepartmentCreateFormData = props.modalConfig.formItems.reduce((accumulate, item) => {
	accumulate[item.prop] = ''
	return accumulate
}, {} as any)
const formData = reactive(initialFormData)


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


// 点击“确认”
const systemStore = useSystemStore()
const onConfigClick = () => {
	showdialog.value = false
	if (!isAdd.value && editId.value !== -1) {
		// 编辑
		const { ...editFormData} = formData
		systemStore.pathEditPageRecordByIdAction<IDepartmentEditFormData>(pageName.value, editId.value, editFormData)
	} else {
		// 新增
		systemStore.postNewPageRecordAction<IDepartmentCreateFormData>(pageName.value, {...formData})
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
			:title="isAdd ? modalConfig.header.newBtnLabel: modalConfig.header.editBtnLabel"
			width="30%"
			destroy-on-close
			center
		>
			<div class="form">
				<el-form :model="formData" label-width="80px" size="large">

					<template v-for="item of modalConfig.formItems" :key="item.prop">
						<el-form-item :label="item.label" :prop="item.prop">

							<template v-if="item.type === 'input'">
								<el-input v-model="formData[item.prop]" :placeholder="item.placeholder"></el-input>
							</template>

							<template v-else-if="item.type === 'select'">
								<el-select
									v-model="formData[item.prop]"
									:placeholder="item.placeholder"
									style="width: 100%"
								>
									<template v-for="option of item.options" :key="option.value">
										<el-option :label="option.label" :value="option.value"></el-option>
									</template>
								</el-select>
							</template>

						</el-form-item>
					</template>

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
