"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Clock, Heart, Zap, Moon, Sun, Users, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Landing = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const theme = localStorage.getItem("theme");
      const isDark = theme === "dark";
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const handleThemeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (typeof window !== "undefined") {
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Spark</span>
          </div>

          <Button
            onClick={handleThemeToggle}
            variant="outline"
            size="icon"
            className="rounded-full w-10 h-10 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Hero Section (White) */}
      <section className="flex-1 flex items-center justify-center px-6 py-6 bg-white dark:bg-gray-900">
        <div className="max-w-3xl text-center space-y-8">
          <span className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-800 text-sm font-medium text-black dark:text-white rounded-full shadow-sm">
            ⚡ The 3-Minutes Chemistry App
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-gray-100">
            Find Your Spark in 3 Minutes
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Speed dating meets modern chat. Connect with someone new, chat for 3 minutes, and
            decide if there's chemistry. Both say yes? Keep the conversation going! ✨
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              onClick={() => router.push("/signup")}
              className="bg-black dark:bg-white text-white dark:text-black font-semibold py-4 px-8 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300"
            >
              <Zap className="w-5 h-5 mr-2" />
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section (Gray) */}
      <section className="bg-[#f9f9f9] dark:bg-gray-800 py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Timer */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md flex flex-col items-center text-center space-y-4 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">3-Minute Timer</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Quick, focused conversations. No endless scrolling or ghosting.
              </p>
            </div>

            {/* Chemistry */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md flex flex-col items-center text-center space-y-4 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Instant Chemistry</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Both feel the spark? Match instantly and keep chatting!
              </p>
            </div>

            {/* Real Connections */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md flex flex-col items-center text-center space-y-4 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Real Connections</h3>
              <p className="text-gray-600 dark:text-gray-400">
                No pressure, just authentic conversations in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section (White) */}
      <section className="bg-white dark:bg-gray-900 py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-800 rounded-3xl p-12 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Join Our Community</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Connect with like-minded people and share your Spark experience with friends.
            </p>
            <Button
              size="lg"
              onClick={() => router.push("/signup")}
              className="bg-black dark:bg-white text-white dark:text-black py-4 px-8 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
            >
              <Users className="w-5 h-5 mr-2" />
              Join Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Footer Image Placeholder */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                <img
                  src="https://imgs.search.brave.com/MSJqy_aGKC8_bELYzR9IGhV-goLO9WWRyZzDVxnIPdk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c29mdHdhcmV3b3Js/ZC5jby9hc3NldHMv/c2VydmljZS9sb2dv/LzE3MTU1Nzg0OTAu/cG5n"
                  alt="Spark Logo"
                  className="w-24 h-24 object-contain"
                />
              </div>
            </div>
            {/* Footer Text Placeholder */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="space-y-2">
                <p className="text-gray-800 dark:text-gray-100 font-semibold text-lg">
                  Powered by <span className="text-cyan-600 dark:text-cyan-400">White Cloak Technologies Inc.</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Built for the Builder Round – Launchpad Program.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 Spark. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
