import { dirname } from "path";
import { fileURLToPath } from "url";

import nextPlugin from "@next/eslint-plugin-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import eslintPluginImport from "eslint-plugin-import";
import prettierRecommended from "eslint-plugin-prettier/recommended";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  prettierRecommended,
  {
    plugins: {
      import: eslintPluginImport,
      "@next": nextPlugin,
    },
    settings: {
      // Pinned instead of "detect": eslint-plugin-react's auto-detection
      // path calls the ESLint 9 `context.getFilename()` API that ESLint 10
      // removed (replaced by the `context.filename` property), crashing
      // every react/* rule with "contextOrFilename.getFilename is not a
      // function". Explicit version skips that code path entirely — see
      // node_modules/eslint-plugin-react/lib/util/version.js's
      // getReactVersionFromContext, which only calls detectReactVersion()
      // when settings.react.version === "detect".
      react: {
        version: "19.2.8",
      },
    },
    rules: {
      semi: ["error"],
      quotes: ["error", "double"],
      "prefer-arrow-callback": ["error"],
      "prefer-template": ["error"],

      // Import sorting rules
      "import/order": [
        "warn",
        {
          groups: [
            "builtin", // fs, path
            "external", // react, next
            "internal", // @/lib, @/components
            ["parent", "sibling", "index"],
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      // Rules from nextPlugin
      ...nextPlugin.configs.recommended.rules,
    },
  },
];

export default eslintConfig;
