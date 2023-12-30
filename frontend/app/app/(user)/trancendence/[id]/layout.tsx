import { GameSocketProvider } from "@/components/providers/game-socket-provider";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("GameLayout");
  return (
    <>
      <GameSocketProvider>{children}</GameSocketProvider>
    </>
  );
}
