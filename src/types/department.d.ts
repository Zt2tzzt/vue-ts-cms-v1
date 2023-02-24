import { IQueryFormItem,IQueryParam, IResponseListData } from './global';

export interface IDepartmentCreateFormData {
	name: string
	leader: string
	parentId: number | ''
}

export type IDepartmentEditFormData = Partial<IDepartmentCreateFormData>

export interface IDepartmentQueryFormData {
	name: string
	leader: string
	createAt: string | string[]
}

export type IDepartmentQueryParam = IQueryParam & Partial<IDepartmentQueryFormData>

export type IDepartmentQueryFormItem = IQueryFormItem<IDepartmentQueryFormData>

export interface IDepartment {
	id: number
	name: string
	parentId: number
	createAt: string
	updateAt: string
	leader: string
}

export type IDepartmentsResult = IResponseListData<IDepartment>


