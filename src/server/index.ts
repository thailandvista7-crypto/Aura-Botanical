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

const JWT_SECRET = process.env.JWT_SECRET || "aura-botanicals-secret-key-2024";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

const app = express();

/* ================= CORS FIX ================= */
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

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
            const result = await db.insert(users).values({ email, name, avatar }).returning();
            user = result[0];
          }

          return done(null, user);
        } catch (err) {
          return done(err as Error);
        }
      }
    )
  );

  app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
      const user = req.user as any;

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: false,
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
    // Admin
    const existingUsers = await db.select().from(users);
    if (existingUsers.length === 0) {
      await db.insert(users).values({
        email: "admin@aurabotanicals.com",
        name: "Admin",
        role: "admin",
      });
    }

    // Products
    const existingProducts = await db.select().from(products);

    if (existingProducts.length === 0) {
      await db.insert(products).values([
        // SOAPS
        { name: "Lavender Soap", description: "Relaxing lavender herbal soap", price: 899, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108", category: "soap", inStock: true },
        { name: "Rose Soap", description: "Soft rose skin soap", price: 799, image: "https://images.unsplash.com/photo-1585386959984-a41552231658", category: "soap", inStock: true },
        { name: "Charcoal Soap", description: "Deep cleansing charcoal soap", price: 999, image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb", category: "soap", inStock: true },
        { name: "Mint Soap", description: "Cooling mint herbal soap", price: 850, image: "https://images.unsplash.com/photo-1590080875515-8ec64895b423", category: "soap", inStock: true },
        { name: "Turmeric Soap", description: "Brightening turmeric soap", price: 950, image: "https://images.unsplash.com/photo-1615486363972-8c3b2b7c6f9c", category: "soap", inStock: true },

        // CANDLES
        { name: "Vanilla Candle", description: "Sweet vanilla aroma candle", price: 1299, image: "https://images.unsplash.com/photo-1603006905003-be475563bc59", category: "candle", inStock: true },
        { name: "Rose Candle", description: "Romantic rose candle", price: 1399, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c", category: "candle", inStock: true },
        { name: "Lavender Candle", description: "Relaxing lavender candle", price: 1499, image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924", category: "candle", inStock: true },
        { name: "Coconut Candle", description: "Tropical coconut scent", price: 1199, image: "https://images.unsplash.com/photo-1612197528062-432c1c3f3a8f", category: "candle", inStock: true },
        { name: "Sandalwood Candle", description: "Warm sandalwood fragrance", price: 1599, image: "https://images.unsplash.com/photo-1602874801006-6d1b6f7d98ae", category: "candle", inStock: true },

        // GIFT SETS
        { name: "Mini Gift Set", description: "Small soap gift set", price: 1999, image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb", category: "gift_set", inStock: true },
        { name: "Luxury Gift Box", description: "Premium botanical set", price: 3499, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf", category: "gift_set", inStock: true },
        { name: "Couple Gift Set", description: "Perfect couple combo", price: 2999, image: "https://images.unsplash.com/photo-1616627459659-75e9e63a4f6c", category: "gift_set", inStock: true },
        { name: "Spa Kit", description: "Home spa experience kit", price: 3999, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03", category: "gift_set", inStock: true },
        { name: "Wellness Bundle", description: "Complete wellness package", price: 4599, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108", category: "gift_set", inStock: true },
      ]);
    }

    res.json({ success: true, message: "Seed completed with products" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

/* ================= HEALTH ================= */
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

/* ================= SERVER ================= */
const PORT = 3001;
app.listen(PORT, () => {
  console.log(✅ Server running on http://localhost:${PORT});
});
