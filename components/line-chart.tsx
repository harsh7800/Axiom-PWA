/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";
import { BsEyeSlash } from "react-icons/bs";
import {
  BarOptionType,
  creepSeriesType,
  LineOptionType,
  modulusSeriesType,
} from "@/types/inputformtype";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LineChart = ({
  data,
  barDataType,
  xAxisCaption,
  yAxisCaption,
}: {
  data: creepSeriesType[] | modulusSeriesType[];
  peakPoint: number[];
  barDataType: "Modulus" | "Creep";
  xAxisCaption: string;
  yAxisCaption: string;
}) => {
  const [lineSeriesVisible, setLineSeriesVisible] = useState<boolean[]>([]);
  const [barSeriesVisible, setBarSeriesVisible] = useState<boolean[]>([]);
  const [barSeries, setBarSeries] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setLineSeriesVisible(data.map((item) => item.visible));
      setBarSeriesVisible(data.map((item) => item.visible)); // Initialize bar series visibility
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const newBarSeries = data
        .filter(
          (item) =>
            !item.name.startsWith("Stress") && !item.name.startsWith("EQSR")
        )
        .map((resin: any) => ({
          ...resin,
          data: [
            barDataType === "Modulus" ? resin?.Modulus : resin?.LongTermModulus,
          ],
        }));
      setBarSeries(newBarSeries);
    }
  }, [data, barDataType]);

  const toggleSeriesVisibility = (index: number) => {
    setLineSeriesVisible((prevVisibleSeries) => {
      const updatedVisibleSeries = [...prevVisibleSeries];
      updatedVisibleSeries[index] = !updatedVisibleSeries[index];

      // Toggle the visibility of the corresponding bar series
      const barIndex = data.findIndex((item) => item.name === data[index].name);
      if (barIndex !== -1) {
        const updatedBarSeriesVisible = [...barSeriesVisible];
        updatedBarSeriesVisible[barIndex] = updatedVisibleSeries[index];
        setBarSeriesVisible(updatedBarSeriesVisible);
      }

      // Toggle the visibility of the corresponding stress series
      const stressIndex = data.findIndex(
        (item) => item.name === `Stress-${data[index].name}`
      );
      if (stressIndex !== -1) {
        updatedVisibleSeries[stressIndex] = updatedVisibleSeries[index];
      }

      return updatedVisibleSeries;
    });
  };

  // Filter data based on visibility for line chart
  const filteredLineData = data.filter(
    (item, index) => lineSeriesVisible[index]
  );

  // Filter data for bar chart based on visibility
  const filteredBarSeriesData = barSeries
    .filter((item, index) => barSeriesVisible[index])
    .filter((item) => item.data[0] !== 0);

  const transformedBarData = [
    {
      name: "Series 1",
      data: filteredBarSeriesData.map((item) => ({
        x: item.name,
        y: item.data[0],
      })),
    },
  ];

  const lineOption: LineOptionType = {
    colors: filteredLineData.map((item) => item.colour),
    chart: {
      id: "1",
      height: 400,
      type: "area",
      borderStyle: "solid",
      borderWidth: 1,
    },
    dataLabels: {
      enabled: false,
      fontWeight: 600,
    },
    stroke: {
      curve: "straight",
      width: 1,
    },
    xaxis: {
      tickAmount: 8,
      type: "category",
      categories: [],
      labels: {
        formatter: function (value: string) {
          const numericValue = parseFloat(value);
          if (!isNaN(numericValue)) {
            if (numericValue.toString().length <= 3) {
              return numericValue.toFixed(0);
            } else {
              return numericValue.toFixed(1);
            }
          }
          return value;
        },
        show: true,
        style: {
          colors: ["#97A1AF"],
          fontSize: "12px",
          fontFamily: "",
          fontWeight: 600,
        },
      },
      title: {
        text: xAxisCaption,
        style: {
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      type: "category",
      categories: [],
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
      labels: {
        formatter: function (value: string) {
          const numericValue = parseFloat(value);
          if (!isNaN(numericValue)) {
            return numericValue.toFixed(0);
          }
          return value;
        },
        show: true,
        style: {
          colors: ["#000"],
          fontSize: "12px",
          fontFamily: "",
          fontWeight: 600,
        },
      },
      title: {
        text: yAxisCaption,
        rotate: -90,
        offsetX: -5,
        offsetY: 0,
        style: {
          fontSize: "16px",
          // fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 600,
          // cssClass: "apexcharts-yaxis-title",
        },
      },
    },
    tooltip: {
      enabled: true,
      shared: true,
    },
    legend: {
      show: false,
    },
  };

  const BarOption: BarOptionType = {
    colors: filteredBarSeriesData.map((item) => item.colour),
    plotOptions: {
      bar: {
        distributed: true,
        rangeBarOverlap: true,
        columnWidth: 40,
      },
    },
    chart: {
      id: "2",
      height: 200,
      type: "bar",
    },
    dataLabels: {
      enabled: false,
      style: {
        fontWeight: 600,
      },
    },
    stroke: {
      curve: "smooth",
      colors: ["transparent"],
      width: 5,
    },
    xaxis: {
      type: "category",
      categories: filteredBarSeriesData.map((item) => item.name),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: true,
      },
      labels: {
        show: true,
        style: {
          colors: ["#000"],
          fontSize: "12px",
          fontFamily: "",
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      type: "category",
      categories: [],
      labels: {
        formatter: function (value: string) {
          const numericValue = parseFloat(value);
          if (!isNaN(numericValue)) {
            return numericValue.toFixed(0);
          }
          return value;
        },
        show: true,
        style: {
          colors: ["#000"],
          fontSize: "12px",
          fontFamily: "",
          fontWeight: 600,
        },
      },
      title: {
        text: yAxisCaption,
        rotate: -90,
        offsetX: -5,
        offsetY: 0,
        style: {
          fontSize: "16px",
          // fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 600,
          // cssClass: "apexcharts-yaxis-title",
        },
      },
    },
    tooltip: {
      enabled: true,
    },
    grid: {
      show: true,
    },
    legend: {
      show: false,
    },
  };

  return (
    <div className="w-full max-w-[800px] p-2 md:p-5 space-y-10">
      <div className="custom-legend mt-5 flex gap-4 justify-start items-center flex-wrap">
        {data
          .filter(
            (item) =>
              !item.name.startsWith("Stress") && !item.name.startsWith("EQSR")
          )
          .map((item, i) => (
            <div
              onClick={() => toggleSeriesVisibility(i)}
              className={cn(
                "flex items-center gap-2 select-none whitespace-nowrap cursor-pointer hover:text-blue",
                !lineSeriesVisible[i] && "line-through"
              )}
              key={item.name}
            >
              <div
                className="w-4 h-4 border"
                style={{ background: item.colour }}
              ></div>
              <p className="font-normal semi-bold-14 text-text-2">
                {item.name}
              </p>
              {lineSeriesVisible[i] ? (
                <Eye size={15} />
              ) : (
                <BsEyeSlash size={15} />
              )}
            </div>
          ))}
      </div>

      <div className="w-[95%] h-[400px] sm:w-full mx-4">
        <Chart
          type="line"
          options={lineOption}
          series={filteredLineData}
          height={400}
          width="100%"
        />
      </div>

      <div className="w-[95%] h-[200px] sm:w-full mx-4">
        <Chart
          type="bar"
          options={BarOption}
          series={transformedBarData}
          height={200}
          width="100%"
        />
      </div>
    </div>
  );
};

export default LineChart;
