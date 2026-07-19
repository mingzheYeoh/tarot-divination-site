import type { Config } from 'tailwindcss'
import { colors, borderRadius, spacing, fontFamily, fontSize } from './src/theme/tokens'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors,
      borderRadius,
      spacing,
      fontFamily,
      fontSize,
    },
  },
  plugins: [],
} satisfies Config
