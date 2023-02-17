import { localCache } from '@/utils/cache'
import { createRouter, createWebHashHistory } from 'vue-router'
import { LOGIN_TOKEN } from '@/global/constance'

const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			redirect: '/main'
		},
		{
			path: '/login',
			component: () => import('../views/login/Login.vue')
		},
		{
			path: '/main',
			component: () => import('../views/main/Main.vue')
		},
		{
			path: '/:pathMatch(.*)',
			component: () => import('../views/not-found/NotFound.vue')
		}
	]
})

router.beforeEach(to => {
	const token = localCache.getCache(LOGIN_TOKEN)
	if (to.path.startsWith('/main') && !token) {
		return '/login'
	}
})

export default router
