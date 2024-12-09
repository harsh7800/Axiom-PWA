"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResinModel from "@/components/resin-model";
import PerformanceModel from "@/components/performance-model";
// import ColorModel from "@/components/color-model";

import LabelTooltip from "@/components/label-tooltip";
import { useGraphPlotData, useInputFormData } from "@/store/zustand-store";
import Footer from "@/components/footer";

const Page = () => {
  const { inputData } = useInputFormData((state) => state);
  const { graphData } = useGraphPlotData((state) => state);
  // console.log("graphData: ", graphData);

  const [currentTab, setCurrentTab] = React.useState(
    !inputData?.analysisType?.resinComparison
      ? "performanceModel"
      : "resinModel"
  );

  const {
    HSR = 0,
    ASR = 0,
    MidHSR = 0,
    MidASR = 0,
  } = graphData?.stretchRatios || {};

  const hoopAndAxial = [
    {
      value: HSR,
      label: "ID Hoop Stretch",
      content:
        "Stretch ratio calculated from the inner diameter of the preform",
    },
    {
      value: ASR,
      label: "ID Axial Stretch",
      content:
        "Stretch ratio calculated from the inner diameter of the preform",
    },
    {
      value: MidHSR,
      label: "MidPlane Hoop Stretch",
      content:
        "Stretch ratio calculated from the midplane of the preform - used for simulation",
    },
    {
      value: MidASR,
      label: "MidPlane Axial Stretch",
      content:
        "Stretch ratio calculated from the midplane of the preform - used for simulation",
    },
  ];

  // useEffect(() => {
  //   if (graphData?.length > 0) {
  //     router.push("/");
  //   }
  // }, [graphData]);

  return (
    <div className="relative bg-white overflow-hidden">
      {/* {!isGenerating ? ( */}
      {/* <Loader2 className="" /> */}
      {/* ) : ( */}
      <Tabs
        defaultValue={
          !inputData?.analysisType?.resinComparison
            ? "performanceModel"
            : "resinModel"
        }
        className="w-full px-2 md:px-5 lg:px-10"
        onValueChange={setCurrentTab}
      >
        <TabsList className=" w-full flex flex-col lg:flex-row justify-between h-fit lg:h-[100px] py-5 space-y-5 lg:space-y-0">
          <div
            className="gap-3 flex
           w-full lg:w-fit justify-start"
          >
            <TabsTrigger
              disabled={!inputData.analysisType.resinComparison}
              value="resinModel"
              className="border-2 rounded-[8px] text-blue text-md lg:text-lg font-semibold"
            >
              Resin <span className="hidden sm:block">&nbsp; Model</span>
            </TabsTrigger>

            <TabsTrigger
              disabled={!inputData?.analysisType?.performanceModel}
              value="performanceModel"
              className="border-2 border-blue rounded-[8px] text-blue text-md sm:text-lg font-semibold"
            >
              Performance <span className="hidden sm:block">&nbsp; Model</span>
            </TabsTrigger>
          </div>

          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-x-2 sm:gap-x-3 gap-y-2 semi-bold-16 text-sm sm:text-lg w-full justify-center lg:justify-normal lg:w-fit">
            {hoopAndAxial.map((item, id) => {
              return (
                <h1
                  key={id}
                  className="border-2 flex items-center gap-1 border-border-1 px-2 py-1 rounded-[10px] text-placeholder"
                >
                  <span>
                    <LabelTooltip content={item.content} />
                  </span>
                  <span>{item.label}</span>
                  <span className="text-black">{item.value}</span>
                </h1>
              );
            })}
          </div>
        </TabsList>

        <TabsContent
          forceMount
          value="resinModel"
          className={`relative space-y-4 ${
            currentTab !== "resinModel" ? "hidden" : ""
          }`}
        >
          <ResinModel resize={false} />
        </TabsContent>

        <TabsContent
          forceMount
          value="performanceModel"
          className={`relative space-y-4 ${
            currentTab !== "performanceModel" ? "hidden" : ""
          }`}
        >
          <PerformanceModel resize={false} />
        </TabsContent>
      </Tabs>
      {/* )} */}
      <Footer />
      {/* {isGenerating && <Navigate />} */}
      {/* <Navigate />
      <div className="absolute -top-[1000%]">
        {inputData.analysisType.resinComparison && (
          <ResinModel ref={refs.resinModelRadarRef} resize={true} />
        )}
        {inputData.analysisType.performanceModel && (
          <PerformanceModel ref={refs.performanceModelRadarRef} resize={true} />
        )}
      </div> */}

      {/* <Dialog open={isGenerating}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className="w-fit bg-white text-blue ">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 p-3">
              <Loader2 className="animate-spin" size={20} />
              Generating Data To Plot Graphs{" "}
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog> */}

      <div className="absolute -top-[1000%]">
        {/* {inputData.analysisType.resinComparison && (
          <ResinModel ref={refs.resinModelRadarRef} resize={true} />
        )} */}
        {inputData.analysisType.performanceModel && (
          <PerformanceModel resize={true} />
        )}
      </div>
    </div>
  );
};

export default Page;
