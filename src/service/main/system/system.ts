import type {  } from '@/types'
import type { IUserQueryParam, IUserCreateFormData, IUsersData, IUserEditFormData, IResponse } from '@/types'
import ztRequest from '@/service'

export const postUsers = (queryParam: IUserQueryParam) =>
	ztRequest.post<IResponse<IUsersData>>({
		url: '/users/list',
		data: queryParam
	})

export const deleteUserById = (id: number) =>
	ztRequest.delete({
		url: 'users/' + id
	})

export const postNewUser = (addParam: IUserCreateFormData) => ztRequest.post({
	url: '/users',
	data: addParam
})

export const pathEditUserById = (id: number, editParam: IUserEditFormData) => ztRequest.patch({
	url: '/users/' + id,
	data: editParam
})
