"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { ModeToggle } from "./ModeToggle";
import NavbarCategory from "./NavbarCategory";
import NavbarTitle from "./NavbarTitle";

import { CategoryWithChildren } from "@/actions/categories-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import { useMenuStore } from "@/store/useMenuStore";

interface NavbarProps {
  initialCategories: CategoryWithChildren[];
}

const Navbar: React.FC<NavbarProps> = ({ initialCategories }) => {
  const { data: session } = useSession();
  const { toggle } = useMenuStore();
  const router = useRouter();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/articles?search=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
    setQuery("");
  };

  return (
    <div className="bg-brand text-brand-foreground fixed top-0 left-0 z-50 flex w-full flex-col border-b border-white/10">
      <div className="grid h-[75px] shrink-0 grid-cols-2 items-center px-4 py-2 text-sm font-medium tracking-wider xl:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Ouvrir le menu"
            onClick={toggle}
            className="hover:text-brand-foreground hover:bg-transparent xl:hidden"
          >
            <Menu className="size-5" />
          </Button>

          <NavbarTitle />
        </div>

        <NavbarCategory categories={initialCategories} />

        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label={isSearchOpen ? "Fermer la recherche" : "Rechercher"}
            onClick={() => setIsSearchOpen((open) => !open)}
            className="hover:text-brand-foreground hover:bg-white/10"
          >
            {isSearchOpen ? (
              <X className="size-4" />
            ) : (
              <Search className="size-4" />
            )}
          </Button>

          <ModeToggle />

          <Button
            asChild
            variant="ghost"
            className="hover:text-brand-foreground hidden hover:bg-white/10 sm:inline-flex"
          >
            <Link href={session ? "/user" : "/login"}>
              {session ? "Profil" : "Connexion"}
            </Link>
          </Button>

          <Button asChild>
            <Link href="/subscribe">Abonnement</Link>
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden transition-[height] duration-300 ease-in-out",
          isSearchOpen ? "h-[64px]" : "h-0"
        )}
      >
        <div
          className={cn(
            "flex h-[64px] items-center px-4 transition-all duration-300",
            isSearchOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0"
          )}
        >
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full items-center gap-2"
          >
            <div className="relative flex-1">
              <Input
                autoFocus={isSearchOpen}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un article..."
                className="bg-background text-foreground w-full pr-9"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Effacer"
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 transition"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <Button type="submit" size="icon" aria-label="Valider la recherche">
              <Search className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
