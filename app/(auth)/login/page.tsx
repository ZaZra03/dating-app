"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let result: any;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      console.log("🔎 Login response (API):", response.status, result);

      // Check for invalid credentials
      if (!response.ok) {
        const message =
          (typeof result === "object" && result?.message) ||
          "Invalid email or password";

        setErrorMessage(message);

        toast({
          title: "Login failed",
          description: message,
          variant: "destructive",
        });

        return;
      }

      if (result?.access_token) {
        localStorage.setItem("token", result.access_token);
        localStorage.setItem("data", JSON.stringify(result.user));
      }

      toast({
        title: "Welcome back! ✨",
        description: "Logged in successfully",
      });

      router.push("/discover");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Network error, please try again.";

      console.error("🔴 Login error:", message);
      setErrorMessage(message);

      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-gray-50 to-white px-4">
      <div className="w-full max-w-md bg-white shadow-lg border border-gray-100 rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500">Log in to find your spark ✨</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-gray-300 focus-visible:ring-black"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-gray-300 focus-visible:ring-black"
            />
          </div>

          {/* Inline error message */}
          {errorMessage && (
            <p className="text-red-600 text-sm text-center">{errorMessage}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-all disabled:opacity-60"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </Button>

          <div className="text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="text-black font-medium hover:underline"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
