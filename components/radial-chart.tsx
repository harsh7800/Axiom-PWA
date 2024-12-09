/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { cn, convertToReadableString } from "@/lib/utils";
import { Eye } from "lucide-react";
import { BsEyeSlash } from "react-icons/bs";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import LabelTooltip from "./label-tooltip";

interface SeriesItem {
  name: string;
  data: number[];
  originalData: number[];
  colour: string | undefined;
}

interface RadialChartProps {
  data: any;
  resize?: boolean;
  ref?: React.RefObject<HTMLDivElement>;
  useScaledValues?: boolean;
}

export function RadialChart({
  data,
  resize,
  ref,
  useScaledValues,
}: RadialChartProps) {
  const [series, setSeries] = useState<SeriesItem[]>([]);
  const [hoverMaterial] = useState<number>(-1);
  const [visibleSeries, setVisibleSeries] = useState<boolean[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // // console.log(data);
  useEffect(() => {
    if (data && data.length > 0) {
      // if (useScaledValues) {
      //   newCategories = Object?.keys(data[0] || {}).filter(
      //     (key) =>
      //       key !== "Resin" && key !== "Colour" && key?.includes("_Scaled")
      //   );
      // } else {
      const newCategories = Object?.keys(data[0] || {}).filter(
        (key) => key !== "Resin" && key !== "Colour"
      );
      // }
      const newData = data.map((model: any) => {
        const originalData = newCategories
          ?.filter((item) => !item.includes("_Scaled"))
          .map((category) => model[category] as number);

        // // console.log(originalData);

        const normalizedData = newCategories
          ?.filter((item) => item.includes("_Scaled"))
          .map((category) => {
            const categoryData = model[category];
            // // console.log(categoryData);
            // const values = data.map((item: any) => item[category]);
            // const normalizedData = normalizeData(
            //   values.filter((val: any) => typeof val === "number" && !isNaN(val))
            // );
            // const index = data.findIndex(
            //   (item: any) => item[category] === categoryData
            // );
            return categoryData || 0;
          });
        return {
          name: model.Resin,
          data: normalizedData,
          originalData: originalData,
          colour: model.Colour || "#000",
        };
      });

      setCategories(newCategories);
      // // console.log(newData);
      setSeries(newData);
      setVisibleSeries(newData.map(() => true));
    }
  }, [data]);

  // const normalizeData = (values: (number | string)[]): number[] => {
  //   const numericValues = values?.filter(
  //     (val): val is number => typeof val === "number" && !isNaN(val)
  //   );

  //   if (numericValues?.length === 0) {
  //     return Array(values.length).fill(0);
  //   }

  //   const min = Math.min(...numericValues);
  //   const max = Math.max(...numericValues);

  //   if (isNaN(min) || isNaN(max)) {
  //     return Array(values.length).fill(0);
  //   }

  //   return values.map((value) => {
  //     if (typeof value !== "number" || isNaN(value)) {
  //       return 0;
  //     }

  //     let data;
  //     if (value === 0) {
  //       data = 0;
  //     } else {
  //       data = 0.1 + (value - min) / (max - (min + 0.01));
  //     }
  //     return data;
  //   });
  // };

  const toggleSeriesVisibility = (index: number) => {
    setVisibleSeries((prevVisibleSeries) => {
      const updatedVisibleSeries = [...prevVisibleSeries];
      updatedVisibleSeries[index] = !updatedVisibleSeries[index];
      return updatedVisibleSeries;
    });
  };

  const filteredSeries = series.filter((_, i) => visibleSeries[i]);

  const formattedData =
    categories?.length > 0
      ? categories
          ?.filter((item) => !item.includes("_Scaled"))
          .map((category, index) => {
            const categoryData: { [key: string]: number | string } = {
              subject:
                category.trim() === "Height of Processing Window - Label"
                  ? "HPW-Label"
                  : category.trim() === "Height of Processing Window - Base"
                  ? "HPW-Base"
                  : category.trim() === "Height of Processing Window - Grip"
                  ? "HPW-Grip"
                  : category.trim() === "Height of Processing Window - Shoulder"
                  ? "HPW-Shoulder"
                  : category.length > 10
                  ? convertToReadableString(category)
                  : category == "Burst"
                  ? "Burst Pressure"
                  : category,
            };

            filteredSeries?.forEach((seriesItem) => {
              categoryData[seriesItem.name] = seriesItem.data[index];
              categoryData[`${seriesItem.name}_original`] =
                seriesItem.originalData[index];
            });
            return categoryData;
          })
      : [];

  const radarData = formattedData;

  // // console.log(radarData);

  // Extract dynamic headers
  const headers = data && data.length > 0 ? Object.keys(data[0]) : [];

  // // // console.log(filteredSeries);

  return (
    <div
      ref={ref}
      className={cn(
        "w-full relative flex flex-col justify-around items-center pb-[70px]",
        resize && "flex justify-center gap-10 scale-[120%] w-[1600px]"
      )}
    >
      {data?.[0]?.Resin == "GPPS" && (
        <div
          className={cn(
            " w-full space-y-0 my-2",
            filteredSeries.length > 0 &&
              filteredSeries &&
              "absolute z-50 left-1/2 top-3 sm:top-[70px] transform -translate-x-1/2"
          )}
        >
          <h3 className="mb-2 text-center semi-bold-16 rounded-t-2xl">
            Performance Metrics
          </h3>
          <div className="custom-legend flex gap-3 justify-center">
            {series.map((item, i) => (
              <div
                onClick={() => {
                  // // // console.log(i);
                  toggleSeriesVisibility(i);
                }}
                className={cn(
                  "flex w-fit items-center h-[50px] gap-1 cursor-pointer hover:text-blue",
                  !visibleSeries[i] && "line-through"
                )}
                key={i + item.name}
              >
                <div
                  className={`size-4 border`}
                  style={{ background: item.colour || "#fff" }}
                ></div>
                <p className="select-none font-normal text-sm text-text-2">
                  {item.name}
                </p>
                {hoverMaterial !== i ? (
                  <Eye size={15} />
                ) : (
                  <BsEyeSlash size={15} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {filteredSeries.length > 0 && filteredSeries && (
        <div className="relative w-fit mt-10">
          <div className="size-0 sm:size-[450px] border border-placeholder border-dashed rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 "></div>
          {categories && categories.length > 0 && (
            <RadarChart
              style={{
                borderRadius: "50%",
              }}
              outerRadius={"55%"}
              width={useScaledValues ? 800 : 700}
              height={700}
              data={radarData}
              margin={{ left: 15 }}
            >
              <PolarGrid />
              <PolarAngleAxis
                dataKey="subject"
                min={0}
                max={1}
                style={{
                  color: "#000000",
                  fontWeight: "600",
                  fontSize: "14px",
                  textTransform: "capitalize",
                }}
              />
              <Tooltip
                contentStyle={{ fontSize: "12px", fontWeight: 500 }}
                formatter={(value, name, props) => {
                  const originalValue = props?.payload[`${name}_original`];
                  return [originalValue?.toFixed(2), name];
                }}
              />
              {filteredSeries.map((seriesItem) => (
                <Radar
                  key={seriesItem.name}
                  name={seriesItem.name}
                  dataKey={seriesItem.name}
                  stroke={seriesItem.colour}
                  fill={seriesItem.colour}
                  fillOpacity={0.3}
                />
              ))}
            </RadarChart>
          )}
        </div>
      )}

      {data?.[0]?.Resin !== "GPPS" && (
        <div
          className={cn(
            "w-full space-y-0 my-2 ",
            filteredSeries &&
              filteredSeries.length > 0 &&
              "absolute left-1/2 top-3 sm:top-[70px] transform -translate-x-1/2"
          )}
        >
          <h3 className=" text-center semi-bold-16 rounded-t-2xl">
            Performance Metrics
          </h3>
          <div className="custom-legend flex flex-wrap gap-x-3 justify-center">
            {series.map((item, i) => (
              <div
                onClick={() => {
                  toggleSeriesVisibility(i);
                }}
                className={cn(
                  "flex w-fit items-center h-[50px] gap-1 cursor-pointer hover:text-blue",
                  !visibleSeries[i] && "line-through"
                )}
                key={i + item.name}
              >
                <div
                  className={`size-4 border`}
                  style={{ background: item.colour || "#fff" }}
                ></div>
                <p className="select-none font-normal text-sm text-text-2">
                  {item.name}
                </p>
                {hoverMaterial !== i ? (
                  <Eye size={15} />
                ) : (
                  <BsEyeSlash size={15} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.[0]?.Resin !== "GPPS" && (
        <div
          className={cn(
            "px-5",
            resize && "130%",
            filteredSeries.length == 0 && "mt-10"
          )}
        >
          <div
            className={cn(
              " mx-auto border border-border-1 w-5/6 rounded-[8px] overflow-scroll -mt-10 bg-white hide-scroll-bar",
              resize && "mt-3",
              filteredSeries &&
                filteredSeries.length > 0 &&
                " absolute left-1/2 bottom-[30px] transform -translate-x-1/2"
            )}
          >
            <Table className="divide-y-[1px] divide-border-1">
              <TableHeader>
                <TableRow className="divide-x-[1px] divide-border-1 whitespace-nowrap text-[10px]">
                  {headers
                    .filter(
                      (item) => item !== "Colour" && !item.includes("_Scaled")
                    )
                    .map((header) => {
                      let content = "";

                      if (header === "Modulus") {
                        content =
                          "Modulus value comes from intersection of modulus curve (below) with maximum EQSR of preform/bottle pair, displayed as vertical line";
                      } else if (header === "IV") {
                        content = "IV values for preforms, measured by PTI";
                      } else if (header === "longTermModulus") {
                        content = "Description for longTermModulus";
                      } else if (
                        header.includes("Height of Processing Window")
                      ) {
                        content =
                          "Height of Processing Window is the difference between the upper and lower temperatures on the process window found for label section (and same for base? - this radar plot now may need 5 points, one for label process window and one for base process window)";
                      }
                      const readableHeader = header.includes(
                        "Height of Processing Window"
                      )
                        ? header.replace("Height of Processing Window", "HPW")
                        : header;

                      return (
                        <TableHead
                          key={header}
                          className="text-center h-8 w-fit"
                        >
                          <LabelTooltip
                            side
                            small
                            label={readableHeader}
                            content={content}
                          />
                        </TableHead>
                      );
                    })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((item: any, index: number) => (
                  <TableRow
                    key={index}
                    className={cn(
                      "divide-x-[1px] divide-border-1 whitespace-nowrap text-[10px]"
                    )}
                    style={{ backgroundColor: item.Colour + "33" }}
                  >
                    {headers.length != 0
                      ? headers
                          .filter(
                            (item) =>
                              item !== "Colour" && !item.includes("_Scaled")
                          )
                          .map((header) => (
                            <TableCell key={header} className="h-6 text-center">
                              {typeof item[header] === "number"
                                ? header.includes("Height of Processing Window")
                                  ? Math.floor(item[header])
                                  : item[header].toFixed(1)
                                : item[header] === 0
                                ? "0.00"
                                : item[header] ?? "N/A"}
                            </TableCell>
                          ))
                      : []}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
