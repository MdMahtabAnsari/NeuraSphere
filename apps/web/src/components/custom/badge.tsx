import { Badge } from "@/components/ui/badge"
import { ReactNode } from "react"

export function NotificationBadge({children,count}: { children: ReactNode,count: number }) {
  return (
    <Badge className="relative">
      {children}
      <span className="absolute -top-2 -right-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
        {count}
      </span>
    </Badge>
  )
}
