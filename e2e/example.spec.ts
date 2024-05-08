// @ts-check
import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Flight Booker/);
});

test("book button is enabled when depart date is today", async ({ page }) => {
  function generateDate(days: number) {
    return new Date(Date.now() + days * 86400000).toISOString().split("T")[0];
  }
  const TODAY = generateDate(0);
  await page.goto("/");
  const departDate = page.getByLabel("Depart Date");
  await departDate.fill(TODAY);

  const bookButton = page.getByRole("button");
  expect(await bookButton.isEnabled()).toBe(true);
});

test("book button is disabled when depart date is in the past", async ({
  page,
}) => {
  function generateDate(days: number) {
    return new Date(Date.now() + days * 86400000).toISOString().split("T")[0];
  }
  const LAST_WEEK = generateDate(-7);
  await page.goto("/");
  const departDate = page.getByLabel("Depart Date");
  await departDate.fill(LAST_WEEK);

  const bookButton = page.getByRole("button");
  expect(await bookButton.isEnabled()).toBe(false);
});
