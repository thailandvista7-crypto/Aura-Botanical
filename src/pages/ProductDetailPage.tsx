import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { trpc } from "@/trpc/client";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag, Minus, Plus, ArrowLeft, Star, Truck, Leaf, Heart } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "0");
  const { data: product, isLoading } = trpc.product.getById.useQuery({ id: productId });
  const { data: featured } = trpc.product.featured.useQuery();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const relatedProducts = (featured || []).filter((p) => p.id !== productId).slice(0, 6);

  function handleAddToCart() {
    if (!product) return;
    addToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFF8F0" }}>
        <div className="animate-pulse text-[#5C3D2E]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFF8F0" }}>
        <p className="text-[#5C3D2E]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#FFF8F0", paddingTop: 80 }}>
      {/* Breadcrumb */}
      <div className="py-6 px-[5vw] border-b border-[#F5F5F0]">
        <div className="max-w-[1400px] mx-auto">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-[#5C3D2E]/60 text-[13px] hover:text-[#1B4332] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <ArrowLeft size={16} />
            Back to Collection
          </Link>
        </div>
      </div>

      {/* Product Detail */}
      <div className="py-12 px-[5vw]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Gallery */}
          <div className="lg:col-span-3">
            <div className="rounded-lg overflow-hidden aspect-[4/5] mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto">
              {[product.image, ...(product.images ? JSON.parse(product.images) : [])].map((img: string, i: number) => (
                <div
                  key={i}
                  className={`w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                    i === 0 ? "border-[#1B4332]" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-2">
            <p
              className="text-[#1B4332] text-[11px] uppercase tracking-[0.15em] mb-2"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {product.category}
            </p>
            <h1
              className="text-[#5C3D2E] mb-2"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(32px, 3vw, 48px)",
              }}
            >
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mb-4">
              <p
                className="text-[#C9A227] text-[24px]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                ${(product.price / 100).toFixed(2)}
              </p>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} className="text-[#C9A227] fill-[#C9A227]" />
                ))}
              </div>
              <span className="text-[#5C3D2E]/50 text-[12px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                (24 reviews)
              </span>
            </div>

            <p
              className="text-[#5C3D2E]/80 text-[16px] leading-relaxed mb-6"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {product.description}
            </p>

            {product.ingredients && (
              <div className="mb-6">
                <h4
                  className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em] mb-2"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Key Ingredients
                </h4>
                <p className="text-[#5C3D2E]/80 text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {product.ingredients}
                </p>
              </div>
            )}

            <div className="flex gap-6 mb-8">
              {product.weight && (
                <div className="flex items-center gap-2 text-[#5C3D2E]/60 text-[13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <Leaf size={16} className="text-[#1B4332]" />
                  {product.weight}
                </div>
              )}
              {product.burnTime && (
                <div className="flex items-center gap-2 text-[#5C3D2E]/60 text-[13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <Heart size={16} className="text-[#1B4332]" />
                  {product.burnTime}
                </div>
              )}
              {product.scent && (
                <div className="flex items-center gap-2 text-[#5C3D2E]/60 text-[13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <Truck size={16} className="text-[#1B4332]" />
                  {product.scent}
                </div>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span
                  className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Quantity
                </span>
                <div className="flex items-center border border-[#5C3D2E]/20 rounded">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#5C3D2E] hover:bg-[#F5F5F0] transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span
                    className="w-12 h-10 flex items-center justify-center text-[#5C3D2E] text-[16px] border-x border-[#5C3D2E]/20"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-[#5C3D2E] hover:bg-[#F5F5F0] transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full h-14 rounded text-[13px] uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-2 ${
                  added
                    ? "bg-[#C9A227] text-[#5C3D2E]"
                    : "bg-[#1B4332] text-[#FFF8F0] hover:bg-[#5C3D2E]"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <ShoppingBag size={18} />
                {added ? "Added to Bag!" : "Add to Bag"}
              </button>

              <p
                className="text-center text-[#5C3D2E]/50 text-[12px]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Free shipping on orders over $50
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like */}
      {relatedProducts.length > 0 && (
        <div className="py-16 px-[5vw] border-t border-[#F5F5F0]">
          <div className="max-w-[1400px] mx-auto">
            <h3
              className="text-[#5C3D2E] text-[24px] mb-8"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              You May Also Like
            </h3>
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/products/${rp.id}`}
                  className="flex-shrink-0 w-[240px] snap-start group"
                >
                  <div className="rounded-lg overflow-hidden aspect-[3/4] mb-3">
                    <img
                      src={rp.image}
                      alt={rp.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p
                    className="text-[#1B4332] text-[10px] uppercase tracking-[0.15em]"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {rp.category}
                  </p>
                  <p
                    className="text-[#5C3D2E] text-[16px] group-hover:text-[#1B4332] transition-colors"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {rp.name}
                  </p>
                  <p
                    className="text-[#5C3D2E]/70 text-[14px]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    ${(rp.price / 100).toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
