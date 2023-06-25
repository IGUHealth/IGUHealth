const config = {
  rootDir: "./",
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  coverageReporters: ["text", "cobertura"],
  testMatch: ["**/?(*.)+(spec|test).[t]s?(x)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};

module.exports = config;
