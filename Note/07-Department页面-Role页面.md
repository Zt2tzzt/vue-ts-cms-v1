# 一、Department 页面

在 PageContent 中进行抽取和封装。

抽取 header 中，即 title 和 按钮 label 的配置。

抽取”选择列“、”序号“、”部门名称“、”部门编号“和”上级部门“比较统用的列。

- 使用 v-bind 的对象写法。

抽取”创建时间“、”更新时间“和”操作“三个使用了插槽的列，两种思路：

- 在遍历配置文件时，使用 v-if 处理。
- 在配置文件中定义一个 type 为 custom，在遍历时，判断该类型，并使用插槽处理，使用动态插槽名。



在 PageContent 中。

传入 pageName 属性，用来决定用于哪个页面。用于发送网络请求。



在 PageModal 中进行抽取和封装。

抽取 header 的配置，和 formItems 的配置。 

> 因为 PageModal 默认不显示，所以设置初始化值无效，需要在显示的时候，再设置初始化值。



再 PageModal 中设置传入的 Props 的类型。

modalConfig 中，select 类型的 item，需要动态添加 options，使用 computed