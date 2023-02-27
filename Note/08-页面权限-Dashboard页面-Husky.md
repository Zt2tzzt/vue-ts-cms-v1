# 一、页面权限管理

## 1.映射按钮权限

按钮的权限管理

通过返回的菜单数据中，第三级菜单中的 permission 字段进行判断。

在 loginStore 中，根据菜单映射路由前，去映射权限。

封装一个工具函数 `mapMenusToPermission`，使用递归。

以上操作，在读取缓存（页面刷新）时，再做一遍。

src\utils\map-menu.ts

```typescript
/**
 * @description: 此函数用于：根据用户拥有的菜单，筛选出对应的增、删、改、查权限（用于 loginStore 中登录和刷新页面时，加载用户的权限）
 * @Author: ZeT1an
 * @param {IMenuInRole} menuList 用户菜单列表
 * @return {string[]} 映射出的权限列表。
 */
export const mapMenusToPermission = (menuList: IMenuInRole[]): string[] => {
	const permission: string[] = []

	const _getPermission = (menus: IMenuInRole[] | IMenuInRoleChild[] | IMenuInRoleChild2[]) => {
		menus.forEach(menu => {
			if (menu.type === 3) {
				permission.push(menu.permission)
			} else {
				_getPermission(menu.children ?? [])
			}
		})
	}
	_getPermission(menuList)

	return permission
}
```

src\stores\login\login.ts

```typescript
function dynamicLoadingPermissionAndRoutes(this: ILoginState,userMenus: IMenuInRole[]) {
	// 加载按钮的权限
	const permissions = mapMenusToPermission(userMenus)
	this.permissions = permissions

	// 动态添加路由
	const routes = mapMenusToRoutes(userMenus)
	routes.forEach(route => router.addRoute('main', route))
}
```

## 2.在页面控制权限

### 1.PageContent 页面

在进入某个页面，如角色（`Role.vue`）时，判断用户是否有增、删、改、查权限。

由分析可知，增删改查实际上都可以在 `PageContent.vue` 中控制。

在其中增加四个布尔类型的 flag，`isCreate`、`isDelete`、`isUpdate`、`isQuery`，分别表示增、删、改、查权限。

获取到 loginstore 中的 `permissions` 后，进行判断，为 flag 赋值。

将上述逻辑抽取到 hook 中。

src\hooks\usePermissions.ts

```typescript
import useLoginStore from "@/stores/login/login"

const usePermission = (permissionStr: string): boolean => {
	const loginStore = useLoginStore()
	return loginStore.permissions.some(item => item.includes(permissionStr))
}

export default usePermission
```

src\components\page-content\PageContent.vue

```typescript
// 增删改查，权限控制
const permission = {
	isCreate: usePermission(pageName.value + ':create'),
	isDelete: usePermission(pageName.value + ':delete'),
	isUpdate: usePermission(pageName.value + ':update'),
	isQuery: usePermission(pageName.value + ':query')
}
```

查询，在网络请求中控制。

src\components\page-content\PageContent.vue

```typescript
// 查询
const fetchPageListData = <T>(formatData: T | object = {}) => {
	if (!permission.isQuery) return
	//...
}
```

新增、删除，修改：在页面上的按钮控制.

src\components\page-content\PageContent.vue

```vue
<template>

  <el-button v-if="permission.isCreate" type="primary" @click="onNewclick">{{
    contentConfig?.header?.btnLabel ?? `新建数据`
  }}</el-button>

	<!--,,,--->

  <el-button
  v-if="permission.isUpdate"
    size="small"
    icon="Edit"
    type="primary"
    text
    @click="onEditClick(scope.row)"
    >编辑</el-button
  >
  <el-button
  v-if="permission.isDelete"
    size="small"
    icon="Delete"
    type="danger"
    text
    @click="onDeleteClick(scope.row.id)"
    >删除</el-button
  >

</template>
```

### 2.PageSearch 页面

在 `PageSearch.vue` 中，判断是否拥有查询权限，如果没有，整个组件都不展示。

src\components\page-search\PageSearch.vue

```vue
<script>
// 查询权限
const permission = {
	isQuery: usePermission(props.searchConfig.pageName + ':query')
}
</script>

<template>
	<div class="page-search" v-if="permission.isQuery">
  </div>
</template>
```

## 3.单元测试

对以上编写的权限管理功能，进行测试。

创建一个角色进行测试，发现一个 bug：

- 当创建新的角色后，没法在新建用户时，选择该角色。

解决方案：

- 在创建角色的 action 执行完成后，重新获取角色列表，并缓存。

src\stores\main\system\system.ts

```typescript
const fetchEntireData = (pageName: string) => {
	if ([DEPARTMENT, ROLE, MENU].includes(pageName)) {
		const mainStore = useMainStore()
		mainStore.fetchEntireDataAction()
	}
}

const actions = {
  deletePageByIdAction(pageName: string, id: number) {
    deletePageById(pageName, id).then(res => {
      console.log(pageName, 'delete res:', res)
      this.postPageListAction(pageName, { offset: 0, size: 10 })

      // 如果是部门，角色，菜单等基础数据发生增、删、改操作，要重显加载到缓存中。
      fetchEntireData(pageName)
    })
  },
  postNewPageRecordAction<T>(pageName: string, record: T) {
    postNewPageRecord(pageName, record).then(res => {
      console.log(pageName, 'add res:', res)
      this.postPageListAction(pageName, { offset: 0, size: 10 })

      // 如果是部门，角色，菜单等基础数据发生增、删、改操作，要重显加载到缓存中。
      fetchEntireData(pageName)
    })
  },
  pathEditPageRecordByIdAction<T>(pageName: string, id: number, record: T) {
    pathEditPageRecordById(pageName, id, record).then(res => {
      console.log(pageName, 'edit res:', res)
      this.postPageListAction(pageName, { offset: 0, size: 10 })

      // 如果是部门，角色，菜单等基础数据发生增、删、改操作，要重显加载到缓存中。
      fetchEntireData(pageName)
    })
  }
}
```

# 二、bug 修复

## 1.用户名显示

在 `UserState.vue` 中动态展示用户名。

src\components\main-header\cpns\UserState.vue

```vue
<script>
const loginStore = useLoginStore()
const nickname = computed(() =>  'name' in loginStore.userInfo ? loginStore.userInfo.name : '用户名')
</script>

<template>
  <span class="name">{{ nickname }}</span>
</template>
```

## 2.增删改后页码重置

在增、删、改发送网络请求后，将分页器页码重置为第一页。

增、改都涉及到跨组件操作，

`PageModal.vue` 中发送完网络请求，要将事件传给 `PageContent.vue`。

### 1.常用两种方案

父子组件通信（交推荐）。

事件总线（少用，不可控）。

### 2.store.$onAction

在 `PageContent.vue` 中使用 `store.$onAction` API，

对 action 的执行进行监听，当增、删、改的 action 执行成功后，将页面中分页相关的状态 `currentPage` 改为 `1`.[参考 Pinia 文档](https://pinia.vuejs.org/zh/core-concepts/actions.html#subscribing-to-actions)

src\components\page-content\PageContent.vue

```vue
<script>
// 增、删、改后，将页面充值到第一页
const onSubscribe = systemStore.$onAction(({ name, after }) => {
	after(() => {
		if (['deletePageByIdAction', 'postNewPageRecordAction', 'pathEditPageRecordByIdAction'].includes(name)) {
			currentPage.value = 1
		}
	})
})

onUnmounted(() => {
	onSubscribe()
})
</script>
```

# 三、Dashboard 页面

头部数字展示区域搭建，使用 Element Plus Layout 布局中的 `<el-row>` 布局。

封装组件 `CountCard.vue` 组件。

在其中使用 flex 布局，并使用 `<el-tooltip>` 组件。

封装网络请求，获取商品数据统计的数量。

> 软件架构中，没有什么问题是分层不能解决的，如果有，就再分一层。



商品统计页面

安装 countup.js 库，再 CountCard 组件中使用。

为数字添加前缀，两种思路：1.再 template 中添加；2.在 JS 代码中添加。



在商品统计页面

创建 ChartCard 页面。用于展示图表卡片。

使用 el-card 布局。

在其中预留插槽，让 Dashboard 传入图表。



在商品统计页面

安装 echarts。对 echarts 的逻辑进行封装。

在 xxxChart 中编写好配置文件，并传给 baseChart。



在商品统计页面。

封装网络请求，获取商品数据。

对获取的数据进行转化，传递给图表。



在商品统计页面，注册地图。

服务器返回的数据中，没有地区销量对应的经纬度。

引入一个城市对应经纬度的对象。封装工具函数，进行映射。



在商品统计页面，进行响应式布局。

监听 window 的缩放，重置 echart 实例大小。

- 监听时，做防抖节流操作。

- 组件卸载时，取消监听，销毁实例。

为上方卡片做响应式布局。



git Husky 配置回顾

[git Husky 配置回顾](./02-项目配置-目录结构分析-环境搭建（一）.md/#二、项目 git 提交规范配置)

