import { getServerSession } from "next-auth";
import { MainNav } from "./main-nav.component";
import { UserNav } from "./user-nav.component";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function TopNavBar() {
  const session = await getServerSession(authOptions);

  return (
    <div className="sticky top-0 z-50 border-b bg-inherit">
      <div className="flex items-center h-16 px-4">
        <MainNav className="mx-6" />
        <div className="flex items-center ml-auto space-x-4">
          <UserNav session={session} />
        </div>
      </div>
    </div>
  );
}
