"use client"

import { LogOut, LogIn, PlusCircle, Settings, User } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut, signIn, useSession } from "next-auth/react"
import ftLogo from "@/public/42_logo.svg"

export function UserNav() {
  const { data, status } = useSession();
  const isSignedIn = status === "authenticated";
  const avatarLink = data?.user?.profile?.image.link;
  const nameInitial = data?.user?.profile?.login[0] + data?.user?.profile?.login[1];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {isSignedIn ?
            <>
              <AvatarImage src={avatarLink} alt="@shadcn" />
              <AvatarFallback >{nameInitial}</AvatarFallback>
            </>
              :
            <>
              <AvatarImage src={ftLogo} alt="42 logo" />
              <AvatarFallback >42</AvatarFallback>
            </>
            }
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
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>New Team</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {isSignedIn?
          <DropdownMenuItem onClick={() => { signOut() }}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
          :
          <DropdownMenuItem onClick={() => { signIn("42-school") }}>
            <LogIn className="mr-2 h-4 w-4" />
            <span>Log In</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
