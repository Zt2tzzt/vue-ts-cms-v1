import { createApp } from 'vue'
import 'normalize.css'
import './assets/css/index.less'
import pinia from './stores'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')
