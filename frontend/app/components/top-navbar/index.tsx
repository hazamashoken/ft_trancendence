import { MainNav } from "./main-nav.component"
import { UserNav } from "./user-nav.component"
import { ModeToggle } from "./mode-toggle.component"

export function TopNavBar () {
    return (
      <div className="border-b sticky top-0 z-50 bg-inherit">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
            <ModeToggle />
          </div>
        </div>
      </div>
    )
}
