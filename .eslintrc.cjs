module.exports = {
  env: {
    node: true,
    es6: true
  },
  extends: ["eslint:recommended"],
  ignorePatterns: ["dist", ".eslintrc.cjs", "rollup.config.mjs"],
  parserOptions: { ecmaVersion: "latest" },
  rules: {
    "no-undef": "error",
    "no-empty": "warn",
    "no-unused-vars": "warn"
  }
};
