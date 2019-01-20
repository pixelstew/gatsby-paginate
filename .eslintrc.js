module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2019,
  },
  rules: {
    indent: ["error", 2, { SwitchCase: 1 }],
    quotes: ["error", "backtick", { avoidEscape: true }],
    semi: ["error", "never"],
    "linebreak-style": ["error", "unix"],
  },
}
