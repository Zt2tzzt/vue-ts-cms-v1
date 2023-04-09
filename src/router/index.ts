import { localCache } from '@/utils/cache'
import { createRouter, createWebHashHistory } from 'vue-router'
import { LOGIN_TOKEN } from '@/global/constance'
import { firstRoute } from '@/utils/map-menu'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/main'
    },
    {
      path: '/login',
      component: () => import('../views/login/LogIn.vue')
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../views/main/MainPanel.vue')
    },
    {
      path: '/:pathMatch(.*)',
      component: () => import('../views/not-found/NotFound.vue')
    }
  ]
})

router.beforeEach(to => {
  const token = localCache.getCache(LOGIN_TOKEN)

  if (to.path.startsWith('/main')) {
    if (!token) return '/login'

    if (to.path === '/main') return firstRoute?.path
  }
})

export default router
