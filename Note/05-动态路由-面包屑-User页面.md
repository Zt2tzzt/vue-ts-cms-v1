# 一、动态添加路由

## 1.思路整理

[回顾 RBAC 设计的三种方案](./04-登录退出-用户权限-菜单树-头部区域-注册路由.md/#5RBAC 设计思想理解)

基于角色添加路由（方案二）步骤：

1. 在前端维护角色，以及角色对应的路由。

2. 后端返回角色后，进行匹配，并动态添加路由。

基于菜单动态匹配的方案（方案三）步骤：

1. 获取用户的菜单信息（已在 store 中），

2. 创建组件，以及组件对应的路由。

   - 可以使用自动化工具创建。

3. 从文件中读取所有的路由。

4. 根据用户菜单，筛选路由对象，并动态添加路由。

项目中采用方案三。

## 2.创建页面和路由

在 router 目录下，创建与 view 目录下，相同的目录结构。

在每个文件中导出对应的路由对象。

这个过程，使用一个自动化工具 _coderwhy_，自动生成 view 目录下的 vue 组件，和 router 目录下的路由对象。

1.安装 _coderwhy_ 工具

```shell
npm install coderwhy -D

npx coderwhy --version
```

2.使用工具，比如要创建 `Department` 路由对象，以及 `Department.vue` 组件，可以执行以下命令。

```shell
npx coderwhy add3page_setup Department -d src/views/main/system/department
```

- `add3page_setup` 表示创建的是 Vue3 setup 语法的 Vue 组件。
- `Department` 表示创建 `Department.vue` 组件和 `Department.ts` 路由对象文件。
- `-d` 表示创建 `Department.vue` 组件所在的路径，同时会映射到 router 目录下。

> 采用方案三（后端返回菜单）时，一般参考后端返回的路径，来创建相应路径下的组件。
>
> 比如返回的这样的路径：`/main/analysis/overview`

## 3.从本地文件中读取路由

1.封装一个工具函数，在其中返回一个保存路由对象的数组。

2.使用打包工具提供的 API，读取文件。

- webpack：`require.context`
- vite：`import.meta.glob()`

默认取到的是一个对象，

- 其中 key 是文件的路径文本，value 是对应加载文件的 get 函数。

这种方式通常用于懒加载。

```typescript
import.meta.glob('../../router/main/**/*.ts')
```

添加一个参数 `{eager: true}`。取到的是一个对象。

- 其中 key 是文件路径文本，value 是对应的文件模块。

```typescript
import.meta.glob('../../router/main/**/*.ts', { eager: true })
```

src\utils\map-menu.ts

```typescript
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
```

## 4.根据菜单映射路由

封装一个工具函数 `mapMenusToRoutes`，在其中返回一个数组，里面是用户菜单映射后的路由对象列表。

src\utils\map-menu.ts

```typescript
import type { IUserMenuResData, IUserMenuChild } from '@/types'

/**
 * @description: 此函数用于：根据用户拥有的菜单，筛选出对应的本地路由（用于 loginStore 中，获取 userMenus 后，进行路由映射）。
 * @Author: ZeT1an
 * @param {IUserMenuResData[]} userMenu 用户菜单列表
 * @return {RouteRecordRaw[]} 菜单映射后的路由列表
 */
export const mapMenusToRoutes = (userMenu: IUserMenuResData[])： RouteRecordRaw[] => {
	const localRoutes = loadLocalRoutes()

	const routes: RouteRecordRaw[] = []

	const _getRoute = (userMenu: IUserMenuResData[] | IUserMenuChild[]) => {
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
						routes.push(route)
					}
					break
			}
		})
	}
	_getRoute(userMenu)

	return routes
}
```

src\stores\login\login.ts

```typescript
const routes = mapMenusToRoutes(userMenus)
routes.forEach(route => router.addRoute('main', route))
```

## 5.登陆后匹配第一个页面

定义一个全局变量 `firstRoute`，用于保存第一个匹配到的路由。

src\utils\map-menu.ts

```typescript
import type { IUserMenuResData[], IUserMenuChild } from '@/types'

export let firstRoute: RouteRecordRaw // 用于保存第一个路由。

/**
 * @description: 此函数用于：根据用户拥有的菜单，筛选出对应的本地路由（用于 loginStore 中，获取 userMenus 后，进行路由映射）。
 * @Author: ZeT1an
 * @param {IUserMenuResData[]} userMenu 用户菜单列表
 * @return {RouteRecordRaw[]} 菜单映射后的路由列表
 */
export const mapMenusToRoutes = (userMenu: IUserMenuResData[]) => {
	const localRoutes = loadLocalRoutes()

	const routes: RouteRecordRaw[] = []

	const _getRoute = (userMenu: IUserMenuResData[] | IUserMenuChild[]) => {
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
```

在导航守卫中，编写逻辑，路由为 `/main` 时，跳转到第一个匹配的路由。

src\router\index.ts

```typescript
//...
import { firstRoute } from '@/utils/map-menu'

//...

router.beforeEach(to => {
	const token = localCache.getCache(LOGIN_TOKEN)

	if (to.path.startsWith('/main')) {
		if (!token) return '/login'

		if (to.path === '/main') return firstRoute?.path
	}
})
```

## 6.刷新后保持路由映射

上述操作后；如果刷新页面，动态添加的路由，全都消失了；

所以在刷新页面后，需要在缓存中重新加载路由并动态添加路由。

在 `loginStore` 中声明一个 action `loadLocalCacheAction`

src\stores\login\login.ts

```typescript
//...
const dynamicLoadingRoutes = (userMenus: IUserMenuResData[]) => {
	const routes = mapMenusToRoutes(userMenus)
	routes.forEach(route => router.addRoute('main', route))
}

//...
const actions = {
  loadLocalCacheAction() {
    // 页面载入、刷新，从缓存中加载数据
    const token = localCache.getCache(LOGIN_TOKEN)
    const userInfo = localCache.getCache(USER_INFO)
    const userMenus = localCache.getCache(USER_MENU)
    if (token && userInfo && userMenus) {
      this.token = token
      this.userInfo = userInfo
      this.userMenus = userMenus

      dynamicLoadingRoutes(userMenus)
    }
  }
}
```

在 `main.ts` 中，`use(pinia)` 后，就去读取本地缓存，并动态添加路由。

将该操作封装成一个插件。

src\stores\index.ts

```typescript
import { createPinia } from 'pinia'
import type { App } from 'vue'
import useLoginStore from './login/login'

const pinia = createPinia()

const registerStore = (app: App<Element>) => {
	// 1.安装 pinia 插件
	app.use(pinia)
	// 2.加载本地数据
	const loginStore = useLoginStore()
	loginStore.loadLocalCacheAction()
}

export default registerStore
```

`use(router)` 放在 `use(pinia)` 之后。以免加载页面时，无法匹配到路由。

src\main.ts

```typescript
import store from './stores'
//...
app.use(store)
app.use(router)
```

## 7.登陆/刷新匹配菜单索引

上述操作，使得登陆后匹配到了第一个路由，刷新页面后，动态添加的路由，仍然存在；

但菜单索引又回到了第一个。这是不对的。

刷新页面时，还需要再匹配当前页对应的菜单索引，并进行设置。

封装一个工具函数 `mapPathToMenu`，返回当前页 url（`route.path`）匹配到的菜单对象。

src\utils\map-path.ts

```typescript
import type { IUserMenuResData, IUserMenuChild, IBreadcrumb } from '@/types'

/**
 * @description: 此函数用于：根据当前路径，匹配用户菜单（用于 MainMenu.vue 中显示激活的菜单索引），
 * @Author: ZeT1an
 * @param {string} path 当前路径
 * @param {IUserMenuResData[]} userMenus 用户菜单列表
 * @return {IUserMenuChild | undefined} 激活的菜单，或者未匹配到/
 */
export const mapPathToMenu = (
	path: string,
	userMenus: IUserMenuResData[] | IUserMenuChild[],
): IUserMenuChild | undefined => {
	for (const item of userMenus) {
		switch (item.type) {
			case 1:
				const findMenu = mapPathToMenu(path, item.children ?? [])
				if (findMenu) {
					return findMenu
				}
				break
			case 2:
				if (item.url === path) return item
				break
		}
	}
}
```

在 `MainMenu.vue` 中使用该工具，获取菜单对象，取出其中的索引。

使用 `computed` 是因为第一次获取到的是空值，需要响应式的获取。

src\components\main-menu\MainMenu.vue

```typescript
const defaultActive = computed(() => {
	const menu = mapPathToMenu(route.path, userMenu)
	return menu ? menu.id + '' : '-1'
})
```

# 二、MainHeader 里的面包屑

封装一个工具 `mapPathToBreadcrumb`，用来将当前路由匹配面包屑。

src\utils\map-path.ts

```typescript
/**
 * @description: 此函数用于：根据当前路径，匹配用户菜单（用于 MainMenu.vue 中显示激活的菜单索引），
 * @Author: ZeT1an
 * @param {string} path 当前路径
 * @param {IUserMenuResData[]} userMenus 用户菜单列表
 * @return {IUserMenuChild | undefined} 激活的菜单，或者未匹配到/
 */
export const mapPathToMenu = (
	path: string,
	userMenus: IUserMenuResData[] | IUserMenuChild[],
	breadcrumb?: IBreadcrumb[]
): IUserMenuChild | undefined => {

	for (const item of userMenus) {
		switch (item.type) {
			case 1:
				const findMenu = mapPathToMenu(path, item.children ?? [])
				if (findMenu) {
					breadcrumb?.push({ name: item.name, path: item.url }) // 一层菜单
					breadcrumb?.push({ name: findMenu.name, path: findMenu.url })
					return findMenu
				}
				break
			case 2:
				if (item.url === path) return item
				break
		}
	}
}

/**
 * @description: 此函数用于：根据当前路径，匹配面包屑（用于 MainHeader.vue 中显示面包屑）
 * @Author: ZeT1an
 * @param {string} path 当前路径
 * @param {IUserMenuResData[]} userMenus 用户菜单列表
 * @return {IBreadcrumb[]} 面包屑列表
 */
export const mapPathToBreadcrumb = (
	path: string,
	userMenus: IUserMenuResData[] | IUserMenuChild[]
): IBreadcrumb[] => {
	const breadcrumbs: IBreadcrumb[] = []
	mapPathToMenu(path, userMenus, breadcrumbs)
	return breadcrumbs
}
```

> 当要从循环中直接返回结果时，`for...of` 比 `forEach` 更合适。

使用计算属性，获取响应式的面包屑。

src\components\main-header\cpns\Breadcrumb.vue

```typescript
const breadcrumbs = computed(() => mapPathToBreadcrumb(route.path, loginStore.userMenus))
```

# 三、User.vue 页面

## 1.搜索页面

### 1.表单区域

创建 `UserSearch.vue` 页面。

使用 `<el-form>` 布局搜索区域。

每行暂定放三个 input 框。使用 UI 框架的 Layout 布局。

- `<el-raw>` 和 `<el-col>`

改变 `<el-form>` 中 `<el-form-item>` 的高度。

- 修改 `<el-form-item>` padding，调整间距。

> 为了方便扩展，一个 `<el-raw>` 中允许放多个 `<el-col>`，
>
> 根据其上的 `span` 属性数值，控制是否进行换行显示。
>
> 一个 `<el-raw>` 的宽度是 `24`

src\views\main\system\user\cpns\UserSearch.vue

### 2.按钮区域

”重置“和”搜索“按钮编写。

重置功能编写，如果要使用 UI 框架（Element Plus）提供的 API，需要进行以下设置。

- 给 `<el-form>` 加上 `model` 属性。
- 给 `<el-form-item>` 加上 `prop` 属性，对应 `model` 中的键值。

src\views\main\system\user\cpns\UserSearch.vue

```typescript
const onResetClick = () => {
	formRef.value?.resetFields()
}
```

## 2.UI 框架国际化

具体操作参考[官方文档](https://element-plus.org/zh-CN/guide/i18n.html)

在 `App.vue` 中配置。

src\App.vue

```vue
<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<template>
	<div class="app">
		<ElConfigProvider :locale="zhCn">
			<router-view></router-view>
		</ElConfigProvider>
	</div>
</template>
```

声明 .mjs 文件模块的类型。

env.d.ts

```typescript
//...
declare module '*.mjs'
```

## 3.内容页面

创建 `UserContent.vue` 页面。

### 1.头部区域

编写 content 的头部区域。

src\views\main\system\user\cpns\UserContent.vue

```html
<div class="header">
	<h3 class="title">用户列表</h3>
	<el-button type="primary">新建用户</el-button>
</div>
```

### 2.数据列表

获取 user 列表的数据并展示：

封装获取用户列表的请求。

src\service\main\system\system.ts

```typescript
export const postUsers = () =>
	ztRequest.post<IResponse<IUsersData>>({
		url: '/users/list',
		data: {
			offset: 0,
			size: 10
		}
	})
```

创建 `systmeStore`。

发送网络请求，调用 store 中的 action。

src\stores\main\system\system.ts

```typescript
import type { IUser } from '@/types'
import { postUsers } from '@/service/main/system/system'
import { defineStore } from 'pinia'

interface ISystemStore {
	users: IUser[]
	usersTotalCount: number
}

const useSystemStore = defineStore('system', {
	state: (): ISystemStore => ({
		users: [],
		usersTotalCount: 0
	}),
	actions: {
		postUsersAction() {
			postUsers().then(res => {
				this.users = res.data.list
				this.usersTotalCount = res.data.totalCount
			})
		}
	}
})

export default useSystemStore
```

使用 `<el-tabel>` 展示数据。

- 在第一列加入多选列 `type="selection" `。

- 最后一列操作列，使用插槽插入按钮。

- 设置每列宽度，没有设置的列，自动平分剩余的宽度 `width="xxx"`。

- 每列居中显示 `align="center"`。

调整每一行的内间距。

src\views\main\system\user\cpns\UserContent.vue

```css
.table {
	:deep(.el-table__cell) {
		padding: 12px 0;
	}
	/*...*/
}
```
