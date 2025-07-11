import prettier from "eslint-config-prettier";

export default [
  prettier,
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
      },
    },
    plugins: {},
    rules: {
      // Formatting handled by Prettier
    },
  },
];
