"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { TextInput } from "@/components/ui";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(email, password);
      router.push("/dashboard/profile");
    } catch {
      setError("Couldn't sign in. Check your email and password.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-sm text-muted hover:text-text mb-6 inline-block">
          ← back
        </Link>
        <h1 className="text-2xl font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>
          Welcome back
        </h1>
        <p className="text-sm text-muted mb-6">Sign in to keep shaping your page.</p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <TextInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-xs text-accent">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent text-canvas font-medium rounded-lg py-2.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-xs text-muted mt-5 text-center">
          New here?{" "}
          <Link href="/register" className="text-accent">
            Create a page
          </Link>
        </p>
      </div>
    </div>
  );
}
