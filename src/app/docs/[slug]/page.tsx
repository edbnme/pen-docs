import { getDocBySlug, getAdjacentDocs, docOrder } from "@/lib/docs";
import { getDocContent } from "@/lib/docs-server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DocPageClient } from "./client";

export function generateStaticParams() {
  return docOrder.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) return {};

  return {
    title: `PEN — ${doc.title}`,
    description: `PEN documentation: ${doc.title}`,
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  const content = getDocContent(slug);
  const { prev, next } = getAdjacentDocs(slug);

  return <DocPageClient content={content} prev={prev} next={next} />;
}
