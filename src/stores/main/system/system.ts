import type { IUserQueryParam, IUser, IUserCreateFormData, IUserEditFormData } from '@/types';
import { postUsers, deleteUserById, postNewUser, pathEditUserById } from "@/service/main/system/system";
import { defineStore } from "pinia";
import { EditPen } from '@element-plus/icons-vue';

interface ISystemStore {
	users: IUser[]
	usersTotalCount: number
}

const useSystemStore = defineStore('system', {
	state: (): ISystemStore => ({
		users: [],
		usersTotalCount: 0
	}),
	actions: {
		postUsersAction(queryParam: IUserQueryParam) {
			console.log('user query param:', queryParam)
			postUsers(queryParam).then(res => {
				console.log('users res:', res)
				this.users = res.data.list
				this.usersTotalCount = res.data.totalCount
			})
		},
		deleteUserByIdAction(id: number) {
			deleteUserById(id).then(res => {
				console.log('user detete res:', res)
				this.postUsersAction({ offset: 0, size: 10 })
			})
		},
		postNewUserAction(addParam: IUserCreateFormData) {
			console.log('user addParam:', addParam)
			postNewUser(addParam).then(res => {
				console.log('user add res:', res)
				this.postUsersAction({ offset: 0, size: 10  })
			})
		},
		pathEditUserByIdAction(id: number, editParam: IUserEditFormData) {
			console.log('user editParam:', editParam)
			pathEditUserById(id, editParam).then(res => {
				console.log('user edit res:', res)
				this.postUsersAction({ offset: 0, size: 10  })
			})
		}
	}
})

export default useSystemStore
