import { accountLoginRequest, getUserInfoById, getUserMenusByRoleId } from '@/service/login/login'
import type { IAccount, IUserInfoResData, IMenuInRole } from '@/types'
import { localCache } from '@/utils/cache'
import { defineStore } from 'pinia'
import { LOGIN_TOKEN, USER_ID, USER_INFO, USER_MENU } from '@/global/constance'
import router from '@/router'
import { mapMenusToRoutes, mapMenusToPermission } from '@/utils/map-menu'
import useMainStore from '../main/main'

interface ILoginState {
  token: string
  userId: number
  userInfo: IUserInfoResData | object
  userMenus: IMenuInRole[]
  permissions: string[]
}

const dynamicLoadingPermissionAndRoutes = (state: ILoginState, userMenus: IMenuInRole[]) => {
  // 加载按钮的权限
  const permissions = mapMenusToPermission(userMenus)
  state.permissions = permissions

  // 动态添加路由
  const routes = mapMenusToRoutes(userMenus)
  routes.forEach(route => router.addRoute('main', route))
}

const useLoginStore = defineStore('login', {
  state: (): ILoginState => ({
    token: '',
    userId: -1,
    userInfo: {},
    userMenus: [],
    permissions: []
  }),
  actions: {
    loginAccountAction(account: IAccount) {
      return accountLoginRequest(account).then(res => {
        console.log('login res:', res)
        this.token = res.data.token
        this.userId = res.data.id
        localCache.setCache(LOGIN_TOKEN, this.token)
        localCache.setCache(USER_ID, this.userId)
        // return getUserInfoById(res.data.id)
        this.getUserInfoAndMenus(res.data.id)
      })
    },
    getUserInfoAndMenus(userId: number) {
      getUserInfoById(userId)
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
          dynamicLoadingPermissionAndRoutes(this, userMenus)

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

        dynamicLoadingPermissionAndRoutes(this, userMenus)
      }
    }
  }
})

export default useLoginStore
