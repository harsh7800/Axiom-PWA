"use client";
import React from "react";

import { useGraphPlotData } from "@/store/zustand-store";
import { AlertInfo } from "./alert-info";
import { RadialChart } from "./radial-chart";
import Pearlescence from "./process-window";
import ModulusCreep from "./modulus-creep";

const ResinModel = ({ resize }: { resize: boolean }) => {
  const { graphData } = useGraphPlotData((state) => state);
  // const resins = inputData?.materialInfo?.resins;

  // useEffect(() => { }, [refs, ref]);

  return (
    <div className="w-full pb-5 space-y-5">
      {/* <Button onClick={downloadImage}>Download</Button> */}
      <div
        // ref={refs.resinModelRadarRef}
        className="w-full border border-states-disabled rounded-2xl"
      >
        <h1 className="semi-bold-16 border-b px-5 py-3 bg-states-disabled text-left rounded-t-2xl">
          Material Information
        </h1>
        <div className="block md:flex items-center gap-3">
          {graphData?.PearlPlotData?.ResinsWithoutPearlData?.length > 0 && (
            <AlertInfo
              title="Missing Pearlesence Data"
              content={graphData.PearlPlotData.ResinsWithoutPearlData.join(
                ", "
              )}
            />
          )}

          {graphData.ResinsWithourSurrogateModels.length > 0 && (
            <AlertInfo
              title="Missing Surrogate Data"
              content={graphData.ResinsWithourSurrogateModels.join(", ")}
            />
          )}
        </div>
        {graphData.resinModel.length > 0 ? (
          <div>
            <RadialChart
              // ref={}
              resize={resize}
              data={graphData?.resinModel}
            />
          </div>
        ) : (
          <h1
            className="font-bold text-center
          py-5"
          >
            No Resin Model Data Found
          </h1>
        )}
      </div>

      <Pearlescence resize={resize} />
      <ModulusCreep />
    </div>
  );
};

export default ResinModel;
