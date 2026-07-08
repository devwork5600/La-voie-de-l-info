"use client";

import {
  BarChart3,
  Mail,
  Menu,
  Newspaper,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { useMenuStore } from "@/store/useMenuStore";

const NAV_LINKS = [
  { href: "/admin", label: "Statistiques", icon: BarChart3 },
  { href: "/admin/articles", label: "Articles", icon: Newspaper },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
];

const AdminNav: React.FC = () => {
  const { toggle } = useMenuStore();

  return (
    <header className="bg-brand text-brand-foreground sticky top-0 z-40 flex h-[75px] shrink-0 items-center justify-between border-b border-white/10 px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Ouvrir le menu"
          onClick={toggle}
          className="hover:text-brand-foreground hover:bg-white/10 lg:hidden"
        >
          <Menu className="size-5" />
        </Button>

        <Link
          href="/admin"
          className="flex flex-col leading-tight transition hover:opacity-90"
        >
          <span className="font-playfair text-lg font-bold">
            La Voie De L&rsquo;Info
          </span>
          <span className="text-brand-foreground/60 flex items-center gap-1 text-[10px] tracking-widest uppercase">
            <ShieldCheck className="size-2.5" />
            Panel Admin
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 border-l border-white/10 pl-4 lg:flex">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="text-brand-foreground/80 hover:text-brand-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition hover:bg-white/10"
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="hover:text-brand-foreground hover:bg-white/10"
        >
          <Link href="/">Retour au site</Link>
        </Button>

        <LogoutButton className="text-brand-foreground/70 hover:text-brand-foreground hidden items-center text-sm transition sm:flex" />
      </div>
    </header>
  );
};

export default AdminNav;
