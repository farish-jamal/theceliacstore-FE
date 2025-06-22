import { MongoDBDecimal } from "@/app/types/Product";

/**
 * Safely formats a price value to 2 decimal places
 * Handles MongoDB Decimal128 objects, numbers, strings, null, and undefined
 * @param price - The price value to format (can be MongoDB Decimal, number, string, null, or undefined)
 * @returns Formatted price string or "0.00" if invalid
 * 
 * @example
 * formatPrice({ $numberDecimal: "1000" }) // "1000.00"
 * formatPrice(1000) // "1000.00"
 * formatPrice("1000") // "1000.00"
 * formatPrice(null) // "0.00"
 * formatPrice(undefined) // "0.00"
 */
export const formatPrice = (price: MongoDBDecimal | number | string | null | undefined): string => {
  if (price === null || price === undefined) {
    return "0.00";
  }
  
  let numPrice: number;
  
  // Handle MongoDB Decimal128 object
  if (typeof price === 'object' && '$numberDecimal' in price) {
    numPrice = parseFloat(price.$numberDecimal);
  }
  // Handle regular numbers
  else if (typeof price === 'number') {
    numPrice = price;
  }
  // Handle strings
  else if (typeof price === 'string') {
    numPrice = parseFloat(price);
  }
  // Handle other cases
  else {
    numPrice = parseFloat(String(price));
  }
  
  if (isNaN(numPrice)) {
    return "0.00";
  }
  
  return numPrice.toFixed(2);
}; 