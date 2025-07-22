import { BACKEND_URL } from "../constants/URL";

export async function getCategories() {
  const res = await fetch(`${BACKEND_URL}/api/category`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
} 