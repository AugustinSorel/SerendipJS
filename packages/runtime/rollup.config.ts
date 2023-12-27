import cleanup from "rollup-plugin-cleanup";
import filesize from "rollup-plugin-filesize";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

import type { RollupOptions } from "rollup";

const config: RollupOptions[] = [
  {
    input: "src/index.ts",
    plugins: [cleanup(), typescript({ tsconfig: "./tsconfig.json" })],
    output: [
      {
        file: "dist/index.js",
        format: "esm",
        plugins: [filesize()],
      },
    ],
  },
  {
    input: "dist/dts/src/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    external: [/\.css$/],
  },
];

export default config;
