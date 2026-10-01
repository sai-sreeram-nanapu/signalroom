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
    await expect(a.page.locator(".experiment-item").first()).toBeVisible();
    await a.page.emulateMedia({ reducedMotion: "reduce" });
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


test("mobile navigation opens with keyboard and follows its selected destination", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 844 });
  await page.goto("/home");
  const toggle = page.getByRole("button", { name: "Toggle menu" });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  const example = page.locator(".app-mobile-links").getByRole("link", { name: "Example", exact: true });
  await expect(example).toBeVisible();
  // The mobile drawer shares the dark navigation surface; its links must remain readable.
  const contrast = await example.evaluate(el => {
    const luminance = (color: string) => {
      const channels = color.match(/\d+/g)!.slice(0, 3).map(Number).map(v => {
        const n = v / 255;
        return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4;
      });
      return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
    };
    const foreground = luminance(getComputedStyle(el).color);
    const background = luminance(getComputedStyle(el.closest("nav")!).backgroundColor);
    const outline = luminance(getComputedStyle(el.closest("nav")!.querySelector('button[aria-label="Toggle menu"]')!).outlineColor);
    return {
      text: (Math.max(foreground, background) + .05) / (Math.min(foreground, background) + .05),
      focus: (Math.max(outline, background) + .05) / (Math.min(outline, background) + .05),
    };
  });
  expect(contrast.text).toBeGreaterThanOrEqual(4.5);
  expect(contrast.focus).toBeGreaterThanOrEqual(3);
  await example.click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("editor retains messages through variant removal and rejects unsupported creatives", async ({ users }) => {
  const [creator] = await users(1);
  await creator.page.goto("/experiments/new");
  await creator.page.getByLabel("Variant 1 message", { exact: true }).fill("First promise stays intact");
  await creator.page.getByRole("button", { name: "Add variant" }).click();
  await creator.page.getByLabel("Variant 3 message", { exact: true }).fill("Third promise moves up");
  await creator.page.getByRole("button", { name: "Add variant" }).click();
  await expect(creator.page.getByRole("button", { name: "Add variant" })).toBeDisabled();
  await creator.page.getByRole("button", { name: "Remove variant 2" }).click();
  await expect(creator.page.getByLabel("Variant 1 message", { exact: true })).toHaveValue("First promise stays intact");
  await expect(creator.page.getByLabel("Variant 2 message", { exact: true })).toHaveValue("Third promise moves up");
  await creator.page.getByLabel("Experiment creative").setInputFiles({ name: "invalid.txt", mimeType: "text/plain", buffer: Buffer.from("not an image") });
  await expect(creator.page.getByRole("alert")).toContainText("Choose a PNG, JPEG, or WebP");
  await expect(creator.page.getByRole("img", { name: "Creative attached to this experiment" })).toHaveCount(0);
  await expect(creator.page.getByLabel("Variant 1 message", { exact: true })).toHaveValue("First promise stays intact");
  await creator.page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(creator.page).toHaveURL(/\/home$/);
});


test("redesigned dark surfaces keep supporting copy readable", async ({ page, users }) => {
  const readable = async (locator: import("@playwright/test").Locator) => {
    const ratio = await locator.evaluate(el => {
      const luminance = (color: string) => {
        const rgb = color.match(/\d+/g)!.slice(0, 3).map(Number).map(v => { const n = v / 255; return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4; });
        return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
      };
      let surface: Element | null = el;
      while (surface && ["rgba(0, 0, 0, 0)", "transparent"].includes(getComputedStyle(surface).backgroundColor)) surface = surface.parentElement;
      if (!surface) throw Error("No opaque surface found");
      const a = luminance(getComputedStyle(el).color), b = luminance(getComputedStyle(surface).backgroundColor);
      return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    });
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  };
  await page.goto("/");
  await readable(page.locator(".bottom-cta > div > p:last-child"));
  const [creator] = await users(1);
  await creator.page.goto("/experiments/new");
  await creator.page.getByLabel("Experiment title", { exact:true }).fill("A readable draft preview");
  await expect(creator.page.locator(".form-preview strong")).toHaveText("A readable draft preview");
  await readable(creator.page.locator(".form-preview strong"));
  await readable(creator.page.locator(".form-preview p").last());
});
