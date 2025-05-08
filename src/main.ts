import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import ToastPlugin from 'vue-toast-notification';

const app = createApp(App)
app.use(createPinia())
app.use(ToastPlugin);
app.mount('#app')
