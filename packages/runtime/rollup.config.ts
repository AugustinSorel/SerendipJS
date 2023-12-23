import cleanup from "rollup-plugin-cleanup";
import filesize from "rollup-plugin-filesize";
import typescript from "@rollup/plugin-typescript";
import type { RollupOptions } from "rollup";

const config: RollupOptions = {
  input: "src/index.ts",
  plugins: [cleanup(), typescript({ tsconfig: "./tsconfig.json" })],
  output: [
    {
      file: "dist/SerendipJS.js",
      format: "esm",
      plugins: [filesize()],
    },
  ],
};

export default config;
