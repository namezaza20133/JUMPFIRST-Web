import path from "node:path";
import { defineConfig } from "vitest/config";

const srcPath = path.resolve(import.meta.dirname, "./src");

export default defineConfig({
  resolve: {
    alias: {
      "@": srcPath,
    },
  },
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/lib/validation/forms.ts", "src/app/api/**/*.ts", "src/lib/api/response.ts"],
      thresholds: {
        lines: 95,
        functions: 95,
        statements: 95,
        branches: 90,
      },
    },
  },
});
