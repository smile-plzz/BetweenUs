import { test, expect, type Page } from "@playwright/test";
async function signUp(page: Page, name: string, email: string) {
  await page.goto("/");
  await page.getByLabel("Your name").fill(name);
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page
    .getByLabel("Password", { exact: true })
    .fill("a-test-password-for-us-2026");
  await page.getByLabel("I am 18 or older.").check();
  await page.getByRole("button", { name: "Create my account" }).click();
  await expect(
    page.getByRole("button", { name: "Create our space", exact: true }).first(),
  ).toBeVisible({ timeout: 20000 });
}
async function snapshot(page: Page) {
  return page.request.get("/api/space").then((r) => r.json());
}
async function mutate(page: Page, body: Record<string, unknown>) {
  return page.request.post("/api/space", {
    data: body,
    headers: { Origin: new URL(page.url()).origin },
  });
}
test("two real accounts pair, capture, react, answer voluntarily, decide, and protect discreet context", async ({
  browser,
}) => {
  const contextA = await browser.newContext({
    viewport: { width: 1440, height: 1050 },
  });
  const contextB = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const contextC = await browser.newContext();
  const a = await contextA.newPage(),
    b = await contextB.newPage(),
    c = await contextC.newPage();
  const errors: string[] = [];
  a.on("pageerror", (e) => errors.push(e.message));
  b.on("pageerror", (e) => errors.push(e.message));
  const run = Date.now();
  await signUp(a, "Amina", `amina-${run}@example.test`);
  await a.getByLabel("I understand and accept").check();
  await a
    .getByRole("button", { name: "Create our space", exact: true })
    .last()
    .click();
  await expect(
    a.getByRole("heading", { name: "A little of us," }),
  ).toBeVisible();
  await a.getByRole("button", { name: "Invite my partner" }).click();
  const token = await a.getByLabel("Invitation code").inputValue();
  await signUp(b, "Yusuf", `yusuf-${run}@example.test`);
  await b.getByRole("button", { name: "Join my partner", exact: true }).click();
  await b.getByLabel("Invitation code").fill(token);
  await b.getByLabel("I understand and accept").check();
  await b.getByRole("button", { name: "Accept invitation" }).click();
  await expect(
    b.getByRole("heading", { name: "A little of us," }),
  ).toBeVisible();
  await expect.poll(async () => (await snapshot(a)).members.length).toBe(2);
  // Capture through the UI with source/title attribution and no enrichment dependency.
  await a.getByRole("button", { name: "Save something", exact: true }).click();
  await a.getByLabel("Link or idea").fill("https://example.com/a-film");
  await a.getByLabel("A little context").fill("For a quiet Friday night");
  await a.getByText("A title, kind, or moment").click();
  await a.getByLabel("Title", { exact: true }).fill("Our Friday film");
  await a.getByLabel("A moment for this").selectOption("watch");
  await a.getByRole("button", { name: "Leave it in our space" }).click();
  await expect(
    a.getByRole("heading", { name: "Our Friday film", exact: true }),
  ).toBeVisible();
  await expect(
    b.getByRole("heading", { name: "Our Friday film", exact: true }),
  ).toBeVisible({ timeout: 15000 });
  const cardB = b
    .locator("article")
    .filter({ has: b.getByRole("heading", { name: "Our Friday film" }) });
  await cardB.getByRole("button", { name: "Love this", exact: true }).click();
  await expect(a.getByText("Yusuf · Love this")).toBeVisible({
    timeout: 15000,
  });
  const cardA = a
    .locator("article")
    .filter({ has: a.getByRole("heading", { name: "Our Friday film" }) });
  await cardA.getByRole("button", { name: "Interested", exact: true }).click();
  await a.getByRole("button", { name: "Ask something" }).click();
  await a
    .getByLabel("Your question")
    .fill("What would feel good this weekend?");
  await a.getByRole("button", { name: "Place the question" }).click();
  await expect(
    b.getByRole("heading", { name: "What would feel good this weekend?" }),
  ).toBeVisible({ timeout: 15000 });
  await b.getByRole("button", { name: /A question in our room/ }).click();
  await b.getByRole("button", { name: "Pass", exact: true }).click();
  await expect(
    b.getByRole("button", { name: "Pass", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await b.getByRole("button", { name: "Not now", exact: true }).click();
  await expect(
    b.getByRole("button", { name: "Not now", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await b
    .getByLabel("Your answer", { exact: true })
    .fill("A long walk, then the film");
  await b.getByRole("button", { name: "Share answer" }).click();
  await expect(
    b.getByText("A long walk, then the film", { exact: true }),
  ).toBeVisible();
  await b.getByRole("button", { name: "Close", exact: true }).click();
  await a.getByRole("button", { name: /A question in our room/ }).click();
  await expect(
    a.getByText("A long walk, then the film", { exact: true }),
  ).toBeVisible();
  await a.getByRole("button", { name: "Close", exact: true }).click();
  // Retrieval and three-candidate decision limit work from real saved history.
  await a.getByRole("button", { name: "Our Things", exact: true }).click();
  await a.getByLabel("Search our things").fill("Friday");
  await expect(
    a.getByRole("heading", { name: "Our Friday film" }),
  ).toBeVisible();
  await a.getByRole("button", { name: "Decide Together", exact: true }).click();
  await expect(a.getByText(/You both liked this/)).toBeVisible();
  await a.getByRole("button", { name: "Let’s consider this" }).click();
  await expect(a.getByRole("status")).toContainText("Considering");
  // C is a real unrelated signed-in user, not just an anonymous request.
  await signUp(c, "Chris", `chris-${run}@example.test`);
  await c.getByLabel("I understand and accept").check();
  await c
    .getByRole("button", { name: "Create our space", exact: true })
    .last()
    .click();
  await expect(
    c.getByRole("heading", { name: "A little of us," }),
  ).toBeVisible();
  const objects = (await snapshot(a)).objects;
  const guessed = objects[0].id;
  expect(
    (await c.request.get(`/api/detail?id=${guessed}&type=object`)).status(),
  ).toBe(404);
  expect(
    (
      await mutate(c, {
        action: "reaction",
        id: guessed,
        reaction_type: "love",
      })
    ).ok(),
  ).toBe(false);
  expect(
    (
      await mutate(a, {
        action: "reaction",
        id: guessed,
        reaction_type: "love",
        user_id: (await snapshot(b)).user.id,
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await a.request.post("/api/space", {
        data: { action: "invite" },
        headers: { Origin: "https://other-site.example" },
      })
    ).status(),
  ).toBe(403);
  // Discreet content is absent from list JSON/DOM but available after opening detail.
  await a.getByRole("button", { name: "Save something", exact: true }).click();
  await a
    .getByLabel("Link or idea")
    .fill("A private reflection only inside the detail");
  await a.getByLabel("Discretion").selectOption("private-couple");
  await a.getByRole("button", { name: "Leave it in our space" }).click();
  const s = await snapshot(a);
  expect(JSON.stringify(s)).not.toContain(
    "A private reflection only inside the detail",
  );
  const secret = s.objects.find(
    (o: { sensitivity: string }) => o.sensitivity === "private-couple",
  );
  await b.getByRole("button", { name: "Our Things", exact: true }).click();
  await b.getByRole("button", { name: "Open discreet shared item" }).click();
  await expect(
    b
      .getByText("A private reflection only inside the detail", { exact: true })
      .last(),
  ).toBeVisible();
  expect(
    (await c.request.get(`/api/detail?id=${secret.id}&type=object`)).status(),
  ).toBe(404);
  await b.getByRole("button", { name: "Close", exact: true }).click();
  // Optional intimacy: both independently opt in, then withdrawal closes an open detail.
  for (const page of [a, b]) {
    await page.getByRole("button", { name: "Privacy and settings" }).click();
    await page.getByLabel("Intimacy & desire").check();
    await page.getByRole("button", { name: "Save my choices" }).click();
  }
  await expect.poll(async () => (await snapshot(a)).intimacy_active).toBe(true);
  const intimate = await mutate(a, {
    action: "question",
    prompt: "A sensitive adult question fixture",
    domain: "intimacy",
    sensitivity: "explicit-intimate",
    prompt_source: "custom",
  });
  expect(intimate.ok()).toBe(true);
  await b.getByRole("button", { name: "Questions", exact: true }).click();
  await b.getByRole("button", { name: /intimacy/ }).click();
  await expect(
    b.getByRole("heading", { name: "A sensitive adult question fixture" }),
  ).toBeVisible();
  await a.getByRole("button", { name: "Privacy and settings" }).click();
  await a.getByLabel("Intimacy & desire").uncheck();
  await a.getByRole("button", { name: "Save my choices" }).click();
  await expect(
    b.getByRole("heading", { name: "A sensitive adult question fixture" }),
  ).not.toBeVisible({ timeout: 15000 });
  await a.getByRole("button", { name: "Our Space", exact: true }).click();
  await a.screenshot({
    path: "test-results/desktop-shared-home.png",
    fullPage: true,
  });
  await b.getByRole("button", { name: "Our Space", exact: true }).click();
  await b.screenshot({
    path: "test-results/mobile-shared-home.png",
    fullPage: true,
  });
  expect(
    await b.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  await contextA.close();
  await contextB.close();
  await contextC.close();
});
