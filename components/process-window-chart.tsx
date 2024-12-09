/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { BsEyeSlash } from "react-icons/bs";
import LabelTooltip from "./label-tooltip";
import {
  pearlescenceSeriesType,
  StraightLineOptionsType,
} from "@/types/inputformtype";
import useProcessWindow from "@/store/processWindow";
import { useGraphPlotData } from "@/store/zustand-store";

const StraightChart = ({
  data,
  resize,
  setListBottleZones,
  listBottleZones = 0,
}: {
  data: pearlescenceSeriesType[];
  resize: boolean;
  listBottleZones: any;
  setListBottleZones: any;
}) => {
  const { setProcessWindow } = useProcessWindow((state) => state);
  const [series, setSeries] = useState<pearlescenceSeriesType[]>([]);
  const [visibleSeries, setVisibleSeries] = useState<boolean[]>([]);
  const [filteredSeries, setFilteredSeries] = useState<any>([]);
  const { graphData } = useGraphPlotData((state) => state);
  const [StraightLineOptions, setStraightLineOptions] = useState<any>();

  useEffect(() => {
    if (data) {
      setSeries(data);

      // Filter out processArea and horizontal items
      const processWindow = data?.filter(
        (item) =>
          !item.name.startsWith("processArea") &&
          !item.name.startsWith("horizontal")
      );
      setProcessWindow(processWindow);

      // Initialize visibility for all series
      const initialVisibility = data.map(() => true);
      setVisibleSeries(initialVisibility);

      // Filter the series based on the initialized visibility
      const initialFilteredSeries = data.filter((_, i) => initialVisibility[i]);
      setFilteredSeries(initialFilteredSeries);
      setStraightLineOptions({
        fill: {
          colors: data
            .filter((_, i) => initialVisibility[i])
            .map((item: any) =>
              item?.name?.startsWith("processArea") ||
              item?.name?.startsWith("horizontal")
                ? item.colour
                : "#afb3b0"
            ),
          opacity: 0.3,
          // type: ["gradient", "solid"],
          // gradient: {
          //   shade: "light",
          //   shadeIntensity: 0.5,
          //   stops: [50, 100],
          // },
        },
        annotations: {
          xaxis: data
            .filter(
              (item, i) =>
                !item.name.includes("horizontalLine") &&
                !item.name.includes("processArea") &&
                !item.name.includes("horizontalLine-Static") &&
                visibleSeries[i]
            )
            .flatMap((annot) => [
              {
                x: annot.listLowerBound[listBottleZones], // Use LowerBound value for x-axis position
                borderColor: annot.colour,
                label: {
                  borderColor: annot.colour,
                  borderWidth: 4,
                  style: {
                    strokeDashArray: 0,
                    color: annot.colour,
                    background: annot.colour,
                    borderWidth: 6,
                    fontWeight: 600,
                  },
                  // text: `LowerBound: ${annot.listLowerBound[listBottleZones]}`, // Label for LowerBound
                },
              },
              {
                x: annot.listUpperBound[listBottleZones], // Use UpperBound value for x-axis position
                borderColor: annot.colour,
                label: {
                  borderColor: annot.colour,
                  borderWidth: 4,
                  style: {
                    strokeDashArray: 0,
                    color: annot.colour,
                    background: annot.colour,
                    borderWidth: 6,
                    fontWeight: 600,
                  },
                  // text: `UpperBound: ${annot.listUpperBound[listBottleZones]}`, // Label for UpperBound
                },
              },
            ]),
        },
        chart: {
          id: "1",
          height: 430,
          type: "line",
          animations: {
            enabled: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
          width: filteredSeries?.map((item: any) =>
            item?.name?.startsWith("horizontal") ? 2 : 0
          ), // Adjust width as needed
          colors: filteredSeries.map((item: any) =>
            item?.name?.startsWith("horizontal") ? item.colour : undefined
          ),
        },
        xaxis: {
          tickAmount: 3,
          tickPlacement: "on",
          type: "numeric",
          decimalsInFloat: 1,
          // min: 2,
          labels: {
            // formatter: (value: number) => value?.toFixed(2),
          },
        },
        yaxis: {
          max: 120.2,
          min: 95,
          labels: {
            formatter: (val: number) => val?.toFixed(0),
          },
        },
        grid: {
          show: false,
          // padding: {
          //   left: 0,
          //   right: 0,
          // },
        },
        legend: {
          show: false,
        },

        tooltip: {
          enabled: true,
          intersect: false,
          hideEmptySeries: false,
          shared: true,
          followCursor: true, // Ensures tooltip follows cursor
          y: {
            formatter: (value: any) => `${value?.toFixed(2)}`,
          },
        },
      });
    }
  }, [data, graphData]);

  const toggleSeriesVisibility = (index: number) => {
    setVisibleSeries((prevVisibleSeries) => {
      const updatedVisibleSeries = [...prevVisibleSeries];

      // Toggle the visibility for the selected series
      updatedVisibleSeries[index] = !updatedVisibleSeries[index];

      // Find the corresponding processArea based on the resin's color
      const processAreaIndex = series.findIndex(
        (item) =>
          item.name.startsWith("processArea") &&
          item.colour === series[index].colour
      );

      if (processAreaIndex !== -1) {
        // Toggle the visibility of the corresponding processArea
        updatedVisibleSeries[processAreaIndex] =
          !updatedVisibleSeries[processAreaIndex];
      }

      // Find the corresponding horizontal line based on the resin's color
      const horizontalLineIndex = series.findIndex(
        (item) =>
          item.name.startsWith("horizontalLine") &&
          item.colour === series[index].colour
      );

      if (horizontalLineIndex !== -1) {
        // Toggle the visibility of the corresponding horizontal line
        updatedVisibleSeries[horizontalLineIndex] =
          !updatedVisibleSeries[horizontalLineIndex];
      }
      const initialFilteredSeries = data?.filter(
        (_, i) => updatedVisibleSeries[i]
      );
      setFilteredSeries(initialFilteredSeries);
      return updatedVisibleSeries;
    });
  };

  const annotations2 = series
    .filter(
      (item, i) =>
        !item.name.includes("horizontalLine") &&
        !item.name.includes("processArea") &&
        !item.name.includes("horizontalLine-Static") &&
        visibleSeries[i]
    )
    .flatMap((annot) => [
      {
        x: annot.listLowerBound[listBottleZones], // Use LowerBound value for x-axis position
        borderColor: annot.colour,
        label: {
          borderColor: annot.colour,
          borderWidth: 4,
          style: {
            strokeDashArray: 0,
            color: annot.colour,
            background: annot.colour,
            borderWidth: 6,
            fontWeight: 600,
          },
          // text: `LowerBound: ${annot.listLowerBound[listBottleZones]}`, // Label for LowerBound
        },
      },
      {
        x: annot.listUpperBound[listBottleZones], // Use UpperBound value for x-axis position
        borderColor: annot.colour,
        label: {
          borderColor: annot.colour,
          borderWidth: 4,
          style: {
            strokeDashArray: 0,
            color: annot.colour,
            background: annot.colour,
            borderWidth: 6,
            fontWeight: 600,
          },
          // text: `UpperBound: ${annot.listUpperBound[listBottleZones]}`, // Label for UpperBound
        },
      },
    ]);

  const StraightLineOption: StraightLineOptionsType = {
    fill: {
      colors: filteredSeries.map((item: any) =>
        item?.name?.startsWith("processArea") ||
        item?.name?.startsWith("horizontal")
          ? item.colour
          : "#afb3b0"
      ),
      opacity: 0.3,
      // type: ["gradient", "solid"],
      // gradient: {
      //   shade: "light",
      //   shadeIntensity: 0.5,
      //   stops: [50, 100],
      // },
    },
    annotations: {
      xaxis: annotations2,
    },
    chart: {
      id: "2",
      height: 430,
      type: "line",
      animations: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
      width: filteredSeries?.map((item: any) =>
        item?.name?.startsWith("horizontal") ? 2 : 0
      ), // Adjust width as needed
      colors: filteredSeries.map((item: any) =>
        item?.name?.startsWith("horizontal") ? item.colour : undefined
      ),
    },
    xaxis: {
      tickAmount: 5,
      tickPlacement: "on",
      type: "numeric",
      decimalsInFloat: 1,
      // min: 0,
      labels: {
        // formatter: (value: number) => value?.toFixed(2),
      },
    },
    yaxis: {
      max: 120.2,
      min: 95,
      labels: {
        formatter: (val: number) => val?.toFixed(0),
      },
    },
    grid: {
      show: false,
      // padding: {
      //   left: 0,
      //   right: 0,
      // },
    },
    legend: {
      show: false,
    },

    tooltip: {
      enabled: true,
      intersect: false,
      hideEmptySeries: false,
      shared: true,
      followCursor: true, // Ensures tooltip follows cursor
      y: {
        formatter: (value: any) => `${value?.toFixed(2)}`,
      },
    },
  };

  return (
    <div className={cn("w-full relative px-5 pb-5", resize && "w-[85%]")}>
      <div
        className={cn("flex w-full justify-between", !resize && "flex-wrap")}
      >
        <div className="flex gap-2 items-center">
          {!resize ? (
            series[0]?.listBottleZones.length > 0 && (
              <Select
                onValueChange={(e) => setListBottleZones(Number(e))}
                defaultValue={"0"}
              >
                <SelectTrigger
                  className={cn(
                    "w-[150px] h-[45px] rounded-[8px] border-border-1 regular-14 text-black select-none m-5 overflow-visible",
                    resize && "pb-3 h-auto"
                  )}
                >
                  <SelectValue placeholder="Select a value" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-[8px] text-placeholder">
                  {series[0]?.listBottleZones?.map((item, i) => {
                    return (
                      <SelectItem
                        // defaultValue={item}
                        className="capitalize"
                        value={i.toString()}
                        key={item + i}
                      >
                        {item}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )
          ) : (
            <div className="border rounded-[8px] my-3 text-md w-[150px] relative p-3">
              <p>
                {listBottleZones == 0
                  ? "shoulder"
                  : listBottleZones === 1
                  ? "label"
                  : listBottleZones == 2
                  ? "Grip"
                  : "Base"}
              </p>
              {/* <FaCaretDown className="absolute right-2 top-4 text-slate-600" /> */}
              <p className=" absolute right-2 text-sm top-4 text-slate-600">
                ▼
              </p>
            </div>
          )}
        </div>
        <div className="mt-5 flex gap-4 justify-end flex-wrap mb-5">
          {series
            ?.filter(
              (item) =>
                !item.name.startsWith("processArea") && // Use && instead of ||
                !item.name.startsWith("horizontalLine")
            )
            ?.map((item, filteredIndex) => {
              // Find the original index in the unfiltered array
              const originalIndex = series.findIndex(
                (s) => s.name === item.name
              );

              return (
                <div
                  onClick={() => toggleSeriesVisibility(originalIndex)}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer whitespace-nowrap hover:text-blue",
                    !visibleSeries[originalIndex] && "line-through"
                  )}
                  key={filteredIndex + item.name}
                >
                  <div
                    className={`size-4 border`}
                    style={{ background: item.colour }}
                  ></div>
                  <p className="font-normal text-md text-text-2">{item.name}</p>
                  {visibleSeries[originalIndex] ? (
                    <Eye size={15} />
                  ) : (
                    <BsEyeSlash size={15} />
                  )}
                </div>
              );
            })}
        </div>
      </div>

      <h1 className="semi-bold-14 text-black absolute top-1/2 -left-10 -rotate-90">
        Temperature (°C)
      </h1>

      {filteredSeries.length > 0 && (
        <div className="w-[95%] sm:w-3/4 min-[1600px]:w-5/6">
          <ApexChart
            options={StraightLineOptions as any}
            series={filteredSeries}
            width="100%"
            height={StraightLineOption.chart.height}
          />
        </div>
      )}
      <h1 className="semi-bold-14 text-black absolute -bottom-2 right-1/3 md:right-1/2 ">
        EQSR
      </h1>

      <div
        className={cn(
          "hidden md:block border border-border-1 rounded-[8px] bottom-20 z-10 right-6 md:right-6 max-h-[150px] overflow-y-scroll mt-10 bg-white hide-scroll-bar w-fit",
          !resize && "absolute w-fit"
        )}
      >
        <Table className="divide-y-[1px] divide-border-1">
          <TableHeader>
            <TableRow className="divide-x-[1px] divide-border-1 whitespace-nowrap text-[10px]">
              <TableHead className="text-center h-8 w-fit">
                <LabelTooltip small label="Resin" content="This is Resin" />
              </TableHead>
              <TableHead className="text-center h-8 w-fit">
                <LabelTooltip
                  small
                  label="Lower Value"
                  content="This is Lower Value"
                />
              </TableHead>
              <TableHead className="text-center h-8 w-fit">
                <LabelTooltip
                  small
                  label="Upper Value"
                  content="This is Upper Value"
                />
              </TableHead>
              <TableHead className="text-center h-8 w-fit">
                <LabelTooltip
                  small
                  label="Height Of Processing Window (°C)"
                  content="This is Height Of Processing Window (°C)"
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {series
              ?.filter(
                (item) =>
                  !item.name.startsWith("processArea") &&
                  !item.name.startsWith("horizontal")
              )
              ?.map((series, index) => {
                return (
                  <TableRow
                    key={index}
                    className={cn(
                      "divide-x-[1px] divide-border-1 whitespace-nowrap text-[10px]"
                    )}
                    style={{ backgroundColor: series.colour + "33" }}
                  >
                    <TableCell className="text-center p-2 w-fit ">
                      {series.name}{" "}
                    </TableCell>
                    <TableCell className="text-center p-2 w-fit">
                      {Number(series.listLower[listBottleZones]).toFixed(0)}
                      &nbsp;°C
                    </TableCell>
                    <TableCell className="text-center p-2 w-fit">
                      {Number(series.listUpper[listBottleZones]).toFixed(0)}
                      &nbsp;°C
                    </TableCell>
                    <TableCell className="text-center p-2 w-fit">
                      {Number(series.listBlowTemp[listBottleZones]).toFixed(0)}
                      &nbsp;°C
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StraightChart;
