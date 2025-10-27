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
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem("notifications") !== "false";
  });
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleNotificationToggle = (checked: boolean) => {
    setNotifications(checked);
    localStorage.setItem("notifications", checked.toString());
    
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
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center border-b border-border">
        <Button variant="ghost" onClick={() => router.push("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Spark</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your Spark experience</p>
          </div>

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

            {/* Logout Button */}
            <Button
              variant="destructive"
              size="lg"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
