import React, { useEffect, useState } from "react";

import { cn, generateSeriesForPearl } from "@/lib/utils";
import { AlertInfo } from "./alert-info";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { pearlescenceSeriesType } from "@/types/inputformtype";
import { useChartStore, useGraphPlotData } from "@/store/zustand-store";
import StraightChart from "./process-window-chart";

const Pearlescence = ({ resize }: { resize: boolean }) => {
  const [pearlescenceSeriesData, setPearlescenceSeriesData] = useState<
    pearlescenceSeriesType[]
  >([]);
  const [listBottleZones, setListBottleZones] = useState<number>(0);
  const { chartIds } = useChartStore((state) => state);

  const { graphData } = useGraphPlotData((state) => state);

  useEffect(() => {
    if (graphData?.PearlPlotData?.PearlGraph) {
      const newSeriesData = generateSeriesForPearl(
        graphData?.PearlPlotData?.PearlGraph,
        listBottleZones
      );
      // // console.log("newDataa", newSeriesData);
      setPearlescenceSeriesData(newSeriesData);
    }
  }, [graphData, listBottleZones]);

  return (
    <div
      // ref={refs.processWindowRef}
      className={cn(
        "w-full border bg-white border-states-disabled rounded-2xl relative pb-5"
      )}
    >
      <h1 className="semi-bold-16 border-b px-5 py-4 bg-states-disabled text-left rounded-t-2xl flex  gap-3">
        Process Window
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <Info size={20} />
            </TooltipTrigger>
            <TooltipContent className="bg-white max-w-screen-md space-y-4">
              <p>
                In this section, the process window comparison of each of the
                selected resins are shown for two sections: the label and base.
                These regions are selected to be of particular interest as they
                are the most prone to potential pearlescence behaviour due to
                the elevated stretch ratios experienced during forming.
              </p>
              <p>
                The left-hand edge of the inverted trapezoid dictates the
                stretch ratios in which strain hardening of the material is
                experienced as a function of material temperature, and it is
                recommended that these stretch ratios be achieved in the
                preform-bottle pair selection.
              </p>

              <p>
                The right-hand edge describes the pearlescence behaviour of the
                material as a function of temperature: where beyond this
                boundary, stress whitening of the material is observed. Maximum
                anticipated stretch ratios per region are given for the chosen
                preform-bottle pair, and dictate the calculated &apos;Lower
                Value&apos; shown in the outputted table. This &apos;Lower
                Value&apos; is the suggested temperature in which the preform be
                processed at for that particular region. The &apos;Upper
                Value&apos; is capped at 120°C, and the &apos;Height of
                Processing Window&apos; is subsequently calculated through the
                subtraction of the &apos;Lower Value&apos; from the &apos;Upper
                Value&apos;.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h1>

      <div className="flex flex-wrap gap-2">
        {graphData?.PearlPlotData?.ResinsWithoutStretchData.length > 0 && (
          <AlertInfo
            type="warn"
            title={`Stretch Ratios are generalized representatives of the Process window and therefore should be used tentatively for [ ${graphData.PearlPlotData.ResinsWithoutStretchData.join(
              ", "
            )} ]`}
            content=""
          />
        )}
        {graphData?.PearlPlotData?.ResinsWithoutPearlData?.length > 0 && (
          <AlertInfo
            title="Missing Pearlesence Data"
            content={graphData.PearlPlotData.ResinsWithoutPearlData.join(", ")}
          />
        )}

        {graphData.ResinsWithourSurrogateModels.length > 0 && (
          <AlertInfo
            title="Missing Surrogate Data"
            content={graphData.ResinsWithourSurrogateModels.join(", ")}
          />
        )}
      </div>
      {pearlescenceSeriesData?.length > 0 ? (
        <StraightChart
          listBottleZones={listBottleZones}
          setListBottleZones={setListBottleZones}
          resize={resize}
          chartID={chartIds[6]}
          data={pearlescenceSeriesData}
          // peakPoint={18}
        />
      ) : (
        <h1
          className="font-bold text-center
          py-5"
        >
          No Pearl Plot Data Found
        </h1>
      )}
    </div>
  );
};

export default Pearlescence;
