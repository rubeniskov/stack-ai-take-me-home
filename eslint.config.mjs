import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Dependencies
    "node_modules/**",

    // Build outputs
    ".next/**",
    "dist/**",
    "out/**",
    "build/**",

    // Coverage
    "coverage/**",

    // Next.js files
    "next-env.d.ts",

    // Lockfiles
    "pnpm-lock.yaml",
    "package-lock.json",
    "yarn.lock",
  ]),
]);

export default eslintConfig;
