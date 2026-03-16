"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const article = document.getElementById("doc-content");
    if (!article) return;

    const h2s = article.querySelectorAll("h2");
    const items: TocItem[] = [];
    h2s.forEach((h, i) => {
      const id = h.id || `section-${i}`;
      if (!h.id) h.id = id;
      items.push({ id, text: h.textContent || "" });
    });
    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-10% 0px -80% 0px", threshold: 0 }
    );

    h2s.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-12">
      <div className="text-[0.65rem] font-semibold text-gray-400 uppercase tracking-widest mb-3">
        On this page
      </div>
      <nav className="space-y-0.5 border-l border-gray-100 pl-3">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById(h.id)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className={`block py-1 text-xs transition-colors ${
              activeId === h.id
                ? "text-indigo-600 font-medium"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
