module.exports = {
  extends: 'erb',
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',

    'react/react-in-jsx-scope': 'off', // Skip the import React from 'react';
    'react/jsx-filename-extension': 'off', // Support tsx files
    'import/extensions': 'off', // No import foo from 'foo.tsx'

    // My typical "stfu eslint" ruleset.
    // "@typescript-eslint/ban-ts-comment": "warn",
    // "@typescript-eslint/camelcase": "off",
    // "@typescript-eslint/explicit-function-return-type": "off",
    // "@typescript-eslint/interface-name-prefix": "off",
    // "@typescript-eslint/no-empty-interface": "warn",
    // "@typescript-eslint/no-empty-function": "off",
    // "@typescript-eslint/no-explicit-any": "off",
    // "@typescript-eslint/no-var-requires": "off",

    "arrow-body-style": [
      "error",
      "as-needed"
    ],
    "arrow-parens": [
      "error",
      "always"
    ],
    "consistent-return":"off",
    "dot-notation":"error",
    "import/namespace": "off",
    "import/no-cycle": "off",
    "import/order": "off", // Handled via prettier
    "import/prefer-default-export": "off",
    "import/no-unresolved": "off",
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
    "jsx-a11y/anchor-is-valid": "off",
    "no-else-return": "error",
    "no-empty": "off",
    "no-empty-pattern": "warn",
    "no-undef": "off",
    "no-unused-vars": "off", // Handled via @typescript-eslint/no-unused-vars
    "no-useless-catch": "off",
    "no-useless-escape": "off",
    "prettier/prettier": "off",
    "react/display-name": "off",
    "react/jsx-curly-brace-presence": "error",
    "react/no-string-refs": "off",
    "react/prop-types": "off",
    "react/require-default-props": "off",
    "react/jsx-props-no-spreading": "off",
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
