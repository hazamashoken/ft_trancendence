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
import { Avatar } from "../ui/avatar";

export function UserCard(props: any){
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Info</CardTitle>
        </CardHeader>
        <CardContent>
         <pre>{JSON.stringify(props.session.data.user, null, 1)}</pre>
        </CardContent>
        <CardFooter>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </CardFooter>
      </Card>
    )
}
