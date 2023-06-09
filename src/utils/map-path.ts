import type { IMenuInRole, IMenuInRoleChild, IBreadcrumb } from '@/types'

/**
 * @description: 此函数用于：根据当前路径，匹配用户菜单（用于 MainMenu.vue 中显示激活的菜单索引），
 * @Author: ZeT1an
 * @param {string} path 当前路径
 * @param {IMenuInRole[]} userMenus 用户菜单列表
 * @return {IMenuInRoleChild | undefined} 激活的菜单，或者未匹配到/
 */
export const mapPathToMenu = (
  path: string,
  userMenus: IMenuInRole[] | IMenuInRoleChild[],
  breadcrumb?: IBreadcrumb[]
): IMenuInRoleChild | undefined => {
  let findMenu: IMenuInRoleChild | undefined

  for (const item of userMenus) {
    switch (item.type) {
      case 1:
        findMenu = mapPathToMenu(path, item.children ?? [])
        if (findMenu) {
          breadcrumb?.push({ name: item.name, path: item.url }) // 一层菜单
          breadcrumb?.push({ name: findMenu.name, path: findMenu.url })
          return findMenu
        }
        break
      case 2:
        if (item.url === path) return item
        break
    }
  }
}

/**
 * @description: 此函数用于：根据当前路径，匹配面包屑（用于 MainHeader.vue 中显示面包屑）
 * @Author: ZeT1an
 * @param {string} path 当前路径
 * @param {IMenuInRole[]} userMenus 用户菜单列表
 * @return {IBreadcrumb[]} 面包屑列表
 */
export const mapPathToBreadcrumb = (
  path: string,
  userMenus: IMenuInRole[] | IMenuInRoleChild[]
): IBreadcrumb[] => {
  const breadcrumbs: IBreadcrumb[] = []
  mapPathToMenu(path, userMenus, breadcrumbs)
  return breadcrumbs
}
