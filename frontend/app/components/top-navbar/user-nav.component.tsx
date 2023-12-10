"use client";

import { LogOut, LogIn, PlusCircle, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, signIn, useSession } from "next-auth/react";
import ftLogo from "@/public/42_logo.svg";

export function UserNav() {
  const { data, status } = useSession();

  const isSignedIn = status === "authenticated";
  const profile = data?.user?.profile;
  const avatarLink = isSignedIn ? profile.image?.link : "";
  const nameInitial = isSignedIn ? profile.login[0] + profile.login[1] : "TMP";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative w-8 h-8 rounded-full">
          <Avatar className="w-8 h-8">
            {isSignedIn ? (
              <>
                <AvatarImage src={avatarLink} alt="@shadcn" />
                <AvatarFallback>{nameInitial}</AvatarFallback>
              </>
            ) : (
              <>
                <AvatarImage src={ftLogo} alt="42 logo" />
                <AvatarFallback>42</AvatarFallback>
              </>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {data?.user?.profile?.login}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {data?.user?.profile?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="w-4 h-4 mr-2" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="w-4 h-4 mr-2" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PlusCircle className="w-4 h-4 mr-2" />
            <span>New Team</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {isSignedIn ? (
          <DropdownMenuItem
            onClick={() => {
              signOut();
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => {
              signIn("42-school");
            }}
          >
            <LogIn className="w-4 h-4 mr-2" />
            <span>Log In</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
