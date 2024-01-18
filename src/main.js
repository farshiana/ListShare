import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.min.css'
import App from './App.vue'
import router from './router'
import './firebase'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

app.use(router)

const vuetify = createVuetify({
    components,
    directives,
  })

app.use(vuetify)

app.mount('#app')
