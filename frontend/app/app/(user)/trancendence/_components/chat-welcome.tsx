import { Hash } from "lucide-react";

interface ChatWelcomeProps {
  name: string;
  type: "public" | "private" | "direct";
}

export const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
  return (
    <div className="px-4 mb-4 space-y-2">
      <p className="text-xl font-bold md:text-3xl">
        {type !== "direct" ? "Welcome to #" : ""}
        {name}
      </p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {type !== "direct"
          ? `This is the start of the #${name} channel.`
          : `This is the start of your legendary conversation with ${name}`}
      </p>
    </div>
  );
};
