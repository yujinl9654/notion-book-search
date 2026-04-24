import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tailwindcss from "eslint-plugin-tailwindcss";
import globals from "globals";

const commonReactRules = {
  ...reactPlugin.configs.recommended.rules,
  ...reactPlugin.configs["jsx-runtime"].rules,
  ...reactHooks.configs.recommended.rules,
  ...jsxA11y.configs.recommended.rules,
};

export default [
  {
    ignores: ["dist", "node_modules"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/order": [
        "error",
        {
          alphabetize: {
            caseInsensitive: true,
            order: "asc",
          },
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "object",
            "type",
          ],
          "newlines-between": "always",
        },
      ],
    },
    plugins: {
      import: importPlugin,
    },
  },
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      tailwindcss: {
        cssConfigPath: "src/index.css",
      },
    },
    plugins: {
      "jsx-a11y": jsxA11y,
      react: reactPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      tailwindcss,
    },
    rules: {
      ...commonReactRules,
      "react/prop-types": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "tailwindcss/classnames-order": "warn",
    },
  },
];
