import pkg from "./package.json" assert { type: "json" };
import { defineConfig } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
];

export default defineConfig([
  {
    input: "Source/index.js",
    output: {
      dir: "dist/cjs",
      format: "cjs",
      entryFileNames: "[name].js",
      chunkFileNames: "chunk-[name].js",
      sourcemap: true
    },
    plugins: [commonjs(), nodeResolve()],
    external
  },
  {
    input: "Source/index.js",
    output: {
      dir: "dist/esm",
      format: "esm",
      entryFileNames: "[name].js",
      chunkFileNames: "chunk-[name].js",
      sourcemap: true
    },
    plugins: [commonjs(), nodeResolve({ browser: true })],
    external
  }
]);
