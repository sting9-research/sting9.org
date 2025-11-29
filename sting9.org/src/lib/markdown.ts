import { getLocale } from '../paraglide/runtime.js'

/**
 * Load markdown content for a specific page based on the current locale.
 * Falls back to English if the localized version doesn't exist.
 *
 * @param pageName - The name of the page (e.g., 'security', 'terms', 'privacy')
 * @returns Promise<string> - The markdown content
 */
export async function loadMarkdownContent(pageName: string): Promise<string> {
  const locale = getLocale()
  const fileName = `${pageName}.${locale}.md`

  try {
    // Use explicit imports with Vite's glob import feature
    const modules = import.meta.glob('../../content/pages/*.md', {
      query: '?raw',
      import: 'default',
    })

    const modulePath = `../../content/pages/${fileName}`

    if (modules[modulePath]) {
      const content = await modules[modulePath]()
      return content as string
    }

    // Fallback to English if the localized version doesn't exist
    if (locale !== 'en') {
      const fallbackPath = `../../content/pages/${pageName}.en.md`
      if (modules[fallbackPath]) {
        const content = await modules[fallbackPath]()
        return content as string
      }
    }

    return `# Content Not Found\n\nThe requested content could not be loaded.`
  } catch (error) {
    console.error(`Failed to load markdown content for ${fileName}:`, error)
    return `# Error Loading Content\n\nAn error occurred while loading the content.`
  }
}
