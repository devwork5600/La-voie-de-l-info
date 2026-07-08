"use client";

import { BarChart3, Mail, Newspaper, Users } from "lucide-react";
import Link from "next/link";
import React from "react";

import { LogoutButton } from "@/components/auth/logout-button";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { cn } from "@/lib/utils";
import { useMenuStore } from "@/store/useMenuStore";

const MENU_ITEMS = [
  { href: "/admin", label: "Statistiques", icon: BarChart3 },
  { href: "/admin/articles", label: "Articles", icon: Newspaper },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
];

const AdminSidebar: React.FC = () => {
  const { isOpen, closeMenu } = useMenuStore();
  useBodyScrollLock(isOpen);

  return (
    <>
      <div
        className={cn(
          "bg-background fixed top-[75px] left-0 h-[calc(100vh-75px)] w-full transition-opacity duration-300",
          isOpen ? "z-30 opacity-30" : "pointer-events-none -z-10 opacity-0"
        )}
        onClick={closeMenu}
      />

      <div
        className={cn(
          "bg-background fixed top-[75px] z-40 h-[calc(100vh-75px)] w-[280px] border-r transition-all duration-300 ease-in-out",
          isOpen ? "left-0" : "left-[-280px]"
        )}
      >
        <nav className="flex h-full flex-col justify-between px-4 py-6">
          <ul className="space-y-1">
            {MENU_ITEMS.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={closeMenu}
                  className="hover:bg-muted flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition"
                >
                  <Icon className="text-muted-foreground size-4" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-t pt-4">
            <LogoutButton className="text-muted-foreground hover:text-destructive flex items-center text-sm transition" />
          </div>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
