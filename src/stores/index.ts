import { createPinia } from 'pinia'
import type { App } from 'vue'
import useLoginStore from './login/login'

const pinia = createPinia()

const registerStore = (app: App<Element>) => {
  // 1.安装 pinia 插件
  app.use(pinia)
  // 2.加载本地数据
  const loginStore = useLoginStore()
  loginStore.loadLocalCacheAction()
}

export default registerStore
