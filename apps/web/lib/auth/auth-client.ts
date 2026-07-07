import { magicLinkClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "@/lib/auth/auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [
    magicLinkClient(),
    inferAdditionalFields<typeof auth>(),
  ],
});

export const { signIn, signOut, signUp, useSession, getSession } = authClient;
