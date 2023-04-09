import ztRequest from '..'
import type { IDepartmentsResult, IRoleSResult, IMenuResult, IResponse } from '@/types'

export const postEntireRoles = () =>
  ztRequest.post<IResponse<IRoleSResult>>({
    url: '/role/list'
  })

export const postEntireDepartment = () =>
  ztRequest.post<IResponse<IDepartmentsResult>>({
    url: '/department/list'
  })

export const postEntireMenus = () =>
  ztRequest.post<IResponse<IMenuResult>>({
    url: '/menu/list'
  })
