import dynamic from "next/dynamic";
import React from "react";
import { generateScatterPlot } from "@/lib/utils";

import chart_error_img from "@/public/chartError.jpg";
import Image from "next/image";
import { useGraphPlotData } from "@/store/zustand-store";
import { ScatterPlotType } from "@/types/inputformtype";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ScatterPlotData {
  name: string;
  data: [number, number][];
}

interface SeriesData {
  T: {
    T1: number;
    T2: number;
    T3: number;
    T4: number;
  };
  PlotData: ScatterPlotData[];
}

const ScatterGraph = () => {
  const { graphData } = useGraphPlotData((state) => state);
  const seriesData: SeriesData = generateScatterPlot(graphData);

  const options: ScatterPlotType = {
    series: seriesData?.PlotData,
    grid: {
      show: false,
    },
    annotations: {
      yaxis: [
        {
          y: seriesData?.T?.T1,
          borderColor: "#004899",
          label: {
            borderColor: "#004899",
            borderWidth: 2,
            style: {
              color: "#000",
              background: "#fff",
              borderWidth: 0,
            },
          },
        },
        {
          y: seriesData?.T?.T2,
          borderColor: "#004899",
          label: {
            borderColor: "#004899",
            borderWidth: 2,
            style: {
              color: "#000",
              background: "#fff",
              borderWidth: 0,
            },
          },
        },
        {
          y: seriesData?.T?.T3,
          borderColor: "#004899",
          label: {
            borderColor: "#004899",
            borderWidth: 2,
            style: {
              color: "#000",
              background: "#fff",
              borderWidth: 0,
            },
          },
        },
        {
          y: seriesData?.T?.T4,
          borderColor: "#004899",
          label: {
            borderColor: "#004899",
            borderWidth: 2,
            style: {
              color: "#000",
              background: "#fff",
              borderWidth: 0,
            },
          },
        },
      ],
    },
    xaxis: {
      tickAmount: 4,
      labels: {
        formatter: (val: number) => val.toFixed(0),
        show: true,
      },
    },
    chart: {
      id: "1",
      height: 350,
      type: "scatter",
    },
    colors: ["#14c732", "#c414c7"],
    yaxis: {
      labels: {
        formatter: (val: number) => val.toFixed(0),
      },
      tickAmount: 4,
    },
  };

  if (!seriesData?.PlotData) return;

  return (
    <div className="w-full md:w-2/5 lg:w-fit border border-states-disabled rounded-2xl relative">
      <h1 className="semi-bold-16 border-b px-5 py-3 bg-states-disabled text-left rounded-t-2xl">
        Bottle and Preform Plot
      </h1>
      <div className="w-full max-w-[250px] py-5 m-3">
        {seriesData?.PlotData ? (
          <Chart
            type="line"
            options={options}
            series={seriesData?.PlotData}
            height={500}
          />
        ) : (
          <Image
            width={400}
            height={400}
            className="object-contain mx-auto"
            src={chart_error_img}
            alt="Data for Chart Not Found"
          />
        )}
      </div>

      <div className="bg-white hover:min-[650px]:bg-red-500 hover:bg-black"></div>
    </div>
  );
};

export default ScatterGraph;
