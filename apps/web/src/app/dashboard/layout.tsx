import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="">
      <AppSidebar />
      <main className="w-full h-full">
        <SidebarTrigger className=" fixed" />
        {children}
      </main>
    </SidebarProvider>
  )
}
