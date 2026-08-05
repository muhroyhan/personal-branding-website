import { en, type Dictionary } from "./dictionaries/en";
import { id } from "./dictionaries/id";
import type { Locale } from "./config";

const DICTIONARIES: Record<Locale, Dictionary> = { en, id };

/**
 * Synchronous on purpose. Both dictionaries are plain objects of static copy
 * — a few kilobytes — so the usual dynamic-import dance buys nothing, and
 * every page here is statically generated at build time anyway.
 */
export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/** Fills `{name}` placeholders — the only interpolation this site needs. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export type { Dictionary };
export * from "./config";
