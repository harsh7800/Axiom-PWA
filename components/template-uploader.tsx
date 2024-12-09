/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react";
import Papa from "papaparse"; // For parsing CSV files
import { Button } from "./ui/button";
import useCsvDataStore from "@/store/template";

const CsvUploader = () => {
  const fileInputRef = useRef<HTMLElement>(null); // Reference to the file input
  const { setCsvData, csvData, clearCsvData } = useCsvDataStore(
    (state) => state
  );

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically trigger the file input click
    }
  };

  const handleFileUpload = (event: any) => {
    console.log(csvData);
    event.preventDefault();
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log("results: ", results);
          const parsedData = results.data.map((row: any) => ({
            shoulder: Number(row.shoulder || 0),
            label: Number(row.label || 0),
            base: Number(row.base || 0),
            grip: Number(row.grip || 0),
            etl: Number(row.etl || 0),
            ftl: Number(row.ftl || 0),
            ts: Number(row.ts || 0),
            "burst-pressure": Number(row["burst-pressure"] || 0),
            "burst-volume": Number(row["burst-volume"] || 0),
          }));
          console.log(parsedData);
          setCsvData(parsedData);
        },
        error: (err) => console.error("Error parsing CSV:", err),
      });
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  return (
    <div className="flex justify-start pl-5">
      {/* Hidden file input */}
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef as any} // Attach the ref
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />
      {/* Button to trigger file input */}
      {csvData.length <= 0 ? (
        <Button
          type="button"
          className="w-full sm:w-fit font-bold sm:font-semibold text-sm border-2 border-blue bg-blue rounded-[8px] px-4 text-white hover:bg-blue"
          onClick={handleButtonClick}
        >
          Upload CSV
        </Button>
      ) : (
        <Button
          type="button"
          className="w-full sm:w-fit font-bold sm:font-semibold text-sm border-2 border-blue bg-blue rounded-[8px] px-4 text-white hover:bg-blue"
          onClick={clearCsvData}
        >
          Clear Data
        </Button>
      )}
    </div>
  );
};

export default CsvUploader;
