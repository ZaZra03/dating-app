"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // ✅ Frontend password match validation
    if (password !== retypePassword) {
      setErrorMessage("Passwords do not match.");
      toast({
        title: "Password mismatch ❌",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/signup", {
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

      console.log("🔎 Signup response:", response.status, result);

      if (!response.ok) {
        const message =
          (typeof result === "object" && result?.message) ||
          "Signup failed. Please try again.";

        setErrorMessage(message);

        toast({
          title: "Signup failed ❌",
          description: message,
          variant: "destructive",
        });

        return;
      }

      // ✅ Notify developer if backend response changes
      if (!result?.access_token) {
        toast({
          title: "⚠️ Backend response changed",
          description:
            "Signup succeeded, but no token was returned. Check backend for updates.",
          variant: "destructive",
        });
      }

      toast({
        title: "Account created! 🎉",
        description: "Let's get to know you better",
      });

      // Optional: store token if your backend returns one
      if (result?.access_token) {
        localStorage.setItem("token", result.access_token);
        localStorage.setItem("data", JSON.stringify(result.user));
      }

      router.push("/about-you");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Network error. Please try again.";

      console.error("🔴 Signup error:", message);
      setErrorMessage(message);

      toast({
        title: "Signup failed ❌",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-gray-50 to-white px-4 my-10">
      <div className="w-full max-w-md bg-white shadow-lg border border-gray-100 rounded-2xl p-8">
        {/* Header / Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Join Spark
          </h1>
          <p className="text-gray-500">Create your profile to start chatting! 💬</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-6">
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
              minLength={6}
              className="border-gray-300 focus-visible:ring-black"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="retypePassword" className="text-gray-700">
              Retype Password
            </Label>
            <Input
              id="retypePassword"
              type="password"
              placeholder="••••••••"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              required
              minLength={6}
              className="border-gray-300 focus-visible:ring-black"
            />
          </div>

          {errorMessage && (
            <p className="text-center text-sm text-red-600">{errorMessage}</p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-all disabled:opacity-60"
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>

          <div className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-black font-medium hover:underline"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
