import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users, products } from "../db/schema";
import { eq } from "drizzle-orm";
import { appRouter } from "../trpc/routers/_app";
import { createContext } from "../trpc/trpc";

const JWT_SECRET =
  process.env.JWT_SECRET || "aura-botanicals-secret-key-2024";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

const app = express();

/* ================= CORS ================= */
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? true
        : "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(passport.initialize());
app.use(express.json());

/* ================= GOOGLE AUTH ================= */
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName;
          const avatar = profile.photos?.[0]?.value;

          if (!email) return done(new Error("No email"));

          let user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });

          if (!user) {
            const result = await db
              .insert(users)
              .values({ email, name, avatar })
              .returning();
            user = result[0];
          }

          return done(null, user);
        } catch (err) {
          return done(err as Error);
        }
      }
    )
  );

  app.get(
    "/api/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
      const user = req.user as any;

      const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      res.redirect("/");
    }
  );
}

/* ================= tRPC ================= */
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

/* ================= SEED ================= */
app.post("/api/seed", async (_req, res) => {
  try {
    const existing = await db.select().from(products);

    if (existing.length === 0) {
      await db.insert(products).values([
        {
          name: "Lavender Soap",
          description: "Relaxing lavender soap",
          price: 899,
          image:
            "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108",
          category: "soap",
          inStock: 1,
        },
        {
          name: "Rose Candle",
          description: "Romantic rose candle",
          price: 1399,
          image:
            "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
          category: "candle",
          inStock: 1,
        },
        {
          name: "Gift Set",
          description: "Beautiful gift set",
          price: 2999,
          image:
            "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb",
          category: "gift_set",
          inStock: 1,
        },
      ]);
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

/* ================= HEALTH ================= */
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

/* ================= SERVE FRONTEND ================= */
if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist"));

  app.get("*", (_req, res) => {
    res.sendFile("dist/index.html", { root: "." });
  });
}

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(Server running on http://localhost:${PORT});
});
