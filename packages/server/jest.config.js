import baseConfig from "../../config/jest.base.config.js";

const config = {
  ...baseConfig,
  collectCoverage: false,
  clearMocks: true,
  coverageProvider: "v8",
  moduleFileExtensions: ["js", "ts", "tsx"],
  moduleNameMapper: {
    "^(\\.\\.?\\/.+)\\.js$": "$1",
  },
};
export default config;
//# sourceMappingURL=jest.config.js.map
