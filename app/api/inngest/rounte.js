import { serve } from "inngest/next";
import { inngest, syncUserCreation, syncUserupdation, syncUserdeletion } from "@/config/inngest";

export default serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserupdation,
    syncUserdeletion,
  ],
});