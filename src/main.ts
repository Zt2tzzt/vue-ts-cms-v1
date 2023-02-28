import { createApp } from 'vue'
import 'normalize.css'
import './assets/css/index.less'
import store from './stores'

import App from './App.vue'
import router from './router'
import icon from '@/global/register-icons'

const app = createApp(App)

app.use(icon)
app.use(store)
app.use(router)

app.mount('#app')

console.log('commitizen test')
