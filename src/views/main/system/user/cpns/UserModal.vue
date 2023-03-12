<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { IUserCreateFormData, IUser } from '@/types'
import useMainStore from '@/stores/main/main'
import useSystemStore from '@/stores/main/system/system'
import { storeToRefs } from 'pinia'

const showdialog = ref(false)
const isAdd = ref(true) // 新建：true；修改：false
const editId = ref(-1)

// 表单属性
const formData = reactive<IUserCreateFormData>({
	name: '',
	realname: '',
	password: '',
	cellphone: '',
	roleId: '',
	departmentId: ''
})

type OpenDialogParamType = {
	isNew?: boolean
	itemData?: IUser
}

// 设置 dialog 是否显示
const setModalVisible = ({ isNew = true, itemData }: OpenDialogParamType) => {
	showdialog.value = true
	isAdd.value = isNew
	if (!isNew && itemData) {
		// 编辑
		Object.keys({ ...formData }).forEach(key => {
			if (key in itemData) {
				;(formData[key as keyof IUserCreateFormData] as any) = itemData[key as keyof IUser]
			}
		})
		editId.value = itemData.id
	} else {
		// 新建
		Object.keys({ ...formData }).forEach(key => {
			formData[key as keyof IUserCreateFormData] = ''
		})
		editId.value = -1
	}
}

// 获取 roles / departments 数据
const mainStore = useMainStore()
const { entireRoles, entireDepartments } = storeToRefs(mainStore)

// 点击“确认”
const systemStore = useSystemStore()
const onConfigClick = () => {
	showdialog.value = false
	if (!isAdd.value && editId.value !== -1) {
		// 编辑
		const { ...editFormData } = formData
		delete editFormData.password
		systemStore.pathEditUserByIdAction(editId.value, editFormData)
	} else {
		// 新增
		systemStore.postNewUserAction({ ...formData })
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
			:title="isAdd ? '新建用户' : '修改用户'"
			width="30%"
			destroy-on-close
			center
		>
			<div class="form">
				<el-form :model="formData" label-width="80px" size="large">
					<el-form-item label="用户名" prop="name">
						<el-input v-model="formData.name" placeholder="请输入用户名"></el-input>
					</el-form-item>
					<el-form-item label="真实姓名" prop="realname">
						<el-input v-model="formData.realname" placeholder="请输入真实姓名"></el-input>
					</el-form-item>
					<el-form-item v-if="isAdd" label="密码" prop="password">
						<el-input v-model="formData.password" placeholder="请输入密码" show-password></el-input>
					</el-form-item>
					<el-form-item label="手机号码" prop="cellphone">
						<el-input v-model="formData.cellphone" placeholder="请输入手机号码"></el-input>
					</el-form-item>
					<el-form-item label="选择角色" prop="roleId">
						<el-select v-model="formData.roleId" placeholder="请选择角色" style="width: 100%">
							<template v-for="item of entireRoles" :key="item.id">
								<el-option :label="item.name" :value="item.id"></el-option>
							</template>
						</el-select>
					</el-form-item>
					<el-form-item label="选择部门" prop="departmentId">
						<el-select v-model="formData.departmentId" placeholder="请选择部门" style="width: 100%">
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
