export interface IUser {
	id: number
	name: string
	realname: string
	cellphone: number
	enable: number
	departmentId: number
	roleId: number
	createAt: string
	updateAt: string
}

export interface IUsersData {
	list: Array<IUser>
	totalCount: number
}
