import { voicesRouter } from "@/features/voices/server/procedures"
import { createTRPCRouter } from "../init"
import { generationsRouter } from "@/features/text-to-speech/server/procedures"
import { billingRouter } from "@/features/billing/server/procedures"

export const appRouter = createTRPCRouter({
  voices: voicesRouter,
  generations: generationsRouter,
  billing: billingRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
