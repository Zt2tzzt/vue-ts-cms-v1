import { ROLE } from '@/global/constance'
import type { IModalConfig } from '@/types'

const modalConfig: IModalConfig = {
  pageName: ROLE,
  header: {
    newBtnLabel: '新建角色',
    editBtnLabel: '编辑角色'
  },
  formItems: [
    { type: 'input', label: '角色名称', prop: 'name', placeholder: '请输入角色名称' },
    { type: 'input', label: '权限介绍', prop: 'intro', placeholder: '请输入权限介绍' },
    { type: 'custom', slotname: 'menulist' }
  ]
}

export default modalConfig
