# 一、高阶组件封装（一）

以 `DepartmentPanel.vue` 页面为例，封装和完善高阶组件 `PageContent.vue` 和 `PageModal.vue`.

## 1.PageContent 组件

### 1.头部抽取

在 `PageContent.vue` 中，进行抽取和封装。

抽取头部的 title 和“新建按钮”的 label 到配置文件中。

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

<script setup lang="ts">
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

#### 1.通用列抽取

在 `PageContent.vue` 中，抽取”选择列“、”序号“、”部门名称“、”部门编号“，”上级部门“等比较通用的列。

使用 `v-bind` 的绑定对象的写法。

src\views\main\system\department\config\content.config.ts

```typescript
const propsList = [
	// 较通用的列
	{ type: 'selection', label: '选择', width: '50' },
	{ type: 'index', label: '序号', width: '60' },
	{ label: '部门名称', prop: 'name', width: '200' },
	{ label: '部门编号', prop: 'leader', width: '200' },
	{ label: '上级部门', prop: 'parentId', width: '150' }
]
```

src\views\main\system\department\cpns\PageContent.vue

```vue
<template v-for="item of contentConfig.propsList" :key="item.prop">
	<el-table-column align="center" v-bind="item"></el-table-column>
</template>
```

#### 2.时间、操作列抽取

抽取”创建时间“、”更新时间“和”操作“等三个使用了插槽的列，

在 `PageContent.vue` 中遍历处理配置文件时，有两种思路（项目中都有采用）：

- 思路一：使用 `v-if` 处理每种情况。
- 思路二：使用插槽将特殊的列交给 `DepartmentPanel.vue` 处理，使用动态插槽名。
  - 配置文件中 item 的 `gener` 为 `custom`，表示需要使用插槽处理。

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
			<el-button size="small" icon="Edit" type="primary" text @click="onEditClick(scope.row)">编辑</el-button>
			<el-button size="small" icon="Delete" type="danger" text @click="onDeleteClick(scope.row.id)">删除</el-button>
		</el-table-column>
	</template>

	<!-- 较为通用的列 -->
	<template v-else>
		<el-table-column align="center" v-bind="item"></el-table-column>
	</template>
</template>
```

### 3.网络请求重构

在 `PageContent.vue` 中。传入 `pageName` 属性，用来决定 `PageContent.vue` 组件用于哪个页面。并用于发送网络请求。

src\views\main\system\department\config\content.config.ts

```typescript
const contentConfig = {
	pageName: DEPARTMENT
}
```

src\views\main\system\department\cpns\PageContent.vue

```typescript
const pageName = computed(() => props.contentConfig.pageName)

//...
systemStore.postPageListAction<IDepartmentQueryParam>(pageName.value, {
	...queryParam,
	...formatData
})

//...
systemStore.deletePageByIdAction(pageName.value, id)
```

## 2.PageModal 组件

在 `PageModal.vue` 中进行抽取和封装。

### 1.头部、表单抽取

抽取 `header` 的配置，和 `formItems` 的配置。

src\views\main\system\department\config\modal.config.ts

```typescript
const formItems: IDepartmentFormItem[] = [
	{ type: 'input', label: '部门名称', prop: 'name', placeholder: '请输入部门名称' },
	{ type: 'input', label: '部门领导', prop: 'leader', placeholder: '请输入部门领导' },
	{ type: 'select', label: '上级部门', prop: 'parentId', placeholder: '请选择上级部门' }
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

在 modalConfig 配置文件中，某些 `type` 为 `select` 的 `formItem` 的 `options` 数据来自服务器。

src\views\main\system\department\config\modal.config.ts

```typescript
const formItems: IModalFormItem[] = [
	{ type: 'input', label: '部门名称', prop: 'name', placeholder: '请输入部门名称' },
	{ type: 'input', label: '部门领导', prop: 'leader', placeholder: '请输入部门领导' },
	{
		type: 'select',
		label: '上级部门',
		prop: 'parentId',
		placeholder: '请选择上级部门',
		options: [] // options 是不确定的，来自服务器中的数据
	}
]
```

在 `DepartmentPanel.vue` 中，为 modalConfig 配置文件中 `type` 为 `select` 类型的 `formItem`，动态添加 `options`，使用 `computed`

src\views\main\system\department\DepartmentPanel.vue

```vue
<template>
	<PageModal :modal-config="modalConfigREf" ref="modalRef"></PageModal>
</template>

<script>
const modalConfigREf = computed(() => {
	const mainStore = useMainStore()
	// 这种写法，如果导致一行过长，如果 prettier 格式化后，要注意给回调函数加上 return。
	const selectFormItem = modalConfig.formItems.find(item => item.type === 'select' && item.prop === 'parentId')

	if (selectFormItem && 'options' in selectFormItem) {
		selectFormItem.options = mainStore.entireDepartments.map(item => ({
			label: item.name,
			value: item.id
		}))
	}

	return modalConfig
})
</script>
```

在 `PageModal.vue` 中展示。

> 因为 `PageModal.vue` 默认是不显示的，而是点击“新建”或“修改”时显示；
>
> 所以需要在显示的时候，再设置初始化值。
>
> 除非在 `<el-dialog>` 上，使用了 `destroy-on-close` 属性。

src\components\page-modal\PageModal.vue

```typescript
interface OpenDialogParamType<T> {
	isNew?: boolean
	itemData?: T
}
// 设置 dialog 是否显示
const setModalVisible = <T extends { id: number }, F>({ isNew = true, itemData }: OpenDialogParamType<T>) => {
	showdialog.value = true
	isAdd.value = isNew
	if (!isNew && itemData) {
		// 编辑
		Object.keys({ ...formData }).forEach(key => {
			if (key in itemData) {
				formData[key as keyof F] = itemData[key as keyof T]
			}
		})
		editId.value = itemData.id
	} else {
		// 新建
		Object.keys({ ...formData }).forEach(key => {
			formData[key as keyof F] = ''
		})
		editId.value = -1
	}
}
```

在 `PageModal.vue` 中设置传入的 Props 的类型时，要注意：

> 组件 Props 的类型 `defineProps<T>` 泛型中的类型 `T` 不能定义在文件外面，否则无法编译。
>
> 不要在 .vue 文件中导出类型或其它内容。
>
> .vue 文件默认导出的是一个组件对象，setup 顶层写法本质上只是一种语法糖。[参考文档](https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props)

## 3.Hooks 封装

在 `DepartmentPanel.vue` 中，对相同的逻辑进行抽取，使用 hooks。

src\hooks\usePageSearch.ts

```typescript
import { ref } from 'vue'
import type PageContent from '@/components/page-content/PageContent.vue'
import type { IDepartmentSearchFormData } from '@/types'

const usePageSearch = () => {
	const contentRef = ref<InstanceType<typeof PageContent>>()

	const handleQueryClick = <T extends IDepartmentSearchFormData>(formData: T) => {
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
import { ref } from 'vue'
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

src\views\main\system\department\DepartmentPanel.vue

```typescript
const [contentRef, handleQueryClick, handleResetClick] = usePageSearch()

const [modalRef, handleNewClick, handleEditClick] = usePageContent()
```

# 二、高阶组件封装（二）

以 `RolePanel.vue` 页面为例，封装和完善高阶组件 `PageContent.vue` 和 `PageModal.vue`.

## 1.Role 配置文件

在 `RolePanel.vue` 中，应用封装好的组件。编写配置文件。

src\views\main\system\role\config\search.config.ts

src\views\main\system\role\config\contnt.config.ts

src\views\main\system\role\config\modal.config.ts

## 2.PageContent 组件

### 1.table 树形数据

为 `<el-table>` 添加树形数据的效果，在 `MenuPanel.vue` 中展示菜单列表和它的子列表。

在 `<el-table>` 上，传入 `row-key` 属性和 `tree-props` 属性。[参考文档](https://element-plus.org/zh-CN/component/table.html#%E6%A0%91%E5%BD%A2%E6%95%B0%E6%8D%AE%E4%B8%8E%E6%87%92%E5%8A%A0%E8%BD%BD)

- 如果子树对应的属性是 `children` 则可以不传 `tree-props` 属性。

src\views\main\system\menu\config\content.config.ts

```typescript
import type { IContentConfig } from '@/types'
import { MENU } from '@/global/constance'

const contentConfig: IContentConfig = {
	pageName: MENU,
	header: {
		title: '菜单列表',
		btnLabel: '新建菜单'
	},
	propList: [
		{ label: '菜单名称', prop: 'name', width: '180' },
		{ label: '级别', prop: 'type', width: '120' },
		{ label: '菜单url', prop: 'url', width: '250' },
		{ label: '菜单icon', prop: 'icon', width: '200' },
		{ label: '排序', prop: 'sort', width: '120' },
		{ label: '权限', prop: 'promission', width: '150' },

		{ gener: 'timer', label: '创建时间', prop: 'createAt' },
		{ gener: 'timer', label: '修改时间', prop: 'updateAt' },
		{ gener: 'handler', label: '操作', width: '250' }
	],
	childrenTree: {
		rowKey: 'id',
		treeProps: {
			children: 'children'
		}
	}
}

export default contentConfig
```

src\components\page-content\PageContent.vue

```vue
<el-table :data="pageList" stripe border style="width: 100%" v-bind="contentConfig?.childrenTree"></el-table>
```

> 最好不要给 `PageContent.vue` 的 config 配置文件中的 `formIten` 加属性 `type`（项目中已用 `gener` 代替），
>
> 因为在 `<el-table-column>` 上使用 `v-bind` 绑定属性对象时，会覆盖原组件上的属性 `type`。

## 3.PageModal 组件

### 1.插槽展示角色的菜单

在 `RolePanel.vue` 中，新建角色时，需要在 `PageModal.vue` 中展示菜单树。

使用插槽。和 `<el-tree>` 树形控件。

先在 `mainStore` 中，获取完整的菜单数据 `entireMenus`。

再在 `PageModal.vue` 中，传入的 `props` 中，新增 `otherInfo` 属性，将选中的菜单信息传入进去。

并在创建和修改角色时携带 `otherInfo` 参数，发送给服务器。

src\views\main\system\role\RolePanel.vue

```vue
<template>
	<PageModal ref="modalRef" :modal-config="modalConfig" :other-info="otherInfo">
		<template #menulist>
			<el-tree
				ref="treeRef"
				:data="entireMenus"
				show-checkbox
				node-key="id"
				:props="{ children: 'children', label: 'name' }"
				@check="handleElTreeCheck"
			></el-tree>
		</template>
	</PageModal>
</template>

<script>
const mainStore = useMainStore()
const { entireMenus } = storeToRefs(mainStore)

const otherInfo = ref({})
const handleElTreeCheck = (detail: any, data: any) => {
	console.log('data:', data)
	const menuList = [...data.checkedKeys, ...data.halfCheckedKeys]
	console.log(`menuList`, menuList)
	otherInfo.value = { menuList }
}

const [contentRef, handleQueryClick, handleResetClick] = usePageSearch()
const [modalRef, handleNewClick, handleEditClick] = usePageContent()
</script>
```

src\components\page-modal\PageModal.vue

```vue
<!-- 插槽列 -->
<template v-if="item.type === 'custom'">
	<el-form-item>
		<slot :name="(item as IModalFormItemCustom).slotname"></slot>
	</el-form-item>
</template>
```

> Vue 中 slot name 最好不要使用大写字母。

在 `RolePanel.vue` 中，点击“编辑：角色时，发现菜单树是上次打开 Modal 时选择的菜单（因为 `PageModal.vue` 组件没有被销毁）。

需要针对角色的菜单树进行回显：

给 hook `usePageContent` 中传入一个回调函数 `editCallback`，将全部的菜单树 `menuList` 传入其中。

src\hooks\usePageContent.ts

```typescript
import type PageModal from '@/components/page-modal/PageModal.vue'
import { ref } from 'vue'
import type { ItemType, CreateFormDataType, EditFormDataType, IRole } from '@/types'

type EditCallbackType = (data: IRole) => void

const usePageContent = (editCallback?: EditCallbackType) => {
	const modalRef = ref<InstanceType<typeof PageModal>>()

	const handleNewClick = () => {
		modalRef.value?.setModalVisible<never, CreateFormDataType>({ isNew: true })
	}

	const handleEditClick = (itemData: ItemType) => {
		modalRef.value?.setModalVisible<ItemType, EditFormDataType>({ isNew: false, itemData })
		if (editCallback && 'menuList' in itemData) editCallback(itemData)
	}

	return [modalRef, handleNewClick, handleEditClick]
}

export default usePageContent
```

封装一个工具函数，将编辑角色的菜单（子菜单）映射出来，返回一个 Id 列表，使用递归。

src\utils\map-menu.ts

```typescript
/**
 * @description: 此函数用于：根据用户拥有的菜单，筛选出对应的权限 id（用于 Role 中，创建/编辑角色时，展示角色拥有的菜单）
 * @Author: ZeT1an
 * @param {IMenuInRole} menuList
 * @return {*}
 */
export const mapMenusToIds = (menuList: IMenuInRole[]): number[] => {
	const ids: number[] = []

	const _getIds = (menuList: IMenuInRole[] | IMenuInRoleChild[] | IMenuInRoleChild2[]) => {
		menuList.forEach(menu => {
			if ('children' in menu && menu.children) {
				_getIds(menu.children)
			} else {
				ids.push(menu.id)
			}
		})
	}
	_getIds(menuList)

	return ids
}
```

在 `nextTick` 中进行映射。

`nextTick` 传入的回调函数，会在 DOM 更新后执行。

src\views\main\system\role\RolePanel.vue

```typescript
// 编辑时，携带编辑角色的菜单
const editCallback = (itemData: IRole) => {
	nextTick(() => {
		const menuIds = mapMenusToIds(itemData.menuList)
		console.log('menuIds:', menuIds)
		treeRef.value?.setCheckedKeys(menuIds)
	})
}
```

> 一次“tick”，有如下阶段：
>
> 1. pre（准备工作）
> 2. queue（队列中的状态更新）
> 3. post（调用生命周期等收尾工作）
>
> 【面试】：`nextick` 中的回调函数是宏任务还是微任务。
>
> - 在 Vue2 中进行了多次调整。
> - 在 Vue3 中，是一个微任务。

# 三、富文本编辑器（了解）

【了解】：流行的做富文本编辑的库 [wangEdit](https://www.wangeditor.com/)
