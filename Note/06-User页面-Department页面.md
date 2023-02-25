# 一、User 页面

## 1.状态格式化

在 `UserContent.vue` 中，格式化“状态”。

使用 `<el-table-column>` 的作用域插槽。

src\views\main\system\user\cpns\UserContent.vue

```vue
<el-table-column align="center" label="状态" prop="enable" width="100">
  <template #default="scope">
    <el-button size="small" :type="scope.row.enable ? 'primary' : 'danger'">
      {{ scope.row.enable ? '启用' : '禁用' }}
    </el-button>
  </template>
</el-table-column>
```

## 2.创建/修改时间格式化

在 `UserContent.vue` 中，格式化，“创建日期”和“结束日期”。

使用 `<el-table-column>` 的作用域插槽。

使用 _day.js_ 和其中的 _utc_ 插件，将零时区转成东八区时间。

src\utils\format.ts

```typescript
import * as dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const formatUTC = (utcString: string, pattern = 'YYYY/MM/DD HH:mm:ss') => {
	return dayjs.utc(utcString).utcOffset(8).format(pattern)
}
```

src\views\main\system\user\cpns\UserContent.vue

```vue
<el-table-column align="center" label="创建时间" prop="createAt">
  <template #default="scope">
    {{ formatUTC(scope.row.createAt) }}
  </template>
</el-table-column>
<el-table-column align="center" label="修改时间" prop="updateAt">
  <template #default="scope">
    {{ formatUTC(scope.row.updateAt) }}
  </template>
</el-table-column>
```

## 3.分页功能

在 `UserContent.vue` 中编写分页区域。

使用 `<el-pagination>` 组件。

定义两个变量 `currentPage` 和 `pageSize`，并绑定到 `<el-pagination>` 组件上。

修改发布的网络请求逻辑，传入 `size` 和 `offset`；

src\service\main\system\system.ts

```typescript
export const postUsers = (queryParam: ISearchParam) =>
	ztRequest.post<IResponse<IUsersData>>({
		url: '/users/list',
		data: queryParam
	})
```

src\views\main\system\user\cpns\UserContent.vue

```vue
<script setup lang="ts">
//...

const systemStore = useSystemStore()
const { users, usersTotalCount } = storeToRefs(systemStore)

const currentPage = ref(1)
const pageSize = ref(10)

const fetchUserListData = (formatData: any = {}) => {
	// 1.获取 offset 和 limit
	const limit = pageSize.value
	const offset = (currentPage.value - 1) * limit
	const queryParam = { size: limit, offset }

	// 2.发送请求
	systemStore.postUsersAction({ ...queryParam, ...formatData })
}

fetchUserListData()

const handleSizeChange = () => {
	fetchUserListData()
}
const handleCurrentChange = () => {
	fetchUserListData()
}
</script>

<template>
	<!--...--->
	<el-pagination
		v-model:current-page="currentPage"
		v-model:page-size="pageSize"
		:page-sizes="[10, 20, 30]"
		layout="total, sizes, prev, pager, next, jumper"
		:total="usersTotalCount"
		@size-change="handleSizeChange"
		@current-change="handleCurrentChange"
	></el-pagination>
	<!--...--->
</template>
```

## 4.查询功能-条件查询

在 `UserContent.vue` 中进行条件查询。

将条件查询的方法 `fetchUserListData` 暴露给 `User.vue`

> 事件总线，通常用于跨度比较大的组件。存在不可控的缺陷。
>
> 这里使用父子组件通信的方式。

src\views\main\system\user\cpns\UserContent.vue

```typescript
defineExpose({
	fetchUserListData
})
```

在 `UserSerach.vue` 中，点击查询时，将查询条件，发送给 `User.vue`。

- 注意：“创建时间”的初始值，不能使用空数组，后端接口无法处理。

将 `UserSerach.vue` 中，点击重置按钮时，也要发送网络请求，请求所有数据。

src\views\main\system\user\cpns\UserSearch.vue

```typescript
//...
const emits = defineEmits(['queryClick', 'resetClick'])

const searchForm = reactive<IUserFormData>({
	name: '',
	realname: '',
	cellphone: '',
	enable: 1,
	createAt: ''
})

const formRef = ref<InstanceType<typeof ElForm>>()

const onResetClick = () => {
	formRef.value?.resetFields()
	emits('resetClick')
}
const onQueryClick = () => {
	emits('queryClick', { ...searchForm })
}
```

再在 `User.vue` 中调用 `UserContent.vue` 中暴露的方法 `fetchUserListData`。

src\views\main\system\user\User.vue

```typescript
const contentRef = ref<InstanceType<typeof UserContent>>()

const handleQueryClick = (formData: IUserFormData) => {
	contentRef.value?.fetchUserListData(formData)
}
const handleResetClick = () => {
	contentRef.value?.fetchUserListData()
}
```

## 5.删除功能

在 `UserContent.vue` 中编写用户删除功能。

点击“删除”，发送 delete 请求，删除数据。

并再发送网络请求，进行数据重载。

src\views\main\system\user\cpns\UserContent.vue

```vue
<script>
//...
const onDeleteClick = (id: number) => {
	systemStore.deleteUserByIdAction(id)
}
</script>

<template>
	<!--...-->
	<el-table-column align="center" label="操作" width="250" #default="scope">
		<el-button size="small" icon="Edit" type="primary" text>编辑</el-button>
		<el-button size="small" icon="Delete" type="danger" text @click="onDeleteClick(scope.row.id)"
			>删除</el-button
		>
	</el-table-column>
</template>
```

src\stores\main\system\system.ts

```typescript
const actions = {
  deleteUserByIdAction(id: number) {
    deleteUserById(id).then(res => {
      console.log('detete res:', res)
      this.postUsersAction({ offset: 0, size: 10 })
    })
  }
}
```

## 6.新增、编辑功能

### 1.弹出新增对话框

在 `UserContent.vue` 中编写用户新建的功能。

将该功能封装在 `UserModal.vue` 组件中。

- 使用 `<el-dialog>` 组件进行布局。
- 在其中使用 `<el-form>` 进行布局。

在 `UserContent.vue` 中发送事件，传递 `UserModal.vue` 的“隐藏/显示”状态。

在 `User.vue` 中拿到该状态，去调用 `UserModal.vue` 中暴露的方法 `setModalVisible`，改变其中的状态，

> 在组件中一般暴露方法，而不是直接暴露属性；
>
> 因为方法中可以进行拦截，更加可控。

src\views\main\system\user\cpns\UserContent.vue

```vue
<script>
const onNewclick = () => {
	emits('newClick')
}
</script>

<template>
	<el-button type="primary" @click="onNewclick">新建用户</el-button>
</template>
```

src\views\main\system\user\User.vue

```vue
<script>
const handleNewClick = () => {
	modalRef.value?.setModalVisible()
}
</script>

<template>
	<UserModal ref="modalRef"></UserModal>
</template>
```

src\views\main\system\user\cpns\UserModal.vue

```vue
<script>
const showdialog = ref(false)
const isAdd = ref(true) // 新建：true；修改：false

// 设置 dialog 是否显示
const setModalVisible = (isNew = true) => {
	showdialog.value = true
}

defineExpose({
	setModalVisible
})
</script>

<template>
	<el-dialog
		v-model="showdialog"
		:title="isAdd ? '新建用户' : '修改用户'"
		width="30%"
		destroy-on-close
		center
	>
		<!--...-->
	</el-dialog>
</template>
```

### 2.加载“角色”和“部门”

新建用户时，在 `UserModal.vue` 中“选择角色”和“选择部门”，需要使用服务器请求下来的数据。

使用“获取角色列表”和“获取部门列表”接口。封装网络请求。

src\service\main\main.ts

```typescript
export const getEntireRoles = () =>
	ztRequest.post<IResponse<IRoleSResult>>({
		url: '/role/list'
	})

export const getEntireDepartment = () =>
	ztRequest.post<IResponse<IDepartmentsResult>>({
		url: '/department/list'
	})
```

这种数据需要在多个页面中使用。

所以创建 mainStore，将数据保存到其中。

src\stores\main\main.ts

```typescript
actions: {
  fetchEntireDataAction() {
    getEntireRoles().then(res => {
      console.log('role res:', res)
      this.entireRoles = res.data.list
    })
    getEntireDepartment().then(res => {
      console.log('department res:', res)
      this.entireDepartments = res.data.list
    })
  }
}
```

登陆/刷新时，就发送请求获取。

src\stores\login\login.ts

```typescript
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
```

### 3.新增用户

在 `UserModal.vue` 中，点击“确定”，使用表单中的数据发送网络请求。

src\views\main\system\user\cpns\UserModal.vue

```vue
<script>
const systemStore = useSystemStore()
const onConfigClick = () => {
	showdialog.value = false
	if (isAdd.value && editId.value !== -1) {
		// 编辑
	} else {
		// 新增
		systemStore.postNewUserAction({ ...formData })
	}
}
</script>

<template>
	<el-button type="primary" @click="onConfigClick"> 确定 </el-button>
</template>
```

封装创建用户的网络请求，在 systenStore 中创建 action。在 `UserModal.vue` 中调用。

新建成功后，发送网络请求，进行数据重载。

src\stores\main\system\system.ts

```typescript
const actions = {
  postNewUserAction(addParam: IUserCreateFormData) {
    postNewUserData(addParam).then(res => {
      console.log('add user res:', res)
      this.postUsersAction({ offset: 0, size: 10  })
    })
  }  
}
```

### 4.编辑用户

在 `UserContent.vue` 中，编写用户修改功能。

点击表格中每条记录后的“编辑”按钮，弹出 `UserModal.vue`，并将用户数据传给 `UserModal.vue`。

src\views\main\system\user\cpns\UserContent.vue

```vue
<template>
	<el-button size="small" icon="Edit" type="primary" text @click="onEditClick(scope.row)"
		>编辑</el-button
	>
</template>

<script>
const onEditClick = (itemData: IUser) => {
	emits('editClick', itemData)
}
</script>
```

src\views\main\system\user\User.vue

```vue
<template>
	<!--...--->
	<UserContent
		ref="contentRef"
		@new-click="handleNewClick"
		@edit-click="handleEditClick"
	></UserContent>
	<UserModal ref="modalRef"></UserModal>
</template>

<script setup lang="ts" name="user">
//...
const modalRef = ref<InstanceType<typeof UserModal>>()
const handleEditClick = (itemData: IUser) => {
	modalRef.value?.setModalVisible({ isNew: false, itemData })
}
</script>
```

在 `UserModal.vue` 中，使用一个标识符 `isAdd` 来区分打开 modal 是为了新建还是编辑。

编辑完成后，进行数据重载。

src\views\main\system\user\cpns\UserModal.vue

```typescript
//...

// 设置 dialog 是否显示
const setModalVisible = ({ isNew = true, itemData }: OpenDialogParamType) => {
	showdialog.value = true
	isAdd.value = isNew
	if (!isNew && itemData) {
		// 编辑
		Object.keys({ ...formData }).forEach(key => {
			if (key in itemData) {
				;(formData[key as keyof IUserCreateFormData] as any) = itemData[key as keyof IUser]
			}
		})
		editId.value = itemData.id
	} else {
		// 新建
		Object.keys({ ...formData }).forEach(key => {
			formData[key as keyof IUserCreateFormData] = ''
		})
		editId.value = -1
	}
}

//...

// 点击“确认”
const systemStore = useSystemStore()
const onConfigClick = () => {
	showdialog.value = false
	if (!isAdd.value && editId.value !== -1) {
		// 编辑
		const { password, ...editFormData } = formData
		systemStore.pathEditUserByIdAction(editId.value, editFormData)
	} else {
		// 新增
		systemStore.postNewUserAction({ ...formData })
	}
}

defineExpose({
	setModalVisible
})
```

#### 1.遍历对象时，key 的类型写法

[参考资料](https://juejin.cn/post/7079687437445922853)

在对象中，所有 key 的类型，都是 `string` 类型。

所以无法分配给对象类型中 keys 具体的字面量类型，需要使用类型断言。

for...in

```typescript
function print(obj: Person) {
	let key: keyof Person
	for (key in obj) {
		// ✅
		console.log(key, obj[key].toUpperCase())
	}
}
```

Object.keys

```typescript
function print(obj: Person) {
	Object.keys(obj).forEach(k => {
		// ...
		console.log(k, obj[k as keyof Person].toUpperCase())
	})
}
```

封装一个函数，用于在 ts 中遍历对象类型，返回有类型的 key。

```typescript
export const getKeysFronObj = <T>(obj: T) => Object.keys(obj) as Array<keyof T>
```

#### 1.箭头函数的泛型（补充）

写在函数参数的前面，见上面的例子。

# 二、Department 页面

## 1.快速搭建

根据 `User.vue` 和其中的组件。

在 `Department.vue` 中，快速搭建搜索区域。创建 `PageSearch.vue` 组件。

src\views\main\system\department\cpns\Pagesearch.vue

在 `Department.vue` 中，快速搭建内容区域。创建 `PageContent.vue` 组件。

src\views\main\system\department\cpns\PageContent.vue

## 2.封装网络请求

在 systemStore 中，针对 `Department.vue` 的内容，封装动态的网络请求。

src\service\main\system\system.ts

```typescript
// 通用的封装
export const postPageList = <T, R>(pageName: string, queryParam: T) =>
	ztRequest.post<IResponse<R>>({
		url: `/${pageName}/list`,
		data: queryParam
	})

export const deletePageById = (pageName: string, id: number) =>
	ztRequest.delete({
		url: `/${pageName}/${id}`
	})

export const postNewPageRecord = <T>(pageName: string, record: T) =>
	ztRequest.post({
		url: `/${pageName}`,
		data: record
	})

export const pathEditPageRecordById = <T>(pageName: string, id: number, record: T) =>
	ztRequest.patch({
		url: `/${pageName}/${id}`,
		data: record
	})
```

src\stores\main\system\system.ts

```typescript
// 通用的封装
const actions = {
	postPageListAction<T>(pageName: string, queryParam: T) {
		console.log(pageName, 'queryParam:', queryParam)
		postPageList<T, IResponseListData>(pageName, queryParam).then(res => {
			console.log(pageName, 'res:', res)
			this.pageList = res.data.list
			this.pageTotalCount = res.data.totalCount
		})
	},
	deletePageByIdAction(pageName: string, id: number) {
		deletePageById(pageName, id).then(res => {
			console.log(pageName, 'delete res:', res)
			this.postPageListAction(pageName, { offset: 0, size: 10 })
		})
	},
	postNewPageRecordAction<T>(pageName: string, record: T) {
		postNewPageRecord(pageName, record).then(res => {
			console.log(pageName, 'add res:', res)
			this.postPageListAction(pageName, { offset: 0, size: 10 })
		})
	},
	pathEditPageRecordByIdAction<T>(pageName: string, id: number, record: T) {
		pathEditPageRecordById(pageName, id, record).then(res => {
			console.log(pageName, 'edit res:', res)
			this.postPageListAction(pageName, { offset: 0, size: 10 })
		})
	}
}
```

## 3.实现查询、重置、删除

在 `PageSearch.vue` 中，实现 Department 的查询，重置

发送查询的事件

src\views\main\system\department\cpns\PageSearch.vue

```typescript
const onResetClick = () => {
	formRef.value?.resetFields()
	emits('resetClick')
}
const onQueryClick = () => {
	emits('queryClick', { ...searchForm })
}
```

在 `PageSearch.vue` 中，实现 Department 的查询，

调用查询的接口。

src\views\main\system\department\cpns\PageContent.vue

```typescript
const fetchPageListData = (formatData: IDepartmentSearchFormData | object = {}) => {
	// 1.获取 offset 和 limit
	const limit = pageSize.value
	const offset = (currentPage.value - 1) * limit
	const queryParam = { size: limit, offset }

	// 2.发送请求
	systemStore.postPageListAction<IDepartmentQueryParam>(DEPARTMENT, {
		...queryParam,
		...formatData
	})
}

fetchPageListData()

const onSizeChange = () => {
	fetchPageListData()
}
const onCurrentChange = () => {
	fetchPageListData()
}

defineExpose({
	fetchPageListData
})
```

在 `PageContent.vue` 中，实现 Department 的删除功能

src\views\main\system\department\cpns\PageContent.vue

```typescript
const onDeleteClick = (id: number) => {
	systemStore.deletePageByIdAction(DEPARTMENT, id)
}
```

## 4.实现新增、编辑

创建 `PageModal.vue` 组件，实现新增，修改等功能。

src\views\main\system\department\cpns\PageModal.vue

```typescript
// 点击“确认”
const systemStore = useSystemStore()
const onConfigClick = () => {
	showdialog.value = false
	if (!isAdd.value && editId.value !== -1) {
		// 编辑
		const { ...editFormData } = formData
		systemStore.pathEditPageRecordByIdAction<IDepartmentEditFormData>(
			DEPARTMENT,
			editId.value,
			editFormData
		)
	} else {
		// 新增
		systemStore.postNewPageRecordAction<IDepartmentCreateFormData>(DEPARTMENT, { ...formData })
	}
}
```

## 5.目录重构

将 `PageSearch.vue` 移动到 Component 目录下。在其中进行抽取和封装。

> 动态组件对一些需要精准控制的组件，不太合适。

src\views\main\system\department\config\search-config.ts

```typescript
import type { IDepartmentSearchFormData } from '@/types'

interface IDepartmentFormItem {
	type: 'input' | 'date-picker' | 'select'
	prop: keyof IDepartmentSearchFormData
	label: string
	placeholder?: string
	initialvalue: IDepartmentSearchFormData[keyof IDepartmentSearchFormData]
}

export interface IDepartmentSearchConfig {
	formItems: Array<IDepartmentFormItem>
}

const searchConfig: IDepartmentSearchConfig = {
	formItems: [
		{
			type: 'input',
			prop: 'name',
			label: '部门名称',
			placeholder: '请输入查询的部门名称',
			initialvalue: ''
		},
		{
			type: 'input',
			prop: 'leader',
			label: '部门领导',
			placeholder: '请输入查询的领导名称',
			initialvalue: ''
		},
		{
			type: 'date-picker',
			prop: 'createAt',
			label: '创建事件',
			initialvalue: ''
		}
	]
}

export default searchConfig
```

src\components\page-search\PageSearch.vue

```vue
<script setup lang="ts">
import type { ElForm } from 'element-plus'
import { reactive, ref } from 'vue'

interface IProps {
	searchConfig: {
		labelWidth?: string
		formItems: any[]
	}
}
const props = defineProps<IProps>()
const emits = defineEmits(['queryClick', 'resetClick'])

// 初始化表单
const initialForm = props.searchConfig.formItems.reduce((accumulate, item) => {
	accumulate[item.prop] = item.initialvalue
	return accumulate
}, {})
const searchForm = reactive(initialForm)

// 重置
const formRef = ref<InstanceType<typeof ElForm>>()
const onResetClick = () => {
	formRef.value?.resetFields()
	emits('resetClick')
}

// 查询
const onQueryClick = () => {
	emits('queryClick', { ...searchForm })
}
</script>

<template>
	<div class="page-search">
		<!-- 表单 -->
		<el-form :model="searchForm" ref="formRef" label-width="80px" size="large">
			<el-row :gutter="20">
				<template v-for="item of searchConfig.formItems" :key="item.prop">
					<el-col :span="8">
						<el-form-item :label="item.label" :prop="item.prop">
							<template v-if="item.type === 'input'">
								<el-input
									v-model="searchForm[item.prop]"
									:placeholder="item.placeholder"
								></el-input>
							</template>

							<template v-if="item.type === 'date-picker'">
								<el-date-picker
									v-model="searchForm[item.prop]"
									type="daterange"
									range-separator="-"
									start-placeholder="开始时间"
									end-placeholder="结束时间"
								></el-date-picker>
							</template>

							<template v-if="item.type === 'select'">
								<el-select
									v-model="searchForm[item.prop]"
									:placeholder="item.placeholder"
									style="width: ;100%"
								>
									<template v-for="option in item.options" :key="option.value">
										<el-option :label="option.label" :value="option.value"></el-option>
									</template>
								</el-select>
							</template>
						</el-form-item>
					</el-col>
				</template>
			</el-row>
		</el-form>

		<!-- 按钮 -->
		<div class="btns">
			<el-button icon="Refresh" @click="onResetClick">重置</el-button>
			<el-button icon="Search" type="primary" @click="onQueryClick">查询</el-button>
		</div>
	</div>
</template>
```

#### 1.将对象属性值字面量类型作为联合类型

【补充】：[TypeScript 如何将对象属性值的字面量作为联合类型](https://zhuanlan.zhihu.com/p/406211160)。

```typescript
interface Student {
	name: string
	age: number
}
type propTypes = Student[keyof Student]
```

# 三、Role 页面（简单搭建）

快速搭建 Role.vue 页面

src\views\main\system\role\config\search.config.ts

```typescript
const searchConfig = {
	formItems: [
		{
			type: 'input',
			prop: 'name',
			label: '角色名称',
			placeholder: '请输入查询的角色名称',
			initialValue: 'abc'
		},
		{
			type: 'input',
			prop: 'leader',
			label: '权限介绍',
			placeholder: '请输入查询的权限介绍'
		},
		{
			type: 'date-picker',
			prop: 'createAt',
			label: '创建时间'
		}
	]
}

export default searchConfig
```

src\views\main\system\role\role.vue

```vue
<template>
	<div class="role">
		<page-search :search-config="searchConfig" />
	</div>
</template>

<script setup lang="ts">
import PageSearch from '@/components/page-search/page-search.vue'
import searchConfig from './config/search.config'
</script>
```
