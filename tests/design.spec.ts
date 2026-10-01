import { mkdirSync } from "node:fs";
import { test, expect, loadAllTestAccounts } from "deepspace/testing";
import { action, sampleInput } from "./helpers/actions";

const screenshots = ".deepspace/screenshots";
mkdirSync(screenshots, { recursive: true });

test("redesigned public pages reflow and the example remains keyboard-operable", async ({
  page,
}) => {
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const path of ["/", "/demo", "/home"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${path} overflows at ${width}`,
      ).toBe(true);
      await page.screenshot({
        path: `${screenshots}/redesign-${path === "/" ? "landing" : path.slice(1)}-${width}.png`,
        fullPage: path === "/",
      });
    }
  }
  await page.goto("/demo");
  const choice = page.getByRole("button", { name: /A · Ship the outcome/ });
  await choice.focus();
  await page.keyboard.press("Enter");
  await expect(choice).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Try an example vote" }).click();
  await expect(page.getByTestId("response-count")).toHaveText("4 responses");
  await page.getByRole("button", { name: "View sample analysis" }).click();
  await expect(
    page.getByRole("heading", { name: "What the feedback supports" }),
  ).toBeVisible();
  await page.screenshot({
    path: `${screenshots}/redesign-analysis-1440.png`,
    fullPage: true,
  });
});

test("workspace search and lifecycle filters use real records; editor and review reflow", async ({
  users,
}) => {
  test.skip(loadAllTestAccounts().length < 2, "Requires two usable accounts");
  const [a, b] = await users(2);
  const ids: string[] = [];
  try {
    const input = sampleInput();
    const draft = await action(a.context, "saveExperiment", input);
    expect(draft.success).toBe(true);
    ids.push(draft.data.recordId);
    const live = await action(a.context, "saveExperiment", {
      ...input,
      title: `${input.title} published`,
    });
    expect(live.success).toBe(true);
    ids.push(live.data.recordId);
    expect(
      (
        await action(a.context, "setExperimentStatus", {
          experimentId: ids[1],
          status: "published",
        })
      ).success,
    ).toBe(true);
    await a.page.goto("/home");
    await a.page
      .getByRole("textbox", { name: "Search experiments" })
      .fill(input.title);
    await expect(a.page.locator(".experiment-item")).toHaveCount(2);
    await a.page.getByRole("button", { name: "Drafts", exact: true }).click();
    await expect(a.page.locator(".experiment-item")).toHaveCount(1);
    await expect(a.page.locator(".experiment-item h2")).toHaveText(input.title);
    await a.page
      .getByRole("button", { name: "Published", exact: true })
      .click();
    await expect(a.page.locator(".experiment-item")).toHaveCount(1);
    await expect(a.page.locator(".experiment-item h2")).toHaveText(
      `${input.title} published`,
    );
    await a.page
      .getByRole("textbox", { name: "Search experiments" })
      .fill("no-matching-signalroom-title");
    await expect(
      a.page.getByRole("heading", { name: "No matching experiments." }),
    ).toBeVisible();
    await a.page.getByRole("button", { name: "Clear filters" }).click();
    await a.page.setViewportSize({ width: 1440, height: 1000 });
    await a.page.screenshot({
      path: `${screenshots}/redesign-workspace-1440.png`,
      fullPage: true,
    });
    for (const width of [375, 1440]) {
      await a.page.setViewportSize({ width, height: 1000 });
      await a.page.goto(`/experiments/${ids[0]}/edit`);
      await expect(
        a.page.getByRole("button", { name: "Save draft", exact: true }),
      ).toBeVisible();
      expect(
        await a.page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await a.page.screenshot({
        path: `${screenshots}/redesign-editor-${width}.png`,
        fullPage: true,
      });
      await a.page.goto(`/experiments/${ids[1]}`);
      await expect(a.page.getByTestId("response-count")).toBeVisible();
      expect(
        await a.page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await a.page.screenshot({
        path: `${screenshots}/redesign-results-${width}.png`,
        fullPage: true,
      });
      await b.page.setViewportSize({ width, height: 1000 });
      await b.page.goto(`/experiments/${ids[1]}`);
      await expect(
        b.page.getByRole("button", { name: "Submit feedback", exact: true }),
      ).toBeVisible();
      expect(
        await b.page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await b.page.screenshot({
        path: `${screenshots}/redesign-reviewer-${width}.png`,
        fullPage: true,
      });
    }
  } finally {
    for (const id of ids)
      await action(a.context, "cleanupTestExperiment", { experimentId: id });
  }
});
