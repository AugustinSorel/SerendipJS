import { defineConfig } from "vitest/config";
import {} from "vitest";

const config = defineConfig({
  test: {
    reporters: "verbose",
    environment: "jsdom",
  },
});

export default config;
