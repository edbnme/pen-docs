"use client";

import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const main = document.getElementById("main-scroll");
    if (!main) return;

    const handler = () => setVisible(main.scrollTop > 300);
    main.addEventListener("scroll", handler);
    return () => main.removeEventListener("scroll", handler);
  }, []);

  return (
    <button
      onClick={() =>
        document
          .getElementById("main-scroll")
          ?.scrollTo({ top: 0, behavior: "smooth" })
      }
      className={`fixed bottom-6 right-6 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center transition-all z-20 cursor-pointer hover:bg-gray-50 hover:border-indigo-200 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <svg
        className="w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 15l7-7 7 7"
        />
      </svg>
    </button>
  );
}
