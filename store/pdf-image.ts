import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define the types for the state and the Base64 image
type Base64Image = `data:image/${string};base64,${string}`;
type ImageKey = "performanceMetrics" | "radialGraph" | "bottle";

interface ImageStore {
  performanceMetrics: Base64Image | null;
  radialGraph: Base64Image | null;
  bottle: Base64Image | null;
  setImage: (name: ImageKey, value: Base64Image) => void;
  clearImages: () => void;
}

const useImageStore = create<ImageStore>()(
  persist(
    (set) => ({
      performanceMetrics: null,
      radialGraph: null,
      bottle: null,
      setImage: (name, value) =>
        set((state) => ({
          ...state,
          [name]: value,
        })),
      clearImages: () =>
        set({
          performanceMetrics: null,
          radialGraph: null,
          bottle: null,
        }),
    }),
    {
      name: "specific-image-storage", // Key for sessionStorage
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useImageStore;
