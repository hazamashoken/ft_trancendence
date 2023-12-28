"use client";
import { useRouter } from "next/navigation";

// Components
import { Button } from "@/components/ui/button";

// Icons
import { CalendarDays, X } from "lucide-react";

// // Schema
// import { INotificationItem } from "./types";

// Datetime
import { formatRelative, addDays } from "date-fns";
import { th } from "date-fns/locale";

// interface NotificationItemProps extends INotificationItem {
//   onHidden: (e: React.MouseEvent<HTMLElement>, id: string[]) => void;
// }

export function NotificationItem(props: any) {
  const { id, title, description, url, created, seen, user, onHidden } = props;

  const router = useRouter();

  const handleLink = (): void => {
    if (!url) return;

    router.push(url);
  };

  return (
    <li
      className={`flex flex-row justify-between p-6 border-b gap-x-4 border-zinc-200/90 last:border-0 hover:bg-zinc-50
        ${!seen ? "bg-zinc-100 items-center" : "items-start"}
      `}
      onClick={handleLink}
    >
      <div className="flex flex-col text-sm leading-5 gap-y-1">
        <small className="text-slate-500 line-clamp-1 max-w-[16rem]">
          {user.first_name ?? "-"} {user.last_name ?? "-"}
        </small>
        <strong className="text-slate-900 line-clamp-1 max-w-[16rem]">
          {title ?? "-"}
        </strong>
        <p className="text-slate-900 line-clamp-1 max-w-[16rem]">
          {description ?? "-"}
        </p>
        <div className="flex flex-row items-center text-slate-500 gap-x-1">
          <CalendarDays size={16} />
          <small className="text-xs">
            {created
              ? formatRelative(new Date(created), new Date(), { locale: th })
              : "-"}
          </small>
        </div>
      </div>
      <div className="flex flex-col items-center gap-y-4">
        {!seen && <div className="w-4 h-4 rounded-full bg-primary"></div>}
        <Button
          id="notify-delete-btn"
          variant="ghost"
          size="icon"
          onClick={(e: React.MouseEvent<HTMLElement>) => onHidden(e, [id])}
        >
          <X size={24} className="text-slate-500" />
        </Button>
      </div>
    </li>
  );
}
