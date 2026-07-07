import { create } from "zustand";

interface WriterModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useWriterModalStore = create<WriterModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
