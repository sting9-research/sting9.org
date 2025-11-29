import { createMiddleware } from '@tanstack/react-start'
import { paraglideMiddleware } from './paraglide/server.js'

export const i18nMiddleware = createMiddleware().server(async ({ request, next }) => {
  return paraglideMiddleware(request, async ({ request: localizedRequest, locale }) => {
    return next({ request: localizedRequest })
  })
})
