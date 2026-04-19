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

  const products = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="min-h-screen" style={{ background: "#FFF8F0", paddingTop: 80 }}>
      {/* Header */}
      <div
        className="py-20 px-[5vw] text-center"
        style={{
          background: "linear-gradient(135deg, #1B4332 0%, #2D5A3D 100%)",
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
        <p className="text-[#FFF8F0]/70 mt-4">
          Discover our handcrafted Thai products.
        </p>
      </div>

      {/* Filters */}
      <div className="py-6 px-[5vw]">
        <div className="flex gap-4">
          {categories.map((cat) => (
            <button key={cat.value} onClick={() => handleCategoryChange(cat.value)}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="px-[5vw] pb-16">
        {isLoading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products found</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <div key={product.id}>
                {/* ✅ FIXED LINK */}
                <Link to={/products/${product.id}}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[200px] object-cover"
                  />
                </Link>

                <h3>{product.name}</h3>
                <p>${(product.price / 100).toFixed(2)}</p>

                <button onClick={() => addToCart(product.id)}>
                  <ShoppingBag size={14} /> Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pb-10">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))}>
            <ChevronLeft />
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}>
              {i + 1}
            </button>
          ))}

          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
