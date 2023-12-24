import { defineConfig } from "vitest/config";

const config = defineConfig({
  test: {
    reporters: "verbose",
    environment: "jsdom",
  },
});

export default config;
