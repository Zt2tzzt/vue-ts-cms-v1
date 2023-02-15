export interface IAccount {
	name: string
	password: string
}

export interface ILoginResData {
	id: number
	name: string
	token: string
}

export interface IUserInfoResData {
	id: number
	name: string
	realname: string
	cellphone: number
	enable: number
	createAt: string
	updateAt: string
	role: {
		id: number
		name: string
		intro: string
		createAt: string
		updateAt: string
	}
	department: {
		id: number
		name: string
		parentId: any
		createAt: string
		updateAt: string
		leader: string
	}
}

export interface IUserMenuChild {
	id: number
	url: string
	name: string
	sort: number
	type: number
	children?: Array<{
		id: number
		url: any
		name: string
		sort: any
		type: number
		parentId: number
		permission: string
	}>
	parentId: number
}


export type IUserMenuResData = Array<{
	id: number
	name: string
	type: number
	url: string
	icon: string
	sort: number
	children: Array<IUserMenuChild>
}>

export interface IResponse<T> {
	code: number
	data: T
}
