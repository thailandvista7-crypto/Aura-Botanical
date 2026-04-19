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
  Droplets,
  Flame,
  Shield,
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
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
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
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Are your soaps 100% natural?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, all Aura Botanicals soaps are made with 100% natural ingredients: organic coconut oil, sustainable palm oil, rice bran oil, and pure essential oils. No parabens, sulfates, or synthetic fragrances.",
            },
          },
          {
            "@type": "Question",
            name: "Do you test on animals?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Never. Aura Botanicals is proudly cruelty-free and Leaping Bunny certified. All our products are vegan except our beeswax candles (which are ethically harvested).",
            },
          },
          {
            "@type": "Question",
            name: "What makes Thai lemongrass soap special?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Thai lemongrass contains higher citral content than other varieties, offering superior antibacterial and antifungal properties. It naturally cleanses oily skin and provides an energizing aroma.",
            },
          },
          {
            "@type": "Question",
            name: "How long do your candles burn?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Our 200g coconut-soy wax candles burn for 45-50 hours. The natural wax blend burns cleaner and longer than paraffin, with no black soot.",
            },
          },
          {
            "@type": "Question",
            name: "Do you ship internationally?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, we ship worldwide from Chiang Mai. Delivery to USA/Europe takes 7-14 business days. Free shipping on orders over $75.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Aura Botanicals | Handmade Thai Soaps & Natural Candles – Artisanal Wellness</title>
        <meta
          name="description"
          content="Discover authentic Thai artisanal soaps and candles. Handcrafted with lemongrass, jasmine, coconut, and pure essential oils. 100% natural, cruelty-free, made in Chiang Mai."
        />
        <meta
          name="keywords"
          content="Thai soap, natural candles, handmade soap Thailand, lemongrass soap benefits, jasmine rice candle, artisanal bath products, vegan skincare Chiang Mai, cold process soap, essential oil candles"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://aurabotanicals.com" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aurabotanicals.com/" />
        <meta property="og:title" content="Aura Botanicals – Thai Artisanal Soaps & Candles" />
        <meta property="og:description" content="Handcrafted botanical luxuries from the heart of Thailand." />
        <meta property="og:image" content="https://aurabotanicals.com/images/og-image.jpg" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://aurabotanicals.com/" />
        <meta property="twitter:title" content="Aura Botanicals – Thai Artisanal Soaps & Candles" />
        <meta property="twitter:description" content="Handcrafted botanical luxuries from the heart of Thailand." />
        <meta property="twitter:image" content="https://aurabotanicals.com/images/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <main>
        <SkipToContent />
        <HeroSection />
        <FeaturedProducts />
        <WhyChooseUs />
        <IngredientsDeepDive />
        <HowItsMade />
        <PhilosophySection />
        <BenefitsOfNatural />
        <TestimonialsSection />
        <FaqSection />
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
          Handcrafted soaps and candles infused with nature's finest ingredients — lemongrass, jasmine,
          coconut, and more. 100% natural, cruelty‑free, and made in small batches in Chiang Mai.
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

/* ─────────────── Why Choose Us ─────────────── */
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

/* ─────────────── Ingredients Deep Dive (SEO) ─────────────── */
function IngredientsDeepDive() {
  return (
    <section className="py-20 px-[5vw] bg-white" aria-labelledby="ingredients-heading">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#1B4332] text-[11px] uppercase tracking-[0.15em] mb-2">Nature’s Finest</p>
          <h2 id="ingredients-heading" className="text-[#5C3D2E] text-[32px] md:text-[48px] font-serif">
            The Heart of Thai Botanicals
          </h2>
          <p className="text-[#5C3D2E]/70 max-w-2xl mx-auto mt-2">
            Every ingredient is chosen for its purity, potency, and traditional use in Thai wellness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-20 h-20 bg-[#1B4332]/10 rounded-full flex items-center justify-center">
              <Leaf className="text-[#1B4332]" size={32} />
            </div>
            <div>
              <h3 className="text-[#1B4332] text-xl font-serif mb-2">Thai Lemongrass (<em>Cymbopogon citratus</em>)</h3>
              <p className="text-[#5C3D2E]/80 text-sm leading-relaxed">
                Sourced from organic farms in Chiang Rai, our lemongrass is hand-harvested at dawn when essential oil concentration peaks. Thai lemongrass contains up to 85% citral — a natural compound with potent antibacterial, antifungal, and anti-inflammatory properties. In traditional Thai medicine, lemongrass tea and compresses are used to relieve muscle pain, reduce fever, and improve digestion. Our cold-processed soaps retain these active compounds, offering gentle cleansing for acne-prone or oily skin without stripping natural moisture. The crisp, citrus aroma also acts as a natural insect repellent and mood enhancer.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-20 h-20 bg-[#1B4332]/10 rounded-full flex items-center justify-center">
              <Flame className="text-[#1B4332]" size={32} />
            </div>
            <div>
              <h3 className="text-[#1B4332] text-xl font-serif mb-2">Night-Blooming Jasmine (<em>Jasminum sambac</em>)</h3>
              <p className="text-[#5C3D2E]/80 text-sm leading-relaxed">
                Our jasmine flowers are picked after sunset in Mae Rim district, when their fragrance is most intense. The petals are infused into organic coconut oil for 30 days to create a rich, aromatic base. Jasmine essential oil is renowned in aromatherapy for reducing anxiety, lifting mood, and promoting restful sleep. In Thai culture, jasmine garlands (phuang malai) are offered as symbols of respect and gratitude. Our jasmine & rice candle combines this floral note with warm basmati rice, evoking the scent of a traditional Thai dessert (khao niew moon). The wax is a blend of coconut and soy, free from phthalates or synthetic enhancers.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-20 h-20 bg-[#1B4332]/10 rounded-full flex items-center justify-center">
              <Droplets className="text-[#1B4332]" size={32} />
            </div>
            <div>
              <h3 className="text-[#1B4332] text-xl font-serif mb-2">Cold-Pressed Coconut Oil</h3>
              <p className="text-[#5C3D2E]/80 text-sm leading-relaxed">
                We partner with a women-run cooperative in Krabi that produces virgin coconut oil using traditional fermentation methods. Unlike refined coconut oil, our cold-pressed version retains lauric acid (a medium-chain triglyceride with antimicrobial properties), vitamin E, and antioxidants. In soap, coconut oil creates a fluffy lather that effectively removes dirt and excess sebum. For our candles, coconut wax burns slower and cleaner than paraffin or soy alone, with a lower melting point that disperses fragrance more evenly. Coconut oil also deeply moisturizes dry skin — it's the only oil that penetrates the hair shaft, making our soaps ideal for shaving.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-20 h-20 bg-[#1B4332]/10 rounded-full flex items-center justify-center">
              <Shield className="text-[#1B4332]" size={32} />
            </div>
            <div>
              <h3 className="text-[#1B4332] text-xl font-serif mb-2">Organic Rice Bran Oil</h3>
              <p className="text-[#5C3D2E]/80 text-sm leading-relaxed">
                Rice bran oil is a hidden gem of Thai skincare. It contains gamma-oryzanol (a powerful antioxidant that protects against UV damage), ferulic acid, and high levels of vitamin E. Historically, Thai women used rice water to rinse their hair and skin for a radiant glow. Our rice bran oil is expeller-pressed from jasmine rice grown in Surin province. In soap, it adds creaminess and conditioning without heaviness, making it perfect for sensitive or mature skin. The oil's natural emollient properties help restore the skin barrier, reducing transepidermal water loss. It also has a very mild scent, allowing the essential oils to shine.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-[#5C3D2E]/60 text-xs">
          * All ingredients are certified organic, non-GMO, and sourced within 200km of our workshop in Chiang Mai.
        </div>
      </div>
    </section>
  );
}

/* ─────────────── How It's Made (SEO) ─────────────── */
function HowItsMade() {
  return (
    <section className="py-20 px-[5vw] bg-[#F5F5F0]" aria-labelledby="process-heading">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#1B4332] text-[11px] uppercase tracking-[0.15em] mb-2">Artisanal Craft</p>
          <h2 id="process-heading" className="text-[#5C3D2E] text-[32px] md:text-[48px] font-serif">
            From Our Workshop to Your Home
          </h2>
          <p className="text-[#5C3D2E]/70 max-w-2xl mx-auto mt-2">
            Every product is made by hand in small batches — never mass-produced.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg text-center">
            <div className="w-16 h-16 mx-auto bg-[#1B4332] text-white rounded-full flex items-center justify-center text-2xl font-serif mb-4">1</div>
            <h3 className="text-[#1B4332] text-xl font-serif mb-2">Cold Process Soap Making</h3>
            <p className="text-[#5C3D2E]/80 text-sm text-left">
              Our soaps are made using the traditional cold-process method, which preserves the natural glycerin and active compounds in the oils. We begin by carefully measuring organic coconut oil, rice bran oil, and sustainable palm oil (RSPO-certified). Lye is mixed with distilled water, then combined with oils at precise temperatures (95–105°F). The mixture is hand-stirred until "trace" — a pudding-like consistency. Next, we add fresh lemongrass puree, jasmine-infused oil, or other botanicals. The raw soap is poured into wooden molds, insulated, and left to saponify for 48 hours. After unmolding, each bar is hand-cut and cured for 4–6 weeks on bamboo racks. This slow cure allows excess water to evaporate, resulting in a harder, longer-lasting bar that is mild and bubbly.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg text-center">
            <div className="w-16 h-16 mx-auto bg-[#1B4332] text-white rounded-full flex items-center justify-center text-2xl font-serif mb-4">2</div>
            <h3 className="text-[#1B4332] text-xl font-serif mb-2">Herbal Infusions & Essential Oils</h3>
            <p className="text-[#5C3D2E]/80 text-sm text-left">
              For our specialty soaps and all candles, we create herbal infusions that can take up to 30 days. Dried lemongrass, pandan leaves, or jasmine petals are submerged in organic coconut oil inside glass jars, placed in a warm spot (but out of direct sunlight). The oil is shaken daily to release the plants' fat-soluble compounds. After infusion, the oil is strained through cheesecloth and used directly in the soap or candle formula. We never use synthetic fragrance oils or "nature identical" alternatives. Our essential oils (lemongrass, litsea cubeba, sweet orange, patchouli) are steam-distilled in small Thai distilleries and tested for purity via GC-MS. Each batch of candles is hand-poured in double-boilers to avoid overheating the essential oils, which can degrade their therapeutic properties.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg text-center">
            <div className="w-16 h-16 mx-auto bg-[#1B4332] text-white rounded-full flex items-center justify-center text-2xl font-serif mb-4">3</div>
            <h3 className="text-[#1B4332] text-xl font-serif mb-2">Quality Control & Sustainability</h3>
            <p className="text-[#5C3D2E]/80 text-sm text-left">
              Every batch is tested for pH (ideal range 8.5–9.5 for gentle cleansing), lather stability, and fragrance throw. We keep a sample of each batch for one year to ensure consistency. Our packaging is plastic-free: soaps are wrapped in compostable cellophane made from cassava starch, and candles come in reusable glass jars with bamboo lids. Shipping boxes are made from 100% recycled cardboard, and we use shredded paper (from our office) as cushioning. We also operate a zero-waste workshop: leftover soap scraps are rebatched into "soap saver" bags, and candle wax remnants are remelted into sample sizes. We are actively working toward B Corp certification.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link to="/products" className="inline-flex items-center gap-2 text-[#1B4332] text-[13px] uppercase tracking-[0.1em] hover:underline">
            Shop the collection <ArrowRight size={16} />
          </Link>
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
            At Aura Botanicals, we believe in the transformative power of nature. Every product is handcrafted in small batches using traditional Thai methods passed down through generations. Our soaps are cold‑processed to retain the full benefits of organic shea butter and coconut oil.
          </p>
          <p
            className="text-[#5C3D2E]/80 text-[16px] leading-relaxed mb-6"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            We source ingredients directly from local farmers in Chiang Mai and Krabi — from wild‑harvested lemongrass to cold‑pressed coconut oil. This commitment to authenticity ensures that every bar of soap and every candle carries the true essence of Thailand.
          </p>
          <p
            className="text-[#5C3D2E]/80 text-[16px] leading-relaxed mb-8"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Our mission: bring the serenity of a Thai spa into your daily ritual, using only the purest natural ingredients that honor both your body and the earth.
          </p>
          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-[#C9A227] text-[32px] font-serif">15+</p>
              <p className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]">Products</p>
            </div>
            <div className="text-center">
              <p className="text-[#C9A227] text-[32px] font-serif">100%</p>
              <p className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]">Natural</p>
            </div>
            <div className="text-center">
              <p className="text-[#C9A227] text-[32px] font-serif">0</p>
              <p className="text-[#5C3D2E]/60 text-[11px] uppercase tracking-[0.1em]">Cruelty</p>
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
          <div className="absolute -bottom-6 -left-6 bg-[#FFF8F0] p-6 rounded-lg shadow-lg max-w-[220px]">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} className="text-[#C9A227] fill-[#C9A227]" />
              ))}
            </div>
            <p className="text-[#5C3D2E] text-[13px] italic">
              "The most luxurious natural soaps I've ever used. The lemongrass scent is pure Thai heaven."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Benefits of Natural Skincare (SEO) ─────────────── */
function BenefitsOfNatural() {
  return (
    <section className="py-20 px-[5vw] bg-white" aria-labelledby="benefits-heading">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-10">
          <h2 id="benefits-heading" className="text-[#5C3D2E] text-[32px] md:text-[48px] font-serif">
            Why Choose Natural Over Synthetic?
          </h2>
          <p className="text-[#5C3D2E]/70 max-w-2xl mx-auto">
            Your skin absorbs up to 60% of what you put on it. Choose ingredients you can pronounce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border-l-4 border-[#1B4332] pl-6">
            <h3 className="text-[#1B4332] text-xl font-serif mb-2">1. No Endocrine Disruptors</h3>
            <p className="text-[#5C3D2E]/80 text-sm">
              Many commercial soaps contain parabens (methylparaben, propylparaben) and phthalates (DEP, DBP) — preservatives and fragrance enhancers that can mimic estrogen and interfere with hormone function. Studies have linked long-term exposure to certain parabens with reproductive issues and breast cancer cell growth. Our products are preserved naturally by rosemary extract, vitamin E (tocopherol), and the low-water environment of cured soap. We use only pure essential oils for scent, which are naturally volatile and do not require phthalates.
            </p>
          </div>
          <div className="border-l-4 border-[#1B4332] pl-6">
            <h3 className="text-[#1B4332] text-xl font-serif mb-2">2. Gentler for Sensitive Skin & Eczema</h3>
            <p className="text-[#5C3D2E]/80 text-sm">
              Synthetic detergents like sodium lauryl sulfate (SLS) and sodium laureth sulfate (SLES) are common in "soap" bars that are actually detergent bars. They strip the skin's natural acid mantle, leading to dryness, itching, and exacerbating conditions like eczema and psoriasis. Our cold-process soaps rely on saponified oils, which create a mild, non-stripping lather. The natural glycerin retained in our bars is a humectant — it draws moisture to the skin. Many customers report that switching to our soaps has reduced their need for body lotion.
            </p>
          </div>
          <div className="border-l-4 border-[#1B4332] pl-6">
            <h3 className="text-[#1B4332] text-xl font-serif mb-2">3. Environmental Impact</h3>
            <p className="text-[#5C3D2E]/80 text-sm">
              Synthetic fragrances and microplastics (used as exfoliants) wash down the drain and enter waterways, harming aquatic life. Phthalates have been found in marine animals, and polyethylene microbeads are ingested by fish. Our soaps biodegrade completely within 30 days. We also avoid palm oil unless it's RSPO-certified sustainable (and we use less than 15% of total oils). Our candle wax (coconut-soy blend) is renewable and carbon-neutral, unlike paraffin wax derived from petroleum.
            </p>
          </div>
          <div className="border-l-4 border-[#1B4332] pl-6">
            <h3 className="text-[#1B4332] text-xl font-serif mb-2">4. Therapeutic Aromatherapy Benefits</h3>
            <p className="text-[#5C3D2E]/80 text-sm">
              Synthetic fragrances are designed to simply smell good — they have no therapeutic effect. In contrast, our lemongrass essential oil has been shown in clinical trials to reduce anxiety and improve mood. Jasmine essential oil can increase beta wave activity in the brain, promoting alertness and a sense of well-being. The simple act of inhaling natural plant compounds triggers the olfactory system, which directly connects to the limbic system (the emotional center of the brain). You're not just cleaning your skin or lighting a candle — you're engaging in a wellness ritual.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Testimonials ─────────────── */
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
        <h2 id="testimonials-heading" className="text-[#5C3D2E] text-[32px] md:text-[48px] font-serif mb-4">
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

/* ─────────────── FAQ Section (SEO & Rich Results) ─────────────── */
function FaqSection() {
  const faqs = [
    {
      q: "Are Aura Botanicals products vegan?",
      a: "Yes, all our soaps and most candles are 100% vegan. The only exception is our 'Honey & Oat' soap (contains locally sourced wild honey) and beeswax candles (we offer a small collection). Our standard lemongrass, jasmine, coconut, and charcoal soaps are vegan. We clearly label non-vegan products on their product pages.",
    },
    {
      q: "How should I store my natural soap to make it last longer?",
      a: "Keep your soap on a well-draining dish away from direct water spray between uses. Natural soaps contain high glycerin content, which attracts moisture. If left in a puddle, the bar can become soft and dissolve faster. Between uses, store in a cool, dry place. A wooden soap dish with slats is ideal.",
    },
    {
      q: "Do you offer wholesale or corporate gifting?",
      a: "Yes! We partner with spas, boutique hotels, and wellness retreats worldwide. Our wholesale minimum is 48 units per scent. We also create custom gift boxes with branded ribbons for corporate events. Contact us at wholesale@aurabotanicals.com with your requirements.",
    },
    {
      q: "What is your return policy?",
      a: "We accept returns of unused, unopened products within 30 days for a full refund. If your product arrives damaged, please send a photo within 48 hours of delivery and we'll ship a replacement immediately. Because our products are natural and handcrafted, slight variations in color or shape are normal and not considered defects.",
    },
    {
      q: "How do I know if I'm allergic to an essential oil?",
      a: "Essential oils are highly concentrated plant extracts. We recommend doing a patch test: apply a small amount of diluted soap lather to the inside of your elbow and wait 24 hours. If no redness or itching occurs, the product is safe for you. If you have known sensitivities to botanicals (e.g., citrus, lavender), please consult your dermatologist before use.",
    },
  ];

  return (
    <section className="py-20 px-[5vw] bg-[#F5F5F0]" aria-labelledby="faq-heading">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-10">
          <p className="text-[#1B4332] text-[11px] uppercase tracking-[0.15em] mb-2">Common Questions</p>
          <h2 id="faq-heading" className="text-[#5C3D2E] text-[32px] md:text-[48px] font-serif">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-[#1B4332] text-lg font-serif mb-2">{faq.q}</h3>
              <p className="text-[#5C3D2E]/80 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-[#5C3D2E]/70 text-sm">
            Still have questions? <a href="#contact" className="text-[#1B4332] underline">Contact our support team</a> — we reply within 24 hours.
          </p>
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
    <section id="contact" className="py-32 px-[5vw] scroll-mt-20" style={{ background: "#FFF8F0" }} aria-labelledby="contact-heading">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <p className="text-[#1B4332] text-[11px] uppercase tracking-[0.15em] mb-4">Get in Touch</p>
          <h2 id="contact-heading" className="text-[#5C3D2E] mb-6 text-[clamp(32px,3.5vw,56px)] font-serif">
            Visit Our Sanctuary
          </h2>
          <p className="text-[#5C3D2E]/80 text-[16px] leading-relaxed mb-8">
            We'd love to hear from you. Whether you have questions about our products, want to place a wholesale order, or simply want to share your wellness journey.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin size={20} className="text-[#1B4332] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#5C3D2E] text-[14px] font-medium">Address</h3>
                <p className="text-[#5C3D2E]/70 text-[14px]">42 Nimmanhaemin Road, Chiang Mai 50200, Thailand</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone size={20} className="text-[#1B4332] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#5C3D2E] text-[14px] font-medium">Phone</h3>
                <p className="text-[#5C3D2E]/70 text-[14px]">+66 53 123 4567</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail size={20} className="text-[#1B4332] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#5C3D2E] text-[14px] font-medium">Email</h3>
                <p className="text-[#5C3D2E]/70 text-[14px]">hello@aurabotanicals.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock size={20} className="text-[#1B4332] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#5C3D2E] text-[14px] font-medium">Hours</h3>
                <p className="text-[#5C3D2E]/70 text-[14px]">Mon - Sat: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-lg overflow-hidden h-[250px]">
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
        </div>

        <div className="bg-[#F5F5F0] p-8 rounded-lg">
          <h3 className="text-[#5C3D2E] text-[24px] mb-6 font-serif">Send us a Message</h3>
          {submitted ? (
            <div className="bg-[#1B4332]/10 p-6 rounded-lg text-center">
              <p className="text-[#1B4332] text-[16px]">Thank you for your message! We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="text-[#5C3D2E]/60 text-[11px] uppercase block mb-2">Name *</label>
                <input id="contact-name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full h-12 px-4 border border-[#F5F5F0] rounded bg-transparent text-[#5C3D2E] focus:border-[#1B4332] focus:outline-none" />
              </div>
              <div>
                <label htmlFor="contact-email" className="text-[#5C3D2E]/60 text-[11px] uppercase block mb-2">Email *</label>
                <input id="contact-email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full h-12 px-4 border border-[#F5F5F0] rounded bg-transparent text-[#5C3D2E] focus:border-[#1B4332] focus:outline-none" />
              </div>
              <div>
                <label htmlFor="contact-subject" className="text-[#5C3D2E]/60 text-[11px] uppercase block mb-2">Subject</label>
                <input id="contact-subject" type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full h-12 px-4 border border-[#F5F5F0] rounded bg-transparent text-[#5C3D2E] focus:border-[#1B4332] focus:outline-none" />
              </div>
              <div>
                <label htmlFor="contact-message" className="text-[#5C3D2E]/60 text-[11px] uppercase block mb-2">Message *</label>
                <textarea id="contact-message" required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 border border-[#F5F5F0] rounded bg-transparent text-[#5C3D2E] focus:border-[#1B4332] focus:outline-none resize-none" />
              </div>
              <button type="submit" disabled={createMutation.isPending} className="w-full h-12 bg-[#1B4332] text-[#FFF8F0] rounded text-[13px] uppercase tracking-[0.1em] hover:bg-[#5C3D2E] transition-colors disabled:opacity-50">
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
        <h2 id="newsletter-heading" className="text-[#FFF8F0] mb-4 text-[clamp(28px,3vw,48px)] font-serif">
          Join the Sanctuary
        </h2>
        <p className="text-[#FFF8F0]/70 text-[14px] mb-8">
          Subscribe for botanical wellness tips, new product announcements, and exclusive offers.
        </p>
        {subscribed ? (
          <p className="text-[#C9A227] text-[16px]">✨ Welcome to the sanctuary! Check your inbox.</p>
        ) : (
          <div className="flex gap-3">
            <input type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 h-12 px-4 bg-transparent border-b border-[#FFF8F0]/30 text-[#FFF8F0] placeholder:text-[#FFF8F0]/40 focus:border-[#C9A227] focus:outline-none transition-colors" aria-label="Email for newsletter" />
            <button onClick={() => { if (email) { setSubscribed(true); setEmail(""); } }} className="px-6 h-12 bg-[#C9A227] text-[#5C3D2E] rounded text-[13px] uppercase tracking-[0.1em] hover:brightness-110 transition-all">
              Subscribe
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
