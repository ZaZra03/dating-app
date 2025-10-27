"use client"

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    toast({
      title: "Welcome back! ✨",
      description: "Logged in successfully",
    });
    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-gradient-romantic flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-spark rounded-full flex items-center justify-center mx-auto mb-4 shadow-spark">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-spark bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">Log in to find your spark ✨</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-card p-8 rounded-2xl shadow-card space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-spark shadow-spark hover:opacity-90"
            size="lg"
          >
            Log In
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="text-primary font-semibold hover:underline"
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
