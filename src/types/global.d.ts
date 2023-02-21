// 部门
export interface IDepartment {
	id: number
	name: string
	parentId: number
	createAt: string
	updateAt: string
	leader: string
}

export interface IDepartmentsResult {
	list: Array<IDepartment>
	totalCount: number
}

// 角色
export interface IMenuChild2 {
	id: number
	url: any
	name: string
	sort: any
	type: number
	parentId: number
	permission: string
}

export interface IMenuChild {
	id: number
	url: string
	name: string
	sort: number
	type: number
	children?: Array<IMenuChild2>
	parentId: number
}

export interface IMenu {
	id: number
	name: string
	type: number
	url: string
	icon: string
	sort: number
	children: Array<IMenuChild>
}

export interface IRole {
	id: number
	name: string
	intro: string
	createAt: string
	updateAt: string
	menuList: Array<IMenu>
}

export interface IRoleSResult {
	list: Array<IRole>
	totalCount: number
}


export interface IResponse<T> {
	code: number
	data: T
}
