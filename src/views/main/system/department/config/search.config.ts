import { DEPARTMENT } from '@/global/constance'
import type { ISearchConfig } from '@/types'

const searchConfig: ISearchConfig = {
  pageName: DEPARTMENT,
  formItems: [
    {
      type: 'input',
      prop: 'name',
      label: '部门名称',
      placeholder: '请输入查询的部门名称',
      initialvalue: ''
    },
    {
      type: 'input',
      prop: 'leader',
      label: '部门领导',
      placeholder: '请输入查询的领导名称',
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
