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
