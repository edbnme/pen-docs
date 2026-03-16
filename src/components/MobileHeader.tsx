"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";

export function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-20 flex items-center justify-between px-4 py-2">
        <span className="text-sm font-bold text-gray-900">PEN</span>
        <button
          onClick={() => setOpen(true)}
          className="p-1.5 text-gray-500 hover:text-gray-900 rounded-md hover:bg-gray-100 transition"
          aria-label="Open navigation"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-y-0 left-0 z-40 w-[280px] bg-white shadow-xl md:hidden overflow-y-auto">
          <div className="flex justify-end p-2">
            <button
              onClick={() => setOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-900 rounded"
              aria-label="Close navigation"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <Sidebar onNavigate={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
