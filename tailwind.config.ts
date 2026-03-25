import tailwindcssLogical from 'tailwindcss-logical'

import type { Config } from 'tailwindcss'
import fluid, { extract, screens, fontSize } from 'fluid-tailwind'

import tailwindPlugin from './src/@core/tailwind/plugin'

const config: Config = {
  content: {
    files: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
      './src/**/*.{js,ts,jsx,tsx,css}' // Retaining existing paths
    ],
    extract
  },
  corePlugins: {
    preflight: false
  },
  important: '#__next',
  plugins: [
    tailwindcssLogical,
    tailwindPlugin,
    fluid({
      checkSC144: false // default: true
    })
  ],
  theme: {
    screens,
    fontSize,

    /** @type {import('fluid-tailwind').FluidThemeConfig} */
    fluid: () => ({
      defaultScreens: ['24rem', '120rem']
    }),
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)'
      }
    }
  }
}

export default config
