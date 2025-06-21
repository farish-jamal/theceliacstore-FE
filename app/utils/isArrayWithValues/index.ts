// Utility to check if a value is an array with at least one item
export function isArrayWithValues<T = any>(arr: unknown): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}
