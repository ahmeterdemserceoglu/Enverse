import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  { ignores: ['node_modules/**', '.expo/**', 'dist/**'] },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: { parser: tsParser, parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' } },
    plugins: { '@typescript-eslint': tseslint, 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];
