module.exports = {
  "testMatch": [
    "<rootDir>/lib/**/__tests__/**/*.ts?(x)",
    "<rootDir>/(test|lib)/**/*(*.)@(spec|test).ts?(x)"
  ],
  "clearMocks": true,
  "collectCoverage": true,
  "coverageReporters": [
    "json",
    "lcov",
    "clover",
    "cobertura",
    "text"
  ],
  "coverageDirectory": "coverage",
  "coveragePathIgnorePatterns": [
    "/node_modules/"
  ],
  "testPathIgnorePatterns": [
    "/node_modules/"
  ],
  "watchPathIgnorePatterns": [
    "/node_modules/"
  ],
  "reporters": [
    "default"
  ],
  "preset": "ts-jest",
  "transform": {
    "^.+\\.m?[tj]sx?$": [
      "ts-jest",
      {
        "tsconfig": "tsconfig.dev.json"
      }
    ]
  }
};
