import { router } from "../trpc";
import { authRouter } from "./auth";
import { productRouter } from "./product";
import { cartRouter } from "./cart";
import { orderRouter } from "./order";
import { contactRouter } from "./contact";
import { aiChatRouter } from "./aiChat";

export const appRouter = router({
  auth: authRouter,
  product: productRouter,
  cart: cartRouter,
  order: orderRouter,
  contact: contactRouter,
  aiChat: aiChatRouter,
});

export type AppRouter = typeof appRouter;
