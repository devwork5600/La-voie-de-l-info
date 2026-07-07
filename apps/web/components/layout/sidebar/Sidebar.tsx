"use client";

import React from "react";
import { useMenuStore } from "@/store/useMenuStore";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { CategoryWithChildren } from "@/actions/categories-actions";
import SidebarContent from "./SidebarContent";

const Sidebar = ({ initialCategories }: { initialCategories: CategoryWithChildren[] }) => {
  const { isOpen, closeMenu } = useMenuStore();
  useBodyScrollLock(isOpen);

  return (
    <>
      <div
        className={`fixed top-[75px] left-0 w-full h-[calc(100vh-75px)] bg-background transition-opacity duration-300 ${isOpen ? "opacity-30 z-20" : "opacity-0 -z-10 pointer-events-none"}`}
        onClick={closeMenu}
      ></div>

      <div
        className={`fixed top-[75px] w-[280px] h-[calc(100vh-75px)] z-30 bg-background transition-all duration-300 ease-in-out border-r overflow-y-auto scrollbar-none px-4 py-6 ${isOpen ? "left-0" : "left-[-280px]"}`}
      >
        <SidebarContent categories={initialCategories} />
      </div>
    </>
  );
};

export default Sidebar;
