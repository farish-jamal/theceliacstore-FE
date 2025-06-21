import { CartItem } from "@/app/types/Cart";

export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + (item.total || 0), 0);
}
