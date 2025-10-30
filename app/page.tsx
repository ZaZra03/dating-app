"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Clock, Heart, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

const Landing = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">Spark</span>
          </div>

          <Button
            onClick={() => router.push("/login")}
            className="bg-black text-white font-semibold px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Log In
          </Button>
        </div>
      </header>

      {/* Hero Section (White) */}
      <section className="flex-1 flex items-center justify-center px-6 py-6 bg-white">
        <div className="max-w-3xl text-center space-y-8">
          <span className="inline-block px-4 py-2 bg-gray-100 text-sm font-medium text-black rounded-full shadow-sm">
            ⚡ The 3-Minutes Chemistry App
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-gray-900">
            Find Your Spark in 3 Minutes
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Speed dating meets modern chat. Connect with someone new, chat for 3 minutes, and
            decide if there's chemistry. Both say yes? Keep the conversation going! ✨
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              onClick={() => router.push("/signup")}
              className="bg-black text-white font-semibold py-4 px-8 rounded-xl hover:bg-gray-800 transition-all duration-300"
            >
              <Zap className="w-5 h-5 mr-2" />
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section (Gray) */}
      <section className="bg-[#f9f9f9] py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Timer */}
            <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col items-center text-center space-y-4 border border-gray-100">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">3-Minute Timer</h3>
              <p className="text-gray-600">
                Quick, focused conversations. No endless scrolling or ghosting.
              </p>
            </div>

            {/* Chemistry */}
            <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col items-center text-center space-y-4 border border-gray-100">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Instant Chemistry</h3>
              <p className="text-gray-600">
                Both feel the spark? Match instantly and keep chatting!
              </p>
            </div>

            {/* Real Connections */}
            <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col items-center text-center space-y-4 border border-gray-100">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Real Connections</h3>
              <p className="text-gray-600">
                No pressure, just authentic conversations in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section (White) */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto bg-gray-50 rounded-3xl p-12 shadow-lg border border-gray-100">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Ready to find your spark?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands finding real connections, 3 minutes at a time.
            </p>
            <Button
              size="lg"
              onClick={() => router.push("/signup")}
              className="bg-black text-white py-4 px-8 rounded-xl hover:bg-gray-800 transition-all"
            >
              Start Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
