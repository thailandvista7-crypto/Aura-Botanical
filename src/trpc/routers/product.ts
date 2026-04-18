import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../trpc";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const productRouter = router({
  list: publicProcedure
    .input(
      z.object({
        category: z.enum(["soap", "candle", "gift_set"]).optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(12),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page || 1;
      const limit = input?.limit || 12;
      const offset = (page - 1) * limit;

      let query;
      if (input?.category) {
        query = ctx.db
          .select()
          .from(products)
          .where(eq(products.category, input.category))
          .orderBy(desc(products.createdAt))
          .limit(limit)
          .offset(offset);
      } else {
        query = ctx.db
          .select()
          .from(products)
          .orderBy(desc(products.createdAt))
          .limit(limit)
          .offset(offset);
      }

      const items = await query;
      const countResult = input?.category
        ? await ctx.db
            .select()
            .from(products)
            .where(eq(products.category, input.category))
        : await ctx.db.select().from(products);

      return {
        items,
        total: countResult.length,
        page,
        limit,
        totalPages: Math.ceil(countResult.length / limit),
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db
        .select()
        .from(products)
        .where(eq(products.id, input.id))
        .limit(1);
      return product[0] || null;
    }),

  featured: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(products)
      .where(eq(products.featured, 1))
      .limit(8);
  }),

  seed: adminProcedure.mutation(async ({ ctx }) => {
    const existing = await ctx.db.select().from(products);
    if (existing.length > 0) {
      return { message: "Products already seeded", count: existing.length };
    }

    const seedProducts = [
      {
        name: "Chiang Mai Botanical Soap",
        category: "soap" as const,
        price: 1299,
        description: "Handcrafted soap infused with wild botanicals from the mountains of Chiang Mai. Features lemongrass, turmeric, and local herbs that gently cleanse while nourishing the skin. Each bar is cold-processed and cured for six weeks to preserve the natural glycerin.",
        shortDesc: "Wild mountain botanicals from Chiang Mai",
        image: "/images/product-01.jpg",
        images: JSON.stringify(["/images/product-07.jpg", "/images/lifestyle-02.jpg"]),
        ingredients: "Olive oil, coconut oil, lemongrass essential oil, turmeric powder, Chiang Mai wild herbs, sodium hydroxide, distilled water",
        weight: "120g",
        scent: "Lemongrass & Turmeric",
        inStock: 1,
        featured: 1,
      },
      {
        name: "Lemongrass Zest Candle",
        category: "candle" as const,
        price: 1899,
        description: "A revitalizing soy candle with the crisp, citrusy aroma of fresh Thai lemongrass. Hand-poured in a matte ceramic vessel inspired by traditional Thai pottery. Burns cleanly for up to 45 hours.",
        shortDesc: "Revitalizing lemongrass soy candle",
        image: "/images/product-02.jpg",
        images: JSON.stringify(["/images/product-06.jpg"]),
        ingredients: "100% natural soy wax, lemongrass essential oil, cotton wick, ceramic vessel",
        burnTime: "45 hours",
        scent: "Lemongrass",
        inStock: 1,
        featured: 1,
      },
      {
        name: "Krabi Coconut Cream Bath Bomb",
        category: "soap" as const,
        price: 899,
        description: "A luxurious bath bomb made with cold-pressed coconut oil from Krabi. Dissolves into creamy, skin-softening foam that hydrates and soothes. Contains real coconut flakes and sea minerals for a truly tropical bathing experience.",
        shortDesc: "Coconut oil bath bomb from Krabi",
        image: "/images/product-03.jpg",
        images: JSON.stringify(["/images/product-09.jpg"]),
        ingredients: "Sodium bicarbonate, citric acid, Krabi coconut oil, cornstarch, coconut flakes, sea salt, vitamin E",
        weight: "150g",
        scent: "Coconut & Sea Salt",
        inStock: 1,
        featured: 1,
      },
      {
        name: "Midnight Jasmine Reed Diffuser",
        category: "candle" as const,
        price: 2499,
        description: "An elegant reed diffuser that fills your space with the intoxicating scent of Thai jasmine blossoms. The amber glass vessel is hand-blown by artisans in Bangkok, while the natural rattan reeds ensure a steady, subtle fragrance release for up to three months.",
        shortDesc: "Thai jasmine reed diffuser",
        image: "/images/product-04.jpg",
        images: JSON.stringify(["/images/lifestyle-01.jpg"]),
        ingredients: "Jasmine essential oil, natural carrier oil, hand-blown amber glass, natural rattan reeds",
        burnTime: "3 months",
        scent: "Thai Jasmine",
        inStock: 1,
        featured: 1,
      },
      {
        name: "Rice Milk & Honey Soap",
        category: "soap" as const,
        price: 999,
        description: "A gentle, moisturizing soap made with organic jasmine rice milk and raw Thai honey. Rich in vitamins and amino acids, it soothes sensitive skin while leaving a subtle sweet fragrance. Inspired by traditional Thai beauty rituals.",
        shortDesc: "Gentle rice milk and honey soap",
        image: "/images/product-05.jpg",
        images: JSON.stringify(["/images/product-01.jpg"]),
        ingredients: "Rice milk, Thai honey, shea butter, coconut oil, olive oil, vitamin E",
        weight: "110g",
        scent: "Honey & Rice Milk",
        inStock: 1,
        featured: 0,
      },
      {
        name: "Sandalwood Meditation Candle",
        category: "candle" as const,
        price: 2199,
        description: "A deeply grounding candle with the warm, woody scent of Thai sandalwood. Perfect for meditation and creating a calming atmosphere. Hand-poured in a reusable stoneware jar with a bamboo lid.",
        shortDesc: "Grounding sandalwood candle",
        image: "/images/product-06.jpg",
        images: JSON.stringify(["/images/product-02.jpg"]),
        ingredients: "Soy wax, sandalwood essential oil, cotton wick, stoneware vessel",
        burnTime: "50 hours",
        scent: "Sandalwood",
        inStock: 1,
        featured: 0,
      },
      {
        name: "Botanical Sampler Set",
        category: "gift_set" as const,
        price: 3499,
        description: "A curated collection of five mini soap bars, each featuring a different Thai botanical: lemongrass, jasmine, turmeric, coconut, and pandan. Beautifully packaged in a handmade kraft box with dried flower garnish.",
        shortDesc: "Five mini soaps in a gift box",
        image: "/images/product-07.jpg",
        images: JSON.stringify(["/images/product-08.jpg"]),
        ingredients: "Varies by bar - all natural oils and botanical extracts",
        weight: "5 x 40g",
        scent: "Assorted Botanicals",
        inStock: 1,
        featured: 1,
      },
      {
        name: "Spa Retreat Gift Set",
        category: "gift_set" as const,
        price: 4999,
        description: "The ultimate Thai spa experience in a box. Includes a full-size botanical soap, a soy candle in ceramic vessel, a coconut bath bomb, and a sample of our jasmine reed diffuser. Nestled in natural kraft paper with Thai silk ribbon.",
        shortDesc: "Complete Thai spa experience",
        image: "/images/product-08.jpg",
        images: JSON.stringify(["/images/product-07.jpg"]),
        ingredients: "See individual products",
        weight: "800g total",
        scent: "Assorted",
        inStock: 1,
        featured: 1,
      },
      {
        name: "Pandan Leaf & Lime Soap",
        category: "soap" as const,
        price: 1199,
        description: "A refreshing soap combining the grassy sweetness of pandan leaves with zesty Thai lime. The natural green color comes from fresh pandan extract. Leaves skin feeling invigorated and clean with a uniquely Thai fragrance.",
        shortDesc: "Fresh pandan and lime soap",
        image: "/images/product-09.jpg",
        images: JSON.stringify(["/images/product-03.jpg"]),
        ingredients: "Coconut oil, olive oil, pandan extract, lime essential oil, shea butter, spirulina powder",
        weight: "120g",
        scent: "Pandan & Lime",
        inStock: 1,
        featured: 0,
      },
      {
        name: "Orchid & Vanilla Candle",
        category: "candle" as const,
        price: 1999,
        description: "A romantic candle blending the exotic floral notes of Thai orchids with creamy vanilla. Hand-poured in a frosted glass vessel that casts a warm, diffused glow. Perfect for creating an intimate atmosphere.",
        shortDesc: "Orchid and vanilla soy candle",
        image: "/images/lifestyle-02.jpg",
        images: JSON.stringify(["/images/product-04.jpg"]),
        ingredients: "Soy wax, orchid fragrance oil, vanilla essential oil, cotton wick, frosted glass",
        burnTime: "40 hours",
        scent: "Orchid & Vanilla",
        inStock: 1,
        featured: 0,
      },
      {
        name: "Charcoal & Tea Tree Detox Soap",
        category: "soap" as const,
        price: 1399,
        description: "A deep-cleansing soap featuring activated bamboo charcoal and tea tree oil. Sourced from northern Thai bamboo forests, the charcoal draws out impurities while tea tree oil provides natural antibacterial properties. Ideal for oily and acne-prone skin.",
        shortDesc: "Detoxifying charcoal soap",
        image: "/images/product-01.jpg",
        images: JSON.stringify(["/images/product-05.jpg"]),
        ingredients: "Activated bamboo charcoal, tea tree oil, coconut oil, olive oil, shea butter, vitamin E",
        weight: "130g",
        scent: "Tea Tree",
        inStock: 1,
        featured: 0,
      },
      {
        name: "Mango & Sticky Rice Candle",
        category: "candle" as const,
        price: 1799,
        description: "A deliciously scented candle inspired by Thailand's beloved mango sticky rice dessert. Sweet mango blends with creamy coconut and a hint of toasted rice for a comforting, gourmand fragrance.",
        shortDesc: "Mango sticky rice inspired candle",
        image: "/images/product-03.jpg",
        images: JSON.stringify(["/images/product-06.jpg"]),
        ingredients: "Soy wax, mango fragrance, coconut oil, rice absolute, cotton wick",
        burnTime: "42 hours",
        scent: "Mango & Coconut",
        inStock: 1,
        featured: 0,
      },
      {
        name: "Rose & Goat Milk Soap",
        category: "soap" as const,
        price: 1499,
        description: "An ultra-luxurious soap combining Bulgarian rose essential oil with creamy Thai goat milk. The rose petals are hand-dried and infused into the soap for gentle exfoliation. Leaves skin silky smooth with an elegant floral scent.",
        shortDesc: "Luxurious rose and goat milk soap",
        image: "/images/product-05.jpg",
        images: JSON.stringify(["/images/product-02.jpg"]),
        ingredients: "Thai goat milk, rose essential oil, dried rose petals, olive oil, coconut oil, shea butter",
        weight: "115g",
        scent: "Bulgarian Rose",
        inStock: 1,
        featured: 0,
      },
      {
        name: "Tropical Paradise Gift Set",
        category: "gift_set" as const,
        price: 5999,
        description: "A lavish gift set featuring our most popular tropical scents: a Krabi coconut bath bomb, a mango & sticky rice candle, a pandan & lime soap, and a lemongrass body oil. All packaged in a handwoven bamboo basket.",
        shortDesc: "Tropical scent collection",
        image: "/images/product-07.jpg",
        images: JSON.stringify(["/images/product-08.jpg"]),
        ingredients: "See individual products",
        weight: "1.2kg total",
        scent: "Tropical Assortment",
        inStock: 1,
        featured: 0,
      },
      {
        name: "Ylang-Ylang & Patchouli Candle",
        category: "candle" as const,
        price: 2099,
        description: "A sensual, exotic candle blending the sweet floral notes of ylang-ylang with earthy patchouli. This sophisticated fragrance evokes the atmosphere of a Thai aromatherapy spa. Hand-poured in a sleek black ceramic vessel.",
        shortDesc: "Sensual ylang-ylang candle",
        image: "/images/product-04.jpg",
        images: JSON.stringify(["/images/lifestyle-01.jpg"]),
        ingredients: "Soy wax, ylang-ylang essential oil, patchouli essential oil, cotton wick, ceramic vessel",
        burnTime: "48 hours",
        scent: "Ylang-Ylang & Patchouli",
        inStock: 1,
        featured: 0,
      },
    ];

    await ctx.db.insert(products).values(seedProducts);
    return { message: "Products seeded successfully", count: seedProducts.length };
  }),
});
