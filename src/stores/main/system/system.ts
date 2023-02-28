import type { IUserQueryParam, IUser, IUserCreateFormData, IUserEditFormData, IResponseListData } from '@/types'
import {
	postUsers,
	deleteUserById,
	postNewUser,
	pathEditUserById,
	postPageList,
	deletePageById,
	postNewPageRecord,
	pathEditPageRecordById
} from '@/service/main/system/system'
import { defineStore } from 'pinia'
import { DEPARTMENT, ROLE, MENU } from '@/global/constance'
import useMainStore from '../main'

const fetchEntireData = (pageName: string) => {
	if ([DEPARTMENT, ROLE, MENU].includes(pageName)) {
		const mainStore = useMainStore()
		mainStore.fetchEntireDataAction()
	}
}

interface ISystemStore {
	users: IUser[]
	usersTotalCount: number

	pageList: any[]
	pageTotalCount: number
}

const useSystemStore = defineStore('system', {
	state: (): ISystemStore => ({
		users: [],
		usersTotalCount: 0,

		pageList: [],
		pageTotalCount: 0
	}),
	actions: {
		// User
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
				this.postUsersAction({ offset: 0, size: 10 })
			})
		},
		pathEditUserByIdAction(id: number, editParam: IUserEditFormData) {
			console.log('user editParam:', editParam)
			pathEditUserById(id, editParam).then(res => {
				console.log('user edit res:', res)
				this.postUsersAction({ offset: 0, size: 10 })
			})
		},

		// 通用的封装
		postPageListAction<T>(pageName: string, queryParam: T) {
			console.log(pageName, 'queryParam:', queryParam)
			postPageList<T, IResponseListData>(pageName, queryParam).then(res => {
				console.log(pageName, 'res:', res)
				this.pageList = res.data.list
				this.pageTotalCount = res.data.totalCount
			})
		},
		deletePageByIdAction(pageName: string, id: number) {
			deletePageById(pageName, id).then(res => {
				console.log(pageName, 'delete res:', res)
				this.postPageListAction(pageName, { offset: 0, size: 10 })

				// 如果是部门，角色，菜单等基础数据发生增、删、改操作，要重显加载到缓存中。
				fetchEntireData(pageName)
			})
		},
		postNewPageRecordAction<T>(pageName: string, record: T) {
			postNewPageRecord(pageName, record).then(res => {
				console.log(pageName, 'add res:', res)
				this.postPageListAction(pageName, { offset: 0, size: 10 })

				// 如果是部门，角色，菜单等基础数据发生增、删、改操作，要重显加载到缓存中。
				fetchEntireData(pageName)
			})
		},
		pathEditPageRecordByIdAction<T>(pageName: string, id: number, record: T) {
			pathEditPageRecordById(pageName, id, record).then(res => {
				console.log(pageName, 'edit res:', res)
				this.postPageListAction(pageName, { offset: 0, size: 10 })

				// 如果是部门，角色，菜单等基础数据发生增、删、改操作，要重显加载到缓存中。
				fetchEntireData(pageName)
			})
		}
	}
})

export default useSystemStore
