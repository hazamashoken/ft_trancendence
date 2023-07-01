"use client"

import { signOut } from "next-auth/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";

export function UserCard(props: any){
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Info</CardTitle>
        </CardHeader>
        <CardContent>
          {JSON.stringify(props.session.data.user.profile, null, 1)}
        </CardContent>
        <CardFooter>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </CardFooter>
      </Card>
    )
}