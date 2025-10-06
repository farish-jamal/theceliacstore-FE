export const endpoints = {
  // auth
  login: "api/auth/user/login",
  register: "api/auth/user/register",

  // products
  products: "api/product",
  productRecommendations: "api/product/recommendations",

  // bundles
  bundles: "api/bundles",

  // blogs
  blogs: "api/blogs",

  // cart
  cart: "api/cart",
  
  // categories
  categories: "api/category",

  // sub-categories
  subCategories: "api/sub-category",

  // brands
  brands: "api/brand",

  // addresses
  addresses: "api/address",
  getUserAddresses: (userId: string) => `api/address/user/${userId}`,

  // orders
  order: "api/order",
  orderHistory: "api/order/history",
};
