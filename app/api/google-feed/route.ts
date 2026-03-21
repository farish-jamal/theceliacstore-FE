import { NextResponse } from 'next/server';
import { getProducts } from '../../apis/getProducts';
import { Product, MongoDBDecimal } from '../../types/Product';

const DOMAIN = 'https://www.theceliacstore.com';

// Helper: Ensures URLs are absolute (Crucial for Google)
const ensureAbsoluteUrl = (url: string | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${DOMAIN}${url.startsWith('/') ? url : '/' + url}`;
};

// Helper: Correctly formats price with currency (Google's REQUIRED format)
const formatPrice = (priceValue: number | MongoDBDecimal | null | undefined): string => {
  let value = '0.00';
  if (priceValue !== null && priceValue !== undefined) {
    if (typeof priceValue === 'number') {
      value = priceValue.toFixed(2);
    } else if (priceValue.$numberDecimal) {
      value = parseFloat(priceValue.$numberDecimal).toFixed(2);
    }
  }
  return `${value} INR`; // Google requires 'Value Currency'
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
          const description = product.small_description || product.full_description || product.name;
          const imageUrl = ensureAbsoluteUrl(product.images?.[0] || product.banner_image);
          const productUrl = `${DOMAIN}/products/${product._id}`;

          return `
          <item>
            <g:id>${product._id}</g:id>
            <g:title><![CDATA[${product.name}]]></g:title>
            <g:description><![CDATA[${description}]]></g:description>
            <g:link>${productUrl}</g:link>
            <g:image_link>${imageUrl}</g:image_link>
            <g:condition>new</g:condition>
            <g:availability>${product.instock !== false ? 'in_stock' : 'out_of_stock'}</g:availability>
            <g:price>${formatPrice(product.price)}</g:price>
            ${product.discounted_price ? `<g:sale_price>${formatPrice(product.discounted_price)}</g:sale_price>` : ''}
            <g:brand><![CDATA[${product.brand?.name || 'The Celiac Store'}]]></g:brand>
            
            <g:mpn>${product.sku || product._id}</g:mpn>
            
            <g:identifier_exists>no</g:identifier_exists>
          </item>
          `;
        }).join('')}
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