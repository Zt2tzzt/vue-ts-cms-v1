# UI 组件库介绍

React

- AntDesign
- Material UI

Vue3

- Vant（移动端）
- Element Plus
- AntDesign Vue

Vue2

- Element UI

# Element Plus 引入

## 1.安装

## 2.用法

### 1.全局引入

方便简洁，但打包过大。

### 2.按需引入

1. 安装两个插件

   ```shell
   npm install -D unplugin-vue-components unplugin-auto-import
   ```

2. 在配置文件中进行配置

   - webpack 对应 vue.config.ts
   - vite 对应 vite.config.ts

3. 项目运行后，会生成 2 个文件

   - `auto-imports.d.ts`；`components.d.ts`
   - 将它们添加到 `tsconfig.json` 中的 `include` 选项中，以实现编辑器中更好地类型支持。

类似于 `ELMessage`、`ELLoading` 这样的反馈组件，按需引入不会自动导入，需要手动导入。

### 3.手动导入

了解，不推荐使用。

# 登录页面

## 1.样式调整

让 Login.vue 中的 app 占满屏幕，这样好做窗口剧中处理。

src\App.vue

```css
.app {
	width: 100vw;
	height: 100vh;
}
```

让 Login 占满屏幕；

并使用 flex 布局，将内容居中。；

添加一个背景

src\views\login\Login.vue

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

## 2.LoginPanel 组件

1.创建组件

src\views\login\cpns\LoginPanel.vue

2.在 Login 中引入。

src\views\login\Login.vue

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

3.组件编写

。。。

vue 中 使用 `ref` 没有初始化值时，可以传泛型来规范类型，如 `ref<boolean>()`

引入的 Ele 组件，可以加 `class`

> 第三方 UI 框架，使用 CSS 变量名设值样式，亦成为趋势，方便用户进行样式覆盖。

使用 Element Plus 框架中自带的图标，两种方式：

- 全局注册，项目中采用。
- 自动导入（配置起来较麻烦）



4.PanelAccount 组件抽取。

未用户输入的帐号、密码编写校验规则。一般卸载 `<el-form>` 组件中。

。。。

“账号” => “帐号”（正确）



5.PanelPhone 组件抽取。

。。。



6.登录按钮点击

校验输入，

在父组件中点击按钮，执行子组件中的方法。

使用 `ref` 引用子组件实例时，不能使用子组件名称作为类型。而是这么写 `ref<InstanceType<typeof [组件名称]>>`，代码中组件导出的时对象，而在 Vue 框架中是当作构造器来使用的。

店家提交按钮，校验表单中的规则是否满足。使用 `ref` 获取 `el-form`。

使用 `ElMessage` 反馈组件（需要手动引入组件和样式）对错误信息进行提示，

- 全局引入样式。
- 只引入 `ElMessage` 的样式。
- 自动导入杨思，需要安装插件



发送请求

封装登录的网络请求，并调用。

将登录返回的登录态，保存到 store 和 storage 中，创建 loginStore。

- 封装一个操作 storege 的工具类.

将发送网络请求的过程，放入到 store 中。

在 src 下创建 types 目录，用来声明多处都要用到的类型。



# postman 使用

将在线文档，导入到 postman 中。


