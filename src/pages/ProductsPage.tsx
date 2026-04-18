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
  const categoryParam = searchParams.get("category") as "soap" | "candle" | "gift_set" | undefined;
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam || "");
  const [page, setPage] = useState(1);

  const { data, isLoading } = trpc.product.list.useQuery({
    category: activeCategory as "soap" | "candle" | "gift_set" | undefined,
    page,
    limit: 12,
  });

  const { addToCart } = useCart();

  function handleCategoryChange(cat: string) {
    setActiveCategory(cat);
    setPage(1);
    if (cat) {
      setSearchParams({ category: cat });
    } else {
      setSearchParams({});
    }
  }

  const products = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen" style={{ background: "#FFF8F0", paddingTop: 80 }}>
      {/* Page Header */}
      <div
        className="py-20 px-[5vw] text-center"
        style={{ background: "linear-gradient(135deg, #1B4332 0%, #2D5A3D 100%)" }}
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
          Discover our full range of handcrafted Thai soaps, aromatic candles, and curated gift sets.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="py-8 px-[5vw] border-b border-[#F5F5F0]">
        <div className="max-w-[1400px] mx-auto flex items-center gap-6 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`text-[13px] uppercase tracking-[0.1em] whitespace-nowrap pb-2 border-b-2 transition-all ${
                activeCategory === cat.value
                  ? "text-[#FFF8F0] border-[#FFF8F0]"
                  : "text-[#FFF8F0]/60 border-transparent hover:text-[#FFF8F0]"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="py-16 px-[5vw]">
        <div className="max-w-[1400px] mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-[#F5F5F0] rounded-lg mb-4" />
                  <div className="h-4 bg-[#F5F5F0] rounded w-1/3 mb-2" />
                  <div className="h-5 bg-[#F5F5F0] rounded w-2/3 mb-2" />
                  <div className="h-4 bg-[#F5F5F0] rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#5C3D2E]/60 text-[16px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                No products found in this category.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <div key={product.id} className="group">
                    <Link to={`/products/${product.id}`} className="block">
                      <div className="relative overflow-hidden rounded-lg aspect-[3/4] mb-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span
                              className="text-[#FFF8F0] text-[12px] uppercase tracking-[0.1em]"
                              style={{ fontFamily: "'Montserrat', sans-serif" }}
                            >
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                    <p
                      className="text-[#1B4332] text-[11px] uppercase tracking-[0.15em] mb-1"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {product.category}
                    </p>
                    <Link to={`/products/${product.id}`}>
                      <h3
                        className="text-[#5C3D2E] text-[18px] mb-1 group-hover:text-[#1B4332] transition-colors"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {product.name}
                      </h3>
                    </Link>
                    <p
                      className="text-[#5C3D2E]/70 text-[14px] mb-3 line-clamp-2"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {product.shortDesc || product.description.slice(0, 80)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <p
                        className="text-[#5C3D2E] text-[16px]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        ${(product.price / 100).toFixed(2)}
                      </p>
                      <button
                        onClick={() => addToCart(product.id)}
                        disabled={!product.inStock}
                        className="px-4 py-2 bg-[#1B4332] text-[#FFF8F0] text-[12px] uppercase tracking-[0.05em] rounded hover:bg-[#5C3D2E] transition-colors disabled:opacity-30 flex items-center gap-2"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <ShoppingBag size={14} />
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-10 h-10 flex items-center justify-center rounded border border-[#F5F5F0] text-[#5C3D2E] hover:bg-[#1B4332] hover:text-[#FFF8F0] hover:border-[#1B4332] transition-colors disabled:opacity-30"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 flex items-center justify-center rounded text-[14px] transition-colors ${
                        page === i + 1
                          ? "bg-[#1B4332] text-[#FFF8F0]"
                          : "border border-[#F5F5F0] text-[#5C3D2E] hover:bg-[#1B4332] hover:text-[#FFF8F0]"
                      }`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded border border-[#F5F5F0] text-[#5C3D2E] hover:bg-[#1B4332] hover:text-[#FFF8F0] hover:border-[#1B4332] transition-colors disabled:opacity-30"
                  >
                    <ChevronRight size={18} />
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
