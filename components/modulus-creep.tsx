/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { generateSeriesForCreep, generateSeriesForModulus } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Info } from "lucide-react";
import { useGraphPlotData } from "@/store/zustand-store";
import { creepSeriesType, modulusSeriesType } from "@/types/inputformtype";
import LineChart from "./line-chart";
const ModulusCreep = () => {
  const { graphData } = useGraphPlotData((state) => state);
  const [stress, setStress] = useState([]);
  const [EQSR, setEQSR] = useState([]);

  const [lineSeriesCreepData, setLineSeriesCreepData] = useState<
    creepSeriesType[]
  >([]);
  const [lineSeriesModulusData, setLineSeriesModulusData] = useState<
    modulusSeriesType[]
  >([]);

  // const resins = inputData?.materialInfo?.resins;

  useEffect(() => {
    if (graphData?.CreepPlotdata?.Creep) {
      const Stress = graphData.CreepPlotdata.Creep.map(
        (item: any) => item.Stress
      );
      // const firstAvailablePoint = Stress.find((point: number) => point !== 0);
      const newSeriesData = generateSeriesForCreep(
        graphData.CreepPlotdata.Creep,
        Stress
      );

      setStress(Stress);
      setLineSeriesCreepData(newSeriesData);
    }
  }, [graphData]);

  useEffect(() => {
    if (graphData?.ModulusPlotData?.ModulusGraph) {
      const eqsr = graphData.ModulusPlotData.ModulusGraph.map(
        (item: any) => item.EQSR
      );
      // const firstAvailablePoint = eqsr.find((point: number) => point !== 0);
      const newSeriesData = generateSeriesForModulus(
        graphData.ModulusPlotData.ModulusGraph,
        eqsr
      );

      // // // console.log(firstAvailablePoint);
      setEQSR(eqsr);
      // // console.log(newSeriesData);
      setLineSeriesModulusData(newSeriesData);
    }
  }, [graphData]);

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row py-10 items-center gap-10">
        <div className="w-full lg:w-1/2 border border-states-disabled rounded-2xl relative">
          <h1 className="semi-bold-16 border-b px-5 py-3 bg-states-disabled text-left rounded-t-2xl flex gap-2">
            Modulus
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <Info size={20} />
                </TooltipTrigger>
                <TooltipContent className="bg-white max-w-screen-md space-y-4">
                  <p>
                    The Young&apos;s Modulus of a resin generally has a positive
                    correlation with performance metrics such as top load and
                    burst.
                  </p>
                  <p>
                    The modulus curve is generated through biaxial stretching
                    and rigid blow tests, and helps give an indication of the
                    resultant stiffness of the associated resin as it is
                    stretched further during forming.
                  </p>

                  <p>
                    An EQSR value (shown by vertical line) is calculated using
                    the internal hoop and axial stretches taken from the
                    bottle-preform pair to highlight the associated local
                    modulus for each resin in the bar chart.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h1>
          {/* <h1 className="semi-bold-14 text-black absolute top-1/3 -left-10 -rotate-90">
            Modulus (MPa)
          </h1> */}
          {lineSeriesModulusData?.length > 0 ? (
            <LineChart
              yAxisCaption="Modulus (Mpa)"
              xAxisCaption="EQSR"
              barDataType="Modulus"
              peakPoint={EQSR}
              data={lineSeriesModulusData}
            />
          ) : (
            <h1 className="font-bold text-center py-5">
              No Modulus Data Found
            </h1>
          )}
        </div>

        <div className="w-full lg:w-1/2 border relative border-states-disabled rounded-2xl ">
          <h1 className="semi-bold-16 border-b px-5 py-3 bg-states-disabled text-left rounded-t-2xl flex gap-2">
            Long Term Modulus
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <Info size={20} />
                </TooltipTrigger>
                <TooltipContent className="bg-white max-w-screen-md space-y-4">
                  <p>
                    Long-term modulus indicates the thermal stability of the
                    chosen resin, with larger expansion behaviour expected as
                    the measured modulus decreases.
                  </p>
                  <p>
                    Creep curves are generated through 24-hour pressurisation
                    tests conducted at 37°C and help give an indication of the
                    thermal stability behaviour of the associated resin with
                    increasingly applied stress.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h1>
          {/* <h1 className="semi-bold-14 text-black absolute top-1/3 -left-16 -rotate-90">
            Creep Modulus (MPa)
          </h1> */}
          {lineSeriesCreepData.length > 0 ? (
            <LineChart
              yAxisCaption="Long Term Modulus (Mpa)"
              xAxisCaption="Stress (MPa)"
              barDataType="Creep"
              peakPoint={stress}
              data={lineSeriesCreepData}
            />
          ) : (
            <h1
              className="font-bold text-center
          py-5"
            >
              No Long Term Modulus Data Found
            </h1>
          )}
        </div>
      </div>
    </>
  );
};

export default ModulusCreep;
