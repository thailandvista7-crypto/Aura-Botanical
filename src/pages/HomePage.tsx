import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { trpc } from "@/trpc/client";
import { useCart } from "@/hooks/useCart";
import { ArrowRight, ShoppingBag, Star, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturedProducts />
      <PhilosophySection />
      <ContactSection />
      <NewsletterSection />
    </div>
  );
}

/* ─────────────── Hero ─────────────── */
function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Fade in animation
    section.style.opacity = "0";
    section.style.transition = "opacity 1.2s ease-out";
    requestAnimationFrame(() => {
      section.style.opacity = "1";
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", minHeight: 600 }}
    >
      {/* Video/Image Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-bg.jpg"
          className="w-full h-full object-cover"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <p
          className="text-[#FFF8F0]/70 text-[11px] uppercase tracking-[0.25em] mb-6"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Thai Artisanal Wellness
        </p>
        <h1
          className="text-[#FFF8F0] max-w-4xl leading-[1.1]"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(36px, 5vw, 80px)",
            letterSpacing: "-0.02em",
          }}
        >
          Botanical Luxuries from the Heart of Thailand
        </h1>
        <p
          className="text-[#FFF8F0]/80 text-[16px] max-w-xl mt-6 leading-relaxed"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Handcrafted soaps and candles infused with nature's finest ingredients — lemongrass, jasmine, coconut, and more.
        </p>
        <div className="flex gap-4 mt-10">
          <Link
            to="/products"
            className="px-8 py-4 bg-[#1B4332] text-[#FFF8F0] rounded text-[13px] uppercase tracking-[0.1em] hover:bg-[#5C3D2E] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Shop Collection
          </Link>
          <a
            href="#philosophy"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("philosophy")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-4 border border-[#FFF8F0]/40 text-[#FFF8F0] rounded text-[13px] uppercase tracking-[0.1em] hover:bg-[#FFF8F0]/10 transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Our Story
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Featured Products ─────────────── */
function FeaturedProducts() {
  const { data } = trpc.product.featured.useQuery();
  const { addToCart } = useCart();
  const sectionRef = useRef<HTMLDivElement>(null);

  const products = data || [];

  return (
    <section
      ref={sectionRef}
      className="py-32 px-[5vw]"
      style={{ background: "#FFF8F0" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-[#1B4332] text-[11px] uppercase tracking-[0.15em] mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Collection
          </p>
          <h2
            className="text-[#5C3D2E]"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(32px, 3.5vw, 56px)",
              letterSpacing: "-0.01em",
            }}
          >
            Botanical Luxuries
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, i) => (
            <div
              key={product.id}
              className="group"
              style={{
                opacity: 0,
                animation: `fadeInUp 0.6s ease-out ${i * 0.1}s forwards`,
              }}
            >
              <Link to={`/products/${product.id}`} className="block">
                <div className="relative overflow-hidden rounded-lg aspect-[3/4] mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
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
              <div className="flex items-center justify-between">
                <p
                  className="text-[#5C3D2E] text-[16px]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  ${(product.price / 100).toFixed(2)}
                </p>
                <button
                  onClick={() => addToCart(product.id)}
                  className="text-[#1B4332] hover:text-[#5C3D2E] transition-colors"
                >
                  <ShoppingBag size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-[#1B4332] text-[13px] uppercase tracking-[0.1em] hover:underline transition-all"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

/* ─────────────── Philosophy ─────────────── */
function PhilosophySection() {
  return (
    <section
      id="philosophy"
      className="py-32 px-[5vw]"
      style={{ background: "#FFF8F0" }}
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <p
            className="text-[#1B4332] text-[11px] uppercase tracking-[0.15em] mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Our Philosophy
          </p>
          <h2
            className="text-[#5C3D2E] mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(32px, 3.5vw, 56px)",
              letterSpacing: "-0.01em",
            }}
          >
            Rooted in Thai Tradition
          </h2>
          <p
            className="text-[#5C3D2E]/80 text-[16px] leading-relaxed mb-6"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            At Aura Botanicals, we believe in the transformative power of nature. Every product in our collection is handcrafted in small batches using traditional Thai methods passed down through generations.
          </p>
          <p
            className="text-[#5C3D2E]/80 text-[16px] leading-relaxed mb-6"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            We source our ingredients directly from local farmers in Chiang Mai and Krabi — from wild-harvested lemongrass to cold-pressed coconut oil. This commitment to authenticity ensures that every bar of soap and every candle carries the true essence of Thailand.
          </p>
          <p
            className="text-[#5C3D2E]/80 text-[16px] leading-relaxed mb-8"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Our mission is simple: to bring the serenity of a Thai spa into your daily ritual, using only the purest natural ingredients that honor both your body and the earth.
          </p>
          <div className="flex gap-8">
            <div className="text-center">
              <p
                className="text-[#C9A227] text-[32px]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                15+
              </p>
              <p
                className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Products
              </p>
            </div>
            <div className="text-center">
              <p
                className="text-[#C9A227] text-[32px]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                100%
              </p>
              <p
                className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Natural
              </p>
            </div>
            <div className="text-center">
              <p
                className="text-[#C9A227] text-[32px]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                0
              </p>
              <p
                className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Cruelty
              </p>
            </div>
          </div>
        </div>
        <div className="relative">
          <img
            src="/images/lifestyle-01.jpg"
            alt="Thai botanical spa"
            className="rounded-lg w-full object-cover"
            style={{ aspectRatio: "4/5" }}
          />
          <div
            className="absolute -bottom-6 -left-6 bg-[#FFF8F0] p-6 rounded-lg shadow-lg max-w-[200px]"
          >
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} className="text-[#C9A227] fill-[#C9A227]" />
              ))}
            </div>
            <p
              className="text-[#5C3D2E] text-[13px] italic"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              "The most luxurious natural soaps I've ever used."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Contact Section ─────────────── */
function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const createMutation = trpc.contact.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    createMutation.mutate(formData);
  }

  return (
    <section id="contact" className="py-32 px-[5vw]" style={{ background: "#F5F5F0" }}>
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div>
          <p
            className="text-[#1B4332] text-[11px] uppercase tracking-[0.15em] mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Get in Touch
          </p>
          <h2
            className="text-[#5C3D2E] mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(32px, 3.5vw, 56px)",
              letterSpacing: "-0.01em",
            }}
          >
            Visit Our Sanctuary
          </h2>
          <p
            className="text-[#5C3D2E]/80 text-[16px] leading-relaxed mb-8"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            We'd love to hear from you. Whether you have questions about our products, want to place a wholesale order, or simply want to share your wellness journey.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin size={20} className="text-[#1B4332] mt-1 flex-shrink-0" />
              <div>
                <p className="text-[#5C3D2E] text-[14px] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>Address</p>
                <p className="text-[#5C3D2E]/70 text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  42 Nimmanhaemin Road, Chiang Mai 50200, Thailand
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone size={20} className="text-[#1B4332] mt-1 flex-shrink-0" />
              <div>
                <p className="text-[#5C3D2E] text-[14px] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>Phone</p>
                <p className="text-[#5C3D2E]/70 text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  +66 53 123 4567
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail size={20} className="text-[#1B4332] mt-1 flex-shrink-0" />
              <div>
                <p className="text-[#5C3D2E] text-[14px] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>Email</p>
                <p className="text-[#5C3D2E]/70 text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  hello@aurabotanicals.com
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock size={20} className="text-[#1B4332] mt-1 flex-shrink-0" />
              <div>
                <p className="text-[#5C3D2E] text-[14px] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>Hours</p>
                <p className="text-[#5C3D2E]/70 text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Mon - Sat: 9:00 AM - 6:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div className="mt-8 rounded-lg overflow-hidden" style={{ height: 250 }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3776.9999999999995!2d98.967!3d18.796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3a!2sChiang%20Mai!5e0!3m2!1sen!2sth!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(0.3)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Aura Botanicals Location"
            />
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#FFF8F0] p-8 rounded-lg">
          <h3
            className="text-[#5C3D2E] text-[24px] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Send us a Message
          </h3>

          {submitted ? (
            <div className="bg-[#1B4332]/10 p-6 rounded-lg text-center">
              <p className="text-[#1B4332] text-[16px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Thank you for your message! We'll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em] block mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-12 px-4 border border-[#F5F5F0] rounded bg-transparent text-[#5C3D2E] focus:border-[#1B4332] focus:outline-none transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>
              <div>
                <label className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em] block mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-12 px-4 border border-[#F5F5F0] rounded bg-transparent text-[#5C3D2E] focus:border-[#1B4332] focus:outline-none transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>
              <div>
                <label className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em] block mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full h-12 px-4 border border-[#F5F5F0] rounded bg-transparent text-[#5C3D2E] focus:border-[#1B4332] focus:outline-none transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>
              <div>
                <label className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em] block mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-[#F5F5F0] rounded bg-transparent text-[#5C3D2E] focus:border-[#1B4332] focus:outline-none transition-colors resize-none"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full h-12 bg-[#1B4332] text-[#FFF8F0] rounded text-[13px] uppercase tracking-[0.1em] hover:bg-[#5C3D2E] transition-colors disabled:opacity-50"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {createMutation.isPending ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Newsletter ─────────────── */
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section className="py-24 px-[5vw]" style={{ background: "#1B4332" }}>
      <div className="max-w-[500px] mx-auto text-center">
        <h2
          className="text-[#FFF8F0] mb-4"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(28px, 3vw, 48px)",
          }}
        >
          Join the Sanctuary
        </h2>
        <p
          className="text-[#FFF8F0]/70 text-[14px] mb-8"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Subscribe for botanical wellness tips, new product announcements, and exclusive offers.
        </p>

        {subscribed ? (
          <p className="text-[#C9A227] text-[16px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Welcome to the sanctuary! Check your inbox.
          </p>
        ) : (
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 px-4 bg-transparent border-b border-[#FFF8F0]/30 text-[#FFF8F0] placeholder:text-[#FFF8F0]/40 focus:border-[#C9A227] focus:outline-none transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            <button
              onClick={() => {
                if (email) {
                  setSubscribed(true);
                  setEmail("");
                }
              }}
              className="px-6 h-12 bg-[#C9A227] text-[#5C3D2E] rounded text-[13px] uppercase tracking-[0.1em] hover:brightness-110 transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Subscribe
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
