import { Ogma } from "@linkurious/ogma";

const placeholder = document.getElementById("icon-placeholder")!;
const CLEAN_QUOTES = /["']/g;
function getIconCode(icon: string): string {
  placeholder.className = `icon-${icon}`;
  const content = getComputedStyle(placeholder, ":before").content;
  return content.replace(CLEAN_QUOTES, "");
}

const FONT_NAME = "Lucide";

const NODE_ICONS = [
  "shield",
  "folder",
  "target",
  "bug",
  "star",
  "cloud",
  "user",
  "hammer",
];

const BADGE_ICONS = ["check", "triangle-alert", "info", "circle-help"];

const ogma = new Ogma({ container: "container" });

ogma.styles.addNodeRule({
  radius: 20,
  color: "#e8eef7",
  icon: {
    font: FONT_NAME,
    color: "#0093ff",
    scale: 0.5,
    content: (n) => getIconCode(NODE_ICONS[+n.getId() % NODE_ICONS.length]),
  },
  badges: {
    topRight: {
      color: "#333",
      scale: 0.35,
      text: {
        font: FONT_NAME,
        color: "white",
        scale: 0.55,
        content: (n) => getIconCode(BADGE_ICONS[+n.getId() % BADGE_ICONS.length]),
      },
    },
  },
});

await ogma.setGraph(await ogma.generate.grid({ rows: 3, columns: 3 }));
await ogma.layouts.grid();

Object.assign(window, { ogma });
