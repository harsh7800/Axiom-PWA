import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define the interface for a single CSV row
interface CsvRow {
  shoulder: number;
  label: number;
  base: number;
  grip: number;
}

// Define the interface for the store's state and actions
interface CsvDataStore {
  csvData: CsvRow[]; // Array of CSV rows
  setCsvData: (data: CsvRow[]) => void; // Action to set CSV data
  clearCsvData: () => void; // Action to clear CSV data
}

// Create the store
const useCsvDataStore = create<CsvDataStore>()(
  persist(
    (set) => ({
      csvData: [], // Initial state
      setCsvData: (data) =>
        set({
          csvData: data,
        }),
      clearCsvData: () =>
        set({
          csvData: [],
        }),
    }),
    {
      name: "csv-data-storage", // Key for storage
      storage: createJSONStorage(() => sessionStorage), // Using sessionStorage
    }
  )
);

export default useCsvDataStore;
