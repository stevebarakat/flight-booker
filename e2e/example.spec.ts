// @ts-check
import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Flight Booker/);
});

test("get started link", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  const departDate = page.getByLabel("Depart Date");
  await departDate.fill("2022-01-01");

  const bookButton = page.getByRole("button");
  expect(await bookButton.isEnabled()).toBe(false);
});
