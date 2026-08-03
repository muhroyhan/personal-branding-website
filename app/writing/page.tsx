import type { Metadata } from "next";
import { getAllWriting } from "@/lib/mdx";
import { WritingCard } from "@/components/writing/writing-card";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Essays by Muhammad Royhan connecting systems thinking and Stoic philosophy to real software architecture decisions.",
};

export default async function WritingPage() {
  const allWriting = await getAllWriting();

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="mb-4 text-center font-display text-4xl font-semibold text-fg sm:text-h1">
        Writing
      </h1>
      <p className="mx-auto mb-16 max-w-xl text-center text-body text-muted-foreground">
        Where systems thinking and Stoic philosophy meet actual engineering decisions.
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {allWriting.map((item) => (
          <WritingCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
