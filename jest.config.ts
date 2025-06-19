import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  coverageProvider: "v8",
  testEnvironment: "node",
  coverageDirectory: "coverage",
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  modulePaths: ["<rootDir>/src"],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
};
export default config;
