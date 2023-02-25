import type { IMenuInRole, IMenuInRoleChild, IMenuInRoleChild2 } from '@/types'
import type { RouteRecordRaw } from 'vue-router'

/**
 * @description: 此函数用于：从文件中（src/router/main/... 目录下）加载路由对象。
 * @Author: ZeT1an
 * @return {RouteRecordRaw[]} 本地的路由对象列表
 */
const loadLocalRoutes = (): RouteRecordRaw[] => {
	const files: Record<string, any> = import.meta.glob('../router/main/**/*.ts', {
		eager: true
	})

	return Object.keys(files).map(key => {
		const moudle = files[key]
		return moudle.default
	})
}

export let firstRoute: RouteRecordRaw

/**
 * @description: 此函数用于：根据用户拥有的菜单，筛选出对应的本地路由（用于 loginStore 中，获取 userMenus 后，进行路由映射）。
 * @Author: ZeT1an
 * @param {IMenuInRole[]} userMenu 用户菜单列表
 * @return {RouteRecordRaw[]} 菜单映射后的路由列表
 */
export const mapMenusToRoutes = (userMenu: IMenuInRole[]): RouteRecordRaw[] => {
	const localRoutes = loadLocalRoutes()

	const routes: RouteRecordRaw[] = []

	const _getRoute = (userMenu: IMenuInRole[] | IMenuInRoleChild[]) => {
		userMenu.forEach(item => {
			switch (item.type) {
				case 1:
					routes.push({ path: item.url, redirect: '' })
					if (Array.isArray(item.children)) _getRoute(item.children)
					break
				case 2:
					const route = localRoutes.find(lr => lr.path === item.url)
					if (route) {
						// 点击一级面包屑，返回大类里的重定向路由。
						const redirectRoute = routes.find(r => !r.redirect && item.url.includes(r.path))
						if (redirectRoute) redirectRoute.redirect = route.path

						if (!firstRoute) firstRoute = route
						routes.push(route)
					}
					break
			}
		})
	}
	_getRoute(userMenu)

	return routes
}

/**
 * @description: 此函数用于：根据用户拥有的菜单，筛选出对应的权限 id（用于 Role 中，创建/编辑角色时，展示角色拥有的菜单）
 * @Author: ZeT1an
 * @param {IMenuInRole} menuList
 * @return {*}
 */
export const mapMenusToIds = (menuList: IMenuInRole[]): number[] => {
	const ids: number[] = []

	const _getIds = (menuList: IMenuInRole[] | IMenuInRoleChild[] | IMenuInRoleChild2[]) => {
		menuList.forEach(menu => {
			if ('children' in menu && menu.children) {
				_getIds(menu.children)
			} else {
				ids.push(menu.id)
			}
		})
	}
	_getIds(menuList)

	return ids
}
