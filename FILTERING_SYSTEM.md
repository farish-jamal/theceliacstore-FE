
This document explains how the URL-based filtering system works for the products pages.

## Filter Keys

The system supports the following filter keys in the URL:

### Core Parameters
- `page`: Current page number (default: 1)
- `per_page`: Items per page (default: 10)

### Search & Filtering
- `search`: Search term for product names, categories, or brands
- `price_range`: Price range in format "min_max" (e.g., "100_200")
- `category`: Product category ID
- `sub_category`: Product sub-category ID
- `rating`: Minimum rating filter (1-5)
- `is_best_seller`: Boolean filter for best seller products (true/false)
- `brands`: Comma-separated list of brand IDs

### Sorting
- `sort_by`: Sort option
  - `created_at` (default): Latest products first
  - `low_to_high`: Price low to high
  - `high_to_low`: Price high to low

## URL Examples

### Basic filtering
```
/products?page=1&per_page=10&search=organic&price_range=100_500&rating=4
```

### Category and brand filtering
```
/products?category=health-foods&brands=brand1,brand2,brand3&sort_by=low_to_highs
```

### Best seller filter
```
/products?is_best_seller=true&sort_by=high_to_low
```

### Complex filtering
```
/products?search=gluten&price_range=200_1000&category=snacks&rating=5&is_best_seller=true&brands=brand1,brand2&sort_by=created_at&page=2&per_page=20
```

## Implementation Details

### 1. URL State Management
- Uses Next.js `useSearchParams` and `useRouter` hooks
- All filter changes update the URL immediately
- Browser back/forward buttons work correctly
- Filters persist on page refresh

### 2. Custom Hook: `useProductFilters`
Located in `app/hooks/useProductFilters.ts`

Provides:
- `filters`: Current filter values from URL
- `updateFilter(key, value)`: Update a single filter
- `updateFilters(object)`: Update multiple filters
- `clearFilters()`: Clear all filters
- `getApiParams`: Convert URL filters to API parameters

### 3. Filter Components
- `SearchFilter`: Text search input
- `PriceRangeFilter`: Price range selection
- `RatingFilter`: Rating filter (radio buttons)
- `BestSellerFilter`: Best seller toggle
- `SortFilter`: Sort dropdown
- `ActiveFilters`: Display and remove active filters

### 4. API Integration
The `getApiParams` function converts URL parameters to the format expected by the backend API:

```typescript
{
  page: 1,
  per_page: 10,
  search: "organic",
  price_range: "100_200",
  category: ["health-foods"],
  sub_category: ["snacks"],
  rating: 4,
  is_best_seller: true,
  brands: ["brand1", "brand2"],
  sort_by: "low_to_high"
}
```

## Usage

### In Components
```typescript
import { useProductFilters } from "../hooks/useProductFilters";

const MyComponent = () => {
  const { filters, updateFilter, clearFilters } = useProductFilters();
  
  const handleSearch = (search: string) => {
    updateFilter("search", search);
  };
  
  const handlePriceRange = (range: string) => {
    updateFilter("price_range", range);
  };
  
  return (
    <div>
      <SearchFilter value={filters.search} onChange={handleSearch} />
      <PriceRangeFilter value={filters.price_range} onChange={handlePriceRange} />
      <button onClick={clearFilters}>Clear All</button>
    </div>
  );
};
```

### Direct URL Navigation
Users can directly navigate to filtered URLs:
```typescript
router.push("/products?search=organic&price_range=100_500&rating=4");
```

## Benefits

1. **Shareable URLs**: Users can share filtered product views
2. **SEO Friendly**: Search engines can index filtered pages
3. **Browser History**: Back/forward buttons work correctly
4. **Bookmarkable**: Users can bookmark specific filter combinations
5. **Analytics**: Track which filters are most popular
6. **Deep Linking**: Link directly to specific product views

## Price Range Format

Price ranges use the format `min_max` where:
- `min`: Minimum price (inclusive)
- `max`: Maximum price (inclusive)
- Separator: Underscore (`_`)

Examples:
- `0_100`: Under ₹100
- `100_200`: ₹100 - ₹200
- `200_500`: ₹200 - ₹500
- `500_1000`: ₹500 - ₹1000
- `1000_2000`: ₹1000 - ₹2000
- `2000_9999`: Above ₹2000 
