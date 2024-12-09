/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ProcessWindowStore {
  processWindow: any;
  setProcessWindow: (value: any) => void;
  clearProcessWindow: () => void;
}

const useProcessWindow = create<ProcessWindowStore>()(
  persist(
    (set) => ({
      processWindow: null,
      setProcessWindow: (value) =>
        set(() => ({
          processWindow: value,
        })),
      clearProcessWindow: () =>
        set({
          processWindow: null,
        }),
    }),
    {
      name: "process-window", // Key for sessionStorage
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useProcessWindow;
