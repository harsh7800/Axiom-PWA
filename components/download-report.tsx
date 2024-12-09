"use client";

import { Font, PDFDownloadLink } from "@react-pdf/renderer";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { DownloadIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import PDFDocument from "./pdf-content";
import useImageStore from "@/store/pdf-image";
import useCsvDataStore from "@/store/template";
import { readUser } from "@/helpers/get-user-details";
import usePerformanceData from "@/store/performanceModel";
import useProcessWindow from "@/store/processWindow";
import {
  useGeneratingReport,
  useGraphPlotData,
  useInputFormData,
} from "@/store/zustand-store";

// Register the custom font
Font.register({
  family: "Montserrat",
  src: "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap",
});

const DownloadReport = () => {
  const { bottle, radialGraph, performanceMetrics } = useImageStore(
    (state) => state
  );
  const { performanceData } = usePerformanceData((state) => state);
  const { processWindow } = useProcessWindow((state) => state);
  const { graphData } = useGraphPlotData((state) => state);
  const { inputData } = useInputFormData((state) => state);

  const { isGenerating } = useGeneratingReport((state) => state);
  const { csvData } = useCsvDataStore((state) => state);
  const [userName, setUserName] = useState("");

  async function FetchUser() {
    const {
      data: { user },
    } = await readUser();

    if (user?.user_metadata.first_name) {
      setUserName(user?.user_metadata.first_name);
    }
  }
  // console.log(processWindow);
  useEffect(() => {
    FetchUser();
  }, []);
  // useEffect(() => {
  //   const captureElementAsImage = async () => {
  //     const allRefs: AllRefs = {};
  //     if (refs && isGenerating) {
  //       for (const refKey of Object.keys(refs)) {
  //         const ref = refs[refKey]?.current;
  //         if (ref) {
  //           const canvas = await html2canvas(ref);
  //           const imageData = canvas.toDataURL("image/png");
  //           allRefs[refKey] = { key: refKey, url: imageData };
  //         }
  //       }

  //       setElementImage(allRefs);
  //       if (Object.keys(refs).length === 9) {
  //         updateIsGenerating(false);
  //         setIsReportGenerated(true);
  //       }
  //     }
  //   };

  //   if (isGenerating) {
  //     setTimeout(() => {
  //       captureElementAsImage();
  //     }, 6000);
  //   }
  // }, [refs]);

  return (
    <>
      {/* {!isGenerating && !isReportGenerated && (
        <Button
          onClick={handleStartGenerating}
          className="w-full sm:w-fit"
          style={{
            background: "#004899",
            color: "#fff",
            borderRadius: "10px",
            fontSize: "15px",
            padding: "10px 40px",
          }}
        >
          <span className="flex items-center gap-2">
            <DownloadIcon size={20} />
            {" Start Generating Report"}
          </span>
        </Button>
      )}

      {isGenerating && (
        <Button
          disabled={true}
          className="w-full sm:w-fit"
          style={{
            background: "#004899",
            color: "#fff",
            borderRadius: "10px",
            fontSize: "15px",
            padding: "10px 40px",
          }}
        >
          <span className="flex items-center gap-2">
            <Loader2 size={20} className="animate-spin" />
            {" Generating Report..."}
          </span>
        </Button>
      )} */}

      {isGenerating && (
        <Button
          disabled={true}
          className="w-full sm:w-fit"
          style={{
            background: "#004899",
            color: "#fff",
            borderRadius: "10px",
            fontSize: "15px",
            padding: "10px 40px",
          }}
        >
          <span className="flex items-center gap-2">
            <Loader2 size={20} className="animate-spin" />
            {" Generating Report..."}
          </span>
        </Button>
      )}

      {/* {isReportGenerated && ( */}
      {!isGenerating && (
        <PDFDownloadLink
          className="download-report-btn"
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
          document={
            <PDFDocument
              csvData={csvData}
              performanceData={performanceData}
              bottle={bottle}
              processWindow={processWindow}
              performanceMetrics={performanceMetrics}
              radialGraph={radialGraph}
              inputData={inputData}
              graphData={graphData}
              userName={userName}
            />
          }
          fileName={`${inputData.materialInfo.bottle}.pdf`}
        >
          {({ loading }: { loading: boolean }) => (
            <Button
              disabled={loading}
              className={cn(
                "w-full sm:w-fit bg-blue text-white text-md px-4 rounded-[8px]",
                loading && "text-blue font-bold"
              )}
            >
              {loading ? (
                "Loading..."
              ) : (
                <span className="flex items-center gap-2">
                  <DownloadIcon size={20} />
                  {" Download Report"}
                </span>
              )}
            </Button>
          )}
        </PDFDownloadLink>
      )}

      {/* )} */}
    </>
  );
};

export default DownloadReport;
