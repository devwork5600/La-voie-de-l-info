import { create } from "zustand";

interface MenuState {
  isOpen: boolean;
  toggle: () => void;
  closeMenu: () => void;
  openMenu: () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  closeMenu: () => set({ isOpen: false }),
  openMenu: () => set({ isOpen: true }),
}));
