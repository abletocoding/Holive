import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
await page.goto("https://holive.org/es", { waitUntil: "networkidle", timeout: 90000 });
await page.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const total = document.body.scrollHeight;
  for (let y = 0; y < total; y += Math.max(200, window.innerHeight * 0.4)) {
    window.scrollTo(0, y);
    await sleep(120);
  }
  window.scrollTo(0, document.body.scrollHeight);
  await sleep(1500);
});
await page.waitForTimeout(3000);
const ready = await page.evaluate(() => document.body.innerText.includes("Entrar a la arena"));
console.log("ready", ready);
await page.locator("footer button", { hasText: "Entrar a la arena" }).click({ force: true });
await page.waitForSelector("[role=application]");
await page.waitForTimeout(800);
await page.screenshot({ path: "_smoke_train.png" });
await page.locator("[role=application] button", { hasText: "Entrar a freestyle" }).click({ force: true });
await page.waitForTimeout(1200);
await page.screenshot({ path: "_smoke_freestyle.png" });
const freestyle = await page.evaluate(() => {
  const app = document.querySelector("[role=application]");
  const pads = [...app.querySelectorAll("button.neural-touch, button[aria-label*='Pad'], button[aria-label*='pad']")];
  const stats = pads.map((b) => {
    const r = b.getBoundingClientRect();
    return {
      label: (b.getAttribute("aria-label") || b.textContent || "").replace(/\s+/g, " ").trim().slice(0, 28),
      w: Math.round(r.width),
      h: Math.round(r.height),
      visible: r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight,
      clipped: r.left < -1 || r.top < -1 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1,
      tooSmall: Math.min(r.width, r.height) < 44,
    };
  });
  const inputs = [...app.querySelectorAll("input, textarea, [contenteditable=true]")].map((el) => ({
    tag: el.tagName,
    type: el.getAttribute("type"),
  }));
  return {
    pageOX: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth,
    touchAction: getComputedStyle(app).touchAction,
    padCount: stats.length,
    visiblePads: stats.filter((p) => p.visible).length,
    clipped: stats.filter((p) => p.clipped).length,
    smallPads: stats.filter((p) => p.tooSmall).length,
    hasKit: [...app.querySelectorAll("button")].some((b) => (b.textContent || "").trim() === "Kit"),
    hasSongs: [...app.querySelectorAll("button")].some((b) => /Canciones|Songs/i.test(b.textContent || "")),
    hasSolo: [...app.querySelectorAll("button")].some((b) => /Solo/i.test(b.textContent || "")),
    playPathInputs: inputs,
    stats,
  };
});
await page.locator("[role=application] button", { hasText: "Abrir profundidades" }).click({ force: true }).catch(async () => {
  await page.locator("[role=application] button", { hasText: /Entrenamiento/i }).first().click({ force: true });
  await page.waitForTimeout(600);
  await page.locator("[role=application] button", { hasText: "Abrir profundidades" }).click({ force: true });
});
await page.waitForTimeout(800);
await page.screenshot({ path: "_smoke_hub.png" });
await page.locator("[role=application] button").filter({ hasText: /Semilla|Seed/ }).first().click({ force: true });
await page.waitForTimeout(1000);
await page.screenshot({ path: "_smoke_classic.png" });
const classic = await page.evaluate(() => ({
  pageOX: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth,
  touchAction: getComputedStyle(document.querySelector("[role=application]")).touchAction,
}));
const out = { freestyle, classic, es: (await fetch("https://holive.org/es")).status };
writeFileSync("_smoke_mobile.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
await browser.close();