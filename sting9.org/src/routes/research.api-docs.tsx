import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import * as m from '../paraglide/messages.js'

export const Route = createFileRoute('/research/api-docs')({
  component: ApiDocsPage,
})

function ApiDocsPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create a script to load Swagger UI
    const loadSwaggerUI = () => {
      // Add Swagger UI CSS
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css'
      document.head.appendChild(link)

      // Add Swagger UI Bundle JS
      const bundleScript = document.createElement('script')
      bundleScript.src = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js'

      // Add Swagger UI Standalone Preset JS
      const presetScript = document.createElement('script')
      presetScript.src = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js'

      let scriptsLoaded = 0
      const checkAndInit = () => {
        scriptsLoaded++
        if (scriptsLoaded === 2 && containerRef.current && (window as any).SwaggerUIBundle) {
          (window as any).SwaggerUIBundle({
            url: '/api-docs.json',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              (window as any).SwaggerUIBundle.presets.apis,
              (window as any).SwaggerUIStandalonePreset,
            ],
            plugins: [
              (window as any).SwaggerUIBundle.plugins.DownloadUrl,
            ],
            layout: 'StandaloneLayout',
            persistAuthorization: true,
          })
        }
      }

      bundleScript.onload = checkAndInit
      presetScript.onload = checkAndInit

      document.head.appendChild(bundleScript)
      document.head.appendChild(presetScript)

      return () => {
        document.head.removeChild(link)
        document.head.removeChild(bundleScript)
        document.head.removeChild(presetScript)
      }
    }

    const cleanup = loadSwaggerUI()

    return cleanup
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {m.api_docs_title()}
          </h1>
          <p className="text-gray-600">
            {m.api_docs_subtitle()}
          </p>
        </div>
        <div id="swagger-ui" ref={containerRef}></div>
      </div>
    </div>
  )
}
