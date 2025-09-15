// Shared Project type (matches your ProjectCard props)
export interface Project {
  title: string;
  category: string;
  tags: string[];
  description: string;
  stack: string[];
  image?: string;
  links?: { code?: string; live?: string; details?: string };
}

/** Collect unique tags used by projects with 'all' first */
export const uniqueTags = (list: Project[]): string[] => {
  return ["all", ...Array.from(new Set(list.flatMap((p) => p.tags)))];
};

/** Filter projects by a single tag (or return all) */
export const filterByTag = (list: Project[], tag: string): Project[] => {
  return tag === "all" ? list : list.filter((p) => p.tags.includes(tag));
};
