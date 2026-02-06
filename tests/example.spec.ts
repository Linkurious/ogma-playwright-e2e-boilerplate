import { Ogma } from "@linkurious/ogma";
import { test, expect } from "@playwright/test";

declare global {
  interface Window {
    ogma: Ogma;
  }
}

test.describe("Ogma e2e tests", () => {
  test("Graph is loaded, layouted and centered", async ({ page }) => {
    // navigate to the right example
    await page.goto("http://localhost:3000/example0/");
    // check elements on the page, your UI
    await expect(page).toHaveTitle(/Ogma Example 0/);
    // check that the instance is created and exposed
    await page.waitForFunction(() => window.ogma !== undefined);
    // wait for the specific console message, wait for the layout to be done
    await new Promise<void>((resolve) =>
      page.on("console", (m) => {
        if (m.text() === "done") resolve();
      }),
    );
    // read values from the exposed ogma instance
    const { view, bounds } = await page.evaluate(() => {
      const ogma = window.ogma;
      return {
        view: ogma.view.get(),
        bounds: ogma.getNodes().getBoundingBox(),
      };
    });

    // assertions
    expect(view).not.toBeUndefined();
    expect(view.x).toBeCloseTo(bounds.cx, 0);
    expect(view.y).toBeCloseTo(bounds.cy, 0);
  });

  test("click on the node", async ({ page }) => {
    // navigate to the right example
    await page.goto("http://localhost:3000/example0/");
    // check that the instance is created and exposed
    await page.waitForFunction(() => window.ogma !== undefined);
    // wait for the specific console message, wait for the layout to be done
    await new Promise<void>((resolve) =>
      page.on("console", (m) => {
        if (m.text() === "done") resolve();
      }),
    );

    // check node position before click
    const position = await page.evaluate(() => {
      const ogma = window.ogma;
      const node = ogma.getNodes().get(0);
      return node.getPositionOnScreen();
    });
    page.mouse.click(position.x, position.y);
    await page.waitForTimeout(100);
    const selectedNode = await page.evaluate(() => {
      const ogma = window.ogma;
      return ogma.getSelectedNodes().get(0).getId();
    });
    expect(selectedNode).toBe("n0");
  });
});
