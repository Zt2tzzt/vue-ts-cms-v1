import { accountLoginRequest, getUserInfoById, getUserMenusByRoleId } from '@/service/login/login'
import type { IAccount, IUserInfoResData, IMenuInRole } from '@/types'
import { localCache } from '@/utils/cache'
import { defineStore } from 'pinia'
import { LOGIN_TOKEN, USER_INFO, USER_MENU } from '@/global/constance'
import router from '@/router'
import { mapMenusToRoutes } from '@/utils/map-menu'
import useMainStore from '../main/main'

interface ILoginState {
	token: string
	userInfo: IUserInfoResData | object
	userMenus: IMenuInRole[]
}

const dynamicLoadingRoutes = (userMenus: IMenuInRole[]) => {
	const routes = mapMenusToRoutes(userMenus)
	routes.forEach(route => router.addRoute('main', route))
}

const useLoginStore = defineStore('login', {
	state: (): ILoginState => ({
		token: '',
		userInfo: {},
		userMenus: []
	}),
	actions: {
		loginAccountAction(account: IAccount) {
			return accountLoginRequest(account)
				.then(res => {
					console.log('login res:', res)
					this.token = res.data.token
					localCache.setCache(LOGIN_TOKEN, this.token)
					return getUserInfoById(res.data.id)
				})
				.then(res => {
					console.log('user info res:', res)
					const userInfo = res.data
					this.userInfo = userInfo
					localCache.setCache(USER_INFO, userInfo)
					return getUserMenusByRoleId(userInfo.role.id)
				})
				.then(res => {
					console.log('user menu res:', res)
					const userMenus = res.data
					this.userMenus = userMenus
					localCache.setCache(USER_MENU, userMenus)

					// 路由映射
					dynamicLoadingRoutes(userMenus)

					router.push('/main')
				})
		},
		loadLocalCacheAction() {
			// 页面载入、刷新，从缓存中加载数据
			const token = localCache.getCache(LOGIN_TOKEN)
			const userInfo = localCache.getCache(USER_INFO)
			const userMenus = localCache.getCache(USER_MENU)
			if (token && userInfo && userMenus) {
				this.token = token
				this.userInfo = userInfo
				this.userMenus = userMenus

				const mainStore = useMainStore()
				mainStore.fetchEntireDataAction()

				dynamicLoadingRoutes(userMenus)
			}
		}
	}
})

export default useLoginStore
