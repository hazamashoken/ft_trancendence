"use client";
import { usePathname } from "next/navigation";
import { TopNavBar } from "@/components/top-navbar";

export function Protected({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const excludedRoutes = ["/sign-in", "/forget-password", "/change-password"];
  return (
    <>
      {!excludedRoutes.includes(pathname) ? (
        <>
          <TopNavBar />
          {children}
        </>
      ) : ( 
        <>{children}</>
      )}
    </>
  );
}
