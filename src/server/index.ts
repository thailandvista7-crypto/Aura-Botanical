import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users, products } from "../db/schema"; // ✅ added products
import { eq } from "drizzle-orm";
import { appRouter } from "../trpc/routers/_app";
import { createContext } from "../trpc/trpc";

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
    // 👤 Admin
    const existingUsers = await db.select().from(users);
    if (existingUsers.length === 0) {
      await db.insert(users).values({
        email: "admin@aurabotanicals.com",
        name: "Admin",
        role: "admin",
      });
    }

    // 🛍 PRODUCTS
    const existingProducts = await db.select().from(products);

    if (existingProducts.length === 0) {
      await db.insert(products).values([
        { name: "Lavender Soap", description: "Relaxing lavender herbal soap", price: 899, image: "/images/p1.jpg", category: "soap", inStock: true },
        { name: "Rose Soap", description: "Soft rose skin soap", price: 799, image: "/images/p2.jpg", category: "soap", inStock: true },
        { name: "Charcoal Soap", description: "Deep cleansing charcoal soap", price: 999, image: "/images/p3.jpg", category: "soap", inStock: true },
        { name: "Mint Soap", description: "Cooling mint herbal soap", price: 850, image: "/images/p4.jpg", category: "soap", inStock: true },
        { name: "Turmeric Soap", description: "Brightening turmeric soap", price: 950, image: "/images/p5.jpg", category: "soap", inStock: true },

        { name: "Vanilla Candle", description: "Sweet vanilla aroma candle", price: 1299, image: "/images/p6.jpg", category: "candle", inStock: true },
        { name: "Rose Candle", description: "Romantic rose candle", price: 1399, image: "/images/p7.jpg", category: "candle", inStock: true },
        { name: "Lavender Candle", description: "Relaxing lavender candle", price: 1499, image: "/images/p8.jpg", category: "candle", inStock: true },
        { name: "Coconut Candle", description: "Tropical coconut scent", price: 1199, image: "/images/p9.jpg", category: "candle", inStock: true },
        { name: "Sandalwood Candle", description: "Warm sandalwood fragrance", price: 1599, image: "/images/p10.jpg", category: "candle", inStock: true },

        { name: "Mini Gift Set", description: "Small soap gift set", price: 1999, image: "/images/p11.jpg", category: "gift_set", inStock: true },
        { name: "Luxury Gift Box", description: "Premium botanical set", price: 3499, image: "/images/p12.jpg", category: "gift_set", inStock: true },
        { name: "Couple Gift Set", description: "Perfect couple combo", price: 2999, image: "/images/p13.jpg", category: "gift_set", inStock: true },
        { name: "Spa Kit", description: "Home spa experience kit", price: 3999, image: "/images/p14.jpg", category: "gift_set", inStock: true },
        { name: "Wellness Bundle", description: "Complete wellness package", price: 4599, image: "/images/p15.jpg", category: "gift_set", inStock: true },
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
