import Vue3Snackbar from 'vue3-snackbar'
import 'vue3-snackbar/dist/index.css'

const snackbar = Vue3Snackbar.create({
  position: 'top-center',
  duration: 3000,
  theme: 'light',
  closeOnClickOutside: true,
  closeOnBack: true,
  closeOnSwipe: true,
  showIcon: true,
  showCloseButton: true,
  queue: true
})

export default snackbar
