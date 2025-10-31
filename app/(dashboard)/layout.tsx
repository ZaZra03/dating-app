"use client";

import SideNav from "@/components/ui/dashboard/sidenav";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const pageTitles: Record<string, string> = {
  "/discover": "Discover",
  "/liked-me": "Likes",
  "/matches": "Matches",
  "/chat": "Chat",
  "/settings": "Settings",
  "/profile": "Profile",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const pageName = pageTitles[pathname] || "Spark";
    document.title = `Spark | ${pageName}`;
  }, [pathname]);

  return (
    <div className="flex h-full min-h-screen w-full">
      <div className="w-64 shrink-0">
        <SideNav />
      </div>
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
