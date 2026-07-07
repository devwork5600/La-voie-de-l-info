import Link from 'next/link';
import React from 'react';

const NavbarTitle: React.FC = () => {
  return (
    <Link href="/" className="inline-block leading-tight hover:opacity-90 transition">
      <h2 className="text-lg font-bold font-playfair leading-tight sm:text-xl">
        La Voie De L&rsquo;Info
      </h2>
    </Link>
  );
};

export default NavbarTitle;
