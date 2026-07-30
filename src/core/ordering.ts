import { generateKeyBetween } from "fractional-indexing";

/**
 * Fractional indexing helpers for ordering siblings without renumbering.
 * See ADR 0004. Each order key is an opaque, lexicographically-sortable string.
 */

/** Order key for an item appended after `last` (or first item if null). */
export function orderAfter(last: string | null): string {
  return generateKeyBetween(last, null);
}

/** Order key for an item inserted before `first` (or first item if null). */
export function orderBefore(first: string | null): string {
  return generateKeyBetween(null, first);
}

/** Order key for an item placed between two existing keys. */
export function orderBetween(a: string | null, b: string | null): string {
  return generateKeyBetween(a, b);
}

/** Compare two order keys for sorting. */
export function compareOrder(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}
