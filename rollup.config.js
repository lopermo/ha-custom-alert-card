import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url)));
console.log("Rollup pkg.version:", pkg.version);

export default {
  input: "src/alert-card.js",
  output: {
    file: "dist/alert-card.js",
    format: "es",
    sourcemap: true,
  },
  plugins: [
    json(),
    replace({
      preventAssignment: true,
      __CARD_VERSION__: JSON.stringify(pkg.version),
    }),
    resolve({
      moduleDirectories: ["node_modules"],
      extensions: [".js", ".mjs"],
      preferBuiltins: false,
      mainFields: ["module", "main"],
      exportConditions: ["default", "module", "import"],
    }),
    commonjs(),
    terser(),
  ],
};
