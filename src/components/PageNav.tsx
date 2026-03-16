"use client";

import Link from "next/link";
import type { DocEntry } from "@/lib/docs";

interface PageNavProps {
  prev: DocEntry | null;
  next: DocEntry | null;
}

export function PageNav({ prev, next }: PageNavProps) {
  return (
    <nav className="flex justify-between mt-12 pt-6 border-t border-gray-100 gap-4">
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="flex flex-col p-3 border border-gray-200 rounded-lg no-underline transition-all hover:border-indigo-200 hover:bg-indigo-50/30 flex-1 min-w-0"
        >
          <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-gray-400 mb-1">
            ← Previous
          </span>
          <span className="text-sm font-medium text-indigo-600 truncate">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="flex flex-col p-3 border border-gray-200 rounded-lg no-underline transition-all hover:border-indigo-200 hover:bg-indigo-50/30 flex-1 min-w-0 text-right"
        >
          <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Next →
          </span>
          <span className="text-sm font-medium text-indigo-600 truncate">
            {next.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
