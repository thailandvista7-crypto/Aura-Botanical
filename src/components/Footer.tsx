import { Link } from "react-router-dom";
import { Leaf, Instagram, Facebook, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1B4332] pt-20 pb-10 px-[5vw]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link
            to="/"
            className="text-[#FFF8F0] text-[22px] tracking-[0.05em] block mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Aura Botanicals
          </Link>
          <p
            className="text-[#FFF8F0] opacity-60 text-[14px] leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Handcrafted soaps and candles inspired by the botanical riches of Thailand. Each product tells a story of nature, tradition, and artisanal care.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="#" className="text-[#FFF8F0] opacity-60 hover:opacity-100 transition-opacity">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-[#FFF8F0] opacity-60 hover:opacity-100 transition-opacity">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-[#FFF8F0] opacity-60 hover:opacity-100 transition-opacity">
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4
            className="text-[#FFF8F0] text-[11px] uppercase tracking-[0.15em] mb-6"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Shop
          </h4>
          <ul className="space-y-3">
            {["All Products", "Soaps", "Candles", "Gift Sets"].map((item) => (
              <li key={item}>
                <Link
                  to={item === "All Products" ? "/products" : `/products?category=${item.toLowerCase().replace(" ", "_")}`}
                  className="text-[#FFF8F0] opacity-70 hover:opacity-100 text-[14px] transition-opacity"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4
            className="text-[#FFF8F0] text-[11px] uppercase tracking-[0.15em] mb-6"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Company
          </h4>
          <ul className="space-y-3">
            {["Our Story", "Ingredients", "Sustainability", "Careers"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-[#FFF8F0] opacity-70 hover:opacity-100 text-[14px] transition-opacity"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h4
            className="text-[#FFF8F0] text-[11px] uppercase tracking-[0.15em] mb-6"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Connect
          </h4>
          <p
            className="text-[#FFF8F0] opacity-60 text-[14px] mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Subscribe for botanical wellness tips and exclusive offers.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 h-10 px-3 bg-transparent border-b border-[#FFF8F0]/30 text-[#FFF8F0] placeholder:text-[#FFF8F0]/40 text-[14px] focus:border-[#C9A227] focus:outline-none transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            <button className="text-[#C9A227] text-[11px] uppercase tracking-[0.1em] ml-3 hover:opacity-80 transition-opacity" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1400px] mx-auto mt-16 pt-6 border-t border-[#FFF8F0]/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p
          className="text-[#FFF8F0] opacity-50 text-[12px]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          &copy; 2024 Aura Botanicals. All rights reserved.
        </p>
        <div className="flex items-center gap-2 text-[#FFF8F0] opacity-50 text-[12px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <Leaf size={14} />
          <span>Cruelty-free &middot; Vegan &middot; Hand-crafted in Thailand</span>
        </div>
      </div>
    </footer>
  );
}
