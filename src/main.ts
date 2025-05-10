import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import ToastPlugin from 'vue-toast-notification'
import setupWorker from './plugins/server' // this should return a Promise

async function bootstrap() {
  if (import.meta.env.DEV) {
    await setupWorker()  // <-- Ensure MSW is ready first
  }

  const app = createApp(App)
  app.use(createPinia())
  app.use(ToastPlugin)
  app.mount('#app')

  if (import.meta.env.DEV) {
    await setupWorker()
  }
}

bootstrap()