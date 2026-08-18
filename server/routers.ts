import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { z } from "zod";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  copilot: router({
    ask: publicProcedure
      .input(z.object({ prompt: z.string().min(1).max(2000), context: z.string().max(5000).optional() }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          model: "gpt-5-mini",
          messages: [
            {
              role: "system",
              content: "You are StockPilot Copilot, an operations intelligence assistant for warehouse teams. Use only the supplied warehouse context. Be concise and practical. Structure every answer with: Situation, Recommended next move, Why, and Operator check. Never claim to have sent a customer message, changed inventory, released an order, or executed an external action. Mark uncertain information as an assumption. Prioritize safety, stock accuracy, customer promise protection, and auditable human approval.",
            },
            { role: "user", content: `Warehouse context:\n${input.context || "No additional context supplied."}\n\nOperator request:\n${input.prompt}` },
          ],
          reasoning: { effort: "low" },
          maxTokens: 700,
        });
        const content = response.choices?.[0]?.message?.content;
        if (typeof content !== "string" || !content.trim()) throw new Error("Copilot returned an empty response");
        return { content };
      }),
  }),
});

export type AppRouter = typeof appRouter;
