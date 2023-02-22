import { IQueryParam } from './global';

export interface IDepartmentCreateFormData {
	name: ''
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

export interface IDepartment {
	id: number
	name: string
	parentId: number
	createAt: string
	updateAt: string
	leader: string
}

