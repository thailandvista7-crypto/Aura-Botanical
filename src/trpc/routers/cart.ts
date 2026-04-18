import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { cartItems, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const cartRouter = router({
  get: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const items = await ctx.db
        .select()
        .from(cartItems)
        .where(eq(cartItems.sessionId, input.sessionId));

      const itemsWithProducts = await Promise.all(
        items.map(async (item) => {
          const product = await ctx.db
            .select()
            .from(products)
            .where(eq(products.id, item.productId))
            .limit(1);
          return {
            ...item,
            product: product[0] || null,
          };
        })
      );

      const total = itemsWithProducts.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
      );

      return { items: itemsWithProducts, total };
    }),

  add: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        productId: z.number(),
        quantity: z.number().min(1).default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.sessionId, input.sessionId),
            eq(cartItems.productId, input.productId)
          )
        )
        .limit(1);

      if (existing[0]) {
        await ctx.db
          .update(cartItems)
          .set({ quantity: existing[0].quantity + input.quantity })
          .where(eq(cartItems.id, existing[0].id));
        return { updated: true };
      }

      await ctx.db.insert(cartItems).values({
        sessionId: input.sessionId,
        productId: input.productId,
        quantity: input.quantity,
      });
      return { added: true };
    }),

  update: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        itemId: z.number(),
        quantity: z.number().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(cartItems)
        .set({ quantity: input.quantity })
        .where(eq(cartItems.id, input.itemId));
      return { updated: true };
    }),

  remove: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        itemId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(cartItems)
        .where(eq(cartItems.id, input.itemId));
      return { removed: true };
    }),

  clear: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(cartItems)
        .where(eq(cartItems.sessionId, input.sessionId));
      return { cleared: true };
    }),
});
