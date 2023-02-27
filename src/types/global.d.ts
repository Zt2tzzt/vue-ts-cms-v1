import type {
	IDepartment,
	IDepartmentSearchFormData,
	IDepartmentCreateFormData,
	IDepartmentEditFormDataIRole,
	IDepartmentSearchFormItem
} from './department'
import type {
	IRole,
	IRoleSearchFormData,
	IRoleCreateFormData,
	IRoleEditFormData,
	IRoleSearchFormItem
} from './role'

// 查询
export interface ISearchParam {
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

// itemType, CreateFormDataType, EditFormDataType
export type ItemType = IDepartment | IRole
export type CreateFormDataType = IDepartmentCreateFormData & IRoleCreateFormData
export type EditFormDataType = IDepartmentEditFormData & IRoleEditFormData
export type SearchFormDataType = IDepartmentSearchFormData & IRoleSearchFormData
export type SearchFormItemType = IRoleSearchFormItem | IDepartmentSearchFormItem

// PageSearch 配置文件
export interface ISearchFormItem<T> {
	type: 'input' | 'date-picker' | 'select'
	prop: keyof T
	label: string
	placeholder?: string
	initialvalue: T[keyof T]
}

export interface ISearchConfig {
	pageName: string
	labelWidth?: string
	formItems: SearchFormItemType[]
}

// PageContent 配置文件
export interface IContentProp {
	label: string
	width?: string
	prop?: string
	type?: 'selection' | 'index'
	gener?: 'handler' | 'timer' | 'custom'
}

export interface IContentConfig {
	pageName: string
	header: {
		title: string
		btnLabel: string
	}
	propList: Array<IContentProp>
	// 子树
	childrenTree?: {
		rowKey: string
		treeProps: {
			children: string
		}
	}
}

// PageModal 配置文件
export interface IModalFormItemGeneral {
	type: string
	label: string
	prop: keyof CreateFormDataType
	placeholder: string
	options?: Array<{ label: string; value: number }>
}

export interface IModalFormItemCustom {
	type: 'custom'
	slotname?: string
}

export type IModalFormItem = IModalFormItemGeneral | IModalFormItemCustom

export interface IModalConfig {
	pageName: string
	header: {
		newBtnLabel: string
		editBtnLabel: string
	}
	formItems: IModalFormItem[]
}

// HookFnType
export type HookFnType = (...args: any[]) => any
