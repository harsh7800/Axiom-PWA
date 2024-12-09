/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import ReferenceImg from "./reference-img";
import { AlertInfo } from "./alert-info";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import html2canvas from "html2canvas";
// import { toast } from "sonner";
import { Form } from "./ui/form";
import {
  useGeneratingReport,
  useGraphPlotData,
  useInputFormData,
} from "@/store/zustand-store";
import useImageStore from "@/store/pdf-image";
import usePerformanceData from "@/store/performanceModel";
import { useGraphPlotDataFetcher } from "@/helpers/getGraphPlotData";
import { bottleMeasurementSchema } from "@/app/schema/inputForm.schema";
import { toast } from "sonner";
import { RadialChart } from "./radial-chart";
import BottleMeasurement from "./bottle-measurements";
import ScatterGraph from "./scatter-graph";
import ResinLinePlot from "./resin-plot-chart";
// import { Button } from "./ui/button";

interface bottleMeasurementType {
  bottleMeasurement: {
    sectionWeights: {
      shoulder: string;
      label: string;
      grip: string;
      base: string;
    };
    thickness: {
      t1: string;
      t2: string;
      t3: string;
      t4: string;
    };
  };
}

const PerformanceModel = ({
  resize,
}: {
  resize: boolean;
  ref?: any;
  recompute?: boolean;
}) => {
  const [PerformanceModelData, setPerformanceModelData] = useState<any>([]);
  const { inputData, updateBottleMeasurements } = useInputFormData(
    (state) => state
  );
  const { updateGraphData, graphData } = useGraphPlotData((state) => state);
  const performanceMetricsRef = useRef<HTMLDivElement>(null);
  const radialRef = useRef<HTMLDivElement>(null);
  const [isPending, StartTransition] = useTransition();
  const getGraphPlotData = useGraphPlotDataFetcher();
  const { setImage, radialGraph, performanceMetrics } = useImageStore(
    (state) => state
  );
  const { setPerformanceData } = usePerformanceData((state) => state);
  const [result, setResult] = useState<any>([]);
  const { updateIsGenerating } = useGeneratingReport((state) => state);

  // // console.log(graphData.performanceModel);

  const DefineColor = (value: number) => {
    if (value > 1.6) {
      return "bg-states-success";
    } else if (value > 1.4 && value <= 1.6) {
      return "bg-states-warning";
    } else if (value > 1.2 && value <= 1.4) {
      return "bg-yellow-500";
    } else if (value < 1.2) {
      return "bg-states-error";
    } else {
      return "bg-gray-400";
    }
  };

  const generatePerformanceGraph = (data: any) => {
    const gppsValues = data.find(
      (item: {
        Resin: string;
        FTL: number;
        ETL: number;
        Burst: number;
        BurstVolume: number;
        ThermalStability: number;
      }) => item.Resin === "GPPS"
    );

    const gppsETL = gppsValues?.ETL;
    const gppsFTL = gppsValues?.FTL;
    const gppsBurst = gppsValues?.Burst;
    const gppsBurstVolume = gppsValues?.BurstVolume;

    const getColorCategories = () => {
      return data.map(
        (item: {
          Resin: string;
          FTL: number;
          ETL: number;
          Burst: number;
          BurstVolume: number;
          ThermalStability: number;
        }) => {
          if (item.Resin !== "GPPS") {
            const ETLRatio = item?.ETL / gppsETL;
            const FTLRatio = item?.FTL / gppsFTL; // Avoid division by zero
            const BurstRatio = item?.Burst / gppsBurst;
            const BurstVolumeRatio = item?.BurstVolume / gppsBurstVolume;
            const ThermalStabilityRatio =
              gppsValues?.ThermalStability / item.ThermalStability;

            const ETLColor = DefineColor(ETLRatio);
            const thermalStabilityColor = DefineColor(ThermalStabilityRatio);
            const FTLColor = DefineColor(FTLRatio); // Assign default color if FTL is zero
            const BurstColor = DefineColor(BurstRatio);
            const BurstVolumeColor = DefineColor(BurstVolumeRatio);
            return {
              ...item,
              ETLRatio: ETLRatio,
              ETLColorCategory: ETLColor,
              FTLRatio: FTLRatio,
              FTLColorCategory: FTLColor,
              thermalStabilityRatio: ThermalStabilityRatio,
              thermalStabilityColor: thermalStabilityColor,
              BurstRatio: BurstRatio,
              BurstColorCategory: BurstColor,
              BurstVolumeRatio: BurstVolumeRatio,
              BurstVolumeColor: BurstVolumeColor,
            };
          } else {
            const defaultColor = "bg-gray-400 text-white"; // Assign a specific default color for GPPS
            return {
              ...item,
              ETLRatio: 1,
              ETLColorCategory: defaultColor,
              FTLRatio: 1,
              FTLColorCategory: defaultColor,
              thermalStabilityRatio: 1,
              thermalStabilityColor: defaultColor,
              BurstRatio: 1,
              BurstColorCategory: defaultColor,
              BurstVolumeRatio: 1,
              BurstVolumeColor: defaultColor,
            };
          }
        }
      );
    };

    const categoriesColors = getColorCategories();
    // console.log(categoriesColors);

    if (categoriesColors) {
      setResult(categoriesColors);
      setPerformanceData(categoriesColors);
    }
  };

  const inputForm = useForm<bottleMeasurementType>({
    resolver: zodResolver(bottleMeasurementSchema),
    mode: "onChange",
    // disabled: isPending,
    defaultValues: {
      bottleMeasurement: {
        sectionWeights: { shoulder: "", label: "", grip: "", base: "" },
        thickness: { t1: "", t2: "", t3: "", t4: "" },
      },
    },
    shouldUnregister: true,
  });

  const { control, getValues, handleSubmit, reset } = inputForm;

  useEffect(() => {
    if (inputData) {
      reset({
        bottleMeasurement: {
          sectionWeights: {
            shoulder:
              inputData?.bottleMeasurement?.sectionWeights?.shoulder ?? "",
            label: inputData?.bottleMeasurement?.sectionWeights?.label ?? "",
            grip: inputData?.bottleMeasurement?.sectionWeights?.grip ?? "",
            base: inputData?.bottleMeasurement?.sectionWeights?.base ?? "",
          },
          thickness: {
            t1: inputData?.bottleMeasurement?.thickness?.t1 ?? "",
            t2: inputData?.bottleMeasurement?.thickness?.t2 ?? "",
            t3: inputData?.bottleMeasurement?.thickness?.t3 ?? "",
            t4: inputData?.bottleMeasurement?.thickness?.t4 ?? "",
          },
        },
      });
    }
  }, [inputData, reset]);

  const onSubmit = async () => {
    StartTransition(async () => {
      const sectionWeight = [
        Number(getValues("bottleMeasurement.sectionWeights.shoulder")),
        Number(getValues("bottleMeasurement.sectionWeights.label")),
        Number(getValues("bottleMeasurement.sectionWeights.grip")),
        Number(getValues("bottleMeasurement.sectionWeights.base")),
      ];

      const thicknessData = [
        Number(getValues("bottleMeasurement.thickness.t1")),
        Number(getValues("bottleMeasurement.thickness.t2")),
        Number(getValues("bottleMeasurement.thickness.t3")),
        Number(getValues("bottleMeasurement.thickness.t4")),
      ];

      const data = {
        analysisType: {
          resinComparision: inputData.analysisType.resinComparison,
          performanceModel: inputData.analysisType.performanceModel,
          colorModel: inputData.analysisType.colourModel,
        },
        bottle: inputData.materialInfo.bottle,
        preform: inputData.materialInfo.preform,
        resinList: [
          ...inputData.materialInfo.reference_resin, // Spread the rest of the array
          ...inputData.materialInfo.resins, // Spread the rest of the array
        ],

        sectionWeight: sectionWeight,
        thicknessData: thicknessData,
        gasVolume: Number(inputData.creepParameters.gasVolume),
        location: inputData.materialInfo.location,
        machine: inputData.materialInfo.machine,
        stretchRodSpeed: Number(inputData.materialInfo.stretchRodSpeed),
        massFlowRate: Number(inputData.materialInfo.massFlowRate),
      };

      const responseText = await getGraphPlotData(data);
      if (responseText) {
        // console.log(responseText);
        updateBottleMeasurements(getValues("bottleMeasurement"));
        updateGraphData(responseText);
        toast.success("Recomputed Successfully");
        // router.push("/chart-model?from=new-project");
      } else {
        toast.error("Failed to Recompute");
      }
    });
  };

  const captureImage = async () => {
    updateIsGenerating(true);
    if (performanceMetricsRef.current) {
      await new Promise((resolve) => setTimeout(resolve, 6000)); // Allow DOM rendering
      const canvas = await html2canvas(performanceMetricsRef.current);
      const image = canvas.toDataURL("image/png");
      // console.log("canvas", canvas);
      // console.log("performance", image);
      if (image || (performanceMetrics as any) == "data:,") {
        setImage("performanceMetrics", image as any);
      }
    }
    if (radialRef.current) {
      await new Promise((resolve) => setTimeout(resolve, 6000)); // Allow DOM rendering
      const canvas = await html2canvas(radialRef.current);
      const image = canvas.toDataURL("image/png");
      // console.log("canvas", canvas);
      // console.log("Radial", image);
      if (image || (radialGraph as any) == "data:,") {
        setImage("radialGraph", image as any);
      }
    }
    updateIsGenerating(false);
  };
  // eslint-disable-next-line
  useEffect(() => {
    if (graphData.performanceModel) {
      setPerformanceModelData(graphData.performanceModel);
      generatePerformanceGraph(graphData.performanceModel);
    }
    captureImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphData]);

  return (
    <div className="space-y-10">
      <div
        // ref={refs.performanceModelRadarRef}
        className="w-full border border-states-disabled rounded-2xl pb-5"
      >
        <h1 className="semi-bold-16 border-b px-5 py-3 bg-states-disabled text-left rounded-t-2xl">
          Performance Model
        </h1>
        {PerformanceModelData.length <= 0 ? (
          <h1 className="semi-bold-16 px-5 py-3 text-center rounded-t-2xl">
            Chart Data Not Found
          </h1>
        ) : (
          graphData.PearlPlotData &&
          graphData.PearlPlotData.PearlGraph[0]?.ModelStretchDataAvailable && (
            <>
              <div className="block md:flex items-center gap-3">
                <AlertInfo
                  title="Only FTL values are placeholder values for visualisation only"
                  type="warn"
                  content={""}
                />

                {graphData.ResinsWithourSurrogateModels.length > 0 && (
                  <AlertInfo
                    title="Missing Surrogate Data"
                    content={graphData.ResinsWithourSurrogateModels.join(", ")}
                  />
                )}

                {graphData?.PearlPlotData?.ResinsWithoutPearlData?.length >
                  0 && (
                  <AlertInfo
                    title="Missing Pearlesence Data"
                    content={graphData.PearlPlotData.ResinsWithoutPearlData.join(
                      ", "
                    )}
                  />
                )}
              </div>
            </>
          )
        )}
        <div ref={radialRef} className="min-w-[400px]">
          {graphData.performanceModel.length > 0 && (
            <RadialChart
              useScaledValues
              resize={resize}
              data={graphData.performanceModel}
            />
          )}
        </div>
      </div>

      <div
        className={cn(
          "flex max-[1100px]:flex-col w-full max-w-[1500px] gap-2",
          resize && "w-[60%]"
        )}
      >
        <div
          ref={performanceMetricsRef}
          className="w-full border border-states-disabled rounded-2xl relative col-span-3 pb-[100px]"
        >
          <h1 className="semi-bold-16 border-b px-5 py-3 bg-states-disabled text-left rounded-t-2xl">
            Performance Metrics
          </h1>
          {result.length <= 0 ? (
            <h1 className="semi-bold-16 px-5 py-3 text-center rounded-t-2xl">
              Data Not Found
            </h1>
          ) : (
            <div className="w-full lg:flex justify-between items-start py-3">
              <Table className="rounded-[8px] mt-5">
                <TableHeader className="">
                  <TableRow className="whitespace-nowrap font-thin text-placeholder">
                    <TableHead className="text-left h-8 w-fit"> </TableHead>
                    <TableHead className=" h-8 w-fit text-left">
                      ETL (lbf)
                    </TableHead>
                    <TableHead className=" h-8 w-fit text-left">
                      FTL (lbf)
                    </TableHead>
                    <TableHead className=" h-8 w-fit text-left">
                      Thermal Stability (%)
                    </TableHead>
                    <TableHead className=" h-8 w-fit text-left">
                      Burst Pressure (psi)
                    </TableHead>
                    <TableHead className=" h-8 w-fit text-left">
                      Burst Volume (%)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result?.map((item: any, i: number) => {
                    return (
                      <TableRow
                        key={i}
                        className={cn(
                          "whitespace-nowrap space-y-2 mt-3 border-none"
                        )}
                      >
                        <TableCell className=" text-left h-8 py-2  pl-4 w-fit semi-bold-12 text-black">
                          {item.Resin}
                        </TableCell>
                        <TableCell className="text-center h-8 py-2  w-fit">
                          <InputCard
                            betweenValues={item.Resin !== "GPPS"}
                            value={item?.ETL?.toFixed(2)}
                            color={item.ETLColorCategory}
                          />
                        </TableCell>
                        <TableCell className="text-center h-8 py-2 w-fit">
                          <InputCard
                            betweenValues={item.Resin !== "GPPS"}
                            value={item?.FTL?.toFixed(2)}
                            color={item.FTLColorCategory}
                          />
                        </TableCell>
                        <TableCell className="text-center h-8 py-2 w-fit">
                          <InputCard
                            betweenValues={item.Resin !== "GPPS"}
                            value={item?.ThermalStability?.toFixed(2)}
                            color={item.thermalStabilityColor}
                          />
                        </TableCell>
                        <TableCell className="text-center h-8 py-2 w-fit">
                          <InputCard
                            betweenValues={item.Resin !== "GPPS"}
                            value={item?.Burst?.toFixed(2)}
                            color={item.BurstColorCategory}
                          />
                        </TableCell>
                        <TableCell className="text-center h-8 py-2 w-fit">
                          <InputCard
                            betweenValues={item.Resin !== "GPPS"}
                            value={item?.BurstVolume?.toFixed(2)}
                            color={item.BurstColorCategory}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
          {result.length > 0 && (
            <div className="sticky lg:absolute left-0 bottom-0 space-y-5 py-5">
              <h3 className="text-md font-semibold text-label px-5">
                Safety factor key
              </h3>

              <div className="flex justify-start items-center gap-10 w-full px-5">
                <div className="flex items-center w-fit">
                  <div className="size-4 bg-states-success"></div>
                  <ChevronRight strokeWidth={1} size={20} color="#303030" />
                  <p className="text-text-2">1.6</p>
                </div>

                <div className="flex items-center w-fit">
                  <div className="size-4 bg-states-warning"></div>
                  &nbsp;&nbsp;
                  <p className="text-text-2">1.6 - 1.4</p>
                </div>
                <div className="flex items-center w-fit">
                  <div className="size-4 bg-yellow-300"></div>
                  &nbsp;&nbsp;
                  <p className="text-text-2">1.4 - 1.2</p>
                </div>

                <div className="flex items-center w-fit">
                  <div className="size-4 bg-states-error"></div>
                  <ChevronLeft strokeWidth={1} size={20} color="#303030" />
                  <p className="text-text-2">Fail</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* <div className="block: xl:hidden w-full">
          <ReferenceImg
            align={false}
            bottle_design={inputData.materialInfo.bottle}
          />
        </div> */}

        <Form {...inputForm}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full lg:w-2/5">
            <BottleMeasurement
              onSubmit={handleSubmit(onSubmit)}
              control={control}
              getValues={getValues}
              performanceModel={
                inputData.analysisType.performanceModel || false
              }
              fullSize={true}
              isLoading={isPending}
            />
          </form>
        </Form>
      </div>

      <div className="flex flex-wrap lg:justify-start lg:flex-nowrap gap-2 w-full">
        <ReferenceImg align bottle_design={inputData.materialInfo.bottle} />

        <ScatterGraph />
        <ResinLinePlot />
      </div>
    </div>
  );
};

export default PerformanceModel;

type InputCardProps = {
  value: number | string;
  color?: string;
  betweenValues?: boolean;
};

const InputCard: React.FC<InputCardProps> = ({
  value,
  color,
  betweenValues,
}) => {
  function minMaxValues(number: any) {
    // Calculate 5% of the number
    const fivePercent = number * 0.05;

    // Calculate min and max
    const minValue = number - fivePercent;
    const maxValue = Number(number) + fivePercent;

    return {
      min: minValue,
      max: maxValue,
    };
  }
  const { min, max } = minMaxValues(value);

  return (
    <div className="min-w-[60px] w-[calc(100%-30px)] overflow-visible">
      {/* Use `value` instead of `defaultValue` */}
      <Input
        readOnly={true}
        inputMode="numeric"
        value={value} // Ensures input value updates when `value` prop changes
        type="text"
        placeholder="0.0"
        className={cn(
          "input text-white placeholder:overflow-visible h-[50px]",
          color
        )}
      />
      {betweenValues && (
        <p className="text-left p-2">
          {min?.toFixed(2)} - {max?.toFixed(2)}
        </p>
      )}
    </div>
  );
};
