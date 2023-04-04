const config = {
  "collectCoverageFrom": ["src/**/*.js", "!**/node_modules/**"],
  "coveragePathIgnorePatterns": ["/node_modules/", "src/templates", "src/utils/slash_cmd_registrator.js", "src/main.js"],
  "coverageReporters": ["html", "text", "text-summary", "cobertura"],
  "testMatch": ["**/*.test.js"],
  "clearMocks": true
};

module.exports = config;