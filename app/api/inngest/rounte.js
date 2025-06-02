import { serve } from "inngest/next";
import { inngest, syncUserCreation, syncUserdeletion, syncUserupdation } from "@/config/inngest";

const handler = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserupdation,
    syncUserdeletion,
  ],
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
