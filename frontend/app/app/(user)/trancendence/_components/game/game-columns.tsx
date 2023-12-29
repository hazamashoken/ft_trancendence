"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

export type TMatch = {
  matchId: number;
  player1: any;
  player2: any;
  status: "WAITING" | "STARTING" | "PLAYING" | "FINISHED";
};

export const columns: ColumnDef<TMatch>[] = [
  {
    header: "Player 1",
    accessorKey: "player1",
  },
  {
    header: "Player 2",
    accessorKey: "player2",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    accessorKey: "tool",
    header: "",
    cell: (props) => {
      return (
        <div className="flex justify-center">
          <Button
            className="w-fit"
            onClick={async () => {
              console.log(props.row.original);
            }}
          >
            Join
          </Button>
        </div>
      );
    },
  },
];
