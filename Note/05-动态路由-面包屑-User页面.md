# 一、动态添加路由

## 1.思路整理

基于菜单动态匹配。

1.获取用户的菜单信息（已在 store 中），

2.创建组件，以及组件对应的路由。

3.从文件中读取路由动态的添加路由。

4.根据菜单，映射路由。



## 2.创建页面和路由

在 router 目录下，创建与 view 目录下，相同的文件结构

在每个文件中导出对应的路由对象。

这个过程，使用一个工具 *coderwhy*，自动生成 view 目录下的 .vue 组件，和 router 目录下的路由对象。

1.安装 *coderwhy* 工具

```shell
pnpm add coderwhy -D

npx coderwhy --version
```

2.使用工具，创建 department 的路由对象，以及 Department.vue 组件。

- `add3page_setup` 表示添加 Vue3 setup 语法的组件。
- `Department` 表示创建 `Department.vue` 组件和对应的路由对象。
- `-d` 表示创建 `Department.vue` 组件在哪一路径下，同时会映射到 ``router 目录下。

```shell
npx coderwhy add3page_setup Department -d src/views/main/system/department
```

> 采用方案三（后端返回菜单）时，一般参考后端返回的路径，蓝创建相应路径下的组件。





## 3.从文件中添加路由

1.在 loginstore 中，定义一个保存路由对象的空数组。

2.使用打包工具提供的 API，读取文件。

- webpack：`require.context`
- vite：`import.meta.glob()`

```typescript
import.meta.glob('../../router/main/**/*.ts')
```

默认取到的是文件路径，对应的 get 函数。通常用于懒加载。

添加一个餐宿。

```typescript
import.meta.glob('../../router/main/**/*.ts', {eager: true})
```

取到的是文件路径，对应的文件模块。



## 4.根据菜单映射路由

在 loginstore 中，定义一个保存路由对象的空数组。

将动态添加路由的代码，封装到一个工具中。



## 刷新时保持路由映射

在 `main.ts` 中，`use(pinia)` 后，

就去读取本地缓存。封装成一个插件。

`use(router)` 放在 `use(pinia)` 之后。



## 登陆后匹配第一个页面

定义一个全局变量，用于保存第一个匹配到的路由。

在导航守卫中，别写逻辑，路由为 `/main` 时，跳转到第一个匹配的路由。

匹配到的第一个页面，再匹配对应菜单的索引，进行设置。



## 刷新匹配当前页的菜单索引

在一个路由下刷新，菜单索引又回到了第一个页面。这是不对的。

将菜单匹配到当前页。



# 二、MainHeader 里的面包屑

封装一个工具，用来将当前路由匹配面包屑。

使用计算属性。

匹配菜单索引时，也是用计算属性。

# 三、User.vue 页面 

## 1.搜索页面

创建 `UserSearch.vue` 页面。

使用 `<el-form>` 布局搜索区域。

每行暂定三个 input 框。使用 UI 框架的 Layout 布局。

- `<el-raw>` 和 `<el-col>`

改变 `<el-form>` 中 `<el-form-item>` 的高度。

修改 `<el-form-item>`  padding，调整间距。

> 为了方便扩展，一个 `<el-raw>` 中允许放多个`<el-col>`



重置和搜索按钮编写。

功能编写。

1.重置操作编写，如果要使用 UI 框架提供的 API。

- 给 `<el-form>` 加上 `model` 属性。
- 给 `<el-form-item>` 加上 `prop` 属性。`



## 2.UI 框架国际化

在 `App.vue` 中配置。



## 3.内容页面

创建 UserContent.vue 页面。

编写 content 的头部区域。



获取 user 的数据并展示：

封装获取用户列表的请求。

创建 systmeStore。

发送网络请求，调用 store 中的 action。



使用 el-tabel 展示数据。

在第一列加入多选列。

最后一列操作列，使用插槽插入按钮。

设置每列宽度，没有设置的列，自动平分剩余的宽度。

每列居中显示。

调整每一行的行高。