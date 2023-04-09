import { ROLE } from '@/global/constance'
import type { IContentConfig } from '@/types'

const contentConfig: IContentConfig = {
  pageName: ROLE,
  header: {
    title: '角色列表',
    btnLabel: '新建角色'
  },
  propList: [
    { type: 'selection', label: '选择', width: '50' },
    { type: 'index', label: '序号', width: '60' },
    { label: '角色名称', prop: 'name', width: '200' },
    { label: '权限介绍', prop: 'intro', width: '200' },
    { gener: 'timer', label: '创建时间', prop: 'createAt' },
    { gener: 'timer', label: '修改时间', prop: 'updateAt' },
    { gener: 'handler', label: '操作', width: '250' }
  ]
}

export default contentConfig
