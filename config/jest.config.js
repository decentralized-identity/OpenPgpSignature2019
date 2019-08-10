const testPathIgnorePatterns = ["dist", "__fixtures__"];

if (process.env.TRAVIS) {
  testPathIgnorePatterns.push("bin.spec.js");
}

const config = {
  rootDir: "..",
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.js",
    "<rootDir>/src/**/?(*.)+(spec|test).js"
  ],
  testPathIgnorePatterns,
  coveragePathIgnorePatterns: ["<rootDir>/config", "__fixtures__"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFiles: ["<rootDir>/config/setup-tests.js"]
};

module.exports = config;
