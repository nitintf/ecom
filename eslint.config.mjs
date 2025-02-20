import pluginJs from "@eslint/js";
import eslintImportPlugin from "eslint-plugin-import";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  {
    ignores: [
      "**/*.d.ts",
      "**/*.cjs",
      "**/*.jsx",
      "**/*.mjs",
      "**/*.tsx",
      "**/*.json",
      "**/*.e2e-spec.ts"
    ]
  },
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...tseslint.config({
    rules: {
      // Import rules
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],

      // Code style and best practices
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/no-inferrable-types": "warn",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          "selector": "interface",
          "format": ["PascalCase"],
          "prefix": ["I"]
        },
        {
          "selector": "class",
          "format": ["PascalCase"]
        }
      ],

      // Additional type safety rules
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-unnecessary-condition": "warn",

      // Code quality
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/no-duplicate-enum-values": "error",
      "@typescript-eslint/consistent-type-assertions": ["error", {
        "assertionStyle": "as",
        "objectLiteralTypeAssertions": "never"
      }],

      // NestJS specific
      "@typescript-eslint/no-useless-constructor": "error",
      "@typescript-eslint/member-ordering": ["error", {
        "default": [
          "public-static-field",
          "protected-static-field",
          "private-static-field",
          "public-instance-field",
          "protected-instance-field",
          "private-instance-field",
          "constructor",
          "public-method",
          "protected-method",
          "private-method"
        ]
      }],

      // Array and promise handling
      "@typescript-eslint/array-type": ["error", {
        "default": "array-simple"
      }],
      "@typescript-eslint/promise-function-async": "error",

      // Method and parameter rules
      "@typescript-eslint/default-param-last": "error",
      "@typescript-eslint/method-signature-style": ["error", "property"],
      // "@typescript-eslint/no-parameter-properties": "error",
      
      // Type definitions
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/consistent-type-imports": ["error", {
        "prefer": "type-imports"
      }]
    }
  }),
  {
    files: ["**/*.spec.ts", "**/*.test.ts", "**/*.e2e-spec.ts"],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    }
  },
  {
    plugins: {
      "import": eslintImportPlugin 
    },
    rules: {
        // Existing rules
        "no-unused-vars": "warn",
        "no-undef": "warn",
        "no-console": "error",
        "no-debugger": "error",
        
        // Imports organization
        "sort-imports": ["error", {
          "ignoreCase": true,
          "ignoreDeclarationSort": true
        }],
        "import/order": ["error", {
          "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          "alphabetize": {
            "order": "asc",
            "caseInsensitive": true
          }
        }]
    },
  }
];