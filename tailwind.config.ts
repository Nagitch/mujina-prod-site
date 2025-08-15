import type { Config } from 'tailwindcss'

import typography from '@tailwindcss/typography'
import daisyui from 'daisyui'
import daisyuiThemes from 'daisyui/src/theming/themes.js'

import { theme } from './src/lib/config/general'

const themeNames = theme.map(({ name }) => name).filter(name => name !== 'cmyk')

export default {
  content: ['./src/**/*.{html,md,js,svelte,ts}'],
  daisyui: {
    themes: [
      {
        cmyk: {
          ...daisyuiThemes['[data-theme=cmyk]'],
          primary: '#00AEEF'
        }
      },
      ...themeNames
    ]
  },
  plugins: [typography, daisyui],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            'ul > li:has(input[type="checkbox"])': {
              listStyle: 'none',
            },
            'ul > li:has(input[type="checkbox"]) ul li': {
              paddingLeft: 30,
            },
            'ul:has(li):has(input[type="checkbox"])': {
              padding: 0,
            },
          },
        },
      },
      backgroundImage: {
        'bg-header': "url('/assets/bg-header.webp')",
      },
    },
  },
} satisfies Config
