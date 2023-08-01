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
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // interface에 prefix를 두지 않도록 합니다.
    '@typescript-eslint/interface-name-prefix': 'off',
    // Typescript가 유추할 수 있도록 하기에 Off합니다.
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-new-func': 'error',
    'no-inner-declarations': 'error',
    'prefer-arrow-callback': 'error',
    'implicit-arrow-linebreak': ['error', 'beside'],
    'object-shorthand': 'error',
    'lines-between-class-members': ['error', 'always'],
    'prefer-template': 'error',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', ['parent', 'sibling'], 'index'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
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
