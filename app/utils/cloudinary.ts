// Ask Cloudinary for a resized, modern-format copy instead of the original upload.
// Original product photos are ~150 KB JPEGs; f_auto,q_auto,w_400 serves ~10 KB WebP/AVIF.
// Non-Cloudinary URLs (local fallbacks, other hosts) are returned unchanged.
export function cloudinaryThumb(url: string, width = 400): string {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) {
    return url;
  }
  // Skip if the URL already carries a transformation segment.
  const afterUpload = url.split("/image/upload/")[1] || "";
  const firstSegment = afterUpload.split("/")[0];
  if (/(^|,)(w_|f_|q_|c_)/.test(firstSegment)) {
    return url;
  }
  return url.replace("/image/upload/", `/image/upload/f_auto,q_auto,c_limit,w_${width}/`);
}
