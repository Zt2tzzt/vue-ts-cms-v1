import { ISearchFormItem, ISearchParam, IResponseListData } from './global'

export interface IDepartmentCreateFormData {
  name: string
  leader: string
  parentId: number | ''
}

export type IDepartmentEditFormData = Partial<IDepartmentCreateFormData>

export interface IDepartmentSearchFormData {
  name: string
  leader: string
  createAt: string | string[]
}

export type IDepartmentQueryParam = ISearchParam & Partial<IDepartmentSearchFormData>

export type IDepartmentSearchFormItem = ISearchFormItem<IDepartmentSearchFormData>

export interface IDepartment {
  id: number
  name: string
  parentId: number
  createAt: string
  updateAt: string
  leader: string
}

export type IDepartmentsResult = IResponseListData<IDepartment>
