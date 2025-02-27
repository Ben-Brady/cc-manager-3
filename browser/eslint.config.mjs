import simpleImportSort from "eslint-plugin-simple-import-sort";
import react from 'eslint-plugin-react';

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        files: ["**/*.ts", "**/*.tsx"],
        plugins: {
            "simple-import-sort": simpleImportSort,
            react
        },
        rules: {
            "prefer-const": "off",
            "no-extra-boolean-cast": "off",
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
);
