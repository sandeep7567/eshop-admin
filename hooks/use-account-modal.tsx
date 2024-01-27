import { create } from "zustand";

interface AccountModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const UseAccountModal = create<AccountModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));