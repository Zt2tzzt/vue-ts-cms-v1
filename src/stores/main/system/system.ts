import type { IUser } from '@/types';
import { postUsers } from "@/service/main/system/system";
import { defineStore } from "pinia";

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
		postUsersAction() {
			postUsers().then(res => {
				this.users = res.data.list
				this.usersTotalCount = res.data.totalCount
			})
		}
	}
})

export default useSystemStore
