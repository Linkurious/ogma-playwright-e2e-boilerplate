import { test, expect } from "@playwright/test";

test.describe("Ogma screenshot tests", () => {
  test("nodes and badges render their Lucide icons before the screenshot is taken", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/example1/");
    await page.waitForFunction(() => window.ogma !== undefined);

    // The reliable "external icon font is loaded and painted" sequence.
    //   1. document.fonts.ready   -> the browser has finished loading (or failing)
    //                                every requested font, including the Lucide
    //                                icon font, independently of Ogma's own polling.
    //   2. ogma.reloadFonts()     -> public API: invalidates Ogma's text/pattern
    //                                caches and schedules a redraw with current
    //                                font state.
    //   3. ogma.view.afterNextFrame() (awaited twice for margin) -> public API that
    //                                resolves only after a real render pass has run,
    //                                not just an animation-frame schedule.
    //   4. ogma.events.once('idle', ...) -> Ogma's existing "everything else has
    //                                settled" signal.
    await page.evaluate(async () => {
      const ogma = window.ogma;
      await document.fonts.ready;
      ogma.reloadFonts();
      await ogma.view.afterNextFrame();
      await ogma.view.afterNextFrame();
      await new Promise<void>((resolve) => ogma.events.once("idle", () => resolve()));
    });

    await expect(page).toHaveScreenshot("graph-with-lucide-icons.png");
  });
});
