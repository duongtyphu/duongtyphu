import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Claude Code skill scripts (installed via CLI, e.g. `uipro`) — standalone
    // Node/CommonJS tooling scripts, not application source. Not meant to be
    // linted against the app's TypeScript/React rules (they legitimately use
    // `require()`, unlike app code).
    ".claude/**",
  ]),
]);

export default eslintConfig;
