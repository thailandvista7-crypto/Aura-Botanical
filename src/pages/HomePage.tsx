import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { trpc } from "@/trpc/client";
import { useCart } from "@/hooks/useCart";
import {
  ArrowRight,
  ShoppingBag,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Leaf,
  Heart,
  Award,
  Facebook,
  Instagram,
} from "lucide-react";

export default function HomePage() {
  // Structured data for SEO (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://aurabotanicals.com/#organization",
        name: "Aura Botanicals",
        url: "https://aurabotanicals.com",
        logo: "https://aurabotanicals.com/logo.png",
        sameAs: [
          "https://www.facebook.com/aurabotanicals",
          "https://www.instagram.com/aurabotanicals",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+66531234567",
          contactType: "customer service",
          areaServed: "TH",
          availableLanguage: "English",
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://aurabotanicals.com/#localbusiness",
        name: "Aura Botanicals",
        image: "https://aurabotanicals.com/images/shop-front.jpg",
        address: {
          "@type": "PostalAddress",
          streetAddress: "42 Nimmanhaemin Road",
          addressLocality: "Chiang Mai",
          addressRegion: "Chiang Mai",
          postalCode: "50200",
          addressCountry: "TH",
        },
        priceRange: "$$",
        telephone: "+66531234567",
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "09:00",
          closes: "18:00",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://aurabotanicals.com/#website",
        url: "https://aurabotanicals.com",
        name: "Aura Botanicals",
        description:
          "Handcrafted Thai soaps and natural candles made with traditional botanical ingredients. Shop lemongrass, jasmine, and coconut artisanal products.",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://aurabotanicals.com/products?search={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>
          Aura Botanicals | Handmade Thai Soaps & Natural Candles – Artisanal Wellness
        </title>
        <meta
          name="title"
          content="Aura Botanicals | Handmade Thai Soaps & Natural Candles"
        />
        <meta
          name="description"
          content="Discover authentic Thai artisanal soaps and candles. Handcrafted with lemongrass, jasmine, coconut, and pure essential oils. Cruelty-free, natural, and traditional."
        />
        <meta
          name="keywords"
          content="Thai soap, natural candles, handmade soap Thailand, lemongrass soap, jasmine candle, artisanal bath products, vegan skincare, Chiang Mai spa"
        />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <link rel="canonical" href="https://aurabotanicals.com" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aurabotanicals.com/" />
        <meta
          property="og:title"
          content="Aura Botanicals – Thai Artisanal Soaps & Candles"
        />
        <meta
          property="og:description"
          content="Handcrafted botanical luxuries from the heart of Thailand. Lemongrass, jasmine, coconut – pure, natural, and traditional."
        />
        <meta
          property="og:image"
          content="https://aurabotanicals.com/images/og-image.jpg"
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://aurabotanicals.com/" />
        <meta
          property="twitter:title"
          content="Aura Botanicals – Thai Artisanal Soaps & Candles"
        />
        <meta
          property="twitter:description"
          content="Handcrafted botanical luxuries from the heart of Thailand."
        />
        <meta
          property="twitter:image"
          content="https://aurabotanicals.com/images/og-image.jpg"
        />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main>
        <SkipToContent />
        <HeroSection />
        <FeaturedProducts />
        <WhyChooseUs />
        <PhilosophySection />
        <TestimonialsSection />
        <ContactSection />
        <NewsletterSection />
      </main>
    </>
  );
}

// Helper: skip to main content for accessibility
function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#1B4332] text-white p-2 z-50"
    >
      Skip to content
    </a>
  );
}

/* ─────────────── Hero Section ─────────────── */
function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
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
      aria-label="Hero banner: Thai artisanal wellness"
    >
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-bg.webp"
          className="w-full h-full object-cover"
          aria-label="Background video of Thai botanical ingredients"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
      </div>

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
          Handcrafted soaps and candles infused with nature's finest ingredients —
          lemongrass, jasmine, coconut, and more. 100% natural, cruelty‑free, and
          made in small batches in Chiang Mai.
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
  const sectionRef = useRef<HTMLElement>(null);

  const products = data || [];

  // Structured data for products (aggregate)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Product",
        name: product.name,
        image: product.image,
        description: `Handcrafted ${product.name} – traditional Thai botanical soap/candle.`,
        sku: product.id,
        offers: {
          "@type": "Offer",
          price: (product.price / 100).toFixed(2),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };

  return (
    <section
      ref={sectionRef}
      className="py-32 px-[5vw]"
      style={{ background: "#FFF8F0" }}
      aria-labelledby="featured-heading"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-[#1B4332] text-[11px] uppercase tracking-[0.15em] mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Our Collection
          </p>
          <h2
            id="featured-heading"
            className="text-[#5C3D2E]"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(32px, 3.5vw, 56px)",
              letterSpacing: "-0.01em",
            }}
          >
            Botanical Luxuries
          </h2>
          <p className="text-[#5C3D2E]/70 max-w-xl mx-auto mt-4">
            Each bar and candle is hand‑poured in Chiang Mai using traditional Thai recipes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, i) => (
            <article
              key={product.id}
              className="group"
              style={{
                opacity: 0,
                animation: `fadeInUp 0.6s ease-out ${i * 0.1}s forwards`,
              }}
            >
              <Link to={`/products/${product.id}`} className="block" aria-label={product.name}>
                <div className="relative overflow-hidden rounded-lg aspect-[3/4] mb-4 bg-[#F5F5F0]">
                  <img
                    src={product.image}
                    alt={`${product.name} – handcrafted Thai ${product.category} made with natural botanical ingredients`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
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
                  className="text-[#5C3D2E] text-[16px] font-medium"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  ${(product.price / 100).toFixed(2)}
                </p>
                <button
                  onClick={() => addToCart(product.id)}
                  className="text-[#1B4332] hover:text-[#5C3D2E] transition-colors"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingBag size={18} />
                </button>
              </div>
            </article>
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

      <script type="application/ld+json">{JSON.stringify(productSchema)}</script>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

/* ─────────────── Why Choose Us (new) ─────────────── */
function WhyChooseUs() {
  return (
    <section className="py-20 px-[5vw] bg-[#F5F5F0]" aria-labelledby="why-heading">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <h2
            id="why-heading"
            className="text-[#5C3D2E] text-[32px] md:text-[48px] font-serif"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Why Aura Botanicals?
          </h2>
          <p className="text-[#5C3D2E]/70 max-w-2xl mx-auto">
            Authenticity, sustainability, and the healing wisdom of Thai botanicals.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="inline-flex p-3 bg-[#1B4332]/10 rounded-full mb-4">
              <Leaf className="text-[#1B4332]" size={32} />
            </div>
            <h3 className="text-[#5C3D2E] text-xl font-serif mb-2">100% Natural</h3>
            <p className="text-[#5C3D2E]/70 text-sm">
              No parabens, sulfates, or synthetic fragrances. Only pure essential oils and botanical extracts.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex p-3 bg-[#1B4332]/10 rounded-full mb-4">
              <Heart className="text-[#1B4332]" size={32} />
            </div>
            <h3 className="text-[#5C3D2E] text-xl font-serif mb-2">Cruelty‑Free & Vegan</h3>
            <p className="text-[#5C3D2E]/70 text-sm">
              Never tested on animals. Our recipes are 100% plant‑based and ethically sourced.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex p-3 bg-[#1B4332]/10 rounded-full mb-4">
              <Award className="text-[#1B4332]" size={32} />
            </div>
            <h3 className="text-[#5C3D2E] text-xl font-serif mb-2">Traditional Craft</h3>
            <p className="text-[#5C3D2E]/70 text-sm">
              Small‑batch production using time‑honored Thai methods from Chiang Mai.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Philosophy Section ─────────────── */
function PhilosophySection() {
  return (
    <section
      id="philosophy"
      className="py-32 px-[5vw] scroll-mt-20"
      style={{ background: "#FFF8F0" }}
      aria-labelledby="philosophy-heading"
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
            id="philosophy-heading"
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
            At Aura Botanicals, we believe in the transformative power of nature.
            Every product is handcrafted in small batches using traditional Thai methods
            passed down through generations. Our soaps are cold‑processed to retain
            the full benefits of organic shea butter and coconut oil.
          </p>
          <p
            className="text-[#5C3D2E]/80 text-[16px] leading-relaxed mb-6"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            We source ingredients directly from local farmers in Chiang Mai and Krabi —
            from wild‑harvested lemongrass to cold‑pressed coconut oil. This commitment
            to authenticity ensures that every bar of soap and every candle carries the
            true essence of Thailand.
          </p>
          <p
            className="text-[#5C3D2E]/80 text-[16px] leading-relaxed mb-8"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Our mission: bring the serenity of a Thai spa into your daily ritual, using
            only the purest natural ingredients that honor both your body and the earth.
          </p>
          <div className="flex gap-8">
            <div className="text-center">
              <p
                className="text-[#C9A227] text-[32px] font-serif"
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
                className="text-[#C9A227] text-[32px] font-serif"
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
                className="text-[#C9A227] text-[32px] font-serif"
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
            src="/images/lifestyle-01.webp"
            alt="Traditional Thai spa setting with fresh lemongrass, jasmine flowers, and handmade coconut soaps"
            className="rounded-lg w-full object-cover"
            style={{ aspectRatio: "4/5" }}
            loading="lazy"
          />
          <div
            className="absolute -bottom-6 -left-6 bg-[#FFF8F0] p-6 rounded-lg shadow-lg max-w-[220px]"
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
              "The most luxurious natural soaps I've ever used. The lemongrass scent is
              pure Thai heaven."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Testimonials (new) ─────────────── */
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah J.",
      text: "These candles fill my home with the most authentic Thai aromas. The jasmine rice candle is divine!",
      rating: 5,
    },
    {
      name: "Michael L.",
      text: "Finally, soap that doesn't dry out my skin. The coconut & lemongrass bar is a staple in our shower.",
      rating: 5,
    },
    {
      name: "Priya K.",
      text: "I love that everything is plastic‑free and handcrafted. Truly a brand that cares.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 px-[5vw] bg-[#FFF8F0]" aria-labelledby="testimonials-heading">
      <div className="max-w-[1400px] mx-auto text-center">
        <h2
          id="testimonials-heading"
          className="text-[#5C3D2E] text-[32px] md:text-[48px] font-serif mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Loved by Wellness Seekers
        </h2>
        <p className="text-[#5C3D2E]/70 max-w-2xl mx-auto mb-12">
          Join thousands of customers who have brought the Thai spa experience home.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-[#C9A227] fill-[#C9A227]" />
                ))}
              </div>
              <p className="text-[#5C3D2E]/80 italic mb-4">"{t.text}"</p>
              <p className="text-[#1B4332] font-medium">— {t.name}</p>
            </div>
          ))}
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
    <section
      id="contact"
      className="py-32 px-[5vw] scroll-mt-20"
      style={{ background: "#F5F5F0" }}
      aria-labelledby="contact-heading"
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <p
            className="text-[#1B4332] text-[11px] uppercase tracking-[0.15em] mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Get in Touch
          </p>
          <h2
            id="contact-heading"
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
            We'd love to hear from you. Whether you have questions about our products,
            want to place a wholesale order, or simply want to share your wellness journey.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin size={20} className="text-[#1B4332] mt-1 flex-shrink-0" aria-hidden="true" />
              <div>
                <h3 className="text-[#5C3D2E] text-[14px] font-medium">Address</h3>
                <p className="text-[#5C3D2E]/70 text-[14px]">
                  42 Nimmanhaemin Road, Chiang Mai 50200, Thailand
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone size={20} className="text-[#1B4332] mt-1 flex-shrink-0" aria-hidden="true" />
              <div>
                <h3 className="text-[#5C3D2E] text-[14px] font-medium">Phone</h3>
                <p className="text-[#5C3D2E]/70 text-[14px]">+66 53 123 4567</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail size={20} className="text-[#1B4332] mt-1 flex-shrink-0" aria-hidden="true" />
              <div>
                <h3 className="text-[#5C3D2E] text-[14px] font-medium">Email</h3>
                <p className="text-[#5C3D2E]/70 text-[14px]">hello@aurabotanicals.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock size={20} className="text-[#1B4332] mt-1 flex-shrink-0" aria-hidden="true" />
              <div>
                <h3 className="text-[#5C3D2E] text-[14px] font-medium">Hours</h3>
                <p className="text-[#5C3D2E]/70 text-[14px]">Mon - Sat: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-lg overflow-hidden" style={{ height: 250 }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3776.9999999999995!2d98.967!3d18.796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3a!2sChiang%20Mai!5e0!3m2!1sen!2sth!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(0.3)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map of Aura Botanicals location in Chiang Mai, Thailand"
            />
          </div>

          <div className="flex gap-4 mt-8">
            <a
              href="https://facebook.com/aurabotanicals"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-[#5C3D2E] hover:text-[#1B4332]"
            >
              <Facebook size={24} />
            </a>
            <a
              href="https://instagram.com/aurabotanicals"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-[#5C3D2E] hover:text-[#1B4332]"
            >
              <Instagram size={24} />
            </a>
          </div>
        </div>

        <div className="bg-[#FFF8F0] p-8 rounded-lg">
          <h3
            className="text-[#5C3D2E] text-[24px] mb-6 font-serif"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Send us a Message
          </h3>

          {submitted ? (
            <div className="bg-[#1B4332]/10 p-6 rounded-lg text-center">
              <p className="text-[#1B4332] text-[16px]">
                Thank you for your message! We'll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em] block mb-2">
                  Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-12 px-4 border border-[#F5F5F0] rounded bg-transparent text-[#5C3D2E] focus:border-[#1B4332] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em] block mb-2">
                  Email *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-12 px-4 border border-[#F5F5F0] rounded bg-transparent text-[#5C3D2E] focus:border-[#1B4332] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="contact-subject" className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em] block mb-2">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full h-12 px-4 border border-[#F5F5F0] rounded bg-transparent text-[#5C3D2E] focus:border-[#1B4332] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em] block mb-2">
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-[#F5F5F0] rounded bg-transparent text-[#5C3D2E] focus:border-[#1B4332] focus:outline-none resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full h-12 bg-[#1B4332] text-[#FFF8F0] rounded text-[13px] uppercase tracking-[0.1em] hover:bg-[#5C3D2E] transition-colors disabled:opacity-50"
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
    <section className="py-24 px-[5vw]" style={{ background: "#1B4332" }} aria-labelledby="newsletter-heading">
      <div className="max-w-[500px] mx-auto text-center">
        <h2
          id="newsletter-heading"
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
          <p className="text-[#C9A227] text-[16px]">
            ✨ Welcome to the sanctuary! Check your inbox.
          </p>
        ) : (
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 px-4 bg-transparent border-b border-[#FFF8F0]/30 text-[#FFF8F0] placeholder:text-[#FFF8F0]/40 focus:border-[#C9A227] focus:outline-none transition-colors"
              aria-label="Email for newsletter"
            />
            <button
              onClick={() => {
                if (email) {
                  setSubscribed(true);
                  setEmail("");
                }
              }}
              className="px-6 h-12 bg-[#C9A227] text-[#5C3D2E] rounded text-[13px] uppercase tracking-[0.1em] hover:brightness-110 transition-all"
            >
              Subscribe
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
