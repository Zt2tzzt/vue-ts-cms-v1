import type { IResponseListData, ISearchFormItem } from './global'

// 角色
export interface IMenuInRoleChild2 {
	id: number
	url: any
	name: string
	sort: any
	type: 3
	parentId: number
	permission: string
}

export interface IMenuInRoleChild {
	id: number
	url: string
	name: string
	sort: number
	type: 2
	children?: Array<IMenuInRoleChild2>
	parentId: number
}

export interface IMenuInRole {
	id: number
	name: string
	type: 1
	url: string
	icon: string
	sort: number
	children: Array<IMenuInRoleChild>
}

export interface IRole {
	id: number
	name: string
	intro: string
	createAt: string
	updateAt: string
	menuList: Array<IMenuInRole>
}

// SearchFormData
export interface IRoleSearchFormData {
	name: string
	intro: string
	createAt: string | string[]
}

// CreateFormData
export interface IRoleCreateFormData {
	name: string
	intro: string
}

export type IRoleSearchFormItem = ISearchFormItem<IRoleSearchFormData>

export type IRoleEditFormData = Partial<IRoleCreateFormData>

export type IRoleSResult = IResponseListData<IRole>

export interface IRoleCreateFormData {
	name: string
	intro: string
}
