import type { IResponse, IUsersData } from '@/types'
import ztRequest from '@/service'

export const postUsers = () =>
	ztRequest.post<IResponse<IUsersData>>({
		url: '/users/list',
		data: {
			offset: 0,
			size: 10
		}
	})
