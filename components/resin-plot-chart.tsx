/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn, generateResinPlot } from "@/lib/utils";

import dynamic from "next/dynamic";
import Image from "next/image";
import React from "react";
import chart_error_img from "@/public/chartError.jpg";
import { useGraphPlotData, useInputFormData } from "@/store/zustand-store";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ResinLinePlot = () => {
  const { graphData } = useGraphPlotData((state) => state);
  const { inputData } = useInputFormData((state) => state);
  const { t1, t2, t3, t4 } = inputData.bottleMeasurement.thickness;

  // Function to generate series data
  const seriesData = generateResinPlot(graphData);

  return (
    <div className="w-full lg:w-fit border border-states-disabled rounded-2xl pb-5">
      <h1 className="semi-bold-16 border-b px-5 py-3 bg-states-disabled text-left rounded-t-2xl">
        {seriesData.length > 0
          ? "Wall Thickness Plot "
          : "Bottle,Preform & Wall Thickness Plot "}
      </h1>
      <div
        className={cn(
          "w-full py-5 gap-2 m-3 relative",
          seriesData.length > 0 && "flex gap-2"
        )}
      >
        {seriesData.length > 0 ? (
          seriesData?.map((item: any, index) => {
            // Extract T1, T2, T3, T4 values for each chart
            const { T1, T2, T3, T4 } = item;
            // // console.log([item]);

            // Options for the scatter plo  t specific to each chart
            const options: any = {
              grid: {
                show: false,
              },
              xaxis: {
                position: "bottom", // Position at the bottom
                reversed: true,
                tickAmount: 4,
                min: 0,
                max: 3.3,
                labels: {
                  formatter: (val: any) => val.toFixed(0),
                  show: true,
                },
                title: {
                  style: {
                    fontSize: "12px",
                    fontWeight: 700,
                  },
                  text: item.name,
                },
              },
              chart: {
                height: 350,
                type: "line",
              },
              yaxis: {
                labels: {
                  formatter: (val: any) => val.toFixed(0),
                },
                tickAmount: 4,
                title: { text: "Bottle Y" },
              },
              annotations: {
                points: [
                  {
                    x: t1,
                    y: parseFloat(T1),
                    marker: {
                      size: 5,
                      fillColor: "#fff",
                      strokeColor: item.color,
                      radius: 2,
                    },
                    label: {
                      borderColor: item.color,
                      // text: `T1 (${t1})`,
                    },
                  },
                  {
                    x: t2,
                    y: parseFloat(T2),
                    marker: {
                      size: 5,
                      fillColor: "#fff",
                      strokeColor: item.color,
                      radius: 2,
                    },
                    label: {
                      borderColor: item.color,
                      // text: `T2 (${t2})`,
                    },
                  },
                  {
                    x: t3,
                    y: parseFloat(T3),
                    marker: {
                      size: 5,
                      fillColor: "#fff",
                      strokeColor: item.color,
                      radius: 2,
                    },
                    label: {
                      borderColor: item.color,
                      // text: `T3 (${t3})`,
                    },
                  },
                  {
                    x: t4,
                    y: parseFloat(T4),
                    marker: {
                      size: 4,
                      fillColor: "#fff",
                      strokeColor: item.color,
                      radius: 2,
                    },
                    label: {
                      borderColor: item.color,
                      // text: `T4 (${t4})`,
                    },
                  },
                ],
              },
              tooltip: {
                enabled: true,
                enabledOnSeries: true,
                shared: false,
                followCursor: true,
                labels: {
                  formatter: (val: any) => val.toFixed(1),
                },
                x: {
                  show: true,
                  format: "dd MMM",
                  formatter: (val: any) => val.toFixed(1),
                },
                y: {
                  formatter: (val: any) => val.toFixed(1),
                  title: {
                    formatter: (seriesName: string) => seriesName,
                  },
                },
                z: {
                  formatter: (val: any) => val.toFixed(1),
                  title: "Size: ",
                },
              },
            };

            return (
              <div key={index}>
                <div className="w-full max-w-[200px] pt-1 ">
                  <Chart series={[item]} options={options} height={480} />
                </div>
              </div>
            );
          })
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
    </div>
  );
};

export default ResinLinePlot;
