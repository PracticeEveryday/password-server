module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:import/typescript', 'plugin:import/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      webpack: {},
      typescript: { project: 'packages/tsconfig.json' },
    },
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // interface에 prefix를 두지 않도록 합니다.
    '@typescript-eslint/interface-name-prefix': 'off',
    // Typescript가 유추할 수 있도록 하기에 Off합니다.
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    semi: ['error', 'always'],
    camelcase: ['error', { properties: 'always' }],
    'prefer-const': [
      'error',
      {
        destructuring: 'any',
        ignoreReadBeforeAssign: false,
      },
    ],
    'no-self-assign': ['error', { props: false }],
    'no-new-object': 'error',
    'array-bracket-newline': ['error', 'consistent'],
    'no-var': 'error',
    'no-new-func': 'error',
    'no-inner-declarations': 'error',
    'prefer-arrow-callback': 'error',
    // 'implicit-arrow-linebreak': ['error', 'beside'],
    'object-shorthand': 'error',
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'prefer-template': 'error',
    'prefer-destructuring': [
      'error',
      { object: true, array: true },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['sibling', 'parent', 'index'], 'type', 'unknown'],
        pathGroups: [
          {
            pattern: '@apps/*',
            group: 'unknown',
          },
          {
            pattern: '@libs/*',
            group: 'unknown',
          },
        ],
        pathGroupsExcludedImportTypes: ['unknown'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      },
    ],
  },
};
