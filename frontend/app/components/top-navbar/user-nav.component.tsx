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
import React from "react";
import { ChangeNameDialog } from "./change-name-dialog";
import { UploadAvatar } from "./upload-avatar";
import { useRouter } from "next/navigation";

export function UserNav(props: any) {
  const { session } = props;
  const [openChangeName, setOpenChangeName] = React.useState(false);
  const [openUploadAvatar, setOpenUploadAvatar] = React.useState(false);

  const router = useRouter();

  const profile = session?.user ?? session?.ftUser;
  const url = profile?.imageUrl ?? profile?.image?.link;
  const username = profile?.displayName ?? profile?.login;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative w-8 h-8 rounded-full">
            <Avatar className="w-8 h-8">
              <AvatarImage src={url ?? ftLogo} alt="@shadcn" />
              <AvatarFallback>{username ?? "42"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{username}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {profile?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setOpenChangeName(true);
              }}
            >
              <User className="w-4 h-4 mr-2" />
              <span>change username</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setOpenUploadAvatar(true);
              }}
            >
              <Settings className="w-4 h-4 mr-2" />
              <span>upload avatar</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                router.push("/otp");
              }}
            >
              <Settings className="w-4 h-4 mr-2" />
              <span>OTP settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {session ? (
            <DropdownMenuItem
              onClick={() => {
                signOut();
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Log out</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => {
                signIn("42-school");
              }}
            >
              <LogIn className="w-4 h-4 mr-2" />
              <span>Log In</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ChangeNameDialog
        session={session}
        open={openChangeName}
        setOpen={setOpenChangeName}
      />
      <UploadAvatar open={openUploadAvatar} setOpen={setOpenUploadAvatar} />
    </>
  );
}
