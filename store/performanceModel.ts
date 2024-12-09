/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ProcessWindowStore {
  performanceData: any;
  setPerformanceData: (value: any) => void;
  clearPerformanceData: () => void;
}

const usePerformanceData = create<ProcessWindowStore>()(
  persist(
    (set) => ({
      performanceData: null,
      setPerformanceData: (value) =>
        set(() => ({
          performanceData: value,
        })),
      clearPerformanceData: () =>
        set({
          performanceData: null,
        }),
    }),
    {
      name: "performance-data", // Key for sessionStorage
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default usePerformanceData;
