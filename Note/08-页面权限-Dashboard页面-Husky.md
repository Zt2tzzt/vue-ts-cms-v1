# 一、页面权限管理

## 1.映射按钮权限

按钮的权限管理

通过返回的菜单数据中，第三级菜单中的 `permission` 字段进行判断。

在 loginStore 中，菜单映射路由前，去映射权限。

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
function dynamicLoadingPermissionAndRoutes(this: ILoginState, userMenus: IMenuInRole[]) {
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

在进入某个页面，如角色（`RolePanel.vue`）时，判断用户是否有增、删、改、查权限。

由分析可知，增删改查实际上都可以在 `PageContent.vue` 中控制。

在其中增加四个布尔类型的 flags，`isCreate`、`isDelete`、`isUpdate`、`isQuery`，分别表示增、删、改、查权限。

获取到 `loginstore` 中的 `permissions` 后，进行判断，为 flags 赋值。

将上述逻辑抽取到 hook 中。

src\hooks\usePermissions.ts

```typescript
import useLoginStore from '@/stores/login/login'

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

增、删，改：在页面上的按钮控制.

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
	<div class="page-search" v-if="permission.isQuery"></div>
</template>
```

## 3.单元测试

对以上编写的权限管理功能，进行测试。

创建一个角色进行测试，发现一个 bug：

- 当创建新的角色后，没法在新建用户时，选择该角色。

原因：

- 创建用户时，能够选择的角色，是在页面刷新或用户登录时，加载到内存（`mainStore`）中的。
- 创建角色后，没有对内存中的角色，进行重载。

解决方案：

- 在增、删、改角色的 action 执行完成后，重新获取角色列表，并缓存。
- 以此类推，增、删、改“部门”、“菜单“后，也要进行类似的操作。

src\stores\main\system\system.ts

```typescript
const fetchEntireData = (pageName: string) => {
	if ([DEPARTMENT, ROLE, MENU].includes(pageName)) {
		const mainStore = useMainStore()
		mainStore.fetchEntireDataAction()
	}
}

//...

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
const nickname = computed(() =>
	'name' in loginStore.userInfo ? loginStore.userInfo.name : '用户名'
)
</script>

<template>
	<span class="name">{{ nickname }}</span>
</template>
```

## 2.增删改后页码重置

在“增“、“删“、“改“发送网络请求后，将分页器页码重置为第一页。

“增“、“改“都涉及到跨组件操作，它们都在 `PageModal.vue` 中触发，意味着：

`PageModal.vue` 中发送完网络请求，要将事件传给 `PageContent.vue`。

### 1.常用两种方案

方案一：父子组件通信（推荐）。

方案二：事件总线（少用，不可控）。

### 2.store.$onAction 方案

在 `PageContent.vue` 中使用 [store.$onAction](https://pinia.vuejs.org/zh/core-concepts/actions.html#subscribing-to-actions) API，

对 `systemStore` 中 action 的执行进行监听，当“增”、“删”、“改”的 action 执行成功后，将页面中分页相关的状态 `currentPage` 改为 `1`。

src\components\page-content\PageContent.vue

```vue
<script>
// 增、删、改后，将页面重置到第一页
const onSubscribe = systemStore.$onAction(({ name, after }) => {
	after(() => {
		if (
			['deletePageByIdAction', 'postNewPageRecordAction', 'pathEditPageRecordByIdAction'].includes(
				name
			)
		) {
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

## 1.页面布局

头部数字展示区域搭建，使用 Element Plus Layout 布局中的 `<el-row>` 布局。

src\views\main\analysis\dashboard\DashboardPanel.vue

```vue
<!-- 数字卡片 -->
<el-row :gutter="10">
  <template v-for="item of goodsAmountList" :key="item.amount">
    <el-col :span="6" :xs="24" :sm="12" :md="8" :lg="6">
      <CountCard v-bind="item"></CountCard>
    </el-col>
  </template>
</el-row>
```

封装组件 `CountCard.vue` 组件。

在其中使用 flex 布局，并使用 `<el-tooltip>` 组件，展示卡片的提示信息。

src\views\main\analysis\dashboard\cpns\count-card\CountCard.vue

```vue
<template>
	<div class="count-card">
		<div class="header">
			<span class="title">{{ title }}</span>
			<el-tooltip :content="tips" placement="top" effect="dark">
				<el-icon><Warning /></el-icon>
			</el-tooltip>
		</div>
		<div class="content">
			<span ref="count1Ref">{{ number1 }}</span>
		</div>
		<div class="footer">
			<span>{{ subtitle }}</span>
			<span ref="count2Ref">{{ number2 }}</span>
		</div>
	</div>
</template>
```

## 2.封装网络请求

获取商品数据统计的数量。

src\service\main\analysis\analysis.ts

```typescript
export const getGoodsAmountListData = () =>
	ztRequest.get<IResponse<IGoodsAmountData[]>>({
		url: '/goods/amount/list'
	})
```

> 软件架构中，没有什么问题是分层不能解决的，如果有，就再分一层。

## 3.数字卡片组件

安装 _countup.js_ 库，

```shell
npm install countup.js
```

将这个库，在 `CountCard.vue` 组件中使用。做数字滚动动画效果。

为数字添加前缀，两种思路：

- 在 `<template>` 中添加；

- 在 JS 代码中添加（项目中采用）。

src\views\main\analysis\dashboard\cpns\count-card\CountCard.vue

```typescript
const countOption = {
	prefix: props.amount === 'saleroom' ? '￥' : ''
}

onMounted(() => {
	const countup1 = new CountUp(count1Ref.value!, props.number1, countOption)
	const countup2 = new CountUp(count2Ref.value!, props.number2, countOption)
	countup1.start()
	countup2.start()
})
```

## 4.图表区域

### 1.ChartCard 组件

在 `DashboardPanel.vue` 中，创建 `ChartCard.vue` 组件。用于展示图表卡片。

使用 `<el-card>` 布局。

在其中预留插槽，让 `DashboardPanel.vue` 传入图表组件。

src\views\main\analysis\dashboard\cpns\chart-card\ChartCard.vue

```vue
<script setup lang="ts">
withDefaults(
	defineProps<{
		header?: string
	}>(),
	{
		header: '卡片标题'
	}
)
</script>

<template>
	<div class="chart-card">
		<el-card :header="header">
			<slot> 卡片内容</slot>
		</el-card>
	</div>
</template>

<style scoped lang="less"></style>
```

### 2.echarts 安装

安装 _echarts_

```shell
npm install echarts
```

### 3.BaseEchart 组件

创建 `BaseEchart.vue` 组件，在其中接收 echarts 的配置项 `option`，并对 _echarts_ 的逻辑进行封装。

src\components\page-echarts\src\BaseEchart.vue

```vue
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, type WatchStopHandle } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption, EChartsType } from 'echarts'
import debounce from '@/utils/debounce'

const props = defineProps<{
	options: EChartsOption
	mapData?: {
		mapName: string
		geoJSON: any
	}
}>()

const containerRef = ref<HTMLElement>()
let echartInstance: EChartsType

if (props.mapData) echarts.registerMap(props.mapData.mapName, props.mapData.geoJSON)

const echartResize = debounce(() => {
	echartInstance.resize()
}, 300)

let stopWatchEffect: WatchStopHandle

onMounted(() => {
	echartInstance = echarts.init(containerRef.value!, 'light', {
		renderer: 'canvas'
	})

	/* watch(
		() => props.options,
		newVal => {
			echartInstance.setOption(newVal)
		}
	) */
	stopWatchEffect = watchEffect(() => echartInstance.setOption(props.options))

	window.addEventListener('resize', echartResize)
})

onUnmounted(() => {
	stopWatchEffect?.()

	window.removeEventListener('resize', echartResize)
})
</script>

<template>
	<div class="base-echart">
		<div class="container" ref="containerRef"></div>
	</div>
</template>

<style scoped lang="less">
.container {
	height: 300px;
}
</style>
```

### 4.图表组件创建，并获取数据

封装网络请求和 actions，在 `DashboardPanel.vue` 中获取商品数据。

src\views\main\analysis\dashboard\DashboardPanel.vue

```typescript
const {
	goodsAmountList,
	goodsCategoryCount,
	goodsCategorySale,
	goodsCategoryFavor,
	goodsCategoryAddressSale
} = storeToRefs(analysisStore)
```

5.图表组件

封装图表组件 `PieEchart.vue`，`RoseEchart.vue`，`LineEchart.vue`，`MapEchart.vue`，`BarEchart.vue`；

分别对应饼图，玫瑰图，折线图，地图，柱状图。

stc/components/page-echarts/src/PieEchart.vue

stc/components/page-echarts/src/RoseEchart.vue

stc/components/page-echarts/src/LineEchart.vue

stc/components/page-echarts/src/MapEchart.vue

stc/components/page-echarts/src/BarEchart.vue

在 `DashboardPanel.vue` 中，对获取的数据进行转化，传递给图表。

src\views\main\analysis\dashboard\DashboardPanel.vue

```vue
<script>
const analysisStore = useAnalysisStore()
analysisStore.fetchAnalysisDataAction()

const {
	goodsAmountList,
	goodsCategoryCount,
	goodsCategorySale,
	goodsCategoryFavor,
	goodsAddressSale
} = storeToRefs(analysisStore)

const showGoodsCategoryCount = computed(() =>
	goodsCategoryCount.value.map(itme => ({
		name: itme.name,
		value: itme.goodsCount
	}))
)

const showgoodsCategorySale = computed(() => ({
	labels: goodsCategorySale.value.map(item => item.name),
	values: goodsCategorySale.value.map(item => item.goodsCount)
}))

const showgoodsCategoryFavor = computed(() => ({
	labels: goodsCategoryFavor.value.map(item => item.name),
	values: goodsCategoryFavor.value.map(item => item.goodsFavor)
}))

const showGoodsAddressSale = computed(() =>
	goodsAddressSale.value.map(item => ({
		name: item.address,
		values: item.count
	}))
)
</script>

<template>
	<div class="dashboard">
		<!-- 数字卡片 -->
		<el-row :gutter="10">
			<template v-for="item of goodsAmountList" :key="item.amount">
				<el-col :span="6" :xs="24" :sm="12" :md="8" :lg="6">
					<CountCard v-bind="item"></CountCard>
				</el-col>
			</template>
		</el-row>

		<!-- 图表 -->
		<el-row :gutter="10">
			<el-col :span="7">
				<ChartCard header="饼图">
					<PieEchart :pie-data="showGoodsCategoryCount"></PieEchart>
				</ChartCard>
			</el-col>
			<el-col :span="10">
				<ChartCard header="地图">
					<MapEchart :map-data="showGoodsAddressSale"></MapEchart>
				</ChartCard>
			</el-col>
			<el-col :span="7">
				<ChartCard header="玫瑰图">
					<RoseEchart :rose-data="showGoodsCategoryCount"></RoseEchart>
				</ChartCard>
			</el-col>

			<el-col :span="12">
				<ChartCard header="折线图">
					<LineEchart v-bind="showgoodsCategorySale"></LineEchart>
				</ChartCard>
			</el-col>
			<el-col :span="12">
				<ChartCard header="柱状图">
					<BarEchart v-bind="showgoodsCategoryFavor"></BarEchart>
				</ChartCard>
			</el-col>
		</el-row>
	</div>
</template>
```

### 5.地图组件

服务器返回的数据中，没有地区销量对应的经纬度。需要去网上找一个包含地名和经纬度的文件。

src\components\page-echarts\data\coordinate-data.ts

注册地图。地图中的数据，需要映射出符合的格式。封装工具函数。

src\components\page-echarts\utils\cover-data.ts

```typescript
import coordinate from '../data/coordinate-data'

type AddressUnionType = keyof typeof coordinate

export default (
	data: {
		name: string
		values: number
	}[]
) =>
	data
		.filter(
			item => item.name in coordinate && Array.isArray(coordinate[item.name as AddressUnionType])
		)
		.map(item => ({
			name: item.name,
			value: coordinate[item.name as AddressUnionType].concat(item.values)
		}))
```

在 `MapEchart.vue` 中，向 `BaseEchart.vue` 中传递 `mapData`。

src\components\page-echarts\src\BaseEchart.vue

```typescript
const props = defineProps<{
	options: EChartsOption
	mapData?: {
		mapName: string
		geoJSON: any
	}
}>()

if (props.mapData) echarts.registerMap(props.mapData.mapName, props.mapData.geoJSON)
```

### 6.响应式布局

#### 1.图表 resize

监听 `window` 的缩放，重置 `echart` 实例大小。

- 监听时，做防抖节流操作。

- 组件卸载时，取消监听，销毁实例。

src\components\page-echarts\src\BaseEchart.vue

```vue
<script>
//...
let echartInstance: EChartsType

const echartResize = debounce(() => {
	echartInstance.resize()
}, 300)

onMounted(() => {
  echartInstance = echarts.init(containerRef.value!, 'light', {
		renderer: 'canvas'
	})

  //...
  stopWatchEffect = watchEffect(() => echartInstance.setOption(props.options))
	window.addEventListener('resize', echartResize)
})

onUnmounted(() => {
	window.removeEventListener('resize', echartResize)
	stopWatchEffect?.()

})
</script>

<template>
	<div class="base-echart">
		<div class="container" ref="containerRef"></div>
	</div>
</template>
```

> 【注意】：echart 实例 `echartInstance` 如果用 `ref` 包裹变为响应式对象，会有两个问题：
>
> - 调用 `resize` 方法时可能报错。
>
> - 使用 `watchEffect` API，会造成频繁 setOption 使得页面卡顿。
>
> `echartInstance` 不是响应式数据，不要用 `ref` 包裹。

#### 2.卡片

为 `DashboardPanel.vue` 上方卡片做响应式布局。

src\views\main\analysis\dashboard\DashboardPanel.vue

```vue
<el-col :span="6" :xs="24" :sm="12" :md="8" :lg="6">
  <CountCard v-bind="item"></CountCard>
</el-col>
```

# 四、git Husky

[git Husky 配置回顾](./02-项目配置-目录结构分析-环境搭建（一）.md/#二、项目 git 提交规范配置)
