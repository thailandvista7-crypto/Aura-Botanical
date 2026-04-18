import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { trpc } from "@/trpc/client";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Menu, X, ShoppingBag, User, Search, LogOut } from "lucide-react";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === "/";

  return (
    <>
      <nav
        className={`liquid-glass fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "liquid-glass-scrolled" : ""
        }`}
        style={{ height: 80 }}
      >
        <div className="flex items-center justify-between h-full px-[5vw] max-w-[1400px] mx-auto">
          {/* Logo */}
          <Link
            to="/"
            className="font-serif text-[22px] tracking-[0.05em] text-[#5C3D2E] hover:opacity-80 transition-opacity"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Aura Botanicals
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/products"
              className="nav-link text-[13px] uppercase tracking-[0.1em] text-[#5C3D2E] opacity-80 hover:opacity-100 transition-opacity"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Shop
            </Link>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                if (isHome) {
                  document.getElementById("philosophy")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.location.href = "/#philosophy";
                }
              }}
              className="nav-link text-[13px] uppercase tracking-[0.1em] text-[#5C3D2E] opacity-80 hover:opacity-100 transition-opacity"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Our Story
            </a>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                if (isHome) {
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.location.href = "/#contact";
                }
              }}
              className="nav-link text-[13px] uppercase tracking-[0.1em] text-[#5C3D2E] opacity-80 hover:opacity-100 transition-opacity"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Contact
            </a>
            {isAdmin && (
              <Link
                to="/admin"
                className="nav-link text-[13px] uppercase tracking-[0.1em] text-[#1B4332] hover:opacity-100 transition-opacity"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button className="hidden md:block text-[#5C3D2E] opacity-70 hover:opacity-100 transition-opacity">
              <Search size={20} />
            </button>
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-[13px] text-[#5C3D2E] opacity-80" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="text-[#5C3D2E] opacity-60 hover:opacity-100 transition-opacity"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  const modal = document.getElementById("auth-modal");
                  if (modal) modal.classList.remove("hidden");
                }}
                className="hidden md:block text-[#5C3D2E] opacity-70 hover:opacity-100 transition-opacity"
              >
                <User size={20} />
              </button>
            )}
            <Link
              to="/cart"
              className="relative text-[#5C3D2E] opacity-70 hover:opacity-100 transition-opacity"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#1B4332] text-[#FFF8F0] text-[10px] w-5 h-5 rounded-full flex items-center justify-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-[#5C3D2E]"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8" style={{ background: "rgba(27, 67, 50, 0.95)" }}>
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-[#FFF8F0]"
          >
            <X size={28} />
          </button>
          <Link
            to="/"
            className="text-[#FFF8F0] text-[32px] hover:opacity-80 transition-opacity"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Home
          </Link>
          <Link
            to="/products"
            className="text-[#FFF8F0] text-[32px] hover:opacity-80 transition-opacity"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Shop
          </Link>
          <Link
            to="/cart"
            className="text-[#FFF8F0] text-[32px] hover:opacity-80 transition-opacity"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Cart ({itemCount})
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="text-[#FFF8F0] text-[32px] hover:opacity-80 transition-opacity"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Admin
            </Link>
          )}
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="text-[#FFF8F0] text-[18px] uppercase tracking-[0.1em] mt-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                const modal = document.getElementById("auth-modal");
                if (modal) modal.classList.remove("hidden");
              }}
              className="text-[#FFF8F0] text-[18px] uppercase tracking-[0.1em] mt-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Sign In
            </button>
          )}
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal />
    </>
  );
}

function AuthModal() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  const loginMutation = trpc.auth.localLogin.useMutation({
    onSuccess: () => {
      closeModal();
      window.location.reload();
    },
    onError: (err: { message: string }) => setError(err.message),
  });

  const registerMutation = trpc.auth.localRegister.useMutation({
    onSuccess: () => {
      closeModal();
      window.location.reload();
    },
    onError: (err: { message: string }) => setError(err.message),
  });

  function closeModal() {
    const modal = document.getElementById("auth-modal");
    if (modal) {
      modal.classList.add("hidden");
      setError("");
      setUsername("");
      setPassword("");
      setDisplayName("");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (mode === "login") {
      loginMutation.mutate({ username, password });
    } else {
      registerMutation.mutate({ username, password, displayName: displayName || undefined });
    }
  }

  function handleGoogleAuth() {
    window.location.href = "/api/auth/google";
  }

  return (
    <div
      id="auth-modal"
      className="hidden fixed inset-0 z-[70] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="bg-[#FFF8F0] rounded-lg p-8 w-full max-w-md mx-4 relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-[#5C3D2E] hover:opacity-70"
        >
          <X size={20} />
        </button>

        <h2
          className="text-[28px] text-[#5C3D2E] mb-6 text-center"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full h-12 px-4 border border-[#F5F5F0] rounded bg-transparent text-[#5C3D2E] placeholder:text-[#5C3D2E]/40 focus:border-[#1B4332] focus:outline-none transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
          )}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full h-12 px-4 border border-[#F5F5F0] rounded bg-transparent text-[#5C3D2E] placeholder:text-[#5C3D2E]/40 focus:border-[#1B4332] focus:outline-none transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full h-12 px-4 border border-[#F5F5F0] rounded bg-transparent text-[#5C3D2E] placeholder:text-[#5C3D2E]/40 focus:border-[#1B4332] focus:outline-none transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />

          {error && (
            <p className="text-red-600 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending || registerMutation.isPending}
            className="w-full h-12 bg-[#1B4332] text-[#FFF8F0] rounded uppercase text-[13px] tracking-[0.1em] hover:bg-[#5C3D2E] transition-colors disabled:opacity-50"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#F5F5F0]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#FFF8F0] text-[#5C3D2E]/50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              or
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleAuth}
          className="w-full h-12 border border-[#F5F5F0] rounded text-[#5C3D2E] text-[13px] tracking-[0.05em] hover:border-[#5C3D2E] transition-colors flex items-center justify-center gap-2"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853" />
            <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        <p
          className="mt-6 text-center text-[13px] text-[#5C3D2E]/60"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button onClick={() => { setMode("register"); setError(""); }} className="text-[#1B4332] underline">
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => { setMode("login"); setError(""); }} className="text-[#1B4332] underline">
                Sign In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
