import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email: String(email).toLowerCase().trim() } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(String(password), user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const session = await getSession();
    session.userId = user.id;
    session.name = user.name;
    session.email = user.email;
    session.role = user.role as "CASHIER" | "OWNER";
    await session.save();

    return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    console.error("Login error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
