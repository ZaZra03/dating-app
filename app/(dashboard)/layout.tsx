"use client";

import SideNav from "@/components/ui/dashboard/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
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
