export interface IAccount {
  name: string
  password: string
}

export interface ILoginResData {
  id: number
  name: string
  token: string
}

export interface IUserInfoResData {
  id: number
  name: string
  realname: string
  cellphone: number
  enable: number
  createAt: string
  updateAt: string
  role: {
    id: number
    name: string
    intro: string
    createAt: string
    updateAt: string
  }
  department: {
    id: number
    name: string
    parentId: any
    createAt: string
    updateAt: string
    leader: string
  }
}

export interface IBreadcrumb {
  name: string
  path: string
}
