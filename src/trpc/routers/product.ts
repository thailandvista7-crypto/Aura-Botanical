import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../trpc";
import { products } from "../../db/schema";
import { eq, desc } from "drizzle-orm";

/* ================= PRODUCT ROUTER ================= */

export const productRouter = router({

  /* ================= LIST PRODUCTS ================= */
  list: publicProcedure
    .input(
      z.object({
        category: z.string().optional(), // ✅ FIX: allow empty string
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(12),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page || 1;
      const limit = input?.limit || 12;
      const offset = (page - 1) * limit;

      // ✅ Normalize category
      const category =
        input?.category && input.category !== ""
          ? input.category
          : undefined;

      let query;

      if (category) {
        query = ctx.db
          .select()
          .from(products)
          .where(eq(products.category, category))
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

      const countResult = category
        ? await ctx.db
            .select()
            .from(products)
            .where(eq(products.category, category))
        : await ctx.db.select().from(products);

      return {
        items,
        total: countResult.length,
        page,
        limit,
        totalPages: Math.ceil(countResult.length / limit),
      };
    }),

  /* ================= GET BY ID ================= */
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(products)
        .where(eq(products.id, input.id))
        .limit(1);

      return result[0] || null;
    }),

  /* ================= FEATURED ================= */
  featured: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(products)
      .where(eq(products.featured, 1))
      .limit(8);
  }),

  /* ================= SEED ================= */
  seed: adminProcedure.mutation(async ({ ctx }) => {
    const existing = await ctx.db.select().from(products);

    if (existing.length > 0) {
      return {
        message: "Products already seeded",
        count: existing.length,
      };
    }

    const seedProducts = [
      {
        name: "Lavender Soap",
        category: "soap",
        price: 899,
        description: "Relaxing lavender soap",
        shortDesc: "Calming herbal soap",
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108",
        inStock: 1,
        featured: 1,
      },
      {
        name: "Rose Soap",
        category: "soap",
        price: 799,
        description: "Natural rose soap",
        shortDesc: "Soft floral soap",
        image: "https://images.unsplash.com/photo-1585386959984-a41552231658",
        inStock: 1,
        featured: 1,
      },
      {
        name: "Charcoal Soap",
        category: "soap",
        price: 999,
        description: "Deep cleansing charcoal soap",
        shortDesc: "Detox soap",
        image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb",
        inStock: 1,
        featured: 0,
      },
      {
        name: "Mint Soap",
        category: "soap",
        price: 850,
        description: "Cooling mint soap",
        shortDesc: "Fresh mint",
        image: "https://images.unsplash.com/photo-1590080875515-8ec64895b423",
        inStock: 1,
        featured: 0,
      },
      {
        name: "Turmeric Soap",
        category: "soap",
        price: 950,
        description: "Brightening turmeric soap",
        shortDesc: "Glow soap",
        image: "https://images.unsplash.com/photo-1615486363972-8c3b2b7c6f9c",
        inStock: 1,
        featured: 0,
      },
      {
        name: "Vanilla Candle",
        category: "candle",
        price: 1299,
        description: "Sweet vanilla candle",
        shortDesc: "Cozy scent",
        image: "https://images.unsplash.com/photo-1603006905003-be475563bc59",
        inStock: 1,
        featured: 1,
      },
      {
        name: "Rose Candle",
        category: "candle",
        price: 1399,
        description: "Romantic rose candle",
        shortDesc: "Floral candle",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
        inStock: 1,
        featured: 1,
      },
      {
        name: "Lavender Candle",
        category: "candle",
        price: 1499,
        description: "Relaxing lavender candle",
        shortDesc: "Calm candle",
        image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924",
        inStock: 1,
        featured: 0,
      },
      {
        name: "Coconut Candle",
        category: "candle",
        price: 1199,
        description: "Tropical coconut candle",
        shortDesc: "Beach scent",
        image: "https://images.unsplash.com/photo-1612197528062-432c1c3f3a8f",
        inStock: 1,
        featured: 0,
      },
      {
        name: "Sandalwood Candle",
        category: "candle",
        price: 1599,
        description: "Warm sandalwood candle",
        shortDesc: "Woody scent",
        image: "https://images.unsplash.com/photo-1602874801006-6d1b6f7d98ae",
        inStock: 1,
        featured: 0,
      },
      {
        name: "Mini Gift Set",
        category: "gift_set",
        price: 1999,
        description: "Mini gift set",
        shortDesc: "Perfect gift",
        image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb",
        inStock: 1,
        featured: 1,
      },
      {
        name: "Luxury Gift Box",
        category: "gift_set",
        price: 3499,
        description: "Luxury gift box",
        shortDesc: "Premium set",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
        inStock: 1,
        featured: 1,
      },
      {
        name: "Couple Gift Set",
        category: "gift_set",
        price: 2999,
        description: "Couple gift set",
        shortDesc: "Perfect combo",
        image: "https://images.unsplash.com/photo-1616627459659-75e9e63a4f6c",
        inStock: 1,
        featured: 0,
      },
      {
        name: "Spa Kit",
        category: "gift_set",
        price: 3999,
        description: "Spa kit",
        shortDesc: "Relax set",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03",
        inStock: 1,
        featured: 0,
      },
      {
        name: "Wellness Bundle",
        category: "gift_set",
        price: 4599,
        description: "Wellness bundle",
        shortDesc: "Complete care",
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108",
        inStock: 1,
        featured: 0,
      },
    ];

    await ctx.db.insert(products).values(seedProducts);

    return {
      message: "Products seeded successfully",
      count: seedProducts.length,
    };
  }),
});
