"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Home,
  Users,
  Car,
  MapPin,
  CalendarDays,
  FileText,
  Receipt,
  Settings,
  QrCode,
  Wrench,
  LogOut,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Role } from "@/generated/prisma";

interface AppSidebarProps {
  user: {
    name: string;
    email: string;
    role: Role;
  };
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["ADMIN", "EMPLOYEE"] as Role[],
  },
  {
    title: "Klanten",
    href: "/dashboard/customers",
    icon: Users,
    roles: ["ADMIN"] as Role[],
  },
  {
    title: "Voertuigen",
    href: "/dashboard/vehicles",
    icon: Car,
    roles: ["ADMIN", "EMPLOYEE"] as Role[],
  },
  {
    title: "Locaties",
    href: "/dashboard/locations",
    icon: MapPin,
    roles: ["ADMIN", "EMPLOYEE"] as Role[],
  },
  {
    title: "Afspraken",
    href: "/dashboard/appointments",
    icon: CalendarDays,
    roles: ["ADMIN", "EMPLOYEE"] as Role[],
  },
  {
    title: "Contracten",
    href: "/dashboard/contracts",
    icon: FileText,
    roles: ["ADMIN"] as Role[],
  },
  {
    title: "Facturen",
    href: "/dashboard/invoices",
    icon: Receipt,
    roles: ["ADMIN"] as Role[],
  },
  {
    title: "Onderhoud",
    href: "/dashboard/maintenance",
    icon: Wrench,
    roles: ["ADMIN", "EMPLOYEE"] as Role[],
  },
  {
    title: "QR Codes",
    href: "/dashboard/qr-codes",
    icon: QrCode,
    roles: ["ADMIN", "EMPLOYEE"] as Role[],
  },
  {
    title: "Instellingen",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["ADMIN"] as Role[],
  },
];

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const visibleItems = menuItems.filter((item) =>
    item.roles.includes(user.role)
  );
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            SD
          </div>
          <div>
            <p className="text-sm font-semibold">Stalling aan de Dijk</p>
            <p className="text-xs text-muted-foreground">Beheersysteem</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigatie</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={
                      pathname === item.href ||
                      (item.href !== "/dashboard" &&
                        pathname.startsWith(item.href))
                    }
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
                <>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.role === "ADMIN"
                        ? "Beheerder"
                        : user.role === "EMPLOYEE"
                          ? "Medewerker"
                          : "Klant"}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto" />
                </>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56">
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Uitloggen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
