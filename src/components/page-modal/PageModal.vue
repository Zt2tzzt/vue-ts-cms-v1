<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { IModalConfig } from '@/types'
import useSystemStore from '@/stores/main/system/system'
import type { CreateFormDataType, EditFormDataType, IModalFormItemGeneral, IModalFormItemCustom } from '@/types'

const props = defineProps<{
	modalConfig: IModalConfig
	otherInfo?: object
}>()
const pageName = computed(() => props.modalConfig.pageName)

const showdialog = ref(false)
const isAdd = ref(true) // 新建：true；修改：false
const editId = ref(-1)

// 表单属性
const initialFormData = props.modalConfig.formItems.reduce((accumulate, item) => {
	if ('prop' in item) accumulate[item.prop] = ''
	return accumulate
}, {} as CreateFormDataType | EditFormDataType)
const formData = reactive(initialFormData)

interface OpenDialogParamType<T> {
	isNew?: boolean
	itemData?: T
}
// 设置 dialog 是否显示
const setModalVisible = <T extends { id: number }, F>({ isNew = true, itemData }: OpenDialogParamType<T>) => {
	showdialog.value = true
	isAdd.value = isNew
	if (!isNew && itemData) {
		// 编辑
		Object.keys({ ...formData }).forEach(key => {
			if (key in itemData) {
				formData[key as keyof F] = itemData[key as keyof T]
			}
		})
		editId.value = itemData.id
	} else {
		// 新建
		Object.keys({ ...formData }).forEach(key => {
			formData[key as keyof F] = ''
		})
		editId.value = -1
	}
}

// 点击“确认”
const systemStore = useSystemStore()
const onConfigClick = () => {
	showdialog.value = false

	let editFormData = { ...formData }

	if (props.otherInfo) {
		editFormData = { ...formData, ...props.otherInfo }
	}

	if (!isAdd.value && editId.value !== -1) {
		// 编辑
		systemStore.pathEditPageRecordByIdAction<EditFormDataType>(pageName.value, editId.value, editFormData)
	} else {
		// 新增
		systemStore.postNewPageRecordAction<CreateFormDataType>(pageName.value, editFormData)
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
			:title="isAdd ? modalConfig.header.newBtnLabel : modalConfig.header.editBtnLabel"
			width="30%"
			destroy-on-close
			center
		>
			<div class="form">
				<el-form :model="formData" label-width="80px" size="large">
					<template v-for="item of modalConfig.formItems" :key="item">
						<!-- 插槽列 -->
						<template v-if="item.type === 'custom'">
							<el-form-item>
								<slot :name="(item as IModalFormItemCustom).slotname"></slot>
							</el-form-item>
						</template>

						<!-- 通用列 -->
						<template v-else>
							<el-form-item
								:label="(item as IModalFormItemGeneral)!.label"
								:prop="(item as IModalFormItemGeneral)!.prop"
							>
								<!-- 输入框 -->
								<template v-if="item.type === 'input'">
									<el-input v-model="formData[item.prop]" :placeholder="item.placeholder"></el-input>
								</template>
								<!-- 选项列表 -->
								<template v-else-if="item.type === 'select'">
									<el-select v-model="formData[item.prop]" :placeholder="item.placeholder" style="width: 100%">
										<template v-for="option of item.options" :key="option.value">
											<el-option :label="option.label" :value="option.value"></el-option>
										</template>
									</el-select>
								</template>
							</el-form-item>
						</template>
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
