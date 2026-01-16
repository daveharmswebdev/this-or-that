import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["apps/**/src/**/*.test.ts", "apps/**/src/**/*.test.tsx"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/*.integration.test.ts"],
  },
});
