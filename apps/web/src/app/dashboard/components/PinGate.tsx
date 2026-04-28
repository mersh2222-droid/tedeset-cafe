"use client";

import { useState, useEffect } from "react";
import { Lock } from "lucide-react";

const PIN = process.env.NEXT_PUBLIC_DASHBOARD_PIN || "";
const SESSION_KEY = "tedeset_pin_verified";
const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 30_000;

export function PinGate({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!PIN) {
      setVerified(true);
    } else if (sessionStorage.getItem(SESSION_KEY) === "true") {
      setVerified(true);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (lockedUntil <= Date.now()) return;
    const timer = setTimeout(() => {
      setLockedUntil(0);
      setError("");
      setAttempts(0);
    }, lockedUntil - Date.now());
    return () => clearTimeout(timer);
  }, [lockedUntil]);

  if (!ready) return null;
  if (verified) return <>{children}</>;

  const locked = lockedUntil > Date.now();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (locked) return;

    if (input === PIN) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setVerified(true);
    } else {
      const next = attempts + 1;
      setAttempts(next);
      setInput("");
      if (next >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_MS);
        setError("Too many attempts. Please wait 30 seconds.");
      } else {
        setError("Incorrect PIN. Please try again.");
      }
    }
  }

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="w-full max-w-xs rounded-2xl border border-border bg-white p-8 shadow-soft text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <h2 className="mb-1 text-lg font-semibold">Dashboard Access</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Enter your PIN to continue
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            maxLength={8}
            placeholder="PIN"
            value={input}
            onChange={(e) => {
              setInput(e.target.value.replace(/\D/g, ""));
              setError("");
            }}
            disabled={locked}
            className="w-full rounded-lg border border-border px-4 py-3 text-center text-lg tracking-[0.5em] disabled:opacity-50"
            autoFocus
          />
          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={locked || !input}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
