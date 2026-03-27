import { NextResponse } from 'next/server';
import { getProducts } from '../../apis/getProducts';
import { Product, MongoDBDecimal } from '../../types/Product';

const DOMAIN = 'https://www.theceliacstore.com';

// Helper: Ensures URLs are absolute
const ensureAbsoluteUrl = (url: string | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${DOMAIN}${url.startsWith('/') ? url : '/' + url}`;
};

// Helper: Correctly formats price with currency
const formatPrice = (priceValue: number | MongoDBDecimal | null | undefined): string => {
  let value = '0.00';
  if (priceValue !== null && priceValue !== undefined) {
    if (typeof priceValue === 'number') {
      value = priceValue.toFixed(2);
    } else if (priceValue.$numberDecimal) {
      value = parseFloat(priceValue.$numberDecimal).toFixed(2);
    }
  }
  return `${value} INR`;
};

export async function GET() {
  try {
    const response = await getProducts({
      params: { page: 1, per_page: 1000 }
    });

    const products: Product[] = response.data?.data || [];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
      <channel>
        <title>The Celiac Store - Product Feed</title>
        <link>${DOMAIN}</link>
        <description>Gluten-free product catalog</description>
        ${products.map((product) => {
          // 1. Safe Formatting 
          const priceFormatted = formatPrice(product.price);
          const discountedFormatted = product.discounted_price ? formatPrice(product.discounted_price) : null;
          const imageUrl = ensureAbsoluteUrl(product.images?.[0] || product.banner_image) || null;
          
          // 2. Validation layer 
          if (!priceFormatted || priceFormatted === '0.00 INR' || !imageUrl) {
            console.warn(`⚠️ Feed: Missing critical data for ${product._id}`);
            return '';
          }
          
          // 3. Smart Title & Tag Logic
          const description = product.small_description || product.full_description || product.name;
          const productUrl = `${DOMAIN}/products/${product._id}?utm_source=google&utm_medium=shopping&utm_campaign=merchant_feed`;
          
          // Logic: Only prepend if it's explicitly tagged 'gluten_free' and doesn't already have 'gluten' in the name
          const isTaggedGF = Array.isArray(product.tags) && product.tags.includes('gluten_free');
          const titleAlreadyHasGF = product.name.toLowerCase().includes('gluten');
          
          const optimizedTitle = (isTaggedGF && !titleAlreadyHasGF) 
            ? `Gluten-Free ${product.name}` 
            : product.name;
            
          const formattedTags = Array.isArray(product.tags) && product.tags.length > 0 
            ? product.tags.join(', ') 
            : '';

          // 4. Safe Availability Logic
          const isAvailable = product.inventory !== undefined 
            ? product.inventory > 0 
            : product.instock !== false;
          
          // 5. Custom boolean checks
          const prod = product as any;

          return `
          <item>
            <g:id>${product._id}</g:id>
            <g:title><![CDATA[${optimizedTitle}]]></g:title>
            <g:description><![CDATA[${description}]]></g:description>
            <g:link><![CDATA[${productUrl}]]></g:link>
            <g:image_link><![CDATA[${imageUrl}]]></g:image_link>
            <g:condition>new</g:condition>
            <g:availability>${isAvailable ? 'in_stock' : 'out_of_stock'}</g:availability>
            
            <g:price>${priceFormatted}</g:price>
            ${discountedFormatted && discountedFormatted !== priceFormatted ? `<g:sale_price>${discountedFormatted}</g:sale_price>` : ''}
            
            <g:brand><![CDATA[The Celiac Store]]></g:brand>
            <g:product_type><![CDATA[Food & Beverages]]></g:product_type>
            ${product.weight_in_grams ? `<g:unit_pricing_measure>${product.weight_in_grams} g</g:unit_pricing_measure>` : ''}
            
            <g:custom_label_0><![CDATA[${prod.is_bakery ? 'Bakery' : 'Pantry'}]]></g:custom_label_0>
            <g:custom_label_1><![CDATA[${isTaggedGF ? 'Certified-GF' : 'Default'}]]></g:custom_label_1>
            ${formattedTags ? `<g:custom_label_2><![CDATA[${formattedTags}]]></g:custom_label_2>` : ''}
            
            <g:mpn>${product.sku || product._id}</g:mpn>
            <g:identifier_exists>no</g:identifier_exists>
          </item>
          `;
        }).filter(Boolean).join('')}
      </channel>
    </rss>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Feed Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}