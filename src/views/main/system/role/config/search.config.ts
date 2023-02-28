import type { ISearchConfig } from '@/types'
import { ROLE } from '@/global/constance'

const searchConfig: ISearchConfig = {
	pageName: ROLE,
	formItems: [
		{
			type: 'input',
			prop: 'name',
			label: '角色名称',
			placeholder: '请输入查询的角色名称',
			initialvalue: ''
		},
		{
			type: 'input',
			prop: 'intro',
			label: '权限介绍',
			placeholder: '请输入权限介绍',
			initialvalue: ''
		},
		{
			type: 'date-picker',
			prop: 'createAt',
			label: '创建时间',
			initialvalue: ''
		}
	]
}

export default searchConfig
