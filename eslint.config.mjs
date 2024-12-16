import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import nextPlugin from '@next/eslint-plugin-next'

export default [
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: {
      '@typescript-eslint': typescript,
      'next': nextPlugin
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      next: {
        rootDir: '.'
      }
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "next/core-web-vitals": "error",
      ...nextPlugin.configs.recommended.rules
    }
  }
]