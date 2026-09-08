"use client";

import React from "react";

import SidebarContent from "./SidebarContent";

import { CategoryWithChildren } from "@/actions/categories-actions";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useMenuStore } from "@/store/useMenuStore";

const Sidebar = ({
  initialCategories,
}: {
  initialCategories: CategoryWithChildren[];
}) => {
  const { isOpen, closeMenu } = useMenuStore();
  useBodyScrollLock(isOpen);

  return (
    <>
      <div
        className={`bg-background fixed top-[75px] left-0 h-[calc(100vh-75px)] w-full transition-opacity duration-300 ${isOpen ? "z-20 opacity-30" : "pointer-events-none -z-10 opacity-0"}`}
        onClick={closeMenu}
      ></div>

      <div
        className={`bg-background fixed top-[75px] z-30 h-[calc(100vh-75px)] w-[280px] scrollbar-none overflow-y-auto border-r px-4 py-6 transition-all duration-300 ease-in-out ${isOpen ? "left-0" : "left-[-280px]"}`}
      >
        <SidebarContent categories={initialCategories} />
      </div>
    </>
  );
};

export default Sidebar;
