import { uniqueTags, filterByTag, type Project } from "../lib/filters";

const sample: Project[] = [
  { title: "A", category: "X", tags: ["ai"], description: "", stack: [] },
  { title: "B", category: "Y", tags: ["web"], description: "", stack: [] },
  { title: "C", category: "Z", tags: ["ai", "embedded"], description: "", stack: [] },
];

describe("filters", () => {
  test("uniqueTags collects unique tags with 'all' first", () => {
    expect(uniqueTags(sample)).toEqual(["all", "ai", "web", "embedded"]);
  });

  test("filterByTag returns all for 'all'", () => {
    expect(filterByTag(sample, "all")).toHaveLength(3);
  });

  test("filterByTag filters by a single tag", () => {
    expect(filterByTag(sample, "ai").map((p) => p.title)).toEqual(["A", "C"]);
    expect(filterByTag(sample, "web").map((p) => p.title)).toEqual(["B"]);
    expect(filterByTag(sample, "embedded").map((p) => p.title)).toEqual(["C"]);
  });

  // Extra safety: unknown tag returns empty array
  test("filterByTag returns empty when tag does not exist", () => {
    expect(filterByTag(sample, "mobile")).toEqual([]);
  });
});
