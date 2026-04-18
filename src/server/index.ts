import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { appRouter } from "@/trpc/routers/_app";
import { createContext } from "@/trpc/trpc";

const JWT_SECRET = process.env.JWT_SECRET || "aura-botanicals-secret-key-2024";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === "production" ? true : "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.json());

// Google OAuth Strategy
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
        try {
          const email = profile.emails?.[0]?.value as string | undefined;
          const name = profile.displayName as string | undefined;
          const avatar = profile.photos?.[0]?.value as string | undefined;

          if (!email) {
            return done(new Error("No email from Google"));
          }

          let user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });

          if (!user) {
            const result = await db
              .insert(users)
              .values({ email, name, avatar })
              .returning();
            user = result[0];
          } else if (!user.name || !user.avatar) {
            await db
              .update(users)
              .set({
                name: user.name || name,
                avatar: user.avatar || avatar,
              })
              .where(eq(users.id, user.id));
            user = { ...user, name: user.name || name || null, avatar: user.avatar || avatar || null };
          }

          return done(null, user);
        } catch (err) {
          return done(err as Error);
        }
      }
    )
  );

  // OAuth Routes
  app.get(
    "/api/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
      const user = req.user as { id: number; email: string; name?: string | null; avatar?: string | null };
      const token = jwt.sign(
        { id: user.id, type: "oauth" },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      res.redirect("/");
    }
  );
} else {
  // Placeholder routes when OAuth not configured
  app.get("/api/auth/google", (_req, res) => {
    res.status(503).json({ error: "Google OAuth not configured" });
  });
}

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Seed endpoint
app.post("/api/seed", async (_req, res) => {
  try {
    const existing = await db.select().from(users);
    if (existing.length === 0) {
      // Create a default admin user
      await db.insert(users).values({
        email: "admin@aurabotanicals.com",
        name: "Admin",
        role: "admin",
      });
    }
    res.json({ success: true, message: "Database seeded" });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist"));
  app.get("*", (_req, res) => {
    res.sendFile("dist/index.html", { root: "." });
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
