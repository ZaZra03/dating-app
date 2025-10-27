"use client"

import { Button } from "@/components/ui/button";
import { Sparkles, Clock, Heart, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import "./globals.css";

const Landing = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-romantic">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-spark rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">
            Spark
          </span>
        </div>
        <Button className="bg-white text-black font-bold py-2 px-4  rounded-lg hover:bg-black hover:text-white" variant="outline" onClick={() => router.push("/login")}>
          Log In
        </Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="inline-block px-4 py-2 bg-gray-200 rounded-full text-sm font-medium text-primary mb-4">
            ⚡ The 3-Minutes Chemistry App
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Find Your{" "}
            <span className="bg-gradient-spark bg-clip-text text-transparent">Spark</span> in
            3 Minutes
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Speed dating meets modern chat. Connect with someone new, chat for 3 minutes, and
            decide if there's chemistry. Both say yes? Keep the conversation going! ✨
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/signup")}
              className="bg-white text-black py-6 px-8 rounded-lg hover:bg-black hover:text-white animate-pulse"
            >
              <Zap className="w-5 h-5 mr-2" />
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Timer */}
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center space-y-4">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold">3-Minute Timer</h3>
            <p className="text-gray-500">
              Quick, focused conversations. No endless scrolling or ghosting.
            </p>
          </div>

          {/* Chemistry */}
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold">Instant Chemistry</h3>
            <p className="text-gray-500">
              Both feel the spark? Match instantly and keep chatting!
            </p>
          </div>

          {/* Real Connections */}
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center space-y-4">
            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-cyan-600" />
            </div>
            <h3 className="text-xl font-semibold">Real Connections</h3>
            <p className="text-gray-500">
              No pressure, just authentic conversations in real-time.
            </p>
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto bg-gradient-hero rounded-3xl p-12 shadow-spark">
          <h2 className="text-4xl font-bold mb-4">Ready to find your spark?</h2>
          <p className="text-lg mb-8">
            Join thousands finding real connections, 3 minutes at a time.
          </p>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/signup")}
            className="bg-white text-black py-6 px-8 rounded-lg hover:bg-black hover:text-white"
          >
            Start Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
