"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import "./page.module.css";

const Signup = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock signup
    toast({
      title: "Account created! 🎉",
      description: "Let's get to know you better",
    });
    router.push("/about-you");
  };

  return (
    <div className="signup-container flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-card">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            Join Spark
          </h1>
          <p className="text-muted-foreground">
            Create your Spark profile to start chatting! 💬
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="bg-card p-8 rounded-2xl shadow-card border border-border space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            Sign Up
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-foreground font-semibold hover:underline"
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
