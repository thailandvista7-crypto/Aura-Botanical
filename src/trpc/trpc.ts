import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { users, localUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "aura-botanicals-secret-key-2024";

export type UnifiedUser = {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
  role: "user" | "admin";
  authType: "oauth" | "local";
};

export async function createContext({ req, res }: CreateExpressContextOptions) {
  const token = req.cookies?.auth_token;
  let user: UnifiedUser | null = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: number;
        type: "oauth" | "local";
      };

      if (decoded.type === "oauth") {
        const oauthUser = await db.query.users.findFirst({
          where: eq(users.id, decoded.id),
        });
        if (oauthUser) {
          user = {
            id: oauthUser.id,
            name: oauthUser.name || oauthUser.email,
            email: oauthUser.email,
            avatar: oauthUser.avatar || undefined,
            role: oauthUser.role as "user" | "admin",
            authType: "oauth",
          };
        }
      } else {
        const localUser = await db.query.localUsers.findFirst({
          where: eq(localUsers.id, decoded.id),
        });
        if (localUser) {
          user = {
            id: localUser.id,
            name: localUser.displayName || localUser.username,
            email: localUser.email || undefined,
            role: localUser.role as "user" | "admin",
            authType: "local",
          };
        }
      }
    } catch {
      user = null;
    }
  }

  return { req, res, user, db };
}

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const authedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
