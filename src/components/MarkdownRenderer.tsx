"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import { useCallback } from "react";

function CopyButton({ code }: { code: string }) {
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).catch(() => {});
    const btn = document.activeElement as HTMLButtonElement;
    if (btn) {
      const original = btn.textContent;
      btn.textContent = "Copied!";
      btn.classList.add("text-emerald-600", "border-emerald-200", "bg-emerald-50");
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove("text-emerald-600", "border-emerald-200", "bg-emerald-50");
      }, 2000);
    }
  }, [code]);

  return (
    <button
      onClick={handleCopy}
      className="text-[0.7rem] font-medium text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded cursor-pointer transition-all hover:text-gray-900 hover:border-gray-300"
    >
      Copy
    </button>
  );
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight, rehypeSlug, rehypeRaw]}
      components={{
        pre({ children, ...props }) {
          // Extract code text for copy button
          let codeText = "";
          let lang = "";

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const codeChild = (children as any)?.props;
          if (codeChild) {
            codeText =
              typeof codeChild.children === "string"
                ? codeChild.children
                : "";
            const className = codeChild.className || "";
            const match = className.match(/language-(\w+)/);
            lang = match ? match[1] : "text";
          }

          return (
            <div className="code-wrap relative my-4 rounded-lg border border-gray-200 overflow-hidden">
              <div className="flex justify-between items-center bg-gray-50 border-b border-gray-100 px-3 py-1">
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-gray-400">
                  {lang}
                </span>
                <CopyButton code={codeText} />
              </div>
              <pre
                {...props}
                className="!m-0 !border-0 !rounded-none overflow-x-auto"
              >
                {children}
              </pre>
            </div>
          );
        },
        code({ children, className, ...props }) {
          const isInline = !className;
          if (isInline) {
            return (
              <code
                className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[0.84em] text-gray-800 break-all"
                {...props}
              >
                {children}
              </code>
            );
          }
          return (
            <code className={`${className} block p-4 bg-[#fafafa] font-mono text-[0.8125rem] leading-relaxed`} {...props}>
              {children}
            </code>
          );
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto my-4 border border-gray-200 rounded-lg">
              <table className="w-full text-sm border-collapse min-w-[500px]">
                {children}
              </table>
            </div>
          );
        },
        th({ children }) {
          return (
            <th className="bg-gray-50 font-semibold text-gray-700 text-left px-3.5 py-2.5 border-b border-gray-200 whitespace-nowrap">
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className="px-3.5 py-2 border-b border-gray-100 align-top">
              {children}
            </td>
          );
        },
        tr({ children }) {
          return <tr className="hover:bg-gray-50/50">{children}</tr>;
        },
        a({ href, children }) {
          // Convert internal doc links
          if (href) {
            // Handle relative links to docs
            if (
              href.startsWith("docs/") ||
              href.startsWith("./") ||
              href.endsWith(".md")
            ) {
              const slug = href
                .replace(/^\.\//, "")
                .replace(/^docs\//, "")
                .replace(/^spec\//, "")
                .replace(/\.md$/, "")
                .replace(/^0[0-9]-/, "")
                .replace(
                  /INSTALL/i,
                  "install"
                )
                .replace(/RUNNING/i, "running");

              const slugMap: Record<string, string> = {
                "executive-summary": "executive-summary",
                "system-architecture": "system-architecture",
                "cdp-integration": "cdp-integration",
                "data-streaming": "data-streaming",
                "mcp-server-design": "mcp-server-design",
                "codebase-mapping": "source-tools",
                "ide-llm-integration": "ide-llm-integration",
                "tool-catalog": "tool-catalog",
                "edge-cases": "edge-cases",
                "security-model": "security-model",
                "appendix-sources": "sources",
                install: "install",
                running: "running",
              };

              const mappedSlug = slugMap[slug] || slug;
              return (
                <a
                  href={`/docs/${mappedSlug}`}
                  className="text-indigo-600 font-medium no-underline hover:text-indigo-800 hover:underline"
                >
                  {children}
                </a>
              );
            }

            // Internal hash or absolute internal links
            if (href.startsWith("/") || href.startsWith("#")) {
              return (
                <a
                  href={href}
                  className="text-indigo-600 font-medium no-underline hover:text-indigo-800 hover:underline"
                >
                  {children}
                </a>
              );
            }

            // External links
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 font-medium no-underline hover:text-indigo-800 hover:underline"
              >
                {children}
              </a>
            );
          }
          return <>{children}</>;
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-3 border-indigo-200 pl-4 text-gray-500 my-4">
              {children}
            </blockquote>
          );
        },
        h1({ children }) {
          return (
            <h1 className="text-3xl font-bold text-gray-900 mt-10 mb-4 tracking-tight leading-tight">
              {children}
            </h1>
          );
        },
        h2({ children, id }) {
          return (
            <h2
              id={id}
              className="text-xl font-semibold text-gray-900 mt-9 mb-3 pt-6 border-t border-gray-100 tracking-tight scroll-mt-8 first:border-t-0 first:pt-0 first:mt-0"
            >
              {children}
            </h2>
          );
        },
        h3({ children, id }) {
          return (
            <h3
              id={id}
              className="text-lg font-semibold text-gray-800 mt-6 mb-2 scroll-mt-8"
            >
              {children}
            </h3>
          );
        },
        h4({ children }) {
          return (
            <h4 className="text-base font-semibold text-gray-700 mt-5 mb-2">
              {children}
            </h4>
          );
        },
        p({ children }) {
          return <p className="my-3 first:mt-0">{children}</p>;
        },
        ul({ children }) {
          return <ul className="my-3 ml-6 list-disc">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="my-3 ml-6 list-decimal">{children}</ol>;
        },
        li({ children }) {
          return <li className="my-1">{children}</li>;
        },
        hr() {
          return <hr className="border-none border-t border-gray-100 my-8" />;
        },
        strong({ children }) {
          return (
            <strong className="font-semibold text-gray-900">{children}</strong>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
