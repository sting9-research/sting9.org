import { createStart } from '@tanstack/react-start'
import { i18nMiddleware } from './middleware'

export const startInstance = createStart(() => ({
  requestMiddleware: [i18nMiddleware],
}))
