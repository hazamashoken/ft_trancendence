"use client";

import { SocketProvider } from "@/components/providers/socket-provider";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameSocketProvider } from "@/components/providers/game-socket-provider";
import { StatusSocketProvider } from "@/components/providers/status-socket.provider";

type INextAuthProvider = {
  children?: React.ReactNode;
};

/**
 * A wrapper component that provides theme support using the Next.js `next-themes` library.
 *
 * @param children The child components to render.
 * @param props The props to pass to the `next-themes` `ThemeProvider` component.
 */
function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

/**
 * A wrapper component that provides session support using the Next.js `next-auth` library.
 * @param children The child components to render.
 * @see https://next-auth.js.org/
 */
export const NextAuthProvider = ({ children }: INextAuthProvider) => {
  return <SessionProvider>{children}</SessionProvider>;
};

/**
 * A wrapper component that provides query support using the `react-query` library.
 *
 * @param children The child components to render.
 * @param client The `react-query` client to use.
 * @see https://tanstack.com/query/v4/docs/react/reference/QueryClientProvider
 */
export const QueryProvider = ({
  children,
  client,
}: {
  children: React.ReactNode;
  client: QueryClient;
}) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

/**
 * A wrapper component that provides global providers for the application.
 *
 * @param children The child components to render.
 */
export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <NextAuthProvider>
      <QueryProvider client={queryClient}>
        <SocketProvider>
          <GameSocketProvider>
            <StatusSocketProvider>
              <TooltipProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="light"
                  enableSystem={false}
                >
                  {children}
                </ThemeProvider>
              </TooltipProvider>
            </StatusSocketProvider>
          </GameSocketProvider>
        </SocketProvider>
      </QueryProvider>
    </NextAuthProvider>
  );
};
