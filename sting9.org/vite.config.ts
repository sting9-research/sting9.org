import { defineConfig } from 'vite'
// import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitroV2Plugin } from '@tanstack/nitro-v2-vite-plugin'

// Vite configuration for TanStack Start with Nitro
const config = defineConfig({
  plugins: [
    // Nitro must come first to properly format the request object
    nitroV2Plugin(),
    // Path aliases and styling
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    // React must come before TanStack Start
    viteReact(),
    // TanStack Start must come last
    tanstackStart(),
  ],
})

export default config
