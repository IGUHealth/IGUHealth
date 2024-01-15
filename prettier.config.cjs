module.exports = {
  plugins: [require.resolve("@trivago/prettier-plugin-sort-imports")],
  tabWidth: 2,

  useTabs: false,
  importOrder: ["^@iguhealth/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
