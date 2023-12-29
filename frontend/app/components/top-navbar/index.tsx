import { getServerSession } from "next-auth";
import { MainNav } from "./main-nav.component";
import { UserNav } from "./user-nav.component";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { FriendShipList } from "./friendship.component";
import { ModeToggle } from "./mode-toggle.component";

export async function TopNavBar() {
  const session = await getServerSession(authOptions);

  return (
    <div className="border-b bg-inherit">
      <div className="flex items-center h-16 px-4">
        <MainNav className="mx-6" />
        <div className="flex items-center ml-auto space-x-4">
          <FriendShipList />
          <ModeToggle className="right-4 top-4 md:right-8 md:top-8" />
          <UserNav session={session} />
        </div>
      </div>
    </div>
  );
}
