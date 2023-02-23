import { IQueryParam } from './global';

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

export interface IUserQueryFormData extends IUserFormDataBasic {
	enable: number
	createAt: string | string[]
}

type IUserQueryFormDataPartial = Partial<IUserQueryFormData>

export type IUserQueryParam = IQueryParam & IUserQueryFormDataPartial

// 返回结果
export interface IUser extends IUserRoleAndDepartment, IUserQueryFormData {
	id: number
	cellphone: number
	roleId: number
  departmentId: number
	createAt: string
	updateAt: string
}
