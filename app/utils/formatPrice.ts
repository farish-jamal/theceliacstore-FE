import { MongoDBDecimal } from "@/app/types/Product";

/**
 * Converts MongoDB Decimal128 objects to numbers
 * @param value - The value to convert (can be MongoDB Decimal, number, or other types)
 * @returns The converted number or 0 if invalid
 */
export const convertToNumber = (value: MongoDBDecimal | number | string | null | undefined): number => {
  if (value === null || value === undefined) {
    return 0;
  }
  
  // Handle MongoDB Decimal128 object
  if (typeof value === 'object' && '$numberDecimal' in value) {
    return parseFloat(value.$numberDecimal);
  }
  // Handle regular numbers
  else if (typeof value === 'number') {
    return value;
  }
  // Handle strings
  else if (typeof value === 'string') {
    return parseFloat(value);
  }
  // Handle other cases
  else {
    return parseFloat(String(value));
  }
};

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
  const numPrice = convertToNumber(price);
  
  if (isNaN(numPrice)) {
    return "0.00";
  }
  
  return numPrice.toFixed(2);
}; 