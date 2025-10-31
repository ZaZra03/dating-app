"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Compass, MessageCircle, Settings, Heart, Power, ThumbsUp } from "lucide-react";

const navigation = [
  { title: "Discover", icon: Compass, href: "/discover" },
  { title: "Likes", icon: ThumbsUp, href: "/liked-me" }, // Changed icon to ThumbsUp
  { title: "Matches", icon: Heart, href: "/matches" },
  { title: "Chat", icon: MessageCircle, href: "/chat" },
  { title: "Settings", icon: Settings, href: "/settings" },
];

export default function SideNav() {
  const pathname = usePathname();
  const router = useRouter();
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const [hasNewLikes, setHasNewLikes] = useState(false);
  const [hasNewMatches, setHasNewMatches] = useState(false);
  const [hasNewChat, setHasNewChat] = useState(false);
  const [firstName, setFirstName] = useState<string>("");

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("data") : null;
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const name = typeof parsed?.name === "string" ? parsed.name.trim() : "";
      if (name) {
        const first = name.split(" ")[0];
        setFirstName(first);
      }
    } catch {}
  }, []);

  useEffect(() => {
    // Ask for permission once
    try {
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "default") {
          Notification.requestPermission().catch(() => {});
        }
      }
    } catch {}

    const notify = (title: string, body: string) => {
      try {
        if (typeof window === "undefined" || !("Notification" in window)) return;
        if (localStorage.getItem("notifications") === "false") return;
        if (Notification.permission !== "granted") return;
        new Notification(title, { body });
      } catch {}
    };

    const poll = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {} as Record<string,string>;
      try {
        // Likes
        const resLikes = await fetch("/api/liked-me", { headers });
        if (resLikes.ok) {
          const liked = await resLikes.json();
          const count = Array.isArray(liked) ? liked.length : 0;
          const prev = Number(sessionStorage.getItem("prevLikedCount") || "0");
          if (count > prev) {
            notify("New like", "Someone liked you! ✨");
            setHasNewLikes(true);
          }
          sessionStorage.setItem("prevLikedCount", String(count));
        }
      } catch {}
      try {
        // Matches
        const resMatches = await fetch("/api/matches", { headers });
        if (resMatches.ok) {
          const matches = await resMatches.json();
          const count = Array.isArray(matches) ? matches.length : 0;
          const prev = Number(sessionStorage.getItem("prevMatchCount") || "0");
          if (count > prev) {
            notify("It's a match!", "You have a new match 💖");
            setHasNewMatches(true);
          }
          sessionStorage.setItem("prevMatchCount", String(count));
        }
      } catch {}
    };

    // Initial poll and interval
    poll();
    pollingRef.current = setInterval(poll, 15000);

    // Listen for chat signals via localStorage (from chat hook)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "latestChatMessageAt" && e.newValue) {
        const from = localStorage.getItem("latestChatFrom") || "Someone";
        notify("New message", `New chat message from ${from}`);
        sessionStorage.setItem("lastChatNotifiedAt", e.newValue);
        setHasNewChat(true);
      }
    };
    window.addEventListener("storage", onStorage);

    // Fallback: same-tab periodic check
    const chatCheck = setInterval(() => {
      try {
        const latest = localStorage.getItem("latestChatMessageAt");
        if (!latest) return;
        const lastNotified = sessionStorage.getItem("lastChatNotifiedAt");
        if (latest && latest !== lastNotified) {
          const from = localStorage.getItem("latestChatFrom") || "Someone";
          notify("New message", `New chat message from ${from}`);
          sessionStorage.setItem("lastChatNotifiedAt", latest);
        }
      } catch {}
    }, 5000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      clearInterval(chatCheck);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Clear badges when visiting their pages
  useEffect(() => {
    if (pathname === "/liked-me") setHasNewLikes(false);
    if (pathname === "/matches") setHasNewMatches(false);
    if (pathname === "/chat") setHasNewChat(false);
  }, [pathname]);

  const handleSignOut = async () => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      if (token) {
        await fetch(`${apiBase}/auth/logout`, {
          method: "POST",
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
      }
    } catch {}
    try {
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
    } catch {}
    router.push("/login");
  };

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-background text-foreground">
      <Link
        href="/"
        className="mb-6 flex flex-col items-center justify-center rounded-xl bg-primary text-primary-foreground py-6 px-2 md:py-10 md:px-4 shadow-md"
      >
        <div className="text-2xl font-extrabold tracking-tight md:text-3xl">
          Spark
        </div>
      </Link>
      {firstName && (
        <div className="mb-4 px-3 py-2 text-sm text-foreground/90">
          <p className="font-medium">Hi, {firstName}</p>
          <p className="text-xs text-foreground/70">Welcome to Spark</p>
        </div>
      )}
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <nav className="flex w-full flex-col gap-2">
          {navigation.map(({ title, icon: Icon, href }) => {
            const isDiscoverRoot = href === "/discover";
            const isActive = isDiscoverRoot
              ? pathname === href
              : pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={
                  "relative flex h-[48px] w-full items-center gap-2 rounded-md p-3 text-sm font-medium md:p-2 md:px-3 " +
                  (isActive
                    ? "bg-primary/15 dark:bg-primary/30 text-primary border border-primary/30 dark:border-primary/40"
                    : "bg-transparent text-foreground/80 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20")
                }
              >
                <Icon className="w-5 h-5" />
                <span>{title}</span>
                {(href === "/liked-me" && hasNewLikes) ||
                (href === "/matches" && hasNewMatches) ||
                (href === "/chat" && hasNewChat) ? (
                  <span className="absolute right-3 top-2 inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="hidden h-auto w-full grow rounded-md bg-muted md:block"></div>
        <form>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-muted p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <Power className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}

