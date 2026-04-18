import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../trpc";
import { orders, cartItems, products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const orderRouter = router({
  create: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        customerName: z.string().min(1),
        customerEmail: z.string().email(),
        shippingAddress: z.string().min(1),
        city: z.string().min(1),
        postalCode: z.string().min(1),
        country: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const cart = await ctx.db
        .select()
        .from(cartItems)
        .where(eq(cartItems.sessionId, input.sessionId));

      if (cart.length === 0) {
        throw new Error("Cart is empty");
      }

      const itemsWithProducts = await Promise.all(
        cart.map(async (item) => {
          const product = await ctx.db
            .select()
            .from(products)
            .where(eq(products.id, item.productId))
            .limit(1);
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: product[0]?.price || 0,
            name: product[0]?.name || "Unknown",
          };
        })
      );

      const subtotal = itemsWithProducts.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const shipping = subtotal > 5000 ? 0 : 599;
      const total = subtotal + shipping;

      const result = await ctx.db
        .insert(orders)
        .values({
          sessionId: input.sessionId,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          shippingAddress: input.shippingAddress,
          city: input.city,
          postalCode: input.postalCode,
          country: input.country,
          items: JSON.stringify(itemsWithProducts),
          subtotal,
          shipping,
          total,
        })
        .returning();

      // Clear cart after order
      await ctx.db
        .delete(cartItems)
        .where(eq(cartItems.sessionId, input.sessionId));

      return result[0];
    }),

  getBySession: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(orders)
        .where(eq(orders.sessionId, input.sessionId))
        .orderBy(desc(orders.createdAt));
    }),

  list: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page || 1;
      const limit = input?.limit || 20;
      const offset = (page - 1) * limit;

      const items = await ctx.db
        .select()
        .from(orders)
        .orderBy(desc(orders.createdAt))
        .limit(limit)
        .offset(offset);

      const all = await ctx.db.select().from(orders);

      return {
        items,
        total: all.length,
        page,
        limit,
        totalPages: Math.ceil(all.length / limit),
      };
    }),

  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(orders)
        .set({ status: input.status })
        .where(eq(orders.id, input.id));
      return { updated: true };
    }),
});
