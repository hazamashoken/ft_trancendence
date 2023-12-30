import { notFound } from "next/navigation";
import { getUserProfile } from "../_actions/user";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReactNode } from "react";

export default async function UserPage({ params }: { params: { id: number } }) {
  const { id } = params;

  const res = await getUserProfile(id);
  if (res.error) {
    return notFound();
  }

  const thingsToNotShow = [
    "intraUrl",
    "imageUrl",
    "createdAt",
    "updatedAt",
    "id",
  ];

  return (
    <Card>
      <CardContent>
        <Avatar className="w-18 h-18">
          <AvatarImage src={res?.data?.imageUrl} />
          <AvatarFallback>{res?.data?.displayName}</AvatarFallback>
        </Avatar>
        <pre className="text-center">
          {Object.entries(res.data)
            ?.filter(([key, value]) => thingsToNotShow.includes(key) === false)
            .map(([key, value], index) => {
              if (key === "stats") {
                return (
                  <pre key={index}>
                    {Object.entries(value ?? [])
                      ?.filter(
                        ([key, value]) =>
                          thingsToNotShow.includes(key) === false
                      )
                      .map(([key, value], index) => (
                        <p key={index}>
                          <span className="font-bold">{key}</span> :{" "}
                          <span>{value}</span>
                        </p>
                      ))}
                  </pre>
                );
              }
              return (
                <p key={index}>
                  <span className="font-bold">{key}</span> :{" "}
                  <span>{(value as ReactNode) ?? "-"}</span>
                </p>
              );
            })}
        </pre>
      </CardContent>
    </Card>
  );
}
