import { IQueryParam } from './global'

interface IUserFormDataBasic {
	name: string
	realname: string
	cellphone: number | ''
}

interface IUserRoleAndDepartment {
	roleId: number | ''
	departmentId: number | ''
}

export interface IUserCreateFormData extends IUserFormDataBasic, IUserRoleAndDepartment {
	password: string
}

export type IUserEditFormData = Partial<IUserFormDataBasic & IUserRoleAndDepartment>

export interface IUserSearchFormData extends IUserFormDataBasic {
	enable: number
	createAt: string | string[]
}

type IUserSearchFormDataPartial = Partial<IUserSearchFormData>

export type IUserQueryParam = IQueryParam & IUserSearchFormDataPartial

// 返回结果
export interface IUser extends IUserRoleAndDepartment, IUserSearchFormData {
	id: number
	cellphone: number
	roleId: number
	departmentId: number
	createAt: string
	updateAt: string
}
