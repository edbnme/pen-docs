import { readFileSync } from "fs";
import { join } from "path";
import { docOrder, getDocBySlug } from "$lib/docs";
import { renderMarkdown, extractHeadings } from "$lib/markdown/index";
import type { PageServerLoad, EntryGenerator } from "./$types";
import { error } from "@sveltejs/kit";

export const entries: EntryGenerator = () => {
  return docOrder.map((slug) => ({ slug }));
};

export const prerender = true;

export const load: PageServerLoad = ({ params }) => {
  const { slug } = params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    error(404, { message: "Page not found" });
  }

  const filePath = join(process.cwd(), "src", "content", `${slug}.md`);
  let raw: string;
  try {
    raw = readFileSync(filePath, "utf-8");
  } catch {
    error(404, { message: "Page not found" });
  }

  const html = renderMarkdown(raw);
  const headings = extractHeadings(raw);

  return {
    slug,
    title: doc.title,
    section: doc.section,
    description: doc.description,
    html,
    headings,
  };
};
