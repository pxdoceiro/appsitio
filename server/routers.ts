import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { ENV } from "./_core/env";
import { transcribeAudio } from "./_core/voiceTranscription";
import { z } from "zod";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  audio: router({
    transcribe: publicProcedure
      .input(
        z.object({
          audioUrl: z.string().min(1),
          language: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await transcribeAudio({
            audioUrl: input.audioUrl,
            language: input.language,
          });

          // Type guard to check if result is an error
          if (result && typeof result === "object" && "error" in result) {
            return {
              success: false,
              error: (result as any).error || "Nao foi possivel transcrever o audio",
            };
          }

          return {
            success: true,
            text: (result as any).text || "",
            language: (result as any).language,
          };
        } catch (error) {
          console.error("Erro ao transcrever audio:", error);
          return {
            success: false,
            error: "Nao foi possivel transcrever o audio",
          };
        }
      }),
  }),

  chat: router({
    sendMessage: publicProcedure
      .input(
        z.object({
          characterId: z.string(),
          characterName: z.string(),
          systemPrompt: z.string(),
          messages: z.array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          ),
          userMessage: z.string(),
          maxTokens: z.number().int().min(32).max(512).optional(),
        })
      )
      .mutation(async ({ input }) => {
        if (!ENV.forgeApiKey) {
          return {
            success: false,
            response: "Chave da IA nao configurada. Defina BUILT_IN_FORGE_API_KEY no servidor.",
          };
        }
        try {
          // Preparar mensagens para o LLM
          const llmMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
            {
              role: "system",
              content: input.systemPrompt,
            },
            ...input.messages.map((msg) => ({
              role: (msg.role === "user" ? "user" : "assistant") as "user" | "assistant",
              content: msg.content,
            })),
            {
              role: "user",
              content: input.userMessage,
            },
          ];

          const attemptInvoke = async (overrideModel?: string) =>
            invokeLLM({
              messages: llmMessages,
              maxTokens: input.maxTokens,
              model: overrideModel,
            });

          let response;
          try {
            response = await attemptInvoke();
          } catch (error) {
            console.error("Erro ao chamar LLM (tentativa 1):", error);
            await new Promise((resolve) => setTimeout(resolve, 800));
            response = await attemptInvoke("openrouter/auto");
          }

          // Extrair texto da resposta
          const responseText =
            response.choices?.[0]?.message?.content ||
            "Desculpe, nao consegui responder.";

          return {
            success: true,
            response: responseText,
          };
        } catch (error) {
          console.error("Erro ao processar mensagem:", error);
          return {
            success: false,
            response:
              "Desculpe, ocorreu um erro ao processar sua mensagem.",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
