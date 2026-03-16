"use client";

import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { TableOfContents } from "@/components/TableOfContents";
import { PageNav } from "@/components/PageNav";
import type { DocEntry } from "@/lib/docs";

interface DocPageClientProps {
  content: string;
  prev: DocEntry | null;
  next: DocEntry | null;
}

export function DocPageClient({ content, prev, next }: DocPageClientProps) {
  return (
    <div className="max-w-6xl mx-auto flex" style={{ minWidth: 0 }}>
      <article
        id="doc-content"
        tabIndex={-1}
        className="flex-1 min-w-0 px-3 sm:px-5 md:px-10 pt-14 md:pt-12 pb-16"
        style={{ maxWidth: "100%", overflowX: "hidden" }}
      >
        <div className="animate-fade-in">
          <MarkdownRenderer content={content} />
          <PageNav prev={prev} next={next} />
        </div>
      </article>

      <aside className="hidden xl:block w-48 shrink-0 pt-12 pr-6">
        <TableOfContents />
      </aside>
    </div>
  );
}
