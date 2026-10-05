import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60000,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev -- --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    timeout: 60000,
    env: {
      BETWEENUS_BACKEND: "local",
      LOCAL_DATABASE_PATH: `.local/e2e-${process.pid}`,
      ENABLE_INTIMACY_PILOT: "true",
      APP_ORIGIN: "http://localhost:3100",
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },
});
