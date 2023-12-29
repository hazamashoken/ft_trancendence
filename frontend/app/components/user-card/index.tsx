"use client";

import { signOut } from "next-auth/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function UserCard(props: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Info</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="">{JSON.stringify(props.session, null, 4)}</pre>
      </CardContent>
      <CardFooter>
        <Button onClick={() => signOut()}>Sign Out</Button>
      </CardFooter>
    </Card>
  );
}
