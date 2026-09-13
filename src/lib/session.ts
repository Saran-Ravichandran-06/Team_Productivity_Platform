import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Retrieves the currently authenticated user from the session, 
 * optionally fetching full details from the database.
 */
export async function getCurrentUser(fetchFromDb = false) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  if (!fetchFromDb) {
    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
      // Intentionally omitting passwordHash
    },
  });

  return user;
}

/**
 * Throws an error or redirects if the user is not authenticated.
 * Suitable for API routes or Server Actions.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
