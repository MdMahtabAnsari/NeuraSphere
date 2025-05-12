'use client'
import { Home, Search,Bell,User,CirclePlus,MessageCircleHeart,Activity } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Search", url: "/dashboard/search", icon: Search },
    { title: "Notifications", url: "/dashboard/notification", icon: Bell },
    {title:"Profile",url:"/dashboard/profile",icon:User},
    {title:"Create Post",url:"/dashboard/post/create",icon:CirclePlus},
    // {title:"Interest",url:"/dashboard/interest",icon:MessageCircleHeart},
    {title:"Viral",url:"/dashboard/viral",icon:Activity},

];

export function AppSidebar() {
    const router = useRouter();
    const pathname = usePathname(); // <-- New!

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={item.url === pathname}>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start cursor-pointer"
                                            onClick={() => router.push(item.url)}
                                        >
                                            <item.icon className="mr-2 h-4 w-4" />
                                            {item.title}
                                        </Button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
