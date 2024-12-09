/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactElement } from "react";

export interface ProjectDataType {
  created_on: string;
  project_name: string;
  bottle: string;
  preform: string;
  resins: string;
  reference_resin: string;
  created_by: string;
  inputs: { inputData: InputDetailsFormValuesType };
  id: string;
}

export interface BarOptionType {
  colors: string[];
  plotOptions: {
    bar: {
      distributed: boolean;
      rangeBarOverlap: boolean;
      columnWidth: string | number;
    };
  };
  chart: {
    id: string;
    height: number;
    type: "bar";
  };
  dataLabels: {
    enabled: boolean;
    style: {
      fontWeight: number;
    };
  };
  stroke: {
    curve: "smooth";
    colors: string[];
    width: number;
  };
  xaxis: {
    type: "category";
    categories: string[];
    axisBorder: {
      show: boolean;
    };
    axisTicks: {
      show: boolean;
    };
    labels: {
      show: boolean;
      style: {
        colors: string[];
        fontSize: string;
        fontFamily: string | undefined;
        fontWeight: number;
      };
    };
  };
  yaxis: {
    // min: number | undefined;
    // max: number | undefined;
    type: string;
    categories: string[];
    labels: {
      formatter: any;
      show: boolean;
      style: {
        colors: string[];
        fontSize: string;
        fontFamily: string | undefined;
        fontWeight: number;
      };
    };
    title: {
      text: string;
      rotate: number;
      offsetX: number;
      offsetY: number;
      style: {
        fontSize: string;
        // fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: number;
        // cssClass: "apexcharts-yaxis-title",
      };
    };
  };
  tooltip: {
    enabled: boolean;
  };
  grid: {
    show: boolean;
  };
  legend: {
    show: boolean;
  };
}

export interface LineOptionType {
  colors: string[];
  // annotations: {
  //   xaxis: {
  //     x: number;
  //     borderColor: string;
  //     label: {
  //       borderColor: string;
  //       borderWidth: number;
  //       style: {
  //         color: string;
  //         background: string;
  //         borderWidth: number;
  //       };
  //     };
  //   }[];
  // };
  // grid: {
  //   show: boolean;
  //   borderColor: string;
  //   strokeDashArray: number;
  //   position: "back" | "front";
  // };
  chart: {
    id: string;
    height: number;
    type: "area";
    borderStyle: string | undefined;
    borderWidth: number | undefined;
  };
  dataLabels: {
    enabled: boolean;
    fontWeight: number;
  };
  stroke: {
    curve: "straight" | "smooth" | "stepline";
    width: number;
  };
  xaxis: {
    tickAmount: number;

    type: "category";
    categories: string[];
    labels: {
      formatter: any;
      show: boolean;
      style: {
        colors: string[];
        fontSize: string;
        fontFamily: string;
        fontWeight: number;
      };
    };
    title: {
      text: string;
      style: {
        fontWeight: number;
      };
    };
  };
  yaxis: {
    type: "category";
    categories: string[];
    axisBorder: {
      show: boolean;
    };
    axisTicks: {
      show: boolean;
    };
    labels: {
      formatter: any;
      show: boolean;
      style: {
        colors: string[];
        fontSize: string;
        fontFamily: string;
        fontWeight: number;
      };
    };
    title: {
      text: string;
      rotate: number;
      offsetX: number;
      offsetY: number;
      style: {
        fontSize: string;
        // fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: number;
        // cssClass: "apexcharts-yaxis-title",
      };
    };
    // title: { text: string };
  };
  tooltip: {
    enabled: boolean;
    shared: boolean;
  };

  legend: {
    show: boolean;
  };
}

export interface StraightLineOptionsType {
  fill: {
    colors: (string | undefined)[];
    opacity: number;
    // type: "solid" | "light";
    // gradient: {
    //   shade: "light" | "solid";
    //   stops: number[];
    // };
  };
  // plotOptions: {
  //   area: {
  //     fillTo: "end" | "origin";
  //   };
  // };

  annotations: {
    xaxis: any;
  };

  chart: {
    id: string;
    height: number;
    type: "area" | "line";
    animations: {
      enabled: boolean;
    };
  };
  dataLabels: {
    enabled: boolean;
  };
  stroke: {
    curve: "straight";
    width: number[];
    colors: string[] | any;
  };
  xaxis: any;
  // axisTicks: {
  //   show: boolean;
  //   // borderType: string;
  //   color: string;
  //   // width: number;
  // };
  yaxis: any;
  grid: {
    show: boolean;
  };
  legend: {
    show: boolean;
  };
  tooltip: any;
}

export interface ScatterPlotType {
  series: any;
  annotations: any;
  chart: {
    id: string;
    height: number;
    type: "scatter";
  };
  grid: {
    show: boolean;
  };
  xaxis: {
    tickAmount: number;
    labels: {
      formatter: any;
      show: boolean;
    };
  };
  colors: string[];
  yaxis: {
    labels: {
      formatter: any;
    };
    tickAmount: number;
  };
}

export interface activeIndexType {
  activeIndex: number;
  incrementActiveIndex: () => void;
  decrementActiveIndex: () => void;
}

interface Material {
  id: string;
  resin_name: string;
}

export interface MultipleSelectProps {
  value: string[];
  onChange?: (value: string[]) => void;
  data: Material[];
  maxSelectLimit?: number;
}

export interface useFilterAndSortType {
  filter: string;
  sort: "Date" | "Name";
  setFilter: (value: string) => void;
  setSort: (value: "Date" | "Name") => void;
}

export interface searchQueryType {
  query: string;
  setQuery?: (value: string) => void;
}

export interface PopoverDropdownProps {
  leftIcon?: ReactElement; // Optional property of type string for leftIcon
  rightIcon?: ReactElement; // Optional property of type string for rightIcon
  onClickAction?: (value: "Date" | "Name") => void; // Optional property of type function for onChangeAction
  eventName?: string;
  data: any; // Optional property of type string for eventName
  outline?: boolean;
  disabled?: boolean;
}

export interface InputDetailsFormValuesType {
  analysisType: {
    resinComparison?: boolean;
    performanceModel?: boolean;
    colourModel?: boolean;
  };
  materialInfo: {
    bottle: string | undefined;
    preform: string | undefined;
    resins: string[];
    reference_resin: string[];
    location: string | undefined;
    machine: string | undefined;
    stretchRodSpeed: string | undefined;
    massFlowRate: string | undefined;
  };
  bottleMeasurement: {
    sectionWeights: {
      shoulder: string | undefined;
      label: string | undefined;
      grip: string | undefined;
      base: string | undefined;
    };
    thickness: {
      t1: string | undefined;
      t2: string | undefined;
      t3: string | undefined;
      t4: string | undefined;
    };
  };
  preformColor: {
    l: string | undefined;
    a: string | undefined;
    b: string | undefined;
    haze: string | undefined;
  };
  creepParameters: {
    gasVolume: string | undefined;
  };
}

export interface PearlescenceFormType {
  location: string;
  machine: string;
  massFlowRate: string;
  stretchRodSpeed: string;
}

// Define the shape of the analysisType object
interface AnalysisType {
  resinComparison: boolean;
  performanceModel: boolean;
  colourModel: boolean;
}

// Define the structure of the store
export interface useAnalysisStoreType {
  analysisType: AnalysisType;
  handleAnalyticsType: (key: keyof AnalysisType, value: boolean) => void;
}

export interface pearlescenceFormStoreType {
  pearlescenceData?: PearlescenceFormType;
  updatePeearlescenceData?: (value: PearlescenceFormType) => void;
}

type GlobalSketchType = {
  axial: string | undefined;
  hoop: string | undefined;
};

type ResinsData = {
  label: string;
  idealETL: string;
  panelCreep: string;
  burst: string;
};

interface PerformanceData {
  resins: ResinsData[];
}

export interface performanceFormStoreType {
  performanceData?: PerformanceData;
  globalSketchData?: GlobalSketchType;
  updatePerformanceData?: (value: PerformanceData) => void;
  updateGlobalSketchData?: (value: GlobalSketchType) => void;
}

export interface inputFormStoreType {
  inputData?: InputDetailsFormValuesType;
  updateInputData?: (value: object) => void;
}

export interface seriesType {
  name: string;
  data: number[];
  color: string;
  visible: boolean;
}

export interface performanceType {
  Resin: string;
  longTermModule: number;
  "PW-blowTemp": number;
  iv: number;
  Modulus: number;
}
export interface creepSeriesType {
  name: string;
  data: { x: number; y: number }[];
  colour: string;
  visible: boolean;
  LongTermModulus?: number;
}

export interface modulusSeriesType {
  name: string;
  data: { x: number; y: number }[];
  colour: string;
  visible: boolean;
  Modulus: number;
}

export interface pearlescenceSeriesType {
  name: string;
  data: { x: number; y: number }[];
  colour?: string;
  color?: string;
  visible: boolean;
  type: string;
  Lower: number;
  Upper: number;
  BlowTemp: number;
  listBottleZones: string[];
  listLowerBound: string[];
  listUpperBound: string[];
  listLower: string[];
  listUpper: string[];
  listBlowTemp: string[];
}
