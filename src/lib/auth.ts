import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

/**
 * Authentication for the /admin CMS.
 *
 * Environment variables (see .env.example):
 *   ADMIN_USERNAME       — admin login name
 *   ADMIN_PASSWORD_HASH  — bcrypt hash of the admin password (preferred), or
 *   ADMIN_PASSWORD       — plaintext fallback for local development only
 *   AUTH_SECRET          — long random string used to sign the session JWT
 */

const COOKIE_NAME = "portfolio_admin_session";
const SESSION_HOURS = 12;

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET is not configured. Set a long random string in your environment."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function verifyCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const expectedUser = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const plainPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUser || (!passwordHash && !plainPassword)) return false;

  // constant-ish time comparison for username
  const userOk =
    username.length === expectedUser.length &&
    Buffer.from(username).equals(Buffer.from(expectedUser));

  let passOk = false;
  if (passwordHash) {
    passOk = await bcrypt.compare(password, passwordHash);
  } else if (plainPassword) {
    passOk =
      password.length === plainPassword.length &&
      Buffer.from(password).equals(Buffer.from(plainPassword));
  }
  return userOk && passOk;
}

export async function createSession(username: string): Promise<void> {
  const token = await new SignJWT({ sub: username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(getSecret());

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function destroySession(): Promise<void> {
  cookies().set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getSession(): Promise<{ username: string } | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "admin" || typeof payload.sub !== "string") return null;
    return { username: payload.sub };
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<{ username: string }> {
  const session = await getSession();
  if (!session) throw new AuthError();
  return session;
}

export class AuthError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "AuthError";
  }
}

export const SESSION_COOKIE = COOKIE_NAME;
