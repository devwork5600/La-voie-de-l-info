import {
  magicLinkClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { auth } from "@/lib/auth/auth";

export const authClient = createAuthClient({
  // Left unset in production so requests stay same-origin (the auth API lives
  // in this same app) — hardcoding a URL here breaks on any domain other than
  // the one it was baked in for. Only override via env when auth is genuinely
  // served from a different origin.
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || undefined,
  plugins: [magicLinkClient(), inferAdditionalFields<typeof auth>()],
});

export const { signIn, signOut, signUp, useSession, getSession } = authClient;
