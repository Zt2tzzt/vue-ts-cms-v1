import ztRequest from '..'
import type { IDepartmentsResult, IRoleSResult, IResponse } from '@/types'

export const getEntireRoles = () =>
	ztRequest.post<IResponse<IRoleSResult>>({
		url: '/role/list'
	})

export const getEntireDepartment = () =>
	ztRequest.post<IResponse<IDepartmentsResult>>({
		url: '/department/list'
	})
