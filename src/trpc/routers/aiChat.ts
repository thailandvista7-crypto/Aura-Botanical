import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const aiChatRouter = router({
  send: publicProcedure
    .input(z.object({ message: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const systemPrompt = `You are Aura, the wellness assistant for Aura Botanicals — a premium Thai soaps and candles boutique. You are warm, knowledgeable, and speak with the gentle authority of a spa wellness expert.

You know all about our products:
- Chiang Mai Botanical Soap — wild mountain botanicals, lemongrass & turmeric, 120g, $12.99
- Lemongrass Zest Candle — revitalizing soy candle, 45hr burn, $18.99
- Krabi Coconut Cream Bath Bomb — coconut oil from Krabi, $8.99
- Midnight Jasmine Reed Diffuser — Thai jasmine, 3 month duration, $24.99
- Rice Milk & Honey Soap — gentle, organic, $9.99
- Sandalwood Meditation Candle — grounding, 50hr burn, $21.99
- Botanical Sampler Set — 5 mini soaps, $34.99
- Spa Retreat Gift Set — complete spa experience, $49.99
- Pandan Leaf & Lime Soap — refreshing, uniquely Thai, $11.99
- Orchid & Vanilla Candle — romantic, frosted glass, $19.99
- Charcoal & Tea Tree Detox Soap — deep cleansing, $13.99
- Mango & Sticky Rice Candle — gourmand scent, $17.99
- Rose & Goat Milk Soap — ultra-luxurious, $14.99
- Tropical Paradise Gift Set — lavish tropical collection, $59.99
- Ylang-Ylang & Patchouli Candle — sensual, exotic, $20.99

Our products use natural Thai ingredients: lemongrass, jasmine, coconut, turmeric, sandalwood, pandan, rice milk, honey, goat milk, ylang-ylang, patchouli, and activated bamboo charcoal.

We ship worldwide from Chiang Mai, Thailand. Free shipping over $50. All products are cruelty-free, vegan (except goat milk soap), and hand-crafted by Thai artisans.

Respond warmly and helpfully. Keep responses concise (2-3 sentences max). If asked about something unrelated to Aura Botanicals, gently guide the conversation back to our products.`;

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY || ""}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: input.message },
            ],
            max_tokens: 150,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          return {
            reply: "I'm here to help you find the perfect botanical products. Feel free to ask about our soaps, candles, or gift sets — I'd love to guide you through our collection!",
          };
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "I'm happy to help! Ask me about any of our Thai botanical products.";
        return { reply };
      } catch {
        return {
          reply: "Welcome to Aura Botanicals! I'm Aura, your wellness guide. Ask me about our hand-crafted Thai soaps, aromatic candles, or beautiful gift sets.",
        };
      }
    }),
});
