import { UserAuthForm } from "@/components/sign-in/user-auth-form.component";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";

export function SignInCard() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Only 42 Student</CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm />
        </CardContent>
        <CardFooter>
          <Link href="https://www.42bangkok.com/th/">
            <Button variant="outline">Sign up for intra</Button>
          </Link>
        </CardFooter>
      </Card>
    );
}
