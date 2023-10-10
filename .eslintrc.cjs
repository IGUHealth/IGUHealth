/* eslint-env node */
module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  rules: {
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
    "packages/server/src/resourceProviders/postgres/migrations",
  ],
};
