import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface POSSessionData {
  userId: number;
  name: string;
  email: string;
  role: "CASHIER" | "OWNER";
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET ?? "this-is-a-dev-secret-replace-in-production-32chars",
  cookieName: "pos_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 12 // 12 hours
  }
};

export async function getSession() {
  return getIronSession<POSSessionData>(await cookies(), sessionOptions);
}

export async function requireSession(): Promise<POSSessionData> {
  const session = await getSession();
  if (!session.userId) throw new Error("UNAUTHORIZED");
  return session as POSSessionData;
}

export async function requireOwner(): Promise<POSSessionData> {
  const session = await requireSession();
  if (session.role !== "OWNER") throw new Error("FORBIDDEN");
  return session;
}
