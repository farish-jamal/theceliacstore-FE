import React from "react";

const FrequentlyBought = () => {
  const products = [
    {
      id: 1,
      name: "Wheafree Gluten Free Multigrain Flour 1000 Gms",
      price: 170.0,
      image:
        "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/183b94b37929bc9eee61fb523d8bef99602cb329_rabkid.jpg?_s=public-apps",
    },
    {
      id: 2,
      name: "Sai Healthy Atta 1000 Gms",
      price: 160.0,
      image:
        "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/828c7686eb0e33b2b2a9b791c342983d6fee1747_ubi5ay.jpg?_s=public-apps",
    },
    {
      id: 3,
      name: "Dr. Gluten Platinum Chapati Flour 1000 Gms",
      price: 180.0,
      image:
        "https://res.cloudinary.com/dacwig3xk/image/upload/fl_preserve_transparency/v1747513129/828c7686eb0e33b2b2a9b791c342983d6fee1747_ubi5ay.jpg?_s=public-apps",
    },
  ];

  const totalPrice = products.reduce((sum, product) => sum + product.price, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-10 text-center">
        Frequently bought together
      </h2>

      <div className="flex items-center justify-center mb-6">
        {products.map((product, index) => (
          <React.Fragment key={product.id}>
            {index > 0 && (
              <div className="mx-5 text-xl font-light text-gray-400">+</div>
            )}
            <div className="flex flex-col items-center mx-2">
              <div className="relative mb-3">
                <div className="absolute -top-2 -left-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                  >
                    <path d="M5 12l5 5L20 7"></path>
                  </svg>
                </div>
                <div className="w-24 h-24 p-1 bg-white rounded border border-gray-200 shadow-sm">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <h3 className="text-xs text-center font-medium max-w-[100px]">
                {product.name}
              </h3>
              <p className="text-xs font-bold mt-1">
                ₹{product.price.toFixed(2)}
              </p>
            </div>
          </React.Fragment>
        ))}

        <div className="mx-5 text-xl font-light text-gray-400">=</div>

        <div className="flex flex-col items-center mx-2">
          <div className="text-lg font-semibold text-gray-900 mb-1">
            Total: ₹{totalPrice.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mb-3">
            For {products.length} Items
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-5 rounded text-sm transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyBought;
