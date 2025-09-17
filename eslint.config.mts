import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  eslintPluginPrettier,
  //For testing purposes: the first rule compiles and one gets a warning instead of error
  //The second rule is for curly braces in arrow functions, one can use --fix to solve if there is an issue
  //The third rule is to capitalize the first letter of the comments
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "arrow-body-style": ["error", "always"],
      "capitalized-comments": ["error", "always"],
    },
  },
]);
