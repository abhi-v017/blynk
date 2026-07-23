"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { claimUsernameAndCreateProfile, isUsernameAvailable } from "@/lib/firestore";
import { TextInput } from "@/components/ui";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const usernameValid = /^[a-z0-9_]{3,20}$/.test(username);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!usernameValid) {
      setError("Username must be 3-20 characters: lowercase letters, numbers, underscores.");
      return;
    }
    setSubmitting(true);
    try {
      const available = await isUsernameAvailable(username);
      if (!available) {
        setError("That username is taken. Try another.");
        setSubmitting(false);
        return;
      }
      const user = await signUp(email, password);
      await claimUsernameAndCreateProfile(user.uid, username, displayName);
      router.push("/dashboard/profile");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message === "USERNAME_TAKEN" ? "That username is taken. Try another." : message);
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
          Claim your page
        </h1>
        <p className="text-sm text-muted mb-6">Free, and yours in under a minute.</p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <TextInput
            placeholder="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          <div className="flex items-center bg-surface border border-border rounded-lg overflow-hidden focus-within:border-accent">
            <span className="pl-3 text-sm text-muted" style={{ fontFamily: "var(--font-label)" }}>
              bento.page/
            </span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              placeholder="yourname"
              required
              className="flex-1 bg-transparent py-2.5 pr-3 text-sm outline-none text-text"
            />
          </div>
          <TextInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextInput
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          {error && <p className="text-xs text-accent">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent text-canvas font-medium rounded-lg py-2.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? "Creating your page…" : "Create my page"}
          </button>
        </form>

        <p className="text-xs text-muted mt-5 text-center">
          Already have a page?{" "}
          <Link href="/login" className="text-accent">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
