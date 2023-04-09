import { defineStore } from 'pinia'
import { postEntireRoles, postEntireDepartment, postEntireMenus } from '@/service/main/main'
import type { IRole, IMenu, IDepartment } from '@/types'

interface IMainStore {
  entireRoles: IRole[]
  entireDepartments: IDepartment[]
  entireMenus: IMenu[]
}

const useMainStore = defineStore('main', {
  state: (): IMainStore => ({
    entireRoles: [],
    entireDepartments: [],
    entireMenus: []
  }),
  actions: {
    fetchEntireDataAction() {
      postEntireRoles().then(res => {
        console.log('entire roles res:', res)
        this.entireRoles = res.data.list
      })
      postEntireDepartment().then(res => {
        console.log('entire departments res:', res)
        this.entireDepartments = res.data.list
      })
      postEntireMenus().then(res => {
        console.log('entire menus res:', res)
        this.entireMenus = res.data.list
      })
    }
  }
})

export default useMainStore
