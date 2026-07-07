/**
 * SERVER-SIDE AUTH HELPERS
 *
 * Provides utilities for accessing the current user's session in Server Components,
 * Server Actions, and API Routes.
 */

import { headers } from 'next/headers';

import { auth } from './auth';

/**
 * Retrieves the currently authenticated user from the session.
 *
 * @returns The user object if authenticated, null otherwise.
 * @example
 * const user = await getUser();
 * if (!user) redirect("/login");
 */
export const getUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user;
};
