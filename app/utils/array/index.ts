export function isArrayWithValues<T = any>(arr: unknown): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}
