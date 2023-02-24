# 一、高阶组件封装（一）

以 Department 页面为例，封装和完善高阶组件 `PageContent.vue` 和 `PageModal.vue`.

## 1.PageContent 组件

### 1.头部抽取

在 `PageContent.vue` 中，进行抽取和封装。

抽取头部的 title 和新建按钮到配置文件中。

src\views\main\system\department\cpns\PageContent.vue

```vue
<template>
  interface IProps {
    contentConfig: {
      pageName: string
      header?: {
        title: string
        btnLabel: string
      }
    }
  }
  defineProps<IProps>()
</template>
  
<script>
  <!--  头部  -->
  <div class="header">
    <h3 class="title">{{ contentConfig?.header?.title ?? `数据列表` }}</h3>
    <el-button type="primary" @click="onNewclick">{{
      contentConfig?.header?.btnLabel ?? `新建数据`
    }}</el-button>
  </div>
</script>
```

### 2.表格抽取

#### 1.通用的列抽取配置

在 `PageContent.vue` 中，抽取”选择列“、”序号“、”部门名称“、”部门编号“和”上级部门“等比较通用的列。

使用 v-bind 的绑定对象的写法。

src\views\main\system\department\config\content.config.ts

```typescript
const propsList = [
  // 较通用的列
  { type: 'selection', label: '选择', width: '50' },
  { type: 'index', label: '序号', width: '60' },
  { label: '部门名称', prop: 'name', width: '200' },
  { label: '部门编号', prop: 'leader', width: '200' },
  { label: '上级部门', prop: 'parentId', width: '150' },
]
```

src\views\main\system\department\cpns\PageContent.vue

```vue
<template v-for="item of contentConfig.propsList" :key="item.prop" >
  <el-table-column align="center" v-bind="item"></el-table-column>
</template>
```

#### 2.大部分页面都有的列抽取配置

抽取”创建时间“、”更新时间“和”操作“等三个使用了插槽的列，两种思路：

- 在 `PageContent.vue` 中遍历配置文件时，使用 v-if 处理每种情况。
- 在 `PageContent.vue` 中遍历配置文件时，使用插槽将特殊的列交给 `Department.vue` 处理，使用动态插槽名。
  - 配置文件中 item 的 `type` 为 `custom`，表示需要使用插槽处理。

src\views\main\system\department\config\content.config.ts

```typescript
const propsList = [
  // 较通用的列
  { type: 'selection', label: '选择', width: '50' },
  { type: 'index', label: '序号', width: '60' },
  { label: '部门名称', prop: 'name', width: '200' },
  { label: '部门编号', prop: 'leader', width: '200' },
  { label: '上级部门', prop: 'parentId', width: '150' },
  // 很多页面都有的列
  { gener: 'timer', label: '创建时间', prop: 'createAt' },
  { gener: 'timer', label: '修改时间', prop: 'updateAt' },
  { gener: 'handler', label: '操作', prop: 'updateAt', width: '250' }
]
```

src\views\main\system\department\cpns\PageContent.vue

```vue
<template v-for="item of contentConfig.propList" :key="item.prop">

  <!-- 很多页面都有的列。分情况处理 -->
  <template v-if="item.gener === 'timer'">
    <el-table-column align="center" v-bind="item" #default="scope">
      {{ formatUTC(scope.row.createAt) }}
    </el-table-column>
  </template>

  <template v-else-if="item.gener === 'handler'">
    <el-table-column align="center" v-bind="item" #default="scope">
      <el-button
        size="small"
        icon="Edit"
        type="primary"
        text
        @click="onEditClick(scope.row)"
        >编辑</el-button
      >
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

  <!-- 较为通用的列 -->
  <template v-else>
    <el-table-column align="center" v-bind="item"></el-table-column>
  </template>

</template>
```

### 3.网络请求

在 `PageContent.vue` 中。

传入 `pageName` 属性，用来决定 `PageContent.vue` 组件用于哪个页面。也可用于发送网络请求。

src\views\main\system\department\config\content.config.ts

```typescript
const contentConfig = {
	pageName: DEPARTMENT,
}
```

src\views\main\system\department\cpns\PageContent.vue

```typescript
const pageName = computed(() => props.contentConfig.pageName)

systemStore.postPageListAction<IDepartmentQueryParam>(pageName.value, {
		...queryParam,
		...formatData
	})

systemStore.deletePageByIdAction(pageName.value, id)
```

## 2.PageModal 组件

在 `PageModal.vue` 中进行抽取和封装。

### 1.头部、表单抽取

抽取 header 的配置，和 formItems 的配置。 

src\views\main\system\department\config\modal.config.ts

```typescript
const formItems: IDepartmentFormItem[] = [
	{ type: 'input', label: '部门名称', prop: 'name', placeholder: '请输入部门名称' },
	{ type: 'input', label: '部门领导', prop: 'leader', placeholder: '请输入部门领导' },
	{ type: 'select', label: '上级部门', prop: 'parentId', placeholder: '请选择上级部门' },
]

export default {
	pageName: DEPARTMENT,
	header: {
		newBtnLabel: '新建部门',
		editBtnLabel: '编辑部门'
	},
	formItems
}
```

src\components\page-modal\PageModal.vue\

```vue
<el-form :model="formData" label-width="80px" size="large">

  <template v-for="item of modalConfig.formItems" :key="item.prop">
    <el-form-item :label="item.label" :prop="item.prop">

      <template v-if="item.type === 'input'">
        <el-input v-model="formData[item.prop]" :placeholder="item.placeholder"></el-input>
      </template>

      <template v-else-if="item.type === 'select'">
        <el-select
          v-model="formData[item.prop]"
          :placeholder="item.placeholder"
          style="width: 100%"
        >
          <template v-for="option of item.options" :key="option.value">
            <el-option :label="option.label" :value="option.value"></el-option>
          </template>
        </el-select>
      </template>

    </el-form-item>
  </template>

</el-form>
```

### 2.动态注入配置项

在 modalConfig 配置文件中，某些 type 为 `select` 的 formItem 的 `options` 数据来自服务器。

在 `Department.vue` 中，为 modalConfig 配置文件中 `type` 为 `select` 类型的 formItem，动态添加 options，使用 `computed`

src\views\main\system\department\Department.vue

```vue
<template>
  <PageModal :modal-config="modalConfigREf" ref="modalRef"></PageModal>
</template>

<script>
  const modalConfigREf = computed(() => {
    
    const mainStore = useMainStore()
    const selectFormItem = modalConfig.formItems.find(item => item.prop === 'parentId')

    if (selectFormItem)	selectFormItem.options =  mainStore.entireDepartments.map(item => ({
      label: item.name, value: item.id
    }))

    return modalConfig
  })
</script>
```

在 `PageModal.vue` 中展示。

> 因为 `PageModal.vue` 默认是不显示的，而是点击“新建”或“修改”时显示；
>
> 所以设置初始化值无效，需要在显示的时候，再设置初始化值。

src\components\page-modal\PageModal.vue

```vue
<el-form :model="formData" label-width="80px" size="large">

  <template v-for="item of modalConfig.formItems" :key="item.prop">
    <el-form-item :label="item.label" :prop="item.prop">

      <template v-if="item.type === 'input'">
        <el-input v-model="formData[item.prop]" :placeholder="item.placeholder"></el-input>
      </template>

      <template v-else-if="item.type === 'select'">
        <el-select
          v-model="formData[item.prop]"
          :placeholder="item.placeholder"
          style="width: 100%"
        >
          <template v-for="option of item.options" :key="option.value">
            <el-option :label="option.label" :value="option.value"></el-option>
          </template>
        </el-select>
      </template>

    </el-form-item>
  </template>

</el-form>
```

在 `PageModal.vue` 中设置传入的 Props 的类型时，要注意：

> 组件 Props 的类型，`defineProps<T>` 泛型中的类型，不能定义在文件外面，否则无法编译。
>
> 不要再 .vue 文件中导出类型或其它内容。
>
> .vue 文件默认导出的是一个组件对象，setup 顶层写法本质上只是一种语法糖。[参考文档](https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props)

## 3.Hooks 封装

在 `Department.vue` 中，对相同的逻辑进行抽取，使用 hooks。

src\hooks\usePageSearch.ts

```typescript
import { ref } from 'vue';
import type PageContent from '@/components/page-content/PageContent.vue'
import type { IDepartmentQueryFormData } from '@/types'

const usePageSearch = () => {

	const contentRef = ref<InstanceType<typeof PageContent>>()
                                      
	const handleQueryClick = <T extends IDepartmentQueryFormData>(formData: T) => {
		contentRef.value?.fetchPageListData(formData)
	}

	const handleResetClick = () => {
		contentRef.value?.fetchPageListData()
	}

	return [contentRef, handleQueryClick, handleResetClick]
}

export default usePageSearch
```

src\hooks\usePageContent.ts

```typescript
import type PageModal from '@/components/page-modal/PageModal.vue'
import { ref } from 'vue';
import type { IDepartment } from '@/types'

const usePageContent = () => {

	const modalRef = ref<InstanceType<typeof PageModal>>()

	const handleNewClick = () => {
		modalRef.value?.setModalVisible({ isNew: true })
	}

	const handleEditClick = <T extends IDepartment>(itemData: T) => {
		modalRef.value?.setModalVisible({ isNew: false, itemData })
	}

	return [modalRef, handleNewClick, handleEditClick]
}

export default usePageContent


```

src\views\main\system\department\Department.vue

```typescript
const [contentRef, handleQueryClick, handleResetClick] = usePageSearch()

const [modalRef, handleNewClick, handleEditClick] = usePageContent()
```

# 二、高阶组件封装（二）



以 Role 页面为例，封装和完善高阶组件 `PageContent.vue` 和 `PageModal.vue`.

## 1.Role 配置文件

在 Role 中，应用封装好的组件。编写配置文件。

src\views\main\system\role\config\search.config.ts

src\views\main\system\role\config\contnt.config.ts

src\views\main\system\role\config\modal.config.ts



## 2.Menu 配置文件

在 Menu 中，应用封装的组件，展示菜单。

在 table 中实现行的展开。使用树形数据和懒加载。

在 PageContent 中，为 el-table 设置 `row-key` 属性

> 最好不要给 config 配置文件中的 iten 加属性 type，使用 v-bind 绑定属性对象时，会覆盖 UI 框架上的属性。





再 Role 中，新建角色时，加入菜单树。

使用插槽。和 tree 树形控件。

再 mainStore 中，获取完整的菜单数据。

再 PageModal 中，传入的 Props 黎，新增 otherInfo 属性，将选中的菜单信息传入进去。并在创建角色时携带。

> Vue 中 slotname 最好不要使用大写字母。



在 Role 中，编辑时，发现菜单树是上次打开 Modal 时选择的（modal 组件没有被销毁。）。

需要针对角色对应的菜单树进行回显：

给 hook usePageContent 中传入一个回调函数 editCallback，将 menuList 传入其中。

封装一个工具函数，将菜单（子菜单）映射出 Id 列表，使用递归。

在 `nextTick` 中进行映射。（这个 api 有什么用？）

> 一次“tick”，pre（准备工作），queue（队列中的状态更新），post（调用生命周期等收尾工作）
>
> 面试：nextick 中的回调函数是宏任务还是微任务。
>
> - 在 Vue2 中进行了多次变化。
> - 在 Vue3 中，是一个微任务



【了解】：流行的做富文本编辑的库 `wangEdit`



在 User 中，对用户的增删改查权限，做限制。



