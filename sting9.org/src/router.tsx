import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import NotFound from './components/NotFound'
import { deLocalizeUrl, localizeUrl } from './paraglide/runtime.js'

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    notFoundMode: "root",
    defaultNotFoundComponent: () => {
      return <NotFound />
    },
    // URL rewriting for i18n - converts localized URLs to/from base URLs
    rewrite: {
      input: ({ url }) => deLocalizeUrl(url),
      output: ({ url }) => localizeUrl(url),
    },
  })

  return router
}
