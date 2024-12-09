import {
  InputDetailsFormValuesType,
  searchQueryType,
  useFilterAndSortType,
} from "@/types/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MutableRefObject } from "react";

export const useFilterAndSort = create<useFilterAndSortType>((set) => ({
  filter: "",
  sort: "Date", // Set an initial value for sort
  setFilter: (value) => set(() => ({ filter: value })),
  setSort: (value: "Date" | "Name") =>
    set(() => ({ sort: value as "Date" | "Name" })), // Cast value to 'Date' | 'Name'
}));

export const useSearchQuery = create<searchQueryType>((set) => ({
  query: "",
  setQuery: (value) => set(() => ({ query: value })),
}));

interface InputFormDataState {
  inputData: InputDetailsFormValuesType;
  editedData: boolean;
  updateInputData: (data: InputDetailsFormValuesType) => void;
  updateEditedData: (data: boolean) => void;
  clearForm: () => void;
  updateBottleMeasurements: (data: any) => void;
}

const initialInputData = {
  analysisType: {
    resinComparison: true,
    performanceModel: true,
    colourModel: true,
  },
  materialInfo: {
    bottle: "",
    preform: "",
    resins: [],
    reference_resin: [],
    location: "",
    machine: "",
    stretchRodSpeed: "1.3",
    massFlowRate: "20",
  },
  bottleMeasurement: {
    sectionWeights: { shoulder: "", label: "", grip: "", base: "" },
    thickness: { t1: "", t2: "", t3: "", t4: "" },
  },
  preformColor: { l: "", a: "", b: "", haze: "" },
  creepParameters: { gasVolume: "" },
};

export const useInputFormData = create(
  persist<InputFormDataState>(
    (set) => ({
      inputData: initialInputData,
      editedData: false,
      updateInputData: (data) => set(() => ({ inputData: data })),
      updateEditedData: (value) => set(() => ({ editedData: value })),
      clearForm: () =>
        set(() => ({ inputData: initialInputData, editedData: false })),
      updateBottleMeasurements: (newMeasurements: any) =>
        set((state) => ({
          inputData: {
            ...state.inputData,
            bottleMeasurement: {
              sectionWeights: {
                ...state.inputData.bottleMeasurement.sectionWeights,
                ...newMeasurements.sectionWeights,
              },
              thickness: {
                ...state.inputData.bottleMeasurement.thickness,
                ...newMeasurements.thickness,
              },
            },
          },
        })),
    }),
    {
      name: "inputData",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useGraphPlotData = create(
  persist<any>(
    (set) => ({
      graphData: {},
      updateGraphData: async (data: any) => {
        set(() => ({ graphData: data }));
      },
    }),
    {
      name: "graphData",
      // Use sessionStorage for persistence
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useChartStore = create<{
  chartIds: string[];
  addChartId: (id: string) => void;
  removeChartId: (id: string) => void;
}>((set) => ({
  chartIds: [
    "ResinModelRadar",
    "PerformanceModelRadar",
    "ModulusLineChart",
    "ModulusBarChart",
    "CreepLineChart",
    "CreepBarChart",
    "PearlescenceAreaChart",
    "PerformanceMetricsLineChart",
    "PerformanceMetrics",
  ],
  addChartId: (id) => set((state) => ({ chartIds: [...state.chartIds, id] })),
  removeChartId: (id) =>
    set((state) => ({
      chartIds: state.chartIds.filter((chartId) => chartId !== id),
    })),
}));

interface RefStoreState {
  refs: { [key: string]: React.RefObject<HTMLDivElement> };
  setRef: (key: string, ref: MutableRefObject<HTMLDivElement | null>) => void;
}

export const RefStore = create<RefStoreState>((set) => ({
  refs: {},
  setRef: (key, ref) =>
    set((state) => ({
      refs: { ...state.refs, [key]: ref },
    })),
}));

interface IsGeneratingStoreState {
  isGenerating: boolean;
  updateIsGenerating: (value: boolean) => void;
}

export const useGeneratingReport = create<IsGeneratingStoreState>((set) => ({
  isGenerating: false, // Initialize the state
  updateIsGenerating: (value: boolean) => set({ isGenerating: value }), // Update state method
}));
