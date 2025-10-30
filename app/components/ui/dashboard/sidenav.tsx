"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
                  "flex h-[48px] w-full items-center gap-2 rounded-md p-3 text-sm font-medium md:p-2 md:px-3 " +
                  (isActive
                    ? "bg-primary/15 dark:bg-primary/30 text-primary border border-primary/30 dark:border-primary/40"
                    : "bg-transparent text-foreground/80 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20")
                }
              >
                <Icon className="w-5 h-5" />
                <span>{title}</span>
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

