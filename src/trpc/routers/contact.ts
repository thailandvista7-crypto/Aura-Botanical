import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../trpc";
import { contactMessages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const contactRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        subject: z.string().optional(),
        message: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(contactMessages)
        .values({
          name: input.name,
          email: input.email,
          subject: input.subject,
          message: input.message,
        })
        .returning();
      return result[0];
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
        .from(contactMessages)
        .orderBy(desc(contactMessages.createdAt))
        .limit(limit)
        .offset(offset);

      const all = await ctx.db.select().from(contactMessages);

      return {
        items,
        total: all.length,
        page,
        limit,
        totalPages: Math.ceil(all.length / limit),
      };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(contactMessages)
        .where(eq(contactMessages.id, input.id));
      return { deleted: true };
    }),
});
