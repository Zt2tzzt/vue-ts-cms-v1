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

export interface IUserMenuChild2 {
	id: number
	url: any
	name: string
	sort: any
	type: 3
	parentId: number
	permission: string
}

export interface IUserMenuChild {
	id: number
	url: string
	name: string
	sort: number
	type: 2
	children?: Array<IUserMenuChild2>
	parentId: number
}

export interface IUserMenuFather {
	id: number
	url: string
	name: string
	sort: number
	type: 1
	icon: string
	children: Array<IUserMenuChild>
}

export interface IBreadcrumb {
	name: string,
	path: string
}

export type IUserMenuResData = Array<IUserMenuFather>

export interface IResponse<T> {
	code: number
	data: T
}
