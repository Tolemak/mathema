import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { ignores: ['dist', 'node_modules', 'server/node_modules'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['src/**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        },
    },
    {
        extends: [js.configs.recommended],
        files: ['server/**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'commonjs',
            globals: globals.node,
        },
    },
    {
        files: ['server/**/*.test.js'],
        languageOptions: {
            globals: {
                ...globals.node,
                describe: 'readonly',
                it: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                vi: 'readonly',
            },
        },
    },
);
