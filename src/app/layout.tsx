import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { BackToTop } from "@/components/BackToTop";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PEN — Docs",
  description:
    "Documentation for PEN, the MCP server that connects AI assistants to Chrome DevTools for performance profiling and analysis.",
  openGraph: {
    title: "PEN — Docs",
    description:
      "MCP server that connects AI assistants to Chrome DevTools. Profile pages, find memory leaks, measure coverage.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans h-full bg-white text-gray-800 antialiased overflow-x-hidden`}
      >
        <a
          href="#doc-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-indigo-600 focus:shadow-lg focus:rounded-md focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>

        <MobileHeader />

        <div className="flex h-full overflow-x-hidden">
          {/* Desktop sidebar */}
          <aside className="w-56 shrink-0 border-r border-gray-100 overflow-y-auto hidden md:flex flex-col">
            <Sidebar />
          </aside>

          {/* Main content area */}
          <main
            id="main-scroll"
            className="flex-1 overflow-y-auto overflow-x-hidden"
          >
            {children}
          </main>
        </div>

        <BackToTop />
      </body>
    </html>
  );
}
