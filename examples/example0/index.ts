import { Ogma } from "@linkurious/ogma";

const ogma = new Ogma({
  container: "container",
});

ogma
  .addGraph({
    nodes: [{ id: "n0" }, { id: "n1" }, { id: "n2" }, { id: "n3" }],
    edges: [
      { id: "e0", source: "n0", target: "n1" },
      { id: "e1", source: "n1", target: "n2" },
      { id: "e2", source: "n2", target: "n3" },
      { id: "e3", source: "n3", target: "n0" },
    ],
  })
  .then(() => ogma.layouts.force({ locate: true }))
  .then(() => console.log("done"));

Object.assign(window, { ogma });
