import { ROLE } from '@/global/constance'
import type { IModalFormItem } from '@/types';

const formItems: IModalFormItem[] = [
	{ type: 'input', label: '角色名称', prop: 'name', placeholder: '请输入角色名称' },
	{ type: 'input', label: '权限介绍', prop: 'intro', placeholder: '请输入权限介绍' },
	{ type: 'custom', slotname: 'menulist'},
]

export default {
	pageName: ROLE,
	header: {
		newBtnLabel: '新建角色',
		editBtnLabel: '编辑角色'
	},
	formItems
}
