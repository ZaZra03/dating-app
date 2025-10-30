"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function withAuth<P extends Record<string, unknown>>(WrappedComponent: React.ComponentType<P>) {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    }, [router]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500">Loading...</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${(WrappedComponent as any).displayName || WrappedComponent.name || "Component"})`;

  return AuthenticatedComponent;
}
