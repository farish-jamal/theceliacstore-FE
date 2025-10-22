"use client";
import React, { useEffect, useMemo, useState } from "react";
import { formatPrice, convertToNumber } from "@/app/utils/formatPrice";
import { getProducts } from "@/app/apis/getProducts";
import { Product } from "@/app/types/Product";
import { updateProductInCart } from "@/app/apis/updateProductInCart";
import { useAppDispatch, useAppSelector } from "@/app/hooks/reduxHooks";
import { showSnackbar } from "@/app/slices/snackbarSlice";
import { useRouter } from "next/navigation";

type FrequentlyBoughtProps = {
  currentProductId?: string;
};

const FrequentlyBought = ({ currentProductId }: FrequentlyBoughtProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAppSelector((state) => state.auth);

  const [allFirstPageProducts, setAllFirstPageProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [adding, setAdding] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchFirstPage = async () => {
      setLoading(true);
      try {
        const res = await getProducts({ params: { page: 1, per_page: 24 } });
        const list = res.data?.data || [];
        setAllFirstPageProducts(list.filter(Boolean));
      } catch (e) {
        console.error("Failed to load products for FrequentlyBought", e);
      } finally {
        setLoading(false);
      }
    };
    fetchFirstPage();
  }, []);

  const randomThree = useMemo(() => {
    const pool = allFirstPageProducts.filter(
      (p) => (p._id || "") !== (currentProductId || "")
    );
    if (pool.length <= 3) return pool;
    const picked: Product[] = [];
    const used = new Set<number>();
    while (picked.length < 3) {
      const idx = Math.floor(Math.random() * pool.length);
      if (!used.has(idx)) {
        used.add(idx);
        picked.push(pool[idx]);
      }
    }
    return picked;
  }, [allFirstPageProducts, currentProductId]);

  // Initialize default selection to all displayed items
  useEffect(() => {
    if (!randomThree.length) {
      setSelectedIds(new Set());
      return;
    }
    const initial = new Set<string>();
    for (let i = 0; i < randomThree.length; i += 1) {
      const id = randomThree[i]?._id || String(i);
      initial.add(id);
    }
    setSelectedIds(initial);
  }, [randomThree]);

  const selectedProducts = useMemo(() => {
    return randomThree.filter((p, idx) => selectedIds.has(p._id || String(idx)));
  }, [randomThree, selectedIds]);

  const totalPrice = useMemo(() => {
    return selectedProducts.reduce((sum, p) => {
      const price = (p.discounted_price as number) || (p.price as number) || 0;
      return sum + (typeof price === "number" ? price : 0);
    }, 0);
  }, [selectedProducts]);

  const handleAddAllToCart = async () => {
    if (!auth.user || !auth.token) {
      router.push("/login");
      return;
    }
    if (!selectedProducts.length) return;
    setAdding(true);
    try {
      await Promise.all(
        selectedProducts.map((p) =>
          updateProductInCart({
            product_id: p._id || "",
            quantity: 1,
            variant_sku: p.variants && p.variants[0]?.sku ? p.variants[0]?.sku : undefined,
            type: "product",
          })
        )
      );
      dispatch(
        showSnackbar({
          message: "Added all to cart successfully",
          type: "success",
        })
      );
    } catch (e) {
      console.error("Failed adding frequently bought items", e);
      dispatch(
        showSnackbar({
          message: "Failed to add items to cart",
          type: "error",
        })
      );
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-10 text-center">
        Frequently bought together
      </h2>

      {loading ? (
        <div className="text-center text-sm text-gray-500">Loading...</div>
      ) : !randomThree.length ? (
        <div className="text-center text-sm text-gray-500">No suggestions available</div>
      ) : (
        <div className="flex items-center justify-center mb-6 flex-col gap-6 md:flex-row md:gap-0">
          {randomThree.map((product, index) => {
            const variant = product.variants && product.variants[0];
            const imageSrc =
              (variant?.images && variant.images[0]) ||
              (product.images && product.images[0]) ||
              product.banner_image ||
              "/product-1.png";

            const displayPrice = convertToNumber(
              variant?.discounted_price ??
              variant?.price ??
              product.discounted_price ??
              product.price
            );
            const originalPrice = convertToNumber(variant?.price ?? product.price);

            const hasDiscount = originalPrice && displayPrice && displayPrice < originalPrice;
            const truncatedName = product.name && product.name.length > 100
              ? product.name.slice(0, 100) + "..."
              : product.name;

            const id = product._id || String(index);
            const isSelected = selectedIds.has(id);

            return (
            <React.Fragment key={product._id || index}>
              {index > 0 && (
                <div className="text-xl font-light text-gray-400 my-3 md:my-0 md:mx-5">+</div>
              )}
              <div className="flex flex-col items-center mx-2">
                <div className="relative mb-3">
                  <div
                    className={`${isSelected ? "bg-green-500" : "bg-gray-200"} absolute -top-2 -left-2 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer`}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    aria-label={`Toggle ${product.name}`}
                    onClick={() => {
                      setSelectedIds((prev) => {
                        const next = new Set(prev);
                        if (next.has(id)) {
                          next.delete(id);
                        } else {
                          next.add(id);
                        }
                        return next;
                      });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(id)) {
                            next.delete(id);
                          } else {
                            next.add(id);
                          }
                          return next;
                        });
                      }
                    }}
                  >
                    {isSelected && (
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
                    )}
                  </div>
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 p-1 bg-white rounded border border-gray-200 shadow-sm">
                    <img
                      src={imageSrc}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-[11px] sm:text-xs text-center font-medium max-w-[120px] md:max-w-[160px]">
                  {truncatedName}
                </h3>
                <div className="text-[11px] sm:text-xs mt-1 flex items-center gap-1">
                  <span className="font-bold">₹{formatPrice(displayPrice)}</span>
                  {hasDiscount && (
                    <span className="text-gray-400 line-through">₹{formatPrice(originalPrice)}</span>
                  )}
                </div>
              </div>
            </React.Fragment>
          );})}

          <div className="text-xl font-light text-gray-400 my-5 md:my-0 md:mx-5">=</div>

          <div className="flex flex-col items-center mx-2">
            <div className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              Total: ₹{formatPrice(totalPrice)}
            </div>
            <div className="text-[11px] sm:text-xs text-gray-500 mb-3">
              For {selectedProducts.length} Items
            </div>
            <button
              onClick={handleAddAllToCart}
              disabled={adding}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-2 px-5 rounded text-sm transition-colors w-full sm:w-auto"
            >
              {adding ? "Adding..." : "Add All to Cart"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrequentlyBought;
