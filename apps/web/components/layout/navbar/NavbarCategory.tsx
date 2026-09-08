import Link from "next/link";
import React from "react";

import { CategoryWithChildren } from "@/actions/categories-actions";
import { cn } from "@/lib/utils";

interface NavbarCategoryProps {
  categories: CategoryWithChildren[];
}

// Tailwind only picks up complete class strings from source, so the
// per-index breakpoint has to be a literal lookup, not a template string.
// Index 0-2 show as soon as the <ul> itself appears (lg:flex below);
// each further slot needs progressively wider screens to reveal itself.
const VISIBLE_FROM = [
  "", // 0
  "", // 1
  "hidden xl:inline", // 2
  "hidden xl:inline", // 3
  "hidden 2xl:inline", // 4
  "hidden 2xl:inline", // 5
  "hidden 2xl:inline", // 6
];

const NavbarCategory: React.FC<NavbarCategoryProps> = ({ categories }) => {
  return (
    <ul className="shrink- hidden items-center justify-center text-sm uppercase xl:flex">
      {categories.slice(0, VISIBLE_FROM.length).map((category, index) => (
        <li key={category.id} className={cn(VISIBLE_FROM[index])}>
          <Link
            href={`/articles?category=${category.slug}`}
            className="after:bg-primary relative mx-3 py-1 font-medium after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-300 hover:after:w-full"
          >
            {category.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavbarCategory;
