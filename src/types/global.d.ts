import type {
	IDepartment,
	IDepartmentQueryFormData,
	IDepartmentCreateFormData,
	IDepartmentEditFormDataIRole,
	IDepartmentQueryFormItem
} from './department'
import type {
	IRole,
	IRoleQueryFormData,
	IRoleCreateFormData,
	IRoleEditFormData,
	IRoleQueryFormItem
} from './role'

// 查询
export interface IQueryParam {
	offset: number
	size: number
}

// 返回
export interface IResponseListData<T = any> {
	list: Array<T>
	totalCount: number
}
export interface IResponse<T> {
	code: number
	data: T
}

// PageSearch 配置文件
export interface IQueryFormItem<T> {
	type: 'input' | 'date-picker' | 'select'
	prop: keyof T
	label: string
	placeholder?: string
	initialvalue: T[keyof T]
}

// PageContent 配置文件
export interface IContentProp {
	type?: string
	label: string
	width?: string
	prop?: string
	gener?: string
}

// HookFnType
export type HookFnType = (...args: any[]) => any

// itemType, CreateFormType, EditFormType
export type ItemType = IDepartment | IRole
export type CreateFormType = IDepartmentCreateFormData & IRoleCreateFormData
export type EditFormType = IDepartmentEditFormData & IRoleEditFormData
export type QueryFormDataType = IDepartmentQueryFormData & IRoleQueryFormData
export type QueryFormItemType = IRoleQueryFormItem | IDepartmentQueryFormItem

export interface IModalFormItemGeneral {
	type: string
	label: string
	prop: keyof CreateFormType
	placeholder: string
	options?: Array<{ label: string; value: number }>
}

export interface IModalFormItemCustom {
	type: 'custom'
	slotname?: string
}

// PageModal 配置文件
export type IModalFormItem = IModalFormItemGeneral | IModalFormItemCustom
