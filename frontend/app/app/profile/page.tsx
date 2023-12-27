"use client"

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { UserCard } from "@/components/user-card";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form"


type Inputs = {
    example: string
    exampleRequired: string
}

export default function Home() {
    const session = useSession();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>()
    if (session.status === 'loading') {
        return (
            <div>loading</div>
        )
    }
    let user;
    if (session.status === 'authenticated') {
        {
            user = session.data.user;
        }
    }

    const onSubmit = (data) => console.log(data)

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Card>
                <CardHeader>
                    <CardTitle className="flex self-center text-3xl">User Info</CardTitle>
                    <Avatar className="w-48 h-48">
                        <AvatarImage src={user?.imageUrl} sizes="200" />
                        <AvatarFallback />
                    </Avatar>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* register your input into the hook by invoking the "register" function */}
                        <input defaultValue="test" {...register("example")} />

                        {/* include validation with required or other standard HTML validation rules */}
                        <input {...register("exampleRequired", { required: true })} />
                        {/* errors will return when field validation fails  */}
                        {errors.exampleRequired && <span>This field is required</span>}
                        <input type="submit" />
                    </form>
                </CardContent>
                <CardFooter className="flex flex-row justify-center">
                    <Button onClick={() => signOut()}>Sign Out</Button>
                </CardFooter>
            </Card>
        </main>
    )
}
