import { UserAuthForm } from "@/components/sign-in/user-auth-form.component";
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
        <CardDescription>Sign in to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <UserAuthForm />
      </CardContent>
      <CardFooter>
        <Button variant="outline">Cancel</Button>
      </CardFooter>
    </Card>
    )
}
