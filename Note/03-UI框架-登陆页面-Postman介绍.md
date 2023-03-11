# 一、UI 组件库介绍

流行的 React 组件库：

- AntDesign
- Material UI

流行的 Vue3 组件库：

- Vant（移动端）
- Element Plus
- AntDesign Vue

流行的 Vue2 组件库：

- Element UI

# 二、Element Plus 引入

## 1.安装

在项目中，使用包管理器进行安装；[官方文档](https://element-plus.org/zh-CN/guide/installation.html)。

```shell
npm install element-plus
```

## 2.全局引入

方便简洁，但打包过大。[官方文档](https://element-plus.org/zh-CN/guide/quickstart.html)

src/main.ts

```typescript
//...
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//...
app.use(ElementPlus)
//...
```

## 3.按需引入（推荐）

详细步骤参考[官方文档](https://element-plus.org/zh-CN/guide/quickstart.html#%E6%8C%89%E9%9C%80%E5%AF%BC%E5%85%A5)

1.安装两个插件

```shell
npm install -D unplugin-vue-components unplugin-auto-import
```

2.在配置文件中进行配置

- _webpack_ 在 `vue.config.ts` 配置。
- _vite_ 在 `vite.config.ts` 配置（项目中使用）。

。/vite.config.ts

```typescript
//...

import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
	plugins: [
		//...
		AutoImport({
			resolvers: [ElementPlusResolver()]
		}),
		Components({
			resolvers: [ElementPlusResolver()]
		})
	]
})
```

3.项目运行后，会生成 2 个文件

- `auto-imports.d.ts`；
- `components.d.ts`

将它们添加到 `tsconfig.json` 中的 `include` 选项中，以实现编辑器中更好地类型支持。

./tsconfig.json

```json
"include": ["env.d.ts", "src/**/*", "src/**/*.vue", "auto-imports.d.ts", "components.d.ts"],
```

> 像 `ELMessage`、`ELLoading` 这样的”反馈组件“，没有在 `<template>` 中使用；
>
> 按需引入不会自动导入，需要手动导入，或者另外配置它们的自动导入，[详细配置方式见下方](#6.反馈组件引入)。

## 4.手动导入

了解，比较麻烦，不推荐使用。[官方文档](https://element-plus.org/zh-CN/guide/quickstart.html#%E6%89%8B%E5%8A%A8%E5%AF%BC%E5%85%A5)

## 5.图标引入

使用 Element Plus 框架中自带的图标，两种方式：

- [全局注册](https://element-plus.org/zh-CN/component/icon.html#%E6%B3%A8%E5%86%8C%E6%89%80%E6%9C%89%E5%9B%BE%E6%A0%87)，项目中采用。
- [自动导入](https://element-plus.org/zh-CN/component/icon.html#%E8%87%AA%E5%8A%A8%E5%AF%BC%E5%85%A5)（配置起来较麻烦）

  1.编写一个注册图标的插件。

src\global\register-icons.ts

```typescript
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import type { App } from 'vue'

const registerIcons = (app: App<Element>) => {
	for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
		app.component(key, component)
	}
}

export default registerIcons
```

2.使用插件

src\main.ts

```typescript
//...
import icon from '@/global/register-icons'
//...
app.use(icon)
```

## 6.反馈组件引入

使用像 `ElMessage` 这样的反馈组件。对错误信息进行提示。

该组件不会在 `<template>` 中使用，而是在 ts 逻辑代码中使用，需要手动引入组件和样式，

### 1.手动引入组件：

src\views\login\cpns\PanelAccount.vue

```typescript
import { ElMessage } from 'element-plus'
```

### 2.手动引入样式：

方式一：全局引入样式。

src\main.ts

```typescript
import 'element-plus/dist/index.css'
```

方式二：单独引入样式，比如只引入 `ElMessage` 的样式。

src\main.ts

```typescript
import 'element-plus/theme-chalk/el-message.css'
```

方式三：自动导入样式，需要安装插件并进行配置（项目中采用）。

1.安装插件 [vite-plugin-style-import](https://github.com/vbenjs/vite-plugin-style-import)

```shell
npm i vite-plugin-style-import -D
```

2.配置 `vite.config.ts`

```typescript
import { UserConfigExport } from 'vite'
import { createStyleImportPlugin, ElementPlusResolve } from 'vite-plugin-style-import'

export default (): UserConfigExport => {
	return {
		// 1. If you are using the ant-design series, you need to configure this
		// 2. Make sure less is installed in the dependency `yarn add less -D`
		css: {
			preprocessorOptions: {
				less: {
					javascriptEnabled: true
				}
			}
		},
		plugins: [
			createStyleImportPlugin({
				resolves: [ElementPlusResolve()],
				libs: [
					{
						libraryName: 'element-plus',
						esModule: true,
						resolveStyle: (name: string) => {
							return `element-plus/theme-chalk/${name}.css`
						}
					}
				]
			})
		]
	}
}
```

# 三、登录页面

## 1.样式调整，添加背景

1.`App.vue` 占满屏幕；这样好做窗口居中处理。

src\App.vue

```css
.app {
	width: 100vw;
	height: 100vh;
}
```

2.`LogIn.vue` 样式处理；

让整个组件占满屏幕，login 的内容居中，使用 flex 布局；

添加一个背景

src\views\login\LogIn.vue

```css
.login {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background-image: url(@/assets/img/login-bg.svg);
}
```

## 2.登录页面搭建

1.创建组件 `LoginPanel.vue` 组件

src\views\login\cpns\LoginPanel.vue

2.在 `LogIn.vue` 中引入。

src\views\login\LogIn.vue

```vue
<script setup lang="ts">
import LoginPanel from './cpns/LoginPanel.vue'
</script>

<template>
	<div class="login">
		<LoginPanel></LoginPanel>
	</div>
</template>
```

### 1.整体页面搭建

在 `LoginPanel.vue` 中搭建整体页面。

1.标题

src\views\login\cpns\LoginPanel.vue

```html
<h1 class="title">ZT 后台管理系统</h1>
```

2.tabs

src\views\login\cpns\LoginPanel.vue

```vue
<!-- tabs 区域，在帐号和手机登录之间切换。 -->
<div class="tabs">
  <el-tabs type="border-card" stretch v-model="activeName">
    <!-- 1.账号登录的 Pane -->
    <el-tab-pane name="account"></el-tab-pane>

    <!-- 2.手机登录的 Pane -->
    <el-tab-pane name="phone"></el-tab-pane>
  </el-tabs>
</div>

<script>
//...
const activeName = ref('account')
</script>
```

3.记住密码/忘记密码

src\views\login\cpns\LoginPanel.vue

```html
<!-- 底部区域 -->
<div class="controls">
	<el-checkbox v-model="isRemPwd" label="记住密码" size="large" />
	<el-link type="primary">忘记密码</el-link>
</div>

<script setup lang="ts">
	import { ref } from 'vue'

	const isRemPwd = ref(false)
</script>
```

> vue 中 使用 `ref` 没有初始化值时，可以传泛型来规范类型，如 `ref<boolean>()`

4.立即登录按钮（组件）

使用 `<el-button>`

src\views\login\cpns\LoginPanel.vue

```vue
<el-button class="login-btn" type="primary" size="large" @click="handleLoginBtnClick">
  立即登录
</el-button>

<script>
// ...
const handleLoginBtnClick = () => {}
</script>
```

### 2.tabs 搭建过程

1.`<el-tab-pane>` 里，`label` 插槽的使用，用于 tabs 的标签。

2.内容显示

src\views\login\cpns\LoginPanel.vue

```vue
<!-- 1.账号登录的Pane -->
<el-tab-pane name="account">
  <template #label>
    <div class="label">
      <el-icon><UserFilled /></el-icon>
      <span class="text">帐号登录</span>
    </div>

		我是内容
  </template>
</el-tab-pane>
```

> 第三方 UI 框架，使用 CSS 变量名设值样式，已成为趋势，方便用户进行样式覆盖。

### 3.帐号登录 form

创建 `PanelAccount.vue` 组件，在其中搭建账号登陆的 form

src\views\login\cpns\PanelAccount.vue

```vue
<el-form :model="account" :rules="accountRules" label-width="60px" size="large" ref="formRef">
  <el-form-item label="帐号" prop="name">
    <el-input v-model="account.name" clearable  />
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="account.password" show-password clearable />
  </el-form-item>
</el-form>

<script>
//...

// 1.定义 account 数据
const account =
	reactive <
	IAccount >
	{
		name: '',
		password: ''
	}
</script>
```

> 词语“账号”，一般出现在银行系统中，与钱有关；
>
> 词语”帐号“，一般用于普通系统。

### 4.form 验证规则

为用户输入的帐号、密码编写校验规则，传入 `<el-form>` 的 `rules` 属性中。

src\views\login\cpns\PanelAccount.vue

```typescript
const accountRules: FormRules = {
	name: [
		{ required: true, message: '必须输入帐号信息~', trigger: 'blur' },
		{
			pattern: /^[a-z0-9]{6,20}$/,
			message: '必须是6~20数字或字母组成~',
			trigger: 'blur'
		}
	],
	password: [
		{ required: true, message: '必须输入密码信息~', trigger: 'blur' },
		{
			pattern: /^[a-z0-9]{3,}$/,
			message: '必须是3位以上数字或字母组成',
			trigger: 'blur'
		}
	]
}
```

### 5.立即登录按钮

回到 `LoginPanel.vue` 组件中，点击“立即登录”按钮，调用 `PanelAccount.vue` 中的登录方法，

src\views\login\cpns\LoginPanel.vue

```vue
<template>
	<!-- .. -->
	<PanelAccount ref="accountRef"></PanelAccount>
	<!-- ... -->
	<el-button class="login-btn" type="primary" size="large" @click="handleLoginBtnClick"> 立即登录 </el-button>
</template>

<script>
// ...
const accountRef = ref<InstanceType<typeof PanelAccount>>()
//...
const handleLoginBtnClick = () => {
	if (activeName.value === 'account') {
		accountRef.value?.loginAction()
	} else {
		console.log('用户在进行手机登录')
	}
}
</script>
```

> 在 TS 编写的父组件中，使用 `ref` 引用子组件实例时，不能使用子组件名称作为类型。而是这么写 `ref<InstanceType<typeof [组件名称]>>`，
>
> .vue 文件中导出的是组件对象，在 Vue 框架中是当作构造器来使用的。
>
> 引入的 El 组件，可以加 `class` 属性。

src\views\login\cpns\PanelAccount.vue

```typescript
const loginAction = () => {}

defineExpose({
	loginAction
})
```

## 3.登录操作分析

### 1.form 通过验证

使用 `form.validata` 方法：

- 用 `ref` 获取 `<el-form>` 实例。

src\views\login\cpns\PanelAccount.vue

```typescript
const formRef = ref<InstanceType<typeof ElForm>>()

const loginAction = () => {
	formRef.value?.validate(valid => {
		if (valid) {
		} else {
			ElMessage.error('Oops, 请您输入正确的格式后再操作~~.')
		}
	})
}
```

### 2.登录接口封装

在 service 目录中，封装登录接口。

src\service\login\login.ts

```typescript
//...
export const accountLoginRequest = (account: IAccount) =>
	ztRequest.post<IResponse<ILoginResData>>({
		url: 'login',
		data: account
	})
```

### 3.在 store 和组件中使用

在 store 中使用

封装一个操作 storege 的工具类.

src\utils\cache.ts

登录后，返回的登录态（token），保存到 store 并缓存到 storage 中。

src\stores\login\login.ts

```typescript
//...
const LOGIN_TOKEN = 'login/token'

const useLoginStore = defineStore('login', {
	state: () => ({
		id: 0,
		token: localCache.getCache(LOGIN_TOKEN) ?? '',
		name: ''
	}),
	actions: {
		loginAccountAction(account: IAccount) {
			accountLoginRequest(account).then(res => {
				this.id = res.data.id
				this.token = res.data.token
				this.name = res.data.name

				localCache.setCache(LOGIN_TOKEN, this.token)
			})
		}
	}
})

export default useLoginStore
```

在 `PanelAccount.vue` 中使用：

src\views\login\cpns\PanelAccount.vue

```typescript
//...
const account = reactive<IAccount>({
	name: '',
	password: ''
})

//...
const loginAction = () => {
	formRef.value?.validate(valid => {
		if (valid) {
			loginStore.loginAccountAction({ ...account })
		} else {
			ElMessage.error('Oops, 请您输入正确的格式后再操作~~.')
		}
	})
}
```

### 4.登录接口参数类型

在全局定义 `IAccount` 类型，作为登录接口传入参数的类型。

src\types\login.d.ts

```typescript
export interface IAccount {
	name: string
	password: string
}
```

> 在 src 下创建 types 目录，用来声明多处都要用到的类型。

# 四、postman 使用

将在线文档，导入到 postman 中。

[接⼝⽂档 v1 版本](https://documenter.getpostman.com/view/12387168/TzsfmQvw)

[接⼝⽂档 v2 版本（有部分更新）](https://documenter.getpostman.com/view/12387168/TzzDKb12)

[baseURL](http://152.136.185.210:5000)

[baseUrl](http://152.136.185.210:4000)（备用）

postman 中设置全局 token 的⽅法：

```js
const res = pm.response.json()
pm.globals.set('token', res.data.token)
```
