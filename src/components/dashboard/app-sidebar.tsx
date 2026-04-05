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
  ScanLine,
  UserPlus,
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

interface MenuItem {
  title: string;
  href: string;
  icon: typeof Home;
  roles: Role[];
}

interface MenuSection {
  label: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    label: "Overzicht",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: Home, roles: ["ADMIN", "EMPLOYEE"] },
    ],
  },
  {
    label: "Inchecken",
    items: [
      { title: "Voertuig inchecken", href: "/checkin", icon: ScanLine, roles: ["ADMIN", "EMPLOYEE"] },
      { title: "Locaties", href: "/dashboard/locations", icon: MapPin, roles: ["ADMIN", "EMPLOYEE"] },
      { title: "QR Codes", href: "/dashboard/qr-codes", icon: QrCode, roles: ["ADMIN", "EMPLOYEE"] },
    ],
  },
  {
    label: "Klanten",
    items: [
      { title: "Aanmeldingen", href: "/dashboard/registrations", icon: UserPlus, roles: ["ADMIN"] },
      { title: "Klanten", href: "/dashboard/customers", icon: Users, roles: ["ADMIN"] },
      { title: "Afspraken", href: "/dashboard/appointments", icon: CalendarDays, roles: ["ADMIN", "EMPLOYEE"] },
    ],
  },
  {
    label: "Voertuigen",
    items: [
      { title: "Voertuig aanvragen", href: "/dashboard/vehicle-requests", icon: Car, roles: ["ADMIN"] },
      { title: "Voertuigen", href: "/dashboard/vehicles", icon: Car, roles: ["ADMIN", "EMPLOYEE"] },
      { title: "Onderhoud", href: "/dashboard/maintenance", icon: Wrench, roles: ["ADMIN", "EMPLOYEE"] },
    ],
  },
  {
    label: "Contracten & Financieel",
    items: [
      { title: "Contracten", href: "/dashboard/contracts", icon: FileText, roles: ["ADMIN"] },
      { title: "Facturen", href: "/dashboard/invoices", icon: Receipt, roles: ["ADMIN"] },
    ],
  },
  {
    label: "Beheer",
    items: [
      { title: "Instellingen", href: "/dashboard/settings", icon: Settings, roles: ["ADMIN"] },
    ],
  },
];

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
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
        {menuSections.map((section) => {
          const visibleItems = section.items.filter((item) =>
            item.roles.includes(user.role)
          );
          if (visibleItems.length === 0) return null;

          return (
            <SidebarGroup key={section.label}>
              <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
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
          );
        })}
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
