"use client"
import Link from "next/link"

import { cn } from "@/lib/utils"
import Image from "next/image"
import ftLogo from "@/public/42_logo.svg"

export function MainNav ({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    return (
        <nav
        className={cn("flex items-center space-x-4 lg:space-x-6", className)}
        {...props}
      >
        <Image src={ftLogo} width={30} height={30} alt="42 logo"/>
        <Link
          href="#"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Settings
        </Link>
      </nav>
    )
}
