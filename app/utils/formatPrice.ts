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

export interface FormatCurrencyOptions {
  /**
   * Currency symbol to display (default: "₹")
   */
  symbol?: string;
  /**
   * Position of currency symbol (default: "prefix")
   */
  symbolPosition?: 'prefix' | 'suffix';
  /**
   * Whether to include the currency symbol (default: false)
   */
  showSymbol?: boolean;
  /**
   * Whether to add thousand separators (default: true)
   */
  useThousandSeparator?: boolean;
  /**
   * Thousand separator character (default: ",")
   */
  thousandSeparator?: string;
  /**
   * Decimal separator character (default: ".")
   */
  decimalSeparator?: string;
  /**
   * Whether to hide decimals if they are .00 (default: true)
   */
  hideZeroDecimals?: boolean;
  /**
   * Number of decimal places to show (default: 2)
   */
  decimalPlaces?: number;
}

/**
 * Formats a price value with customizable options
 * Removes unnecessary decimals (.00) and adds thousand separators
 * 
 * @param price - The price value to format
 * @param options - Formatting options
 * @returns Formatted price string
 * 
 * @example
 * formatCurrency(135.00) // "135"
 * formatCurrency(135.50) // "135.50"
 * formatCurrency(1000) // "1,000"
 * formatCurrency(1234.56) // "1,234.56"
 * formatCurrency(135, { showSymbol: true }) // "₹135"
 * formatCurrency(135, { showSymbol: true, symbol: "$", symbolPosition: "prefix" }) // "$135"
 * formatCurrency(135.00, { hideZeroDecimals: false }) // "135.00"
 */
export const formatCurrency = (
  price: MongoDBDecimal | number | string | null | undefined,
  options: FormatCurrencyOptions = {}
): string => {
  const {
    symbol = "₹",
    symbolPosition = "prefix",
    showSymbol = false,
    useThousandSeparator = true,
    thousandSeparator = ",",
    decimalSeparator = ".",
    hideZeroDecimals = true,
    decimalPlaces = 2,
  } = options;

  const numPrice = convertToNumber(price);
  
  if (isNaN(numPrice)) {
    return showSymbol 
      ? (symbolPosition === 'prefix' ? `${symbol}0` : `0${symbol}`)
      : "0";
  }

  // Split into integer and decimal parts
  const fixedPrice = numPrice.toFixed(decimalPlaces);
  const [integerPart, decimalPart] = fixedPrice.split('.');

  // Add thousand separators to integer part
  let formattedInteger = integerPart;
  if (useThousandSeparator) {
    formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  }

  // Determine if we should show decimals
  let formattedPrice = formattedInteger;
  const hasNonZeroDecimals = decimalPart && decimalPart !== '0'.repeat(decimalPlaces);
  
  if (!hideZeroDecimals || hasNonZeroDecimals) {
    formattedPrice = `${formattedInteger}${decimalSeparator}${decimalPart}`;
  }

  // Add currency symbol if needed
  if (showSymbol) {
    return symbolPosition === 'prefix' 
      ? `${symbol}${formattedPrice}`
      : `${formattedPrice}${symbol}`;
  }

  return formattedPrice;
}; 