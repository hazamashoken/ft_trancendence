"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function HomeBtn() {
  return (
    <Link href={"/"}>
      <Button size={"icon"} variant={"outline"}>
        <Home />
      </Button>
    </Link>
  );
}
