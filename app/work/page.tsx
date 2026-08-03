import type { Metadata } from "next";
import { getAllWork } from "@/lib/mdx";
import { WorkCard } from "@/components/sections/work-preview";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies and production systems architected and shipped by Muhammad Royhan, Tech Lead / Senior Software Engineer.",
};

export default async function WorkPage() {
  const allWork = await getAllWork();

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="mb-16 text-center font-display text-4xl font-semibold text-fg sm:text-h1">
        Work
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {allWork.map((item) => (
          <WorkCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
