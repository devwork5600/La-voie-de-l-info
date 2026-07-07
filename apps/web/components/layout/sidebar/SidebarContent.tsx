"use client";

import { Cpu, Drama, Landmark, Leaf, Newspaper, TrendingUp } from "lucide-react";
import Link from "next/link";
import React from "react";

import { CategoryWithChildren } from "@/actions/categories-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMenuStore } from "@/store/useMenuStore";

import { ThemeSwitch } from "./SidebarThemeToggle";

const ICONS_BY_SLUG: Record<string, React.ComponentType<{ className?: string }>> = {
  politique: Landmark,
  economie: TrendingUp,
  "high-tech": Cpu,
  ecologie: Leaf,
  culture: Drama,
};

interface SidebarContentProps {
  categories: CategoryWithChildren[];
  activeSlug?: string;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ categories, activeSlug }) => {
  const { closeMenu } = useMenuStore();

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between gap-3 border-b pb-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center bg-brand font-playfair text-lg font-bold text-brand-foreground">
            L
          </div>
          <div>
            <p className="font-playfair text-sm font-bold leading-tight">La Voie De L&rsquo;Info</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">
              Édition Premium
            </p>
          </div>
        </div>

        <div className="sm:hidden">
          <ThemeSwitch />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Sections
        </p>

        <ul className="mt-4 space-y-1">
          {categories.map((category) => {
            const Icon = ICONS_BY_SLUG[category.slug] ?? Newspaper;
            const isActive = category.slug === activeSlug;

            return (
              <li key={category.id}>
                <Link
                  href={`/articles?category=${category.slug}`}
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                    isActive ? "bg-brand text-brand-foreground" : "text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="size-4" />
                  <span className="uppercase tracking-wide">{category.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t pt-6">
        <p className="font-semibold">Soutenez-nous</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Un journalisme rigoureux nécessite votre engagement.
        </p>
        <Button asChild className="mt-4 w-full" onClick={closeMenu}>
          <Link href="/subscribe">S&rsquo;abonner</Link>
        </Button>
      </div>
    </div>
  );
};

export default SidebarContent;
