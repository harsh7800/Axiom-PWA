/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  creepSeriesType,
  modulusSeriesType,
  pearlescenceSeriesType,
} from "@/types/inputformtype";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const generateSeriesForCreep = (
  existingData: any[],
  peakPoints: number[]
): creepSeriesType[] => {
  // Extract all Y values across all resins and convert to floats
  const allYValues = existingData.flatMap((data) => data.y.map(parseFloat));

  // Find global min and max Y values across all resins
  const maxY = Math.max(...allYValues);
  const minY = Math.min(...allYValues);

  // Generate the series array
  const series: creepSeriesType[] = [];

  // Add resin series to the series array
  existingData.forEach((data) => {
    series.push({
      name: data.Resin,
      data: data.x.map((x: number, index: number) => ({
        x,
        y: parseFloat(data.y[index]).toFixed(2),
      })),
      colour: data.Colour,
      visible: true,
      LongTermModulus: data.LongTermModulus,
    });
  });

  // Add peak series for each peak point that matches a resin's Stress value
  peakPoints.forEach((peakPoint) => {
    if (peakPoint !== 0) {
      const correspondingData = existingData.find(
        (data) => data.Stress === peakPoint
      );
      if (correspondingData) {
        series.push({
          name: `Stress-${correspondingData.Resin}`,
          data: [
            { x: peakPoint, y: parseFloat(minY.toFixed(2)) },
            { x: peakPoint, y: parseFloat(maxY.toFixed(2)) },
          ],
          colour: correspondingData.Colour, // Use the correct resin's color
          visible: true,
          LongTermModulus: 0, // Adjust as needed
        });
      }
    }
  });

  return series;
};

export const generateSeriesForPearl = (
  existingData: any[],
  arrayIndex: number
): pearlescenceSeriesType[] => {
  // // console.log("Existing Data", existingData);

  const series = existingData.flatMap((data) => [
    // Original data series
    {
      name: data.Resin,
      data: data.xArea.map((x: number, index: number) => ({
        x: Number(x.toFixed(2)),
        y: Number(data.yArea[index].toFixed(2)),
      })),
      type: "area",
      colour: data.Colour,
      visible: true,
      Lower: data.Lower,
      Upper: data.Upper,
      BlowTemp: data.BlowTemp,
      LowerBound: data.LowerBound,
      UpperBound: data.UpperBound,
      listBottleZones: data.ListBottleZones,
      listLowerBound: data.listLowerBound,
      listUpperBound: data.listUpperBound,
      listLower: data.listLower,
      listUpper: data.listUpper,
      listBlowTemp: data.listBlowTemp,
    },
    // processArea series using listZoneAreaX and listZoneAreaY based on arrayIndex
    {
      name: `processArea-${data.Resin}-${arrayIndex}`, // Unique identifier
      data: data.listZoneAreaX[arrayIndex].map((x: number, index: number) => ({
        x: Number(x.toFixed(2)),
        y: Number(data.listZoneAreaY[arrayIndex][index].toFixed(2)),
      })),
      type: "area",
      colour: data.Colour,
      visible: true,
      // Optional additional properties
      Lower: null,
      Upper: null,
      BlowTemp: null,
      LowerBound: null,
      UpperBound: null,
      listBottleZones: [],
      listLowerBound: [],
      listUpperBound: [],
      listLower: [],
      listUpper: [],
      listBlowTemp: [],
    },
    // Horizontal line series based on arrayIndex
    {
      name: `horizontalLine-${data.Resin}-${arrayIndex}`,
      data: [
        { x: 1.5, y: data.listLower[arrayIndex] },
        { x: 4.5, y: data.listLower[arrayIndex] },
      ],
      type: "line",
      colour: data.Colour,
      visible: true,
      Lower: null,
      Upper: null,
      BlowTemp: null,
      LowerBound: null,
      UpperBound: null,
      listBottleZones: [],
      listLowerBound: [],
      listUpperBound: [],
      listLower: [],
      listUpper: [],
      listBlowTemp: [],
    },
  ]);

  // Add the static horizontal line only once
  series.push({
    name: `horizontalLine-Static`,
    data: [
      { x: 1.5, y: 120 },
      { x: 4.5, y: 120 },
    ],
    type: "line",
    colour: "#000000",
    visible: true,
    Lower: null,
    Upper: null,
    BlowTemp: null,
    LowerBound: null,
    UpperBound: null,
    listBottleZones: [],
    listLowerBound: [],
    listUpperBound: [],
    listLower: [],
    listUpper: [],
    listBlowTemp: [],
  });

  return series;
};

// export const generateLabelSeriesForPearl = (
//   existingData: any[]
// ): pearlescenceSeriesType[] => {
//   return existingData.map((data) => ({
//     Resin: data.Resin,
//     data: data.xArea.map((x: number, index: number) => ({
//       x: Number(x.toFixed(2)),
//       y: Number(data.yArea[index].toFixed(2)),
//     })),
//     colour: data.Colour,
//     visible: true,
//     Lower: data.Lower,
//     Upper: data.Upper,
//     BlowTemp: data.BlowTemp,
//     LowerBound: data.LowerBound,
//     UpperBound: data.UpperBound,
//     listBottleZones: data.ListBottleZones,
//     listLowerBound: data.listLowerBound,
//     listUpperBound: data.listUpperBound,
//     listUpper: data.listUpper,
//     listLower: data.listLower,
//   }));
// };

export const generateSeriesForModulus = (
  existingData: any[],
  peakPoints: number[]
): modulusSeriesType[] => {
  // Convert all Y values to numbers
  const allYValues = existingData.flatMap((data) => data.y.map(Number));

  // Find global min and max Y values across all resins
  const maxY = Math.max(...allYValues);
  const minY = Math.min(...allYValues);

  // Generate the series array
  const series: modulusSeriesType[] = [];

  // Add resin series to the series array
  existingData.forEach((data) => {
    series.push({
      name: data.Resin,
      data: data.x.map((x: number, index: number) => ({
        x,
        y: Number(data.y[index]).toFixed(2),
      })),
      colour: data.Colour,
      visible: true,
      Modulus: data.Modulus,
    });
  });

  // Add peak series for each peak point to the series array, excluding zero values
  peakPoints.forEach((peakPoint) => {
    // Only add peak series if the peak point is not zero
    if (peakPoint !== 0) {
      series.push({
        name: `EQSR`,
        data: [
          { x: peakPoint, y: parseInt(minY.toFixed(2)) },
          { x: peakPoint, y: parseInt(maxY.toFixed(2)) },
        ],
        colour: "#000",
        visible: true,
        Modulus: 0, // Adjust if needed
      });
    }
  });

  return series;
};

// Define the ScatterPlotData interface
export interface ScatterPlotData {
  name: string;
  thicknessData?: number[]; // thicknessData is optional since preform data may not have it
  data: [number, number][];
}

// Define the ScatterPlotProps interface
export interface ScatterPlotProps {
  thicnessProfiles: {
    Name: string;
    T1: number;
    T2: number;
    T3: number;
    T4: number;
    thicknessData: number[];
    bottleX: number[];
    bottleY: number[];
  }[];
  Preform_X: number[];
  Preform_Y: number[];
}

// Define the ThicknessProfile interface that extends ScatterPlotData
interface ThicknessProfile extends ScatterPlotData {
  name: string;
  T1: number;
  T2: number;
  T3: number;
  T4: number;
  thicknessData: number[];
}

export const generateScatterPlot = (data: any): any => {
  if (!data) {
    throw new Error("Data is undefined");
  }

  const thicknessProfiles: ThicknessProfile[] = data.thicnessProfiles.map(
    (profile: any) => ({
      name: profile.Resin,
      T1: profile.T1,
      T2: profile.T2,
      T3: profile.T3,
      T4: profile.T4,
      thicknessData: profile.bottleX.map(
        (_: any, index: any) => profile.thicknessData[index]
      ),
      // data: profile.bottleX.map((x: any, index: any) => [
      //   x,
      //   profile.bottleY[index],
      // ]),
    })
  );
  const preformData: ScatterPlotData = {
    name: "preform",
    data: data.Preform_X.map((x: any, index: any) => [
      x,
      data.Preform_Y[index],
    ]),
  };
  const bottleData: ScatterPlotData = {
    name: "bottle",
    data: data.Bottle_X.map((x: any, index: any) => [x, data.Bottle_Y[index]]),
  };

  if (data.thicnessProfiles.length != 0) {
    const T: any = {
      T1: thicknessProfiles[0].T1,
      T2: thicknessProfiles[0].T2,
      T3: thicknessProfiles[0].T3,
      T4: thicknessProfiles[0].T4,
    };
    // Concatenate thickness profiles with preform data
    const PlotData = [bottleData, preformData];
    const res = { T, PlotData };
    return res;
  }
  return;
};

export const generateResinPlot = (data: any): ScatterPlotData[] => {
  if (!data) {
    throw new Error("Data is undefined");
  }

  const thicknessProfiles: ThicknessProfile[] = data.thicnessProfiles.map(
    (profile: any) => ({
      name: profile.Resin,
      color: profile.Colour,
      T1: profile.T1,
      T2: profile.T2,
      T3: profile.T3,
      T4: profile.T4,
      thicknessData: profile.bottleX.map(
        (_: any, index: any) => profile.thicknessData[index]
      ),
      data: profile.thicknessData.map((x: any, index: any) => [
        x,
        profile.bottleY[index],
      ]),
    })
  );
  return thicknessProfiles;
};

// export const generateLinearSeries = (
//   materials: string[] = []
// ): seriesType[] => {
//   const generateColorPalette = (count: number): string[] => {
//     const palette = [
//       "#9FCCE7",
//       "#EB4993",
//       "#62A126",
//       "#bc85a3",
//       "#feadb9",
//       "#f9e1e0",
//     ]; // Define your color palette here
//     return palette.slice(0, count); // Return a subset of the palette
//   };

//   const colors = generateColorPalette(materials.length); // Generate a color palette based on the number of materials

//   const getRandomOffset = (range: number): number =>
//     (Math.random() - 1) * range; // Random offset between -range/2 and range/2

//   return materials?.map((material, index) => {
//     const startValue = 90;
//     const increment = 10; // Increment value for each step
//     const baseLine = Array.from(
//       { length: 7 },
//       (_, index) => startValue + index * increment
//     );
//     const data = baseLine.map((value) => value + getRandomOffset(10)); // Add randomness around the base line

//     return {
//       name: material,
//       data,
//       color: colors[index] || "#000000", // Use generated color or fallback to black
//       visible: true,
//     };
//   });
// };

type ToggleSeriesVisibility = (
  index: number,
  setVisibleSeries: React.Dispatch<React.SetStateAction<boolean[]>>
) => void;

// Implement the toggle function
export const toggleSeriesVisibility: ToggleSeriesVisibility = (
  index,
  setVisibleSeries
) => {
  setVisibleSeries((prevVisibleSeries) => {
    const updatedVisibleSeries = [...prevVisibleSeries];
    updatedVisibleSeries[index] = !updatedVisibleSeries[index];
    return updatedVisibleSeries;
  });
};

export function separateEmailLocalPart(email: string) {
  // Extract the local part of the email (before the @)
  const localPart = email?.split("@")[0];

  // Initialize an array to hold the parts of the name
  const parts: string[] = [];

  // Use a regular expression to split the string into parts
  // This regex matches sequences of letters followed by digits or a capital letter
  const regex = /([a-z]+)(?=\d|[A-Z])|([a-z]+)/g;
  let match;

  while ((match = regex.exec(localPart)) !== null) {
    parts.push(match[0]);
  }

  // Join the parts with a space and return the result
  return parts.join(" ");
}

export function convertTimestamp(timestamp: string): string {
  // Parse the timestamp into a Date object
  const date = new Date(timestamp);

  // Define an array of month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the day, month, and year
  const day = date.getUTCDate();
  const month = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  // Format the date as 'DD MMM YYYY'
  const formattedDate = `${day.toString().padStart(2, "0")} ${month} ${year}`;

  return formattedDate;
}

export function convertToReadableString(input: any) {
  // Step 1: Insert spaces before each uppercase letter
  let result = input?.replace(/([A-Z])/g, " $1");

  // Step 2: Capitalize the first letter
  result = result?.charAt(0).toUpperCase() + result?.slice(1);

  // Step 3: Ensure the rest of the string remains in lowercase (except for the uppercase letters after spaces)
  return result;
}
