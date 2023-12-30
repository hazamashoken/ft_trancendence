import "./globals.css";
import { Inter } from "next/font/google";

import { Providers } from "./provider";

import { Toaster } from "@/components/ui/sonner";
import { TopNavBar } from "@/components/top-navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ft_transendence",
  description: "final project",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning className="w-screen h-screen">
      <body className={cn(inter.className, "w-screen h-screen")}>
        <Providers>
          {session && <TopNavBar />}
          {children}
          <Toaster richColors />
          {/* <pre>{JSON.stringify(process.env, null, 4)}</pre> */}
        </Providers>
      </body>
    </html>
  );
}
