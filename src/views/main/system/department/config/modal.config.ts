import { DEPARTMENT } from '@/global/constance'
import type { IDepartmentCreateFormData } from '@/types'

export interface IDepartmentFormItem {
	type: string
	label: string
	prop: keyof IDepartmentCreateFormData
	placeholder: string
	options?: Array<{label: string, value: number}>
}

const formItems: IDepartmentFormItem[] = [
	{ type: 'input', label: '部门名称', prop: 'name', placeholder: '请输入部门名称' },
	{ type: 'input', label: '部门领导', prop: 'leader', placeholder: '请输入部门领导' },
	{ type: 'select', label: '上级部门', prop: 'parentId', placeholder: '请选择上级部门', options: [] }
]

export default {
	pageName: DEPARTMENT,
	header: {
		newBtnLabel: '新建部门',
		editBtnLabel: '编辑部门'
	},
	formItems
}
