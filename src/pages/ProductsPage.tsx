import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { trpc } from "@/trpc/client";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  { value: "", label: "All" },
  { value: "soap", label: "Soaps" },
  { value: "candle", label: "Candles" },
  { value: "gift_set", label: "Gift Sets" },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get("category") as
    | "soap"
    | "candle"
    | "gift_set"
    | null;

  const [activeCategory, setActiveCategory] = useState<
    "soap" | "candle" | "gift_set" | undefined
  >(categoryParam || undefined);

  const [page, setPage] = useState(1);

  const { data, isLoading } = trpc.product.list.useQuery({
    category: activeCategory,
    page,
    limit: 12,
  });

  const { addToCart } = useCart();

  function handleCategoryChange(cat: string) {
    const value =
      cat === "" ? undefined : (cat as "soap" | "candle" | "gift_set");

    setActiveCategory(value);
    setPage(1);

    if (value) {
      setSearchParams({ category: value });
    } else {
      setSearchParams({});
    }
  }

  // ✅ FINAL FIX (IMPORTANT)
  const apiData = (data as any)?.result?.data || data;

  const products = apiData?.items || [];
  const totalPages = apiData?.totalPages || 1;

  return (
    <div
      className="min-h-screen"
      style={{ background: "#FFF8F0", paddingTop: 80 }}
    >
      {/* Header */}
      <div
        className="py-20 px-[5vw] text-center"
        style={{
          background:
            "linear-gradient(135deg, #1B4332 0%, #2D5A3D 100%)",
        }}
      >
        <h1
          className="text-[#FFF8F0]"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(36px, 4vw, 64px)",
          }}
        >
          Botanical Collection
        </h1>
        <p
          className="text-[#FFF8F0]/70 text-[16px] mt-4 max-w-xl mx-auto"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Discover our full range of handcrafted Thai soaps, aromatic candles,
          and curated gift sets.
        </p>
      </div>

      {/* Filters */}
      <div className="py-8 px-[5vw] border-b border-[#F5F5F0]">
        <div className="max-w-[1400px] mx-auto flex gap-6 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`text-[13px] uppercase tracking-[0.1em] pb-2 border-b-2 ${
                activeCategory === cat.value ||
                (!activeCategory && cat.value === "")
                  ? "text-[#1B4332] border-[#1B4332]"
                  : "text-[#5C3D2E]/60 border-transparent"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="py-16 px-[5vw]">
        <div className="max-w-[1400px] mx-auto">
          {isLoading ? (
            <p>Loading...</p>
          ) : products.length === 0 ? (
            <p className="text-center">No products found.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product: any) => (
                  <div key={product.id}>
                    {/* ✅ FIXED LINK SYNTAX */}
                    <Link to={/products/${product.id}}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-[250px] object-cover rounded"
                      />
                    </Link>

                    <h3 className="mt-2">{product.name}</h3>

                    <p>${(product.price / 100).toFixed(2)}</p>

                    <button
                      onClick={() => addToCart(product.id)}
                      className="mt-2 bg-[#1B4332] text-white px-3 py-1 flex items-center gap-2"
                    >
                      <ShoppingBag size={14} /> Add
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-10 gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft />
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)}>
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setPage((p) => Math.min(totalPages, p + 1))
                    }
                  >
                    <ChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
