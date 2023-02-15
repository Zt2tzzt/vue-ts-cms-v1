import { accountLoginRequest, getUserInfoById, getUserMenusByRoleId } from '@/service/login/login'
import type { IAccount, IUserInfoResData, IUserMenuResData } from '@/types'
import { localCache } from '@/utils/cache'
import { defineStore } from 'pinia'
import { LOGIN_TOKEN, USER_INFO, USER_MENU } from '@/global/constance'
import router from '@/router'

interface ILoginState {
	token: string
	userInfo: IUserInfoResData
	userMenu: IUserMenuResData
}

const useLoginStore = defineStore('login', {
	state: (): ILoginState => ({
		token: localCache.getCache(LOGIN_TOKEN) ?? '',
		userInfo: localCache.getCache(USER_INFO) ?? {},
		userMenu: localCache.getCache(USER_MENU) ?? []
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
				}).then(res => {
					console.log('user menu res:', res)
					const userMenu = res.data
					this.userMenu = userMenu
					localCache.setCache(USER_MENU, userMenu)
					router.push('/main')
				})
		}
	}
})

export default useLoginStore
