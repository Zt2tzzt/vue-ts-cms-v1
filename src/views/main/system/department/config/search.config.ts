import type { IDepartmentQueryFormData } from '@/types'

export interface IDepartmentFormItem {
	type: 'input' | 'date-picker' | 'select'
	prop: keyof IDepartmentQueryFormData
	label: string
	placeholder?: string
	initialvalue: IDepartmentQueryFormData[keyof IDepartmentQueryFormData]
}

const formItems: IDepartmentFormItem[] = [
	{
		type: 'input',
		prop: 'name',
		label: '部门名称',
		placeholder: '请输入查询的部门名称',
		initialvalue: ''
	},
	{
		type: 'input',
		prop: 'leader',
		label: '部门领导',
		placeholder: '请输入查询的领导名称',
		initialvalue: ''
	},
	{
		type: 'date-picker',
		prop: 'createAt',
		label: '创建时间',
		initialvalue: ''
	}
]

export default {
	formItems
}
