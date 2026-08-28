import { createDefaultEsmPreset } from "ts-jest";
import type { Config } from "jest";

const preset = createDefaultEsmPreset();

const config: Config = {
  ...preset,
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
  ],
};

export default config;