import type {
	IUserQueryParam,
	IUserCreateFormData,
	IUserEditFormData,
	IUser,
	IResponseListData,
	IResponse
} from '@/types'
import ztRequest from '@/service'

// user
export const postUsers = (queryParam: IUserQueryParam) =>
	ztRequest.post<IResponse<IResponseListData<IUser>>>({
		url: '/users/list',
		data: queryParam
	})

export const deleteUserById = (id: number) =>
	ztRequest.delete({
		url: 'users/' + id
	})

export const postNewUser = (addParam: IUserCreateFormData) =>
	ztRequest.post({
		url: '/users',
		data: addParam
	})

export const pathEditUserById = (id: number, editParam: IUserEditFormData) =>
	ztRequest.patch({
		url: '/users/' + id,
		data: editParam
	})

// 通用的封装
export const postPageList = <T, R>(pageName: string, queryParam: T) =>
	ztRequest.post<IResponse<R>>({
		url: `/${pageName}/list`,
		data: queryParam
	})

export const deletePageById = (pageName: string, id: number) =>
	ztRequest.delete({
		url: `/${pageName}/${id}`
	})

export const postNewPageRecord = <T>(pageName: string, record: T) =>
	ztRequest.post({
		url: `/${pageName}`,
		data: record
	})

export const pathEditPageRecordById = <T>(pageName: string, id: number, record: T) =>
	ztRequest.patch({
		url: `/${pageName}/${id}`,
		data: record
	})
