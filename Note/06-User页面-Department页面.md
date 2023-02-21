# 一、User页面

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

在 `UserContent.vue` 中，格式化“状态”，“创建日期”和“结束日期”。

使用 `<el-table-column>` 的作用域插槽。

使用 *day.js* 和其中的 *utc* 插件，零时区转东八区时间。

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
export const postUsers = (queryParam: IQueryParam) =>
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
	const QueryParam = {size: limit, offset}

	// 2.发送请求
	systemStore.postUsersAction({ ...QueryParam, ...formatData })
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

> 事件总线，通常用于跨度比较大的组件。存在不可控的缺陷。

src\views\main\system\user\cpns\UserContent.vue

```typescript
const systemStore = useSystemStore()
const { users, usersTotalCount } = storeToRefs(systemStore)

const currentPage = ref(1)
const pageSize = ref(10)

const fetchUserListData = (formatData: IUserFormData | object = {}) => {
	// 1.获取 offset 和 limit
	const limit = pageSize.value
	const offset = (currentPage.value - 1) * limit
	const queryParam = {size: limit, offset}

	// 2.发送请求
	systemStore.postUsersAction({...queryParam, ...formatData})
}

fetchUserListData()


const onSizeChange = () => {
	fetchUserListData()
}
const onCurrentChange = () => {
	fetchUserListData()
}

defineExpose({
	fetchUserListData
})
```

在 `UserSerach.vue` 中，点击查询时，将查询条件，发送给 `User.vue`。

- 注意：“创建时间”的初始化值，不能使用空数组，后端接口无法处理。

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
	emits('queryClick', {...searchForm})
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
  <el-button
    size="small"
    icon="Delete"
    type="danger"
    text
    @click="onDeleteClick(scope.row.id)"
    >删除</el-button
  >
</el-table-column>
</template>
```

src\stores\main\system\system.ts

```typescript
deleteUserByIdAction(id: number) {
  deleteUserById(id).then(res => {
    console.log('detete res:', res)
    this.postUsersAction({ offset: 0, size: 10 })
  })
}
```

## 6.新增功能

### 1.弹出新增对话框

在 `UserContent.vue` 中编写用户新建的功能。

将该功能封装在 `UserModal.vue` 组件中。

- 使用 `<el-dialog>` 组件进行布局。
- 在其中使用 `<el-form>` 进行布局。

在 `UserContent.vue` 中发送事件，传递“新建会话框”的“隐藏/显示”状态。

在 `User.vue` 中拿到该状态，去调用 `UserModal.vue` 中暴露的方法，改变其中的状态，

> 在组件中一般暴露方法，因为方法中可以进行拦截，更加可控。

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

在 `UserModal.vue` 中“选择角色”和“选择部门”需要使用服务器请求下来的数据。

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
	if (isAdd.value && editData.value) {
		// 编辑
	} else {
		// 新增
		systemStore.postNewUserAction(formData)
	}
}
</script>

<template>
<el-button type="primary" @click="onConfigClick"> 确定 </el-button>
</template>
```

封装创建用户的网络请求，在 systenStore 中创建 action。在 UserModal 中调用。

新建成功后，发送网络请求，进行数据重载。

src\stores\main\system\system.ts

```typescript
postNewUserAction(addParam: IUserCreateFormData) {
  postNewUserData(addParam).then(res => {
    console.log('add user res:', res)
    this.postUsersAction({ offset: 0, size: 10  })
  })
}
```

### 4.编辑用户

在 `UserContent.vue` 中，编写用户修改功能。

点击“编辑”按钮，弹出 modal，并将用户数据传给 `UserModal.vue`。

src\views\main\system\user\cpns\UserContent.vue

```vue
<template>
<el-button size="small" icon="Edit" type="primary" text @click="onEditClick(scope.row)">编辑</el-button>
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
  <UserContent ref="contentRef" @new-click="handleNewClick" @edit-click="handleEditClick"></UserContent>
  <UserModal ref="modalRef"></UserModal>
</template>

<script setup lang="ts" name="user">
//...
const modalRef = ref<InstanceType<typeof UserModal>>()
const handleEditClick = (itemData: IUser) => {
	modalRef.value?.setModalVisible({isNew: false, itemData})
}
</script>
```

在 `UserModal.vue` 中，使用一个标识符 `isAdd` 来区分新建还是编辑。

编辑完成后，进行数据重载。

src\views\main\system\user\cpns\UserModal.vue

```typescript
//...

// 设置 dialog 是否显示
const setModalVisible = ({isNew = true, itemData}: OpenDialogParamType) => {
	showdialog.value = true
	isAdd.value = isNew
	if (!isNew && itemData) {
		// 编辑
		Object.keys({...formData}).forEach((key) => {
			if (key in itemData) {
				(formData[key as keyof IUserCreateFormData] as any) = itemData[key as keyof IUser]
			}
		})
		editId.value = itemData.id
	} else {
		// 新建
		Object.keys({...formData}).forEach(key => {
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
		const {password, ...editFormData} = formData
		systemStore.pathEditUserByIdAction(editId.value, editFormData)
	} else {
		// 新增
		systemStore.postNewUserAction({...formData})
	}
}

defineExpose({
	setModalVisible
})
```

#### 1.遍历对象时，key的类型写法

[参考资料](https://juejin.cn/post/7079687437445922853)

在对象中，所有 key 的类型，都是 string 类型。

所以无法分配给对象类型中 keys 具体的字面量类型，需要使用类型断言。

for...in

```typescript
function print(obj:Person){
  let key: keyof Person;
  for (key in obj) {
    // ✅
    console.log(key, obj[key].toUpperCase());
  }
}
```

Object.keys

```typescript
function print(obj: Person) {
  Object.keys(obj).forEach((k) => {
    // ...
    console.log(k, obj[k as keyof Person].toUpperCase());
  });
}
```

封装一个函数，用于在 ts 中遍历对象类型。

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



在 systemStore 中，针对 Department 的内容，封装动态的网络请求。

在 Department 中，实现查询，重置，删除等功能。

---

创建 PageModal 组件，实现新增，修改等功能。

---

将 PageSearch 移动到 Component 目录下。在其中进行抽取和封装。