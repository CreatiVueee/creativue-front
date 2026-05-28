import { create } from "zustand";

interface LoginModalState {
  isOpen: boolean;
  redirectPath: string | null;
}

interface LoginModalActions {
  open: (redirectPath?: string) => void;
  close: () => void;
}

export const useLoginModalStore = create<LoginModalState & LoginModalActions>()(
  (set) => ({
    isOpen: false,
    redirectPath: null,

    open: (redirectPath) =>
      set({ isOpen: true, redirectPath: redirectPath ?? null }),
    close: () => set({ isOpen: false, redirectPath: null }),
  })
);
