module.exports = {
  "extends": [
    "airbnb",
    "prettier",
    "prettier/react"
  ],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 2020,
  },
  "env": {
    "browser": true,
    "node": true
  },
  "rules": {
    "camelcase": [
      1,
      {
        "ignoreDestructuring": true,
        "properties": "never"
      }
    ],
    "no-shadow": 0,
    "react/prop-types": 0,
    "react/jsx-filename-extension": [
      1,
      {
        "extensions": [
          ".js",
          ".jsx"
        ]
      }
    ],
    "no-unused-vars": [
      1,
      { "args": "none" }
    ],
    "prettier/prettier": [
      "warn",
      {
        "singleQuote": true,
        "printWidth": 100,
      }
    ],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  "plugins": [
    "html",
    "prettier",
    "react-hooks"
  ]
}
