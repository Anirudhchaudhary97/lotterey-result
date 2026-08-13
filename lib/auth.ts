import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "prizetrack-super-secret-key-2083"
);

const COOKIE_NAME = "prizetrack_session";

export interface SessionPayload {
  userId: string;
  email: string;
}

/** Signs a JWT token and stores it in an HTTP-only secure cookie. */
export async function createSession(userId: string, email: string) {
  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

/** Clears the session cookie. */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Decodes and verifies the current session token if present. */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}

/** Returns the authenticated user record from the database. */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.userId) return null;

  try {
    return await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, email: true, createdAt: true },
    });
  } catch {
    return null;
  }
}

/** Returns current user ID or redirects to /login if unauthenticated. */
export async function getCurrentUserId(): Promise<string> {
  const session = await getSession();
  if (!session?.userId) {
    redirect("/login");
  }
  return session.userId;
}
