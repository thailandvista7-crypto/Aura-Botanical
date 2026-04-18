import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { router, publicProcedure } from "../trpc";
import { localUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "aura-botanicals-secret-key-2024";

export const authRouter = router({
  me: publicProcedure.query(async ({ ctx }) => {
    return ctx.user || null;
  }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return { success: true };
  }),

  localRegister: publicProcedure
    .input(
      z.object({
        username: z.string().min(3).max(30),
        password: z.string().min(6),
        displayName: z.string().optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.localUsers.findFirst({
        where: eq(localUsers.username, input.username),
      });
      if (existing) {
        throw new Error("Username already taken");
      }

      const passwordHash = await bcrypt.hash(input.password, 10);
      const result = await ctx.db
        .insert(localUsers)
        .values({
          username: input.username,
          displayName: input.displayName || input.username,
          passwordHash,
          email: input.email,
        })
        .returning();

      const user = result[0];
      const token = jwt.sign(
        { id: user.id, type: "local" },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      ctx.res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      return {
        id: user.id,
        name: user.displayName || user.username,
        username: user.username,
        role: user.role,
      };
    }),

  localLogin: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.localUsers.findFirst({
        where: eq(localUsers.username, input.username),
      });
      if (!user) {
        throw new Error("Invalid username or password");
      }

      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) {
        throw new Error("Invalid username or password");
      }

      const token = jwt.sign(
        { id: user.id, type: "local" },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      ctx.res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      return {
        id: user.id,
        name: user.displayName || user.username,
        username: user.username,
        role: user.role,
      };
    }),
});
