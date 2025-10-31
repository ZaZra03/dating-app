"use client"

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Bell, LogOut, Sparkles, Heart, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize from localStorage on client only
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications !== null) {
      setNotifications(storedNotifications !== "false");
    }
    const storedTheme = localStorage.getItem("theme");
    const isDark = storedTheme === "dark";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (darkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [darkMode]);

  const handleNotificationToggle = (checked: boolean) => {
    setNotifications(checked);
    if (typeof window !== "undefined") {
      localStorage.setItem("notifications", checked.toString());
    }
    
    if (checked && "Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          toast({
            title: "Notifications enabled ✅",
            description: "You'll be notified about new matches and messages",
          });
        }
      });
    } else if (!checked) {
      toast({
        title: "Notifications disabled",
        description: "You won't receive push notifications",
      });
    }
  };

  const handleThemeToggle = (checked: boolean) => {
    setDarkMode(checked);
    toast({
      title: checked ? "Dark mode enabled 🌙" : "Light mode enabled ☀️",
      description: "Your theme preference has been saved",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "See you soon! ✨",
    });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Settings Sections */}
          <div className="space-y-4">
            {/* Profile Section */}
            <div className="bg-card p-6 rounded-2xl shadow-card border border-border space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold">Profile</h2>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/profile")}
              >
                Edit Profile
              </Button>
            </div>

            {/* Appearance Section */}
            <div className="bg-card p-6 rounded-2xl shadow-card border border-border space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <h2 className="text-xl font-semibold">Appearance</h2>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="darkMode" className="cursor-pointer">
                  Dark mode
                </Label>
                <Switch
                  id="darkMode"
                  checked={darkMode}
                  onCheckedChange={handleThemeToggle}
                />
              </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-card p-6 rounded-2xl shadow-card border border-border space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold">Notifications</h2>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="cursor-pointer">
                  Push notifications
                </Label>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={handleNotificationToggle}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Get notified about new matches and messages
              </p>
            </div>

            {/* About Section */}
            <div className="bg-card p-6 rounded-2xl shadow-card border border-border space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold">About Spark</h2>
              </div>
              <p className="text-muted-foreground">
                Made with ❤️ for spontaneous connections. Find your spark in just 3 minutes
                and discover real chemistry through authentic conversations.
              </p>
              <div className="text-sm text-muted-foreground">
                Version 1.0.0
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
