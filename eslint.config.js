import js from '@eslint/js';
import globals from 'globals';

export default [
  // Bộ rule mặc định của ESLint
  js.configs.recommended,

  // ==========================
  // Source code
  // ==========================
  {
    files: ['src/**/*.js', '*.js'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },

    rules: {
      // ======================
      // Best Practices
      // ======================
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],

      // ======================
      // Variables
      // ======================
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // ======================
      // Style
      // ======================
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      indent: ['error', 2],
      'comma-dangle': ['error', 'always-multiline'],
      'eol-last': ['error', 'always'],
      'no-trailing-spaces': 'error',

      // ======================
      // Console
      // ======================
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
    },
  },

  // ==========================
  // Test files (Jest)
  // ==========================
  {
    files: ['tests/**/*.js', '**/*.test.js', '**/*.spec.js'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },

    rules: {
      'no-console': 'off',
    },
  },

  // ==========================
  // Config files
  // ==========================
  {
    files: ['eslint.config.js', 'jest.config.js'],

    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
