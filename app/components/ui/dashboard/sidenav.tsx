"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Compass, MessageCircle, Settings, Heart, Power } from "lucide-react";

const navigation = [
  { title: "Discover", icon: Compass, href: "/discover" },
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
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40 text-xl font-semibold">
          Dating App
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
                    ? "bg-sky-100 text-blue-600"
                    : "bg-gray-50 hover:bg-sky-100 hover:text-blue-600")
                }
              >
                <Icon className="w-5 h-5" />
                <span>{title}</span>
              </Link>
            );
          })}
        </nav>
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <Power className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}

