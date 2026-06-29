"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "../../components/Button";
import { useAuth } from "../../lib/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-md mx-auto bg-coffee border border-coffeeMid rounded-2xl p-5 sm:p-9">
        <h2 className="text-2xl text-center mb-1.5">
          {mode === "login" ? "Welcome back" : "Create an account"}
        </h2>
        <p className="text-sm text-textMuted text-center mb-7">
          {mode === "login"
            ? "Log in to order faster and save your favourites"
            : "Sign up to get started"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="text-sm font-semibold text-cream block mb-1.5">Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={mode === "register"}
                className="w-full border border-coffeeMid bg-coffeeDark text-cream rounded-lg px-3 
                py-2.5 text-sm focus:outline-none focus:border-terracotta placeholder-textMuted"
              />
            </div>
          )}
          <div>
            <label className="text-sm font-semibold text-cream block mb-1.5">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-coffeeMid bg-coffeeDark text-cream rounded-lg px-3 
              py-2.5 text-sm focus:outline-none focus:border-terracotta placeholder-textMuted"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-cream block mb-1.5">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-coffeeMid bg-coffeeDark text-cream rounded-lg 
              px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta placeholder-textMuted"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" variant="primary" className="w-full justify-center" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
          </Button>
        </form>

        <div className="flex items-center gap-2.5 my-5 text-xs text-textMuted">
          <span className="flex-1 h-px bg-coffeeMid" />
          or
          <span className="flex-1 h-px bg-coffeeMid" />
        </div>

        <Button href="/" variant="secondary" className="w-full justify-center">
          Continue as guest
        </Button>

        <p className="text-center text-sm text-textMuted mt-5">
          {mode === "login" ? (
            <>
              New to Yoto?{" "}
              <button
                type="button"
                onClick={() => { setMode("register"); setError(""); }}
                className="text-terracotta font-semibold hover:underline"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); }}
                className="text-terracotta font-semibold hover:underline"
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </section>
  );
}
