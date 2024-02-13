import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/** @type {import("prettier").Config} */
export default {
  plugins: [require.resolve("@trivago/prettier-plugin-sort-imports")],
  tabWidth: 2,
  useTabs: false,
  importOrder: ["^@iguhealth/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
