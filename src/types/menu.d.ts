import type { IMenuInRoleChild2, IMenuInRoleChild, IMenuInRole } from './role'

export interface IMenuChild2 extends IMenuInRoleChild2 {
	createAt: string
	updateAt: string
}

export interface IMenuChild extends IMenuInRoleChild {
	createAt: string
	parentId: number
	updateAt: string
	children: Array<IMenuChild2>
}

export interface IMenu extends IMenuInRole {
	createAt: string
	updateAt: string
	children: Array<IMenuChild>
}

export interface IMenuResult {
	list: Array<IMenu>
}
