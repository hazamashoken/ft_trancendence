"use client";

import { signOut, useSession } from "next-auth/react";

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
  const { data } = useSession();
  console.log(data);
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Info</CardTitle>
      </CardHeader>
      <CardContent>
        {/* <pre>{JSON.stringify(session.data.user.profile, null, 1)}</pre> */}
        <pre>{JSON.stringify(data, null, 1)}</pre>
      </CardContent>
      <CardFooter>
        <Button onClick={() => signOut()}>Sign Out</Button>
      </CardFooter>
    </Card>
  );
}
