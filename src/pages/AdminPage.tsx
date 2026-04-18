import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "@/trpc/client";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  ShoppingCart,
  MessageSquare,
  Package,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Box,
} from "lucide-react";

type Tab = "overview" | "orders" | "messages" | "products";

export default function AdminPage() {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/");
    }
  }, [authLoading, isAdmin, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFF8F0" }}>
        <div className="animate-pulse text-[#5C3D2E]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex" style={{ background: "#FFF8F0", paddingTop: 80 }}>
      {/* Sidebar */}
      <aside className="w-64 bg-[#1B4332] flex-shrink-0 hidden lg:block">
        <div className="p-6">
          <h2
            className="text-[#FFF8F0] text-[18px] tracking-[0.05em] mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Admin Dashboard
          </h2>
          <nav className="space-y-2">
            <SidebarButton tab="overview" active={activeTab} setTab={setActiveTab} icon={<LayoutDashboard size={18} />} label="Overview" />
            <SidebarButton tab="orders" active={activeTab} setTab={setActiveTab} icon={<ShoppingCart size={18} />} label="Orders" />
            <SidebarButton tab="messages" active={activeTab} setTab={setActiveTab} icon={<MessageSquare size={18} />} label="Messages" />
            <SidebarButton tab="products" active={activeTab} setTab={setActiveTab} icon={<Package size={18} />} label="Products" />
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 w-64 p-6 border-t border-[#FFF8F0]/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C9A227] flex items-center justify-center text-[#5C3D2E] text-[12px] font-bold">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="text-[#FFF8F0] text-[13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{user?.name}</p>
              <p className="text-[#FFF8F0]/50 text-[11px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Tabs */}
      <div className="lg:hidden fixed top-20 left-0 right-0 bg-[#1B4332] z-40 flex overflow-x-auto">
        {(["overview", "orders", "messages", "products"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-[12px] uppercase tracking-[0.1em] whitespace-nowrap ${
              activeTab === tab ? "text-[#C9A227]" : "text-[#FFF8F0]/60"
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-auto">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "messages" && <MessagesTab />}
        {activeTab === "products" && <ProductsTab />}
      </main>
    </div>
  );
}

function SidebarButton({
  tab,
  active,
  setTab,
  icon,
  label,
}: {
  tab: Tab;
  active: Tab;
  setTab: (t: Tab) => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={() => setTab(tab)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] transition-colors ${
        active === tab
          ? "bg-[#FFF8F0]/10 text-[#FFF8F0]"
          : "text-[#FFF8F0]/60 hover:text-[#FFF8F0] hover:bg-[#FFF8F0]/5"
      }`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {icon}
      {label}
    </button>
  );
}

/* ─── Overview Tab ─── */
function OverviewTab() {
  const { data: ordersData } = trpc.order.list.useQuery({ page: 1, limit: 100 }, { retry: false });
  const { data: messagesData } = trpc.contact.list.useQuery({ page: 1, limit: 100 }, { retry: false });
  const { data: productsData } = trpc.product.list.useQuery({ page: 1, limit: 100 });

  const orders = ordersData?.items || [];
  const messages = messagesData?.items || [];
  const products = productsData?.items || [];

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const totalProducts = products.length;
  const totalMessages = messages.length;

  const stats = [
    { label: "Total Revenue", value: `$${(totalRevenue / 100).toFixed(2)}`, icon: <DollarSign size={20} />, change: "+12%" },
    { label: "Pending Orders", value: String(pendingOrders), icon: <ShoppingCart size={20} />, change: "Active" },
    { label: "Products", value: String(totalProducts), icon: <Box size={20} />, change: "In stock" },
    { label: "Messages", value: String(totalMessages), icon: <MessageSquare size={20} />, change: "New" },
  ];

  return (
    <div>
      <h2 className="text-[#5C3D2E] text-[28px] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg border border-[#F5F5F0]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#1B4332]/10 flex items-center justify-center text-[#1B4332]">
                {stat.icon}
              </div>
              <span
                className="text-[#1B4332] text-[11px] uppercase tracking-[0.1em] bg-[#1B4332]/5 px-2 py-1 rounded"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {stat.change}
              </span>
            </div>
            <p className="text-[#5C3D2E] text-[28px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {stat.value}
            </p>
            <p className="text-[#5C3D2E]/50 text-[12px] uppercase tracking-[0.1em] mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg border border-[#F5F5F0] overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-[#F5F5F0] flex items-center justify-between">
          <h3 className="text-[#5C3D2E] text-[18px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Recent Orders
          </h3>
          <TrendingUp size={16} className="text-[#1B4332]" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F5F5F0]">
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Order</th>
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Customer</th>
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Total</th>
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-[#F5F5F0] hover:bg-[#F5F5F0]/50 transition-colors">
                  <td className="px-6 py-4 text-[#5C3D2E] text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 text-[#5C3D2E] text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 text-[#5C3D2E] text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    ${(order.total / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[#5C3D2E]/50 text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-lg border border-[#F5F5F0] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F5F5F0] flex items-center justify-between">
          <h3 className="text-[#5C3D2E] text-[18px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Recent Messages
          </h3>
          <MessageSquare size={16} className="text-[#1B4332]" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F5F5F0]">
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Name</th>
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Subject</th>
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Preview</th>
              </tr>
            </thead>
            <tbody>
              {messages.slice(0, 5).map((msg) => (
                <tr key={msg.id} className="border-b border-[#F5F5F0] hover:bg-[#F5F5F0]/50 transition-colors">
                  <td className="px-6 py-4 text-[#5C3D2E] text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {msg.name}
                  </td>
                  <td className="px-6 py-4 text-[#5C3D2E] text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {msg.subject || "—"}
                  </td>
                  <td className="px-6 py-4 text-[#5C3D2E]/70 text-[14px] truncate max-w-[300px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {msg.message}
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-[#5C3D2E]/50 text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    No messages yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Orders Tab ─── */
function OrdersTab() {
  const [page, setPage] = useState(1);
  const { data } = trpc.order.list.useQuery({ page, limit: 20 });
  const utils = trpc.useUtils();
  const updateStatus = trpc.order.updateStatus.useMutation({
    onSuccess: () => utils.order.list.invalidate(),
  });

  const orders = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div>
      <h2 className="text-[#5C3D2E] text-[28px] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Orders
      </h2>

      <div className="bg-white rounded-lg border border-[#F5F5F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F5F5F0] bg-[#F5F5F0]/50">
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>ID</th>
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Customer</th>
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Items</th>
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Total</th>
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Status</th>
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Date</th>
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const items = JSON.parse(order.items) as Array<{ name: string; quantity: number }>;
                return (
                  <tr key={order.id} className="border-b border-[#F5F5F0] hover:bg-[#F5F5F0]/50 transition-colors">
                    <td className="px-6 py-4 text-[#5C3D2E] text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      #{order.id}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[#5C3D2E] text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{order.customerName}</p>
                      <p className="text-[#5C3D2E]/50 text-[12px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{order.customerEmail}</p>
                    </td>
                    <td className="px-6 py-4 text-[#5C3D2E]/70 text-[13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                    </td>
                    <td className="px-6 py-4 text-[#C9A227] text-[14px] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      ${(order.total / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-[#5C3D2E]/50 text-[13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus.mutate({
                            id: order.id,
                            status: e.target.value as "pending" | "processing" | "shipped" | "delivered" | "cancelled",
                          })
                        }
                        className="text-[13px] border border-[#F5F5F0] rounded px-2 py-1 bg-white text-[#5C3D2E] focus:border-[#1B4332] focus:outline-none"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#5C3D2E]/50 text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-[#F5F5F0]">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded border border-[#F5F5F0] text-[#5C3D2E] disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[#5C3D2E] text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded border border-[#F5F5F0] text-[#5C3D2E] disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Messages Tab ─── */
function MessagesTab() {
  const [page, setPage] = useState(1);
  const { data } = trpc.contact.list.useQuery({ page, limit: 20 });
  const utils = trpc.useUtils();
  const deleteMutation = trpc.contact.delete.useMutation({
    onSuccess: () => utils.contact.list.invalidate(),
  });

  const messages = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div>
      <h2 className="text-[#5C3D2E] text-[28px] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Contact Messages
      </h2>

      <div className="bg-white rounded-lg border border-[#F5F5F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F5F5F0] bg-[#F5F5F0]/50">
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Name</th>
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Email</th>
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Subject</th>
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Message</th>
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Date</th>
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id} className="border-b border-[#F5F5F0] hover:bg-[#F5F5F0]/50 transition-colors">
                  <td className="px-6 py-4 text-[#5C3D2E] text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {msg.name}
                  </td>
                  <td className="px-6 py-4 text-[#5C3D2E]/70 text-[13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {msg.email}
                  </td>
                  <td className="px-6 py-4 text-[#5C3D2E] text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {msg.subject || "—"}
                  </td>
                  <td className="px-6 py-4 text-[#5C3D2E]/70 text-[14px] max-w-[300px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {msg.message}
                  </td>
                  <td className="px-6 py-4 text-[#5C3D2E]/50 text-[13px] whitespace-nowrap" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        if (confirm("Delete this message?")) {
                          deleteMutation.mutate({ id: msg.id });
                        }
                      }}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#5C3D2E]/50 text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    No messages found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-[#F5F5F0]">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded border border-[#F5F5F0] text-[#5C3D2E] disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[#5C3D2E] text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded border border-[#F5F5F0] text-[#5C3D2E] disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Products Tab ─── */
function ProductsTab() {
  const { data } = trpc.product.list.useQuery({ page: 1, limit: 100 });
  const utils = trpc.useUtils();
  const seedMutation = trpc.product.seed.useMutation({
    onSuccess: () => {
      utils.product.list.invalidate();
      alert("Products seeded successfully!");
    },
  });

  const products = data?.items || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[#5C3D2E] text-[28px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Products
        </h2>
        {products.length === 0 && (
          <button
            onClick={() => seedMutation.mutate()}
            disabled={seedMutation.isPending}
            className="px-6 py-3 bg-[#1B4332] text-[#FFF8F0] rounded text-[13px] uppercase tracking-[0.1em] hover:bg-[#5C3D2E] transition-colors disabled:opacity-50"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {seedMutation.isPending ? "Seeding..." : "Seed Products"}
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg border border-[#F5F5F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F5F5F0] bg-[#F5F5F0]/50">
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Image</th>
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Name</th>
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Category</th>
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Price</th>
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Stock</th>
                <th className="text-left px-6 py-3 text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Featured</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-[#F5F5F0] hover:bg-[#F5F5F0]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#5C3D2E] text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {product.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] uppercase tracking-[0.1em] bg-[#1B4332]/10 text-[#1B4332] px-2 py-1 rounded" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#C9A227] text-[14px] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    ${(product.price / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[12px] ${product.inStock ? "text-green-600" : "text-red-500"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[12px] ${product.featured ? "text-[#C9A227]" : "text-[#5C3D2E]/30"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {product.featured ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#5C3D2E]/50 text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    No products found. Click "Seed Products" to add the collection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`text-[11px] uppercase tracking-[0.1em] px-2 py-1 rounded ${colors[status] || "bg-gray-100 text-gray-700"}`}
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {status}
    </span>
  );
}
