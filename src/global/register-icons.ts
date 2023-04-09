import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import type { App } from 'vue'

const registerIcons = (app: App<Element>) => {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}

export default registerIcons
