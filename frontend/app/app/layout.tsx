import "./globals.css";
import { Inter } from "next/font/google";

import { Providers } from "./provider";

import { Toaster } from "@/components/ui/toaster";
import { Protected } from "./protected";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ft_transendence",
  description: "final project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Protected>
            {children}
            <Toaster />
          </Protected>
        </Providers>
      </body>
    </html>
  );
}
