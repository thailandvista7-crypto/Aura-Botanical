import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  const shipping = total > 5000 ? 0 : 599;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#FFF8F0", paddingTop: 80 }}>
        <ShoppingBag size={64} className="text-[#5C3D2E]/20 mb-6" />
        <h1
          className="text-[#5C3D2E] text-[32px] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Your Bag is Empty
        </h1>
        <p
          className="text-[#5C3D2E]/60 text-[16px] mb-8"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Discover our botanical collection and find your perfect match.
        </p>
        <Link
          to="/products"
          className="px-8 py-4 bg-[#1B4332] text-[#FFF8F0] rounded text-[13px] uppercase tracking-[0.1em] hover:bg-[#5C3D2E] transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Shop Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#FFF8F0", paddingTop: 80 }}>
      <div className="py-12 px-[5vw]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1
                className="text-[#5C3D2E]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(32px, 3vw, 48px)",
                }}
              >
                Your Bag
              </h1>
              <p
                className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.15em] mt-2"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 pb-6 border-b border-[#F5F5F0]"
                >
                  <Link to={`/products/${item.productId}`} className="flex-shrink-0">
                    <div className="w-[120px] h-[150px] rounded-lg overflow-hidden">
                      <img
                        src={item.product?.image || ""}
                        alt={item.product?.name || ""}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/products/${item.productId}`}>
                        <h3
                          className="text-[#5C3D2E] text-[18px] hover:text-[#1B4332] transition-colors"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          {item.product?.name}
                        </h3>
                      </Link>
                      <p
                        className="text-[#5C3D2E]/50 text-[14px] mt-1"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        ${((item.product?.price || 0) / 100).toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-[#5C3D2E]/20 rounded">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center text-[#5C3D2E] hover:bg-[#F5F5F0] transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span
                          className="w-10 h-8 flex items-center justify-center text-[#5C3D2E] text-[14px] border-x border-[#5C3D2E]/20"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#5C3D2E] hover:bg-[#F5F5F0] transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <p
                          className="text-[#5C3D2E] text-[18px]"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          ${(((item.product?.price || 0) * item.quantity) / 100).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#5C3D2E]/40 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#F5F5F0] p-8 rounded-lg sticky top-24">
                <h3
                  className="text-[#5C3D2E] text-[18px] mb-6"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Order Summary
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#5C3D2E]/70 text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Subtotal
                    </span>
                    <span className="text-[#5C3D2E] text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      ${(total / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5C3D2E]/70 text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Shipping
                    </span>
                    <span className="text-[#5C3D2E] text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {shipping === 0 ? "Free" : `$${(shipping / 100).toFixed(2)}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[#1B4332] text-[12px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Add ${((5000 - total) / 100).toFixed(2)} more for free shipping
                    </p>
                  )}
                  <div className="border-t border-[#5C3D2E]/10 pt-4">
                    <div className="flex justify-between">
                      <span
                        className="text-[#5C3D2E] text-[18px]"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        Total
                      </span>
                      <span
                        className="text-[#5C3D2E] text-[24px]"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        ${(grandTotal / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full h-14 bg-[#1B4332] text-[#FFF8F0] rounded text-[13px] uppercase tracking-[0.1em] hover:bg-[#5C3D2E] transition-colors flex items-center justify-center gap-2"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </button>
                <Link
                  to="/products"
                  className="block text-center mt-4 text-[#5C3D2E]/60 text-[13px] hover:text-[#1B4332] transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
