import { defineConfig } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL || "https://ticketing.dev";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL,
    ignoreHTTPSErrors: true,
  },
});
