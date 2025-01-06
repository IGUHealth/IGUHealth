/* eslint-env node */
module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  rules: {
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-unused-vars": "warn",
  },
  ignorePatterns: [
    "dist",
    "build",
    "node_modules",
    "examples",
    "scripts",
    "lib",
    "storybook-static",
    "tailwind.config.js",
    "rollup.config.js",
    "postcss.config.js",
    "*.test.ts",
    "packages/server/src/storage/schemas/migrations/db-migrate/",
  ],
};
