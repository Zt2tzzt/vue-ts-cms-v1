在 UserContent 中，格式化“状态”，“创建日期”和“结束日期”。

使用 el-table-column 的作用域插槽。

使用 day.js 和其中的 utc 插件，0时区转东八区时间



在 UserContent 中编写分页区域。

使用 el-pagination 组件。

定义两个变量 currentPage 和 pageSize，并绑定到 el-pagination 组件上。

- 修改发布的网络请求逻辑，传入 size 和 offset；

触发交互事件后，发送网络请求。

从服务器返回的 userList 中，获取 totalCount。



在 UserContent 中进行条件查询。

> 事件总线，通常用于跨度比较大的组件。可造成不可控的缺陷。

将 UserSerach 中，点击查询时，将查询条件，发送给 User。

再在 User 中调用 UserContent 中暴露的方法。

- 注意：“创建时间”的初始化值，不能使用空数组。

将 UserSerach 中，点击重置按钮时，也要发送网络请求，请求所有数据。



在 UserContent 中编写用户删除功能。

点击“删除”，发送 delete 请求，删除数据。

并再发送网络请求，进行数据回显。



再 UserContent 中编写用户新建的功能。

将该功能封装在 UserModal 组件中。

- 使用 el-dialog 组件进行布局。
- 在其中使用 el-form 进行布局。

再 UserContent 中发送事件，传递新建会话框的“隐藏/显示”状态。

再 User 中拿到该状态，去调用 UserModal 中暴露的方法，改变其中的状态，

> 在组件中一般暴露方法，方法中可以进行拦截，更加可控。



在 UserModal 中“选择角色”和“选择部门”需要使用服务器请求下来的数据。

使用“获取角色列表”和“获取部门列表”接口。封装网络请求。

这种数据需要在多个页面中使用，所以创建 mainStore，将数据保存到其中。登陆/刷新时，就发送请求获取。