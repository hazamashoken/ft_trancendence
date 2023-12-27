"use client";
import Link from "next/link";

import { cn } from "@/lib/utils";
import Image from "next/image";
import ftLogo from "@/public/42_logo.svg";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import React from "react";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [open, setOpen] = React.useState(false);
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {/* <Image
        src={ftLogo}
        width={30}
        height={30}
        alt="42 logo"
        className="bg-gray"
      /> */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost">
            <Menu size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="flex flex-col items-start space-y-4">
            <Link
              href="/"
              onClick={() => {
                setOpen(false);
              }}
            >
              <p className="text-lg font-semibol">Home</p>
            </Link>
            <Link
              href="/test"
              onClick={() => {
                setOpen(false);
              }}
            >
              <p className="text-lg font-semibol">Test</p>
            </Link>
            <Link
              href="/trancendence"
              onClick={() => {
                setOpen(false);
              }}
            >
              <p className="text-lg font-semibol">Trancendence</p>
            </Link>
            <Button
              variant={"ghost"}
              onClick={() => {
                signOut();
              }}
            >
              Sign Out
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
