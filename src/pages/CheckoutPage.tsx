import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "@/trpc/client";
import { useCart } from "@/hooks/useCart";
import { Check, Truck, CreditCard } from "lucide-react";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, sessionId, clearCart } = useCart();
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    shippingAddress: "",
    city: "",
    postalCode: "",
    country: "Thailand",
  });
  const [placed, setPlaced] = useState(false);

  const orderMutation = trpc.order.create.useMutation({
    onSuccess: () => {
      setPlaced(true);
      clearCart();
    },
  });

  const shipping = total > 5000 ? 0 : 599;
  const grandTotal = total + shipping;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    orderMutation.mutate({
      sessionId,
      ...form,
    });
  }

  if (placed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFF8F0", paddingTop: 80 }}>
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 rounded-full bg-[#1B4332] flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-[#C9A227]" />
          </div>
          <h1
            className="text-[#5C3D2E] text-[36px] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Order Confirmed
          </h1>
          <p
            className="text-[#5C3D2E]/70 text-[16px] mb-8"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Thank you for your order! We've sent a confirmation to your email. Your botanical luxuries will be crafted and shipped soon.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-4 bg-[#1B4332] text-[#FFF8F0] rounded text-[13px] uppercase tracking-[0.1em] hover:bg-[#5C3D2E] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !placed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFF8F0", paddingTop: 80 }}>
        <p className="text-[#5C3D2E]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Your bag is empty. <button onClick={() => navigate("/products")} className="text-[#1B4332] underline">Continue shopping</button>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#FFF8F0", paddingTop: 80 }}>
      <div className="py-12 px-[5vw]">
        <div className="max-w-[1400px] mx-auto">
          <h1
            className="text-[#5C3D2E] mb-12"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(32px, 3vw, 48px)",
            }}
          >
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Forms */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Shipping */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Truck size={20} className="text-[#1B4332]" />
                    <h3
                      className="text-[#5C3D2E] text-[20px]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      Shipping Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em] block mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={form.customerName}
                        onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                        className="w-full h-12 px-4 border border-[#F5F5F0] rounded bg-white text-[#5C3D2E] focus:border-[#1B4332] focus:outline-none focus:ring-1 focus:ring-[#1B4332]/20 transition-all"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em] block mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={form.customerEmail}
                        onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                        className="w-full h-12 px-4 border border-[#F5F5F0] rounded bg-white text-[#5C3D2E] focus:border-[#1B4332] focus:outline-none focus:ring-1 focus:ring-[#1B4332]/20 transition-all"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em] block mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Address
                      </label>
                      <input
                        type="text"
                        required
                        value={form.shippingAddress}
                        onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                        className="w-full h-12 px-4 border border-[#F5F5F0] rounded bg-white text-[#5C3D2E] focus:border-[#1B4332] focus:outline-none focus:ring-1 focus:ring-[#1B4332]/20 transition-all"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </div>
                    <div>
                      <label className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em] block mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full h-12 px-4 border border-[#F5F5F0] rounded bg-white text-[#5C3D2E] focus:border-[#1B4332] focus:outline-none focus:ring-1 focus:ring-[#1B4332]/20 transition-all"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </div>
                    <div>
                      <label className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em] block mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Postal Code
                      </label>
                      <input
                        type="text"
                        required
                        value={form.postalCode}
                        onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                        className="w-full h-12 px-4 border border-[#F5F5F0] rounded bg-white text-[#5C3D2E] focus:border-[#1B4332] focus:outline-none focus:ring-1 focus:ring-[#1B4332]/20 transition-all"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em] block mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Country
                      </label>
                      <select
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        className="w-full h-12 px-4 border border-[#F5F5F0] rounded bg-white text-[#5C3D2E] focus:border-[#1B4332] focus:outline-none focus:ring-1 focus:ring-[#1B4332]/20 transition-all"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <option>Thailand</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Australia</option>
                        <option>Japan</option>
                        <option>Singapore</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard size={20} className="text-[#1B4332]" />
                    <h3
                      className="text-[#5C3D2E] text-[20px]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      Payment Method
                    </h3>
                  </div>
                  <div className="bg-[#F5F5F0] p-6 rounded-lg text-center">
                    <p className="text-[#5C3D2E]/60 text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      This is a demo store. No real payment will be processed.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={orderMutation.isPending}
                  className="w-full h-14 bg-[#C9A227] text-[#5C3D2E] rounded text-[13px] uppercase tracking-[0.1em] hover:brightness-110 transition-all disabled:opacity-50"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {orderMutation.isPending ? "Processing..." : `Place Order — $${(grandTotal / 100).toFixed(2)}`}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-[#F5F5F0] p-8 rounded-lg sticky top-24">
                <h3
                  className="text-[#5C3D2E] text-[18px] mb-6"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Your Order
                </h3>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.product?.image || ""}
                          alt={item.product?.name || ""}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#5C3D2E] text-[14px] truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {item.product?.name}
                        </p>
                        <p className="text-[#5C3D2E]/50 text-[12px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-[#5C3D2E] text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        ${(((item.product?.price || 0) * item.quantity) / 100).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#5C3D2E]/10 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#5C3D2E]/70 text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Subtotal</span>
                    <span className="text-[#5C3D2E] text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>${(total / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5C3D2E]/70 text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Shipping</span>
                    <span className="text-[#5C3D2E] text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {shipping === 0 ? "Free" : `$${(shipping / 100).toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-[#5C3D2E]/10 pt-2 flex justify-between">
                    <span className="text-[#5C3D2E] text-[18px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Total</span>
                    <span className="text-[#5C3D2E] text-[24px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>${(grandTotal / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
