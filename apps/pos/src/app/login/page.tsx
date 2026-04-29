import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "./login-form";

export default async function LoginPage() {
  const session = await getSession();
  if (session.userId) redirect("/");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-primary">Tedeset Cafe</h1>
          <p className="mt-1 text-sm text-muted-foreground">POS Cash Management</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-6 shadow-soft">
          <h2 className="mb-6 text-lg font-semibold">Sign In</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
