/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";

interface GraphPlotData {
  // Define the shape of the response data here based on what the API returns
  [key: string]: any;
}

// Define the caching function
export const useGraphPlotDataFetcher = () => {
  const cache: { [key: string]: GraphPlotData } = {};

  const getGraphPlotData = useCallback(
    async (data: any): Promise<GraphPlotData | undefined> => {
      try {
        // Generate a cache key based on the input data
        const cacheKey = JSON.stringify(data);

        // Check if the data is already cached
        if (cache[cacheKey]) {
          return cache[cacheKey];
        }

        // Make your API call here
        const response = await fetch(
          "https://resincomparisionpythonapi.azurewebsites.net/api/data",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update graph data");
        }

        // Get the response text
        const responseText = await response.text();

        // Replace 'NaN' strings with 'null'
        const cleanedText = responseText.replace(/NaN/g, "null");

        // Parse the cleaned text to JSON
        const responseData: GraphPlotData = JSON.parse(cleanedText);

        // Update the cache
        cache[cacheKey] = responseData;
        return responseData;
      } catch (error) {
        console.error("Error updating graph data:", error);
        // Optionally handle error states or notifications
      }
    },
    []
  );

  return getGraphPlotData;
};
