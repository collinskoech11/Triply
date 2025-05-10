import { setupWorker } from 'msw/browser'
import { handlerIndustries } from './handlers/industries'

const worker = setupWorker(...handlerIndustries)

export default function () {
  const workerUrl = `${import.meta.env.BASE_URL ?? '/'}mockServiceWorker.js`
  if (import.meta.env.DEV) {
  worker.start({
    serviceWorker: {
      url: workerUrl,
    },
    onUnhandledRequest: 'bypass',
  })
}
}
