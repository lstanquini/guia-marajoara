import { defineConfig } from 'eslint/config'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.obsidian/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'src/**/*.backup.tsx',
      'src/**/*.disabled',
      'src/**/*.old',
      'src/middleware.ts.disabled',
      'src/components/layout/Navbar.backup.tsx',
    ],
  },
  {
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',
      '@next/next/no-before-interactive-script-outside-document': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/no-unescaped-entities': 'warn',
      '@next/next/no-html-link-for-pages': 'warn',
    },
  },
])

export default eslintConfig
