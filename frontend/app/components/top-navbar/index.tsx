import { MainNav } from "./main-nav.component";
import { UserNav } from "./user-nav.component";

export function TopNavBar() {
  return (
    <div className="sticky top-0 z-50 border-b bg-inherit">
      <div className="flex items-center h-16 px-4">
        <MainNav className="mx-6" />
        <div className="flex items-center ml-auto space-x-4">
          <UserNav />
        </div>
      </div>
    </div>
  );
}
