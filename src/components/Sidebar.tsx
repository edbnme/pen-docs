"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { getDocSections } from "@/lib/docs";

const sections = getDocSections();

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [filter, setFilter] = useState("");

  const currentSlug =
    pathname === "/" ? "readme" : pathname.replace("/docs/", "");

  return (
    <div className="flex h-full flex-col">
      <div className="p-4 pb-2">
        <Link href="/docs/readme" className="block" onClick={onNavigate}>
          <div className="text-base font-bold text-gray-900 tracking-tight">
            PEN
          </div>
          <div className="text-[0.65rem] text-gray-400 mt-0.5">
            Performance Engineer Node
          </div>
        </Link>
      </div>

      <div className="px-3 pb-2">
        <input
          type="text"
          placeholder="Filter pages…"
          autoComplete="off"
          spellCheck={false}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full text-xs px-2.5 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 placeholder-gray-300 transition"
          aria-label="Filter documentation pages"
        />
      </div>

      <nav className="flex-1 px-2 pb-4 space-y-0.5 overflow-y-auto">
        {sections.map((section) => {
          const filteredDocs = section.docs.filter(
            (doc) =>
              !filter ||
              doc.title.toLowerCase().includes(filter.toLowerCase())
          );
          if (filteredDocs.length === 0) return null;

          return (
            <div key={section.name}>
              {section.name !== "Getting Started" && (
                <div className="pt-4 pb-1 px-2.5 text-[0.65rem] font-semibold text-gray-400 uppercase tracking-widest">
                  {section.name}
                </div>
              )}
              {filteredDocs.map((doc) => {
                const isActive = currentSlug === doc.slug;
                return (
                  <Link
                    key={doc.slug}
                    href={`/docs/${doc.slug}`}
                    onClick={onNavigate}
                    className={`block py-2 px-3 rounded-md text-[0.8125rem] transition-all border-l-2 min-h-[2.25rem] ${
                      isActive
                        ? "text-indigo-600 bg-indigo-50 border-indigo-500 font-medium"
                        : "text-gray-500 border-transparent hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {doc.title}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
