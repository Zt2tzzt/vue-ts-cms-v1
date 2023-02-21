import { defineStore } from 'pinia'
import { getEntireRoles, getEntireDepartment } from '@/service/main/main'
import type { IRole, IDepartment } from '@/types';

interface IMainStore {
	entireRoles: IRole[]
entireDepartments: IDepartment[]
}

const useMainStore = defineStore('main', {
	state: (): IMainStore => ({
		entireRoles: [],
		entireDepartments: []
	}),
	actions: {
		fetchEntireDataAction() {
			getEntireRoles().then(res => {
				console.log('role res:', res)
				this.entireRoles = res.data.list
			})
			getEntireDepartment().then(res => {
				console.log('department res:', res)
				this.entireDepartments = res.data.list
			})
		}
	}
})

export default useMainStore
