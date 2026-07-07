'use client';

import { Menu, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryWithChildren } from '@/actions/categories-actions';
import { useSession } from '@/lib/auth/auth-client';
import { useMenuStore } from '@/store/useMenuStore';
import { cn } from '@/lib/utils';

import { ModeToggle } from './ModeToggle';
import NavbarCategory from './NavbarCategory';
import NavbarTitle from './NavbarTitle';

interface NavbarProps {
  initialCategories: CategoryWithChildren[];
}

const Navbar: React.FC<NavbarProps> = ({ initialCategories }) => {
  const { data: session } = useSession();
  const { toggle } = useMenuStore();
  const router = useRouter();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/articles?search=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed top-0 left-0 z-50 flex w-full flex-col bg-brand text-brand-foreground border-b border-white/10">
      <div className="grid h-[75px] shrink-0 grid-cols-2 xl:grid-cols-[1fr_auto_1fr] items-center px-4 py-2 text-sm font-medium tracking-wider">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Ouvrir le menu"
          onClick={toggle}
          className="xl:hidden hover:bg-transparent hover:text-brand-foreground"
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
          aria-label={isSearchOpen ? 'Fermer la recherche' : 'Rechercher'}
          onClick={() => setIsSearchOpen((open) => !open)}
          className="hover:bg-white/10 hover:text-brand-foreground"
        >
          {isSearchOpen ? <X className="size-4" /> : <Search className="size-4" />}
        </Button>

        <ModeToggle />

        <Button
          asChild
          variant="ghost"
          className="hidden sm:inline-flex hover:bg-white/10 hover:text-brand-foreground"
        >
          <Link href={session ? '/user' : '/login'}>
            {session ? 'Profil' : 'Connexion'}
          </Link>
        </Button>

        <Button asChild>
          <Link href="/subscribe">Abonnement</Link>
        </Button>
      </div>
      </div>

      <div
        className={cn(
          'overflow-hidden transition-[height] duration-300 ease-in-out',
          isSearchOpen ? 'h-[64px]' : 'h-0'
        )}
      >
        <div
          className={cn(
            'flex h-[64px] items-center px-4 transition-all duration-300',
            isSearchOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
          )}
        >
          <form onSubmit={handleSearchSubmit} className="flex w-full items-center gap-2">
            <div className="relative flex-1">
              <Input
                autoFocus={isSearchOpen}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un article..."
                className="w-full bg-background pr-9 text-foreground"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Effacer"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
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
