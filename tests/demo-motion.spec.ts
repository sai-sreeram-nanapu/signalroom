import { test, expect } from '@playwright/test';

test('demo interpretation follows committed votes, ties, replacements and reset', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'View sample analysis' }).click();
  await expect(page.locator('.analysis-summary .eyebrow')).toHaveText('INTERPRETATION · 3 RESPONSES');
  await page.getByRole('button', { name: /B · Remove the friction/ }).click();
  await page.getByRole('button', { name: 'Try an example vote' }).click();
  await expect(page.getByTestId('response-count')).toHaveText('4 responses');
  await expect(page.locator('.analysis-summary .eyebrow')).toHaveText('INTERPRETATION · 4 RESPONSES');
  await expect(page.getByRole('heading', { name: 'No clear leader. The sample is split.' })).toBeVisible();
  await expect(page.locator('.result-label b > span[aria-hidden]')).toHaveText(['50', '50']); // visual digits and exact accessible value
  await page.getByRole('button', { name: /B · Remove the friction/ }).click();
  await expect(page.getByTestId('response-count')).toHaveText('4 responses');
  await expect(page.getByRole('button', { name: 'Example vote counted' })).toBeDisabled();
  await page.getByRole('button', { name: /A · Ship the outcome/ }).click();
  // Choosing a replacement must not temporarily erase the committed vote.
  await expect(page.getByRole('heading', { name: 'No clear leader. The sample is split.' })).toBeVisible();
  await page.getByRole('button', { name: 'Update example vote' }).click();
  await expect(page.getByTestId('response-count')).toHaveText('4 responses');
  await expect(page.getByRole('heading', { name: 'A · Ship the outcome leads this small sample' })).toBeVisible();
  await expect(page.locator('.result-label b > span[aria-hidden]')).toHaveText(['75', '25']);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByTestId('response-count')).toHaveText('3 responses');
  await expect(page.locator('.analysis-summary .eyebrow')).toHaveText('INTERPRETATION · 3 RESPONSES');
  await expect(page.getByRole('button', { name: 'Try an example vote' })).toBeDisabled();
  await page.getByRole('button', { name: 'Hide sample analysis' }).click();
  await expect(page.getByRole('heading', { name: 'A · Ship the outcome leads this small sample' })).toHaveCount(0);
  await page.reload();
  await expect(page.getByTestId('response-count')).toHaveText('3 responses');
});

test('progress animates to its exact value and honors a changed motion preference', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/demo');
  const bar = page.locator('.bar-fill').first();
  expect(await bar.evaluate(el => getComputedStyle(el).transitionProperty)).toContain('transform');
  const before = await bar.evaluate(el => getComputedStyle(el).transform);
  await page.getByRole('button', { name: /B · Remove the friction/ }).click();
  await page.getByRole('button', { name: 'Try an example vote' }).click();
  await expect.poll(() => bar.evaluate(el => getComputedStyle(el).transform)).toBe('matrix(0.5, 0, 0, 1, 0, 0)');
  expect(before).not.toBe('matrix(0.5, 0, 0, 1, 0, 0)');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(await bar.evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0s');
  await expect(page.getByTestId('response-count')).toHaveText('3 responses');
  await expect(page.locator('.result-label b > span[aria-hidden]').first()).toHaveText('67');
});
