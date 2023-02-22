import { IResponseListData } from './global.d';
import { IResponse } from '@/types';
// 部门
export interface IDepartment {
	id: number
	name: string
	parentId: number
	createAt: string
	updateAt: string
	leader: string
}

// 角色
export interface IMenuChild2 {
	id: number
	url: any
	name: string
	sort: any
	type: number
	parentId: number
	permission: string
}

export interface IMenuChild {
	id: number
	url: string
	name: string
	sort: number
	type: number
	children?: Array<IMenuChild2>
	parentId: number
}

export interface IMenu {
	id: number
	name: string
	type: number
	url: string
	icon: string
	sort: number
	children: Array<IMenuChild>
}

export interface IRole {
	id: number
	name: string
	intro: string
	createAt: string
	updateAt: string
	menuList: Array<IMenu>
}

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

export type IRoleSResult = IResponseListData<IRole>

export type IDepartmentsResult = IResponseListData<IDepartment>

export interface IResponse<T> {
	code: number
	data: T
}
