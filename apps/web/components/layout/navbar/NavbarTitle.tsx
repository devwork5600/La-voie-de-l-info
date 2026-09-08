import Link from "next/link";
import React from "react";

const NavbarTitle: React.FC = () => {
  return (
    <Link
      href="/"
      className="inline-block leading-tight transition hover:opacity-90"
    >
      <h2 className="font-playfair text-lg leading-tight font-bold sm:text-xl">
        La Voie De L&rsquo;Info
      </h2>
    </Link>
  );
};

export default NavbarTitle;
