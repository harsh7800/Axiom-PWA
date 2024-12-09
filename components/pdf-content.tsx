/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Aptos",
  src: "../app/fonts/aptos.ttf", // Roboto font link
});

// Font.register({
//   family: "Open Sans",
//   fonts: [
//     {
//       src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
//     },
//     {
//       src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
//       fontWeight: 600,
//     },
//   ],
// });

// Create styles
const styles = StyleSheet.create({
  body: {
    fontFamily: "Aptos",
  },
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  section: {
    width: "100%",
    display: "flex",
  },
  headerLogo: {
    position: "absolute",
    left: 60,
    width: 120,
    marginBottom: 150,
  },
  titleContainer: {
    marginBottom: 40,
    position: "absolute",
    top: 250,
    left: 60,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "ultrabold",
    marginBottom: 30,
  },
  resinName: {
    fontSize: 14,
    marginBottom: 10,
    color: "#000",
  },
  footerSection: {
    height: "300px",
    width: "100%",
    backgroundColor: "#00000020",
    position: "absolute",
    bottom: 0,
    padding: 40,
  },
  footerRow: {
    flexDirection: "column",
  },
  footerLabel: {
    fontSize: 12,
    width: 120,
  },
  footerValue: {
    fontSize: 12,
    color: "#000",
  },
  Divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#000",
    margin: "10px 0px",
  },
  disclaimer: {
    position: "absolute",
    width: "80%",
    lineHeight: 2,
    bottom: 15,
    left: 90,
    fontSize: 8,
    color: "#666",
    marginTop: 15,
    textAlign: "center",
  },
  headerCell: {
    flex: 1,
    padding: 10,
    borderRight: "1px solid #000",
    textAlign: "center",
  },
  unitCell: {
    flex: 1,
    padding: 10,
    borderRight: "1px solid #000",
    textAlign: "center",
    fontStyle: "italic",
  },
});

interface Resin {
  name: string;
  data: { x: number; y: number }[]; // Data points for the resin
  type: string;
  colour: string;
  visible: boolean;
  Lower: number;
  Upper: number;
  BlowTemp: number;
  LowerBound: number;
  UpperBound: number;
  listBottleZones: string[]; // Names of zones
  listLowerBound: number[];
  listUpperBound: number[];
  listLower: number[];
  listUpper: number[];
  listBlowTemp: number[]; // Temperatures for each zone
  group: string;
}

interface ProcessWindow {
  highest: Resin | null;
  middle?: Resin | null;
  lowest: Resin | null;
}

export const PDFDocument = ({
  inputData,
  bottle,
  radialGraph,
  performanceMetrics,
  graphData,
  processWindow,
  performanceData,
  csvData,
  userName,
}: {
  inputData: any;
  bottle: any;
  radialGraph: any;
  performanceMetrics: any;
  graphData: any;
  elementImage?: any;
  processWindow: any;
  performanceData: any;
  csvData: any;
  userName: string;
}) => {
  const DefineColor = (value: number) => {
    if (value > 1.6) {
      return "#65B47A";
    } else if (value > 1.4 && value <= 1.6) {
      return "#F79E19";
    } else if (value > 1.2 && value <= 1.4) {
      return "#FDE047";
    } else if (value < 1.2) {
      return "#EF0707";
    } else {
      return "bg-gray-400";
    }
  };

  const gppsValues = performanceData?.find(
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
    return performanceData?.map(
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

  function findResinWithHighestLowestAndMiddleBlowTemp(resins: Resin[]) {
    if (!resins || resins.length === 0) {
      return { highest: null, middle: null, lowest: null };
    }

    let maxBlowTemp = -Infinity; // Initialize to a very low value for maximum
    let minBlowTemp = Infinity; // Initialize to a very high value for minimum
    let resinWithHighestBlowTemp: Resin | null = null;
    let resinWithLowestBlowTemp: Resin | null = null;

    const allBlowTemps: { temp: number; resin: Resin }[] = []; // Store all temperatures with their respective resin

    resins.forEach((resin) => {
      const maxTempForResin = Math.max(...resin.listBlowTemp); // Get the max value from listBlowTemp for each resin
      const minTempForResin = Math.min(...resin.listBlowTemp); // Get the min value from listBlowTemp for each resin

      // Collect all temperatures with the resin
      resin.listBlowTemp.forEach((temp) => {
        allBlowTemps.push({ temp, resin });
      });

      // Check if this resin has the highest BlowTemp
      if (maxTempForResin > maxBlowTemp) {
        maxBlowTemp = maxTempForResin;
        resinWithHighestBlowTemp = resin; // Update the resin with the highest BlowTemp
      }

      // Check if this resin has the lowest BlowTemp
      if (minTempForResin < minBlowTemp) {
        minBlowTemp = minTempForResin;
        resinWithLowestBlowTemp = resin; // Update the resin with the lowest BlowTemp
      }
    });

    // Sort all temperatures
    allBlowTemps.sort((a, b) => a.temp - b.temp);

    // Check the length of resins and return accordingly
    if (resins.length <= 2) {
      // If there are only 2 resins, return only highest and lowest
      return {
        highest: resinWithHighestBlowTemp,
        lowest: resinWithLowestBlowTemp,
      };
    } else {
      // If there are 3 or more resins, find the middle value
      const middleIndex = Math.floor(allBlowTemps.length / 2);
      const middleBlowTemp = allBlowTemps[middleIndex];
      const resinWithMiddleBlowTemp = middleBlowTemp?.resin ?? null;

      return {
        highest: resinWithHighestBlowTemp,
        middle: resinWithMiddleBlowTemp,
        lowest: resinWithLowestBlowTemp,
      };
    }
  }

  function findResinWithModulus() {
    if (
      !graphData ||
      !graphData.ModulusPlotData ||
      !graphData.ModulusPlotData.ModulusGraph
    ) {
      return [];
    }

    // Sort resins by Modulus value
    const sortedResins = graphData.ModulusPlotData.ModulusGraph.sort(
      (a: any, b: any) => {
        return b.Modulus - a.Modulus; // Directly sort by Modulus value
      }
    );

    return sortedResins;
  }

  function findResinWithLongTermModulus() {
    if (
      !graphData ||
      !graphData.CreepPlotdata ||
      !graphData.CreepPlotdata.Creep
    ) {
      return [];
    }

    // Sort resins by Modulus value
    const sortedResins = graphData.CreepPlotdata.Creep.sort(
      (a: any, b: any) => {
        return b.LongTermModulus - a.LongTermModulus; // Directly sort by Modulus value
      }
    );

    return sortedResins;
  }
  const Modulus = findResinWithModulus();
  const LongModulus = findResinWithLongTermModulus();

  const biggestProcessWindow: ProcessWindow | null =
    findResinWithHighestLowestAndMiddleBlowTemp(processWindow);

  function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  const resinWithIV = graphData?.resinModel?.map(
    (resin: any) => `${resin?.Resin}-(${resin?.IV})`
  );

  const chosenLessThanModulusResins =
    graphData?.ModulusPlotData?.ModulusGraph?.filter(
      (resin: any) =>
        resin.Resin !== inputData?.materialInfo?.reference_resin[0] &&
        100 - Number(resin?.CompareScore) <= 10
    )?.map((resin: any) => resin.Resin); // Extract only `Resin` names or relevant info
  const chosenGreaterThanModulusResins =
    graphData?.ModulusPlotData?.ModulusGraph?.filter(
      (resin: any) =>
        resin.Resin !== inputData?.materialInfo?.reference_resin[0] &&
        100 - Number(resin?.CompareScore) >= 10
    )?.map((resin: any) => resin.Resin); // Extract only `Resin` names or relevant info
  const chosenLessLongTermModulusResins =
    graphData?.CreepPlotdata?.Creep?.filter(
      (resin: any) =>
        resin.Resin !== inputData?.materialInfo?.reference_resin[0] &&
        100 - Number(resin?.Similarity?.replace("%", "")) <= 10
    )?.map((resin: any) => resin.Resin); // Extract only `Resin` names or relevant info
  const chosenGreaterLongTermModulusResins =
    graphData?.CreepPlotdata?.Creep?.filter(
      (resin: any) =>
        resin.Resin !== inputData?.materialInfo?.reference_resin[0] &&
        100 - Number(resin?.Similarity?.replace("%", "")) >= 10
    )?.map((resin: any) => resin.Resin); // Extract only `Resin` names or relevant info

  console.log(graphData);
  return (
    <Document>
      {/* Cover Page */}

      <Page size="A4" style={styles.page}>
        {/* Header Logo */}
        <View
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            marginTop: 60,
          }}
        >
          <Image
            style={styles.headerLogo}
            // alt="Logo"
            src="https://dkuzirpnfhuckpfriciw.supabase.co/storage/v1/object/public/pdf%20images/BMT.png" // You'll need to ensure this path is correct
          />
          {/* <View
            style={{
              fontSize: 30,
              position: "absolute",
              left: 60,
              fontWeight: "extrabold",
              border: "1px solid black",
              width: "20%",
              height: 50,
            }}
          >
            {/* BMT */}
          {/* </View>  */}
          {/* <Text
            style={{
              fontSize: 30,
              position: "absolute",
              left: 60,
              fontWeight: "extrabold",
            }}
          >
            BMT
          </Text> */}
          {/* <View
            style={{
              position: "absolute",
              left: 60,
            }}
          >
            {imageData && <Image src={imageData} />}
          </View> */}

          <View
            style={{
              fontSize: 30,
              position: "absolute",
              right: 60,
              fontWeight: "extrabold",
              // border: "1px solid black",
              width: "40%",
              height: 50,
            }}
          >
            <Image
              // style={styles.headerLogo}
              // alt={"Logo"}
              src="https://dkuzirpnfhuckpfriciw.supabase.co/storage/v1/object/public/pdf%20images/pepsico-name-logo-.png" // You'll need to ensure this path is correct
            />
            {/* BMT */}
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text
            style={{
              fontSize: 24,
              marginBottom: 40,
              fontWeight: 600,
            }}
          >
            rPET Comparison Summary
          </Text>
          {/* {inputData?.materialInfo?.resins??.map(
            (resin: string, index: number) => (
            )
          )} */}
          <Text style={styles.resinName}>
            {inputData?.materialInfo?.reference_resin[0]}
          </Text>
          <Text style={styles.resinName}>
            {inputData?.materialInfo?.resins[0]}
          </Text>
          <Text style={styles.resinName}>
            {inputData?.materialInfo?.resins[1]}
          </Text>
        </View>

        {/* Footer Section */}
        <View style={styles.footerSection}>
          <View style={{ position: "relative" }}>
            <View style={{ position: "absolute", left: 25 }}>
              <Text style={styles.footerLabel}>Prepared For:</Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#000",
                  fontWeight: "extrabold",
                  marginTop: "10",
                }}
              >
                {userName || ""}
              </Text>
              {/* <Text
                style={{
                  fontSize: 12,
                  color: "#000",
                  marginTop: "10",
                }}
              >
                R&D Senior Packaging Engineer
              </Text> */}
            </View>

            <View style={{ position: "absolute", right: 40 }}>
              <Text style={styles.footerLabel}>Document written:</Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#000",
                  fontWeight: "ultrabold",
                  marginTop: "10",
                }}
              >
                {getFormattedDate()}
              </Text>
            </View>
          </View>
          <View
            style={{
              position: "absolute",
              left: 60,
              top: 170,
            }}
          >
            <Text
              style={{
                fontSize: 7,
                marginTop: 5,
                color: "#000",
                marginLeft: "5px",
                marginRight: "5px",
              }}
            >
              Blow Moulding Technologies LTD.
            </Text>{" "}
            <Text
              style={{
                fontSize: 7,
                marginTop: 5,
                color: "#000",
                marginLeft: "5px",
                marginRight: "5px",
              }}
            >
              Unit 1, Rowan House, Beechill Business Park, 96 Beechill Road,
              Belfast, BTB 7QN
            </Text>{" "}
            <Text
              style={{
                fontSize: 7,
                marginTop: 5,
                color: "#000",
                marginLeft: "5px",
                marginRight: "5px",
              }}
            >
              +44 (0) 28 96 22 70 04 | e: info@bmt-ni.com | w: www.bmt-ni.com
            </Text>{" "}
          </View>
          <Text style={styles.disclaimer}>
            This proposal and supporting materials contain confidential and
            proprietary information of Blow Moulding Technologies Ltd. These
            materials must not be copied, replicated or redistributed without
            consent.
          </Text>
        </View>
        {/* <View></View> */}
      </Page>

      {/* Rest of your existing pages remain the same */}
      {/* Input Data Page */}
      <Page
        size="A4"
        style={{
          flexDirection: "column",
          backgroundColor: "#fff",
          padding: 60,
        }}
      >
        <View
          style={{
            margin: "15px 0",
          }}
        >
          {/* Overview */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              marginBottom: 5,
            }}
          >
            OVERVIEW
          </Text>
          <View style={styles.Divider} />
          <Text
            style={{
              fontSize: 10,
              marginBottom: 10,
              lineHeight: 2,
              color: "#00000090",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 5,
            }}
          >
            Presented in this report is a comparison of the forming and
            performance behaviours of the selected rPET resins:{" "}
            <Text
              style={{ color: "#000", marginLeft: "5px", marginRight: "5px" }}
            >
              {inputData?.materialInfo?.resins?.join(", ")} and{" "}
              {inputData?.materialInfo?.reference_resin?.join(", ")}
            </Text>{" "}
          </Text>

          <Text
            style={{
              fontSize: 10,
              marginBottom: 10,
              lineHeight: 2,
              color: "#00000090",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 5,
            }}
          >
            Shown below is a table of the inputted material, preform, bottle and
            forming parameter information in which representative stretch ratios
            and characteristic models are calculated:
          </Text>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              border: "1px solid #000",
              fontSize: 10,
              height: "35px",
            }}
          >
            <Text
              style={{
                flex: 1,
                padding: 10,
                paddingTop: 10,
                color: "grey",
                borderRight: "1px solid #000",
                textAlign: "center",
              }}
            >
              Geometry
            </Text>
            <Text
              style={{
                flex: 1,
                padding: 10,
                paddingTop: 10,
                color: "grey",
                textAlign: "center",
              }}
            >
              Forming Parameters
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              borderBottom: "1px solid #000",
              fontSize: 10,
              height: "35px",
            }}
          >
            <Text
              style={{
                flex: 1,
                padding: 10,
                borderLeft: "1px solid #000",
                borderRight: "1px solid #000",
                textAlign: "center",
                color: "grey",
              }}
            >
              Bottle
            </Text>
            <Text
              style={{
                flex: 1,
                padding: 10,
                borderRight: "1px solid #000",
                textAlign: "center",
                color: "grey",
              }}
            >
              Preform
            </Text>
            <Text
              style={{
                flex: 1,
                padding: 10,
                borderRight: "1px solid #000",
                textAlign: "center",
                color: "grey",
              }}
            >
              Mass Flow Rate
            </Text>
            <Text
              style={{
                flex: 1,
                padding: 10,
                borderRight: "1px solid #000",
                textAlign: "center",
                color: "grey",
              }}
            >
              Stretch Rod Speed
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              fontSize: 10,
              borderBottom: "1px solid #000",
              height: "35px",
            }}
          >
            <Text
              style={{
                flex: 1,
                padding: 10,
                borderRight: "1px solid #000",
                borderLeft: "1px solid #000",
                textAlign: "center",
              }}
            >
              {inputData?.materialInfo?.bottle}
            </Text>
            <Text
              style={{
                flex: 1,
                padding: 10,
                borderRight: "1px solid #000",
                textAlign: "center",
              }}
            >
              {inputData?.materialInfo?.preform}
            </Text>
            <Text
              style={{
                flex: 1,
                padding: 10,
                borderRight: "1px solid #000",
                textAlign: "center",
              }}
            >
              {inputData?.materialInfo?.massFlowRate
                ? inputData?.materialInfo?.massFlowRate
                : "20"}{" "}
              g/s
            </Text>
            <Text
              style={{
                flex: 1,
                padding: 10,
                borderRight: "1px solid #000",
                textAlign: "center",
              }}
            >
              {inputData?.materialInfo?.stretchRodSpeed
                ? inputData?.materialInfo?.stretchRodSpeed
                : "1.3"}{" "}
              m/s
            </Text>
          </View>
        </View>

        <View
          style={{
            margin: "15px 0",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              marginBottom: 10,
            }}
          >
            PROCESSING WINDOW
          </Text>
          <View style={styles.Divider} />
          <Text
            style={{
              fontSize: 10,
              marginBottom: 10,
              lineHeight: 2,
              color: "#00000090",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 5,
            }}
          >
            The following temperature ranges are given below per section of the
            preform length as a guideline in which to process the individual
            resins, where the preform-bottle-resin combination can give desired
            strength whilst mitigating the onset of pearlescence behaviour in
            the formed bottle. See below an infographic highlighting the
            suggested temperature processing windows for each resin, at each
            section of the chosen bottle geometry:{" "}
          </Text>

          {/* Processing Window Table */}

          <View
            style={{
              width: "100%",
              marginTop: 10,
              // border: "1px solid #000",
              fontSize: 8,
              display: "flex",
              flexDirection: "row",
              position: "relative",
            }}
          >
            {/* <View></View> */}
            <Image
              style={{ width: "20%", marginLeft: 20 }}
              // alt="Logo"
              src={
                "https://dkuzirpnfhuckpfriciw.supabase.co/storage/v1/object/public/pdf%20images/side-processing-window.png"
              } // You'll need to ensure this path is correct
            />
            <View style={{ width: "80%", marginTop: "-7" }}>
              <Text style={{ fontSize: 10, textAlign: "center", padding: 2 }}>
                Processing Window
              </Text>
              <View
                style={{
                  width: "100%",
                  fontSize: 10,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  border: "1px solid black",
                }}
              >
                <Text
                  style={{
                    width: "80%",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    padding: 3,
                    color: "grey",
                  }}
                >
                  Minimum Allowable Temperature (AT) / &deg;C
                </Text>
                <Text
                  style={{
                    padding: 3,
                    width: "20%",
                    textAlign: "center",
                    color: "grey",
                  }}
                >
                  MAX. (AT) / &deg;C
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  fontSize: 10,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    width: "80%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderLeft: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  {/* Mapping of Resins */}
                  {processWindow?.map((resin: any, i: number) => {
                    return (
                      <View
                        key={i}
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          // justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            padding: 3,
                            paddingBottom: 0,
                            paddingTop: 4,
                            height: 20,

                            textAlign: "center",
                            width: "100%",
                            fontSize: 8,
                            borderRight: "1px solid black",
                            textOverflow: "ellipsis",
                            color: "grey",
                          }}
                        >
                          {resin?.name}
                        </Text>
                        {resin.listLower?.map((val: number, i: number) => {
                          return (
                            <Text
                              key={i}
                              style={{
                                // padding: 10,
                                paddingTop:
                                  i == 0 ? 5 : i == 1 ? 15 : i == 2 ? 12 : 7,
                                height:
                                  i == 0 ? 22 : i == 1 ? 41 : i == 2 ? 37 : 25,
                                textAlign: "center",
                                width: "100%",
                                borderRight: "1px solid black",
                                borderTop: "1px solid black",
                                backgroundColor: resin?.colour,
                                color: "#fff",
                              }}
                            >
                              {Math.floor(val)}
                            </Text>
                          );
                        })}
                      </View>
                    );
                  })}
                </View>
                {/* Max table */}
                <View
                  style={{
                    width: "20%",
                    borderBottom: "1px solid black",
                  }}
                >
                  <Text
                    style={{
                      padding: 3,
                      paddingBottom: 0,
                      paddingTop: 4,
                      height: 20,
                      textAlign: "center",
                      fontSize: 8,
                      borderRight: "1px solid black",
                      color: "grey",
                    }}
                  >
                    <Text
                      style={{
                        width: 5,
                        height: 5,
                        backgroundColor: "red",
                      }}
                    />
                    MAX
                  </Text>
                  {Array.from({ length: 4 }).map((_, i) => {
                    const styles = [
                      { paddingTop: 5, height: 22 },
                      { paddingTop: 15, height: 41 },
                      { paddingTop: 12, height: 37 },
                      { paddingTop: 7, height: 25 },
                    ];
                    return (
                      <Text
                        key={i}
                        style={{
                          ...styles[i],
                          textAlign: "center",
                          width: "100%",
                          borderRight: "1px solid black",
                          borderTop: "1px solid black",
                        }}
                      >
                        120
                      </Text>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>

          <Text
            style={{
              fontSize: 10,
              marginBottom: 10,
              marginTop: 30,
              lineHeight: 2,
              color: "#00000090",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 5,
            }}
          >
            <Text
              style={{
                color: "#000",
                marginLeft: "5px",
                marginTop: "20px",
                marginRight: "5px",
              }}
            >
              {biggestProcessWindow && biggestProcessWindow?.highest?.name}
              {/* {inputData?.materialInfo?.resins[1]} */}
            </Text>{" "}
            is shown to have a{" "}
            <Text
              style={{ color: "#000", marginLeft: "5px", marginRight: "5px" }}
            >
              largest temperature processing window
            </Text>{" "}
            {biggestProcessWindow?.highest && (
              <>
                ({biggestProcessWindow.highest.listBlowTemp[1].toFixed(2)}{" "}
                &deg;C and {"  "}
                {biggestProcessWindow.highest.listBlowTemp[3].toFixed(2)} &deg;C
                for label and base sections respectively) when compared to the
                other selected resins
              </>
            )}{" "}
            <Text
              style={{ color: "#000", marginLeft: "5px", marginRight: "5px" }}
            >
              {"  "}
              {biggestProcessWindow?.lowest?.name}
            </Text>{" "}
            is shown to have a{" "}
            <Text
              style={{ color: "#000", marginLeft: "5px", marginRight: "5px" }}
            >
              reduced
            </Text>{" "}
            processing range across all sections (
            {biggestProcessWindow?.lowest?.listBlowTemp[1]?.toFixed(2)} &deg;C
            for label and {"  "}
            {biggestProcessWindow?.lowest?.listBlowTemp[3]?.toFixed(2)} &deg;C
            for base).
          </Text>
          <Text
            style={{
              fontSize: 10,
              marginBottom: 10,
              lineHeight: 2,
              color: "#00000090",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 5,
            }}
          >
            See the chosen resins ranked below in descending order of largest
            processing window to smallest, based on the base section of the
            chosen geometry:
          </Text>
          <View
            style={{
              fontSize: 10,
              marginBottom: 10,
              lineHeight: 2,
              color: "#00000090",
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {Object.entries(biggestProcessWindow)?.map(
              ([key, value], index) => (
                <Text key={key}>
                  {index + 1}. {value?.name || "N/A"}
                </Text>
              )
            )}
          </View>
        </View>
      </Page>

      {/* Charts Pages */}
      <Page size="A4" style={{ padding: "30px 60px" }}>
        <View
          style={{
            margin: "15px 0",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            PERFORMANCE - MODULUS
          </Text>
          <View style={styles.Divider} />

          <Text
            style={{
              fontSize: 10,
              marginBottom: 10,
              lineHeight: 2,
              color: "#00000090",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 5,
            }}
          >
            The Young&apos;s Modulus of a resin generally has a positive
            correlation with performance metrics such as top load and burst. See
            the chosen resins ranked below in descending order of largest
            Young’s Modulus to smallest, based on the calculated Equivalent
            Stretch Ratio (EQSR) of the chosen preform-bottle pair geometry –
            percentage values calculated based off the value for Young’s Modulus
            of the reference resin:
          </Text>

          <View
            style={{
              fontSize: 10,
              lineHeight: 2,
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {Modulus?.map((resin: any, index: any) => (
              <DarkText
                key={index}
                text={`  ${index + 1}. ${resin?.Resin}${
                  resin?.Resin === inputData?.materialInfo?.reference_resin[0]
                    ? " - (reference - 100%)"
                    : ` - ${resin.CompareScore}%`
                }`}
              />
            ))}
          </View>

          {chosenLessThanModulusResins?.length > 0 && (
            <Text
              style={{
                fontSize: 10,
                marginBottom: 10,
                marginTop: 20,
                lineHeight: 2,
                color: "#00000090",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 5,
              }}
            >
              Local similarity scores with{" "}
              <DarkText text="less than a 10% difference" /> calculated between
              the{" "}
              <DarkText
                text={`reference resin ${inputData.materialInfo?.reference_resin[0]}`}
              />{" "}
              and{" "}
              <DarkText
                text={`chosen resins ${chosenLessThanModulusResins?.join(
                  ", "
                )}`}
              />
              , for the selected geometry, would suggest the{" "}
              <DarkText text="post-forming performance will be comparable" />{" "}
              across all selected resins.
            </Text>
          )}

          {chosenGreaterThanModulusResins &&
            Array.isArray(chosenGreaterThanModulusResins) &&
            chosenGreaterThanModulusResins.length > 0 && (
              <Text
                style={{
                  fontSize: 10,
                  marginBottom: 10,
                  marginTop: 10,
                  lineHeight: 2,
                  color: "#00000090",
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 5,
                }}
              >
                Local similarity scores with{" "}
                <DarkText text="greater than a 10% difference" /> calculated
                between the{" "}
                <DarkText
                  text={`reference resin ${inputData.materialInfo?.reference_resin[0]}`}
                />{" "}
                and{" "}
                <DarkText
                  text={`chosen resins ${chosenGreaterThanModulusResins.join(
                    ", "
                  )}`}
                />
                , for the selected geometry, would suggest the{" "}
                <DarkText text="post-forming performance will be comparable" />{" "}
                across all selected resins.
              </Text>
            )}

          <Text
            style={{
              fontSize: 10,
              marginBottom: 10,
              lineHeight: 2,
              color: "#00000090",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 5,
            }}
          >
            See below a table comparing the global similarity of modulus
            behaviour across all EQSR values for the chosen resins. The capacity
            for a chosen resin to match the modulus behaviour of the reference
            is also shown through the required EQSR calculated to meet the
            reference resin Young’s Modulus for the chosen geometry:
          </Text>

          <View
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #000",
              fontSize: 10,
            }}
          >
            {/* Row 1 */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                height: "35px",
              }}
            >
              <Text
                style={{
                  flex: 1,
                  padding: 5,
                  borderRight: "1px solid #000",
                  borderBottom: "1px solid #000",
                  textAlign: "center",
                }}
              ></Text>
              <Text
                style={{
                  flex: 1,
                  padding: 5,
                  borderRight: "1px solid #000",
                  borderBottom: "1px solid #000",
                  textAlign: "center",
                }}
              >
                <DarkText
                  header
                  text={`Global similarity score against reference (${inputData.materialInfo?.reference_resin[0]})`}
                />
              </Text>
              <Text
                style={{
                  flex: 1,
                  padding: 5,
                  borderBottom: "1px solid #000",
                  textAlign: "center",
                }}
              >
                {" "}
                <DarkText
                  header
                  text={`EQSR required to match modulus of reference (ref. EQSR = 4 `}
                  // ${
                  //   graphData?.ModulusPlotData?.ModulusGraph
                  //     ? graphData?.ModulusPlotData?.ModulusGraph[
                  //         inputData?.materialInfo?.reference_resin[0]
                  //       ]?.referenceStress?.toFixed(2)
                  //     : "4.0"
                  //   })
                />
              </Text>
            </View>

            {/* Row 2 */}
            {graphData?.ModulusPlotData?.ModulusGraph?.length > 0 ? (
              graphData?.ModulusPlotData?.ModulusGraph?.filter(
                (resin: any) =>
                  resin.Resin !== inputData?.materialInfo?.reference_resin[0]
              )?.map((item: any, i: number) => {
                return (
                  <View
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      height: "35px",
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        padding: 10,
                        borderRight: "1px solid #000",
                        borderBottom: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      {item.Resin}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        padding: 10,
                        borderRight: "1px solid #000",
                        borderBottom: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      {/* {item.Similarity
                        ? (
                            100 - Number(item?.Similarity?.replace("%", ""))
                          ).toFixed(2)
                        : "N/A"} */}
                      {item?.Similarity}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        padding: 10,
                        borderBottom: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      {item.referenceStress?.toFixed(2)}
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text
                style={{ paddingTop: 10, paddingBottom: 10, marginLeft: 150 }}
              >
                No Performance Modulus Data Found
              </Text>
            )}
          </View>
        </View>

        <View
          style={{
            margin: "15px 0",
          }}
        >
          {graphData?.ModulusPlotData?.ModulusGraph?.filter((resin: any) =>
            resin.Resin !== inputData?.materialInfo?.reference_resin[0] &&
            typeof resin?.Similarity === "string"
              ? Number(resin?.Similarity.replace("%", "")) < 95 &&
                Number(resin?.Similarity.replace("%", "")) !== 1
              : Number(resin?.Similarity) < 95 &&
                Number(resin?.Similarity) !== 1
          ).length > 0 && (
            <Text
              style={{
                fontSize: 10,
                marginBottom: 10,
                lineHeight: 2,
                color: "#00000090",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 5,
              }}
            >
              A <DarkText text="similar finding" /> is shown for the{" "}
              <DarkText text="global modulus similarity scores" /> (&lt; 95%)
              across the chosen resins and imply that the top load and burst
              performance of the{" "}
              <DarkText
                text={graphData?.ModulusPlotData?.ModulusGraph?.filter(
                  (resin: any) =>
                    resin.Resin !==
                      inputData?.materialInfo?.reference_resin[0] &&
                    typeof resin?.Similarity === "string"
                      ? Number(resin?.Similarity.replace("%", "")) < 95 &&
                        Number(resin?.Similarity.replace("%", "")) !== 1
                      : Number(resin?.Similarity) < 95 &&
                        Number(resin?.Similarity) !== 1
                )
                  ?.map((item: any) => item.Resin)
                  ?.join(", ")}
              />{" "}
              resin will not be equivalent to the reference{" "}
              <DarkText text={inputData?.materialInfo?.reference_resin[0]} />{" "}
              resin, for the majority of preform bottle pair geometries
            </Text>
          )}
          {graphData?.ModulusPlotData?.ModulusGraph?.filter((resin: any) =>
            resin.Resin !== inputData?.materialInfo?.reference_resin[0] &&
            typeof resin?.Similarity === "string"
              ? Number(resin?.Similarity.replace("%", "")) >= 95 &&
                Number(resin?.Similarity.replace("%", "")) !== 1
              : Number(resin?.Similarity) >= 95 &&
                Number(resin?.Similarity) !== 1
          ).length > 0 && (
            <Text
              style={{
                fontSize: 10,
                marginBottom: 10,
                lineHeight: 2,
                color: "#00000090",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 5,
              }}
            >
              <DarkText text={"The Global Modulus Similarity Scores"} /> (&gt;
              95%) across the chosen resins and imply that the top load and
              burst performance of the{" "}
              <DarkText
                text={graphData?.ModulusPlotData?.ModulusGraph?.filter(
                  (resin: any) =>
                    resin.Resin !==
                      inputData?.materialInfo?.reference_resin[0] &&
                    typeof resin?.Similarity === "string"
                      ? Number(resin?.Similarity.replace("%", "")) >= 95 &&
                        Number(resin?.Similarity.replace("%", "")) !== 1
                      : Number(resin?.Similarity) >= 95 &&
                        Number(resin?.Similarity) !== 1
                )
                  ?.map((item: any) => item.Resin)
                  ?.join(", ")}
              />{" "}
              resin will generally be equivalent to the reference{" "}
              <DarkText text={inputData?.materialInfo?.reference_resin[0]} />{" "}
              resin, for the majority of preform bottle pair geometries
            </Text>
          )}
        </View>
      </Page>

      {/* Performance - Long Term Modulus */}
      <Page size="A4" style={{ padding: "30px 60px" }}>
        <View
          style={{
            margin: "15px 0",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            PERFORMANCE - LONG TERM MODULUS
          </Text>
          <View style={styles.Divider} />
          <Text
            style={{
              fontSize: 10,
              marginBottom: 10,
              lineHeight: 2,
              color: "#00000090",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 5,
            }}
          >
            Long-term modulus indicates the thermal stability of the chosen
            resin, with larger expansion behaviour expected as the measured
            modulus decreases. See the chosen resins ranked below in descending
            order of largest long-term modulus to smallest, based on the
            calculated stress experienced by the chosen preform-bottle pair
            geometry – percentage values calculated based off the value for
            long-term modulus of the reference resin:
          </Text>
          <View
            style={{
              fontSize: 10,
              lineHeight: 2,
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {LongModulus?.map((resin: any, index: any) => (
              <DarkText
                key={index}
                text={`  ${index + 1}. ${resin?.Resin}${
                  resin?.Resin === inputData?.materialInfo?.reference_resin[0]
                    ? " - (reference - 100%)"
                    : ` - ${resin.CompareScore}%`
                }`}
              />
            ))}
          </View>
          {chosenLessLongTermModulusResins && (
            <Text
              style={{
                fontSize: 10,
                marginBottom: 10,
                marginTop: 20,
                lineHeight: 2,
                color: "#00000090",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 5,
              }}
            >
              {/* //TODO  calculate similar resins */}
              <DarkText text="Equivalency" /> (difference &lt; 10%) in long-term
              modulus would suggest{"  "}
              <DarkText text={`similar thermal expansions`} /> to be associated
              with the{" "}
              <DarkText
                text={`${chosenLessLongTermModulusResins?.join(", ")}`}
              />
              resin when compared to the reference resin.
            </Text>
          )}
          {graphData?.CreepPlotdata?.Creep?.filter(
            (resin: any) =>
              resin.Resin !== inputData?.materialInfo?.reference_resin[0] &&
              Number(resin.Similarity) >= 90
          )?.length === 0 && (
            <Text
              style={{
                fontSize: 10,
                marginBottom: 10,
                marginTop: 10,
                lineHeight: 2,
                color: "#00000090",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 5,
              }}
            >
              Not having equivalency in global similarity score would imply that
              the thermal stability performance of the selected resins{" "}
              <DarkText text={chosenGreaterLongTermModulusResins?.join(", ")} />{" "}
              would not perform similarly to the reference resin (
              <DarkText text={inputData?.materialInfo?.reference_resin[0]} />
              ).
            </Text>
          )}
          <Text
            style={{
              fontSize: 10,
              marginBottom: 10,
              lineHeight: 2,
              color: "#00000090",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 5,
            }}
          >
            See below a table comparing the global similarity of long-term
            modulus behaviour across all stress values for the chosen resins.
            The capacity for a chosen resin to match the long-term modulus
            behaviour of the reference is also shown through the calculated
            required thickness increase to meet the reference resin long-term
            modulus for the chosen bottle geometry:
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #000",
              fontSize: 10,
            }}
          >
            {/* Row 1 */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                height: "35px",
              }}
            >
              <Text
                style={{
                  flex: 1,
                  padding: 5,
                  borderRight: "1px solid #000",
                  borderBottom: "1px solid #000",
                  textAlign: "center",
                }}
              ></Text>
              <Text
                style={{
                  flex: 1,
                  padding: 5,
                  borderRight: "1px solid #000",
                  borderBottom: "1px solid #000",
                  textAlign: "center",
                }}
              >
                <DarkText
                  header
                  text={`Global similarity score against reference (${inputData.materialInfo?.reference_resin[0]})`}
                />
              </Text>
              <Text
                style={{
                  flex: 1,
                  padding: 5,
                  borderBottom: "1px solid #000",
                  textAlign: "center",
                }}
              >
                {" "}
                <DarkText
                  header
                  text={`Thickness change required to match ref creep behaviour *`}
                />
              </Text>
            </View>

            {/* Row 2 */}
            {graphData?.CreepPlotdata?.Creep?.length > 0 ? (
              graphData?.CreepPlotdata?.Creep?.filter(
                (resin: any) =>
                  resin.Resin !== inputData?.materialInfo?.reference_resin[0]
              )?.map((item: any, i: number) => {
                // // console.log(item);
                return (
                  <View
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      height: "35px",
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        padding: 10,
                        borderRight: "1px solid #000",
                        borderBottom: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      {item.Resin}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        padding: 10,
                        borderRight: "1px solid #000",
                        borderBottom: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      {item.Similarity}%
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        padding: 10,
                        borderBottom: "1px solid #000",
                        textAlign: "center",
                      }}
                    >
                      {item.referenceStress?.toFixed(2)}
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text
                style={{ paddingTop: 10, paddingBottom: 10, marginLeft: 150 }}
              >
                No Process Window Data Found
              </Text>
            )}
          </View>
          <Text
            style={{
              fontSize: 10,
              marginBottom: 10,
              color: "#00000090",
            }}
          >
            *calculations based on idealisations of pressure applied and bottle
            geometry
          </Text>
        </View>

        {graphData?.CreepPlotdata?.Creep?.filter(
          (resin: any) =>
            resin.Resin !== inputData?.materialInfo?.reference_resin[0] &&
            Number(resin.Similarity) >= 90
        ).length > 0 && (
          <View
            style={{
              margin: "15px 0",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                marginBottom: 10,
                lineHeight: 2,
                color: "#00000090",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 5,
              }}
            >
              <DarkText text="Equivalency in global similarity score" /> would
              imply that the <DarkText text="thermal stability performance" />{" "}
              of the selected resins would{" "}
              <DarkText text="perform similar to the" /> reference resin{"  "}
              {inputData.materialInfo?.reference_resin[0]} for the{" "}
              <DarkText text="majority of preform-bottle pair geometries." />
            </Text>
          </View>
        )}
      </Page>

      <Page size="A4" style={{ padding: "30px 60px" }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          RESIN SUMMARY
        </Text>
        <View style={styles.Divider} />
        <Text
          style={{
            fontSize: 10,
            marginBottom: 10,
            lineHeight: 2,
            color: "#00000090",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 5,
          }}
        >
          In summary, enclosed within this report is a comparison of the resin
          performance of {inputData?.materialInfo?.reference_resin[0]}{" "}
          (reference) and {inputData?.materialInfo?.resins.join(", ")}
          for the chosen preform-bottle pair geometry and processing conditions.
        </Text>
        <Text
          style={{
            fontSize: 10,
            marginBottom: 10,
            lineHeight: 2,
            color: "#00000090",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 5,
          }}
        >
          Investigation into the processing windows of the individual resins
          highlighted the {biggestProcessWindow.highest?.name} resin to rank the
          highest.{" "}
          {graphData?.ResinsWithourSurrogateModels?.length > 0 && (
            <DarkText
              text={`“Pearlescence behaviour was not investigated for ${graphData?.ResinsWithourSurrogateModels?.join(
                ", "
              )}”`}
            />
          )}{" "}
          Pearlescence behaviour is expected to be mitigated, indicating
          particular ease of use and flexibility in future preform-bottle
          geometry selection.
        </Text>
        <Text
          style={{
            fontSize: 10,
            marginBottom: 10,
            lineHeight: 2,
            color: "#00000090",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 5,
          }}
        >
          The Young’s Modulus of {chosenLessLongTermModulusResins?.join(", ")}{" "}
          (reference) was shown to be the greatest amongst the chosen resins for
          the preform-bottle pair, indicating the best top load and burst
          performance to be associated with this resin. Equivalency is shown
          between the reference and chosen resin, indicating that similar
          post-processing performance behaviour would be expected.
        </Text>
        <Text
          style={{
            fontSize: 10,
            marginBottom: 10,
            lineHeight: 2,
            color: "#00000090",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 5,
          }}
        >
          The long-term modulus of {chosenLessLongTermModulusResins?.join(", ")}{" "}
          (reference) was shown to be the greatest amongst the chosen resins for
          the preform-bottle pair, indicating expansions associated with thermal
          stability to be the least. Equivalency is shown between the reference
          and chosen resin, indicating that similar thermal stability
          performance behaviour would be expected.
        </Text>
      </Page>

      {/* Performance Overview inputData Table */}
      <Page size="A4" style={{ padding: "30px 60px", position: "relative" }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          PERFORMANCE - OVERVIEW
        </Text>
        <View style={styles.Divider} />
        <Text
          style={{
            fontSize: 10,
            marginBottom: 10,
            lineHeight: 2,
            color: "#00000090",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 5,
          }}
        >
          Presented in this report is a comparison of the forming and
          performance behaviours of the selected rPET resins:{" "}
          {/* <DarkText
            // (0.791 IV)
            text={`${inputData?.materialInfo?.reference_resin[0]} `}
          />{" "}
          and{" "} */}
          <DarkText
            // (0.793 IV)
            text={`${resinWithIV?.join(", ")} `}
          />
        </Text>
        <Text
          style={{
            fontSize: 10,
            marginBottom: 10,
            lineHeight: 2,
            color: "#00000090",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 5,
          }}
        >
          Shown below is a table of the inputted material, preform, bottle and
          forming parameter information in which representative stretch ratios
          and characteristic models are calculated:
        </Text>

        {/* Bottle Table */}

        <View
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "row",
            border: "1px solid #000",
            fontSize: 10,
            height: "35px",
          }}
        >
          {/* Header Row */}
          <Text
            style={{
              flex: 2,
              padding: 3,
              paddingTop: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            <DarkText header text="Geometry" />
          </Text>
          <Text
            style={{
              flex: 3,
              padding: 5,
              paddingTop: 10,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            <DarkText header text="Forming Parameters" />
          </Text>
        </View>

        {/* Sub-header Row */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            borderBottom: "1px solid #000",
            fontSize: 10,
            height: "35px",
            fontWeight: "bold",
          }}
        >
          <Text
            style={{
              flex: 1,
              padding: 10,
              paddingTop: 10,
              borderRight: "1px solid #000",
              borderLeft: "1px solid #000",
              textAlign: "center",
            }}
          >
            <DarkText header text="Bottle" />
          </Text>
          <Text
            style={{
              flex: 1,
              padding: 10,
              paddingTop: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
            }}
          >
            <DarkText header text="Preform" />
          </Text>
          <Text
            style={{
              flex: 1,
              padding: 10,
              paddingTop: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
            }}
          >
            <DarkText header text="Mass Flow Rate" />
          </Text>
          <Text
            style={{
              flex: 1,
              padding: 10,
              paddingTop: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
            }}
          >
            <DarkText header text="Stretch Rod Speed" />
          </Text>
          <Text
            style={{
              flex: 1,
              padding: 10,
              paddingTop: 10,
              textAlign: "center",
              borderRight: "1px solid #000",
            }}
          >
            <DarkText header text="Gas Volume" />
          </Text>
        </View>

        {/* BottleData Row */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            borderBottom: "1px solid #000",
            fontSize: 10,
            height: "35px",
          }}
        >
          <Text
            style={{
              flex: 1,
              padding: 10,
              borderRight: "1px solid #000",
              borderLeft: "1px solid #000",
              textAlign: "center",
              color: "#000",
            }}
          >
            {inputData?.materialInfo?.bottle}
          </Text>
          <Text
            style={{
              flex: 1,
              padding: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
              color: "#000",
            }}
          >
            {`${inputData?.materialInfo?.preform} g`}
          </Text>
          <Text
            style={{
              flex: 1,
              padding: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
              color: "#000",
            }}
          >
            {inputData?.materialInfo?.massFlowRate
              ? inputData?.materialInfo?.massFlowRate
              : "20"}{" "}
            g/s
          </Text>
          <Text
            style={{
              flex: 1,
              padding: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
              color: "#000",
            }}
          >
            {inputData?.materialInfo?.stretchRodSpeed
              ? inputData?.materialInfo?.stretchRodSpeed
              : "1.3"}{" "}
            m/s
          </Text>
          <Text
            style={{
              flex: 1,
              padding: 10,
              textAlign: "center",
              color: "#000",
              borderRight: "1px solid #000",
            }}
          >
            {inputData?.creepParameters?.gasVolume
              ? inputData?.creepParameters?.gasVolume
              : "NA"}{" "}
            GV
          </Text>
        </View>

        {/* Section Weights */}
        <View
          style={{
            marginTop: 20,
            display: "flex",
            width: "100%",
            flexDirection: "row",
            border: "1px solid #000",
            fontSize: 10,
            height: "35px",
          }}
        >
          {/* Header Row */}
          <Text
            style={{
              flex: 2,
              padding: 3,
              paddingTop: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            <DarkText header text="Section Weights (g)" />
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            borderBottom: "1px solid #000",
            fontSize: 10,
            height: "35px",
            fontWeight: "bold",
          }}
        >
          <Text
            style={{
              flex: 1,
              padding: 10,
              paddingTop: 10,
              borderRight: "1px solid #000",
              borderLeft: "1px solid #000",
              textAlign: "center",
            }}
          >
            <DarkText header text="Shoulder" />
          </Text>
          <Text
            style={{
              flex: 1,
              padding: 10,
              paddingTop: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
            }}
          >
            <DarkText header text="label" />
          </Text>
          <Text
            style={{
              flex: 1,
              padding: 10,
              paddingTop: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
            }}
          >
            <DarkText header text="Grip" />
          </Text>
          <Text
            style={{
              flex: 1,
              padding: 10,
              paddingTop: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
            }}
          >
            <DarkText header text="Base" />
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            borderBottom: "1px solid #000",
            fontSize: 10,
            height: "35px",
            fontWeight: "bold",
          }}
        >
          <Text
            style={{
              flex: 1,
              padding: 10,
              borderRight: "1px solid #000",
              borderLeft: "1px solid #000",
              textAlign: "center",
            }}
          >
            <DarkText
              text={`${inputData?.bottleMeasurement?.sectionWeights?.shoulder} g`}
            />
          </Text>
          <Text
            style={{
              flex: 1,
              padding: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
            }}
          >
            <DarkText
              text={`${inputData?.bottleMeasurement?.sectionWeights?.label} g`}
            />
          </Text>
          <Text
            style={{
              flex: 1,
              padding: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
            }}
          >
            <DarkText
              text={`${inputData?.bottleMeasurement?.sectionWeights?.grip} g`}
            />
          </Text>
          <Text
            style={{
              flex: 1,
              padding: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
            }}
          >
            <DarkText
              text={`${inputData?.bottleMeasurement?.sectionWeights?.base} g`}
            />
          </Text>
        </View>

        {/* Thickness (mm) */}
        <View
          style={{
            marginTop: 20,
            display: "flex",
            width: "100%",
            flexDirection: "row",
            border: "1px solid #000",
            fontSize: 10,
            height: "35px",
          }}
        >
          {/* Header Row */}
          <Text
            style={{
              flex: 2,
              padding: 3,
              paddingTop: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            <DarkText header text="Section Weights (g)" />
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            borderBottom: "1px solid #000",
            fontSize: 10,
            height: "35px",
            fontWeight: "bold",
          }}
        >
          <Text
            style={{
              flex: 1,
              padding: 10,
              paddingTop: 10,
              borderRight: "1px solid #000",
              borderLeft: "1px solid #000",
              textAlign: "center",
            }}
          >
            <DarkText header text="T1" />
          </Text>
          <Text
            style={{
              flex: 1,
              padding: 10,
              paddingTop: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
            }}
          >
            <DarkText header text="T2" />
          </Text>
          <Text
            style={{
              flex: 1,
              padding: 10,
              paddingTop: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
            }}
          >
            <DarkText header text="T3" />
          </Text>
          <Text
            style={{
              flex: 1,
              padding: 10,
              paddingTop: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
            }}
          >
            <DarkText header text="T4" />
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            borderBottom: "1px solid #000",
            fontSize: 10,
            height: "35px",
            fontWeight: "bold",
          }}
        >
          <Text
            style={{
              flex: 1,
              padding: 10,
              borderRight: "1px solid #000",
              borderLeft: "1px solid #000",
              textAlign: "center",
            }}
          >
            <DarkText
              text={`${inputData?.bottleMeasurement?.thickness?.t1} mm`}
            />
          </Text>
          <Text
            style={{
              flex: 1,
              padding: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
            }}
          >
            <DarkText
              text={`${inputData?.bottleMeasurement?.thickness?.t2} mm`}
            />
          </Text>
          <Text
            style={{
              flex: 1,
              padding: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
            }}
          >
            <DarkText
              text={`${inputData?.bottleMeasurement?.thickness?.t3} mm`}
            />
          </Text>
          <Text
            style={{
              flex: 1,
              padding: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
            }}
          >
            <DarkText
              text={`${inputData?.bottleMeasurement?.thickness?.t4} mm`}
            />
          </Text>
        </View>
        <View
          style={{
            position: "absolute",
            right: 220,
            bottom: 20,
          }}
        >
          <Image
            style={{
              width: 180,
            }}
            src={bottle}
          />
        </View>
      </Page>

      <Page size="A4" style={{ padding: "30px 60px" }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          PERFORMANCE - METRICS
        </Text>
        <View style={styles.Divider} />
        <Text
          style={{
            fontSize: 10,
            marginBottom: 10,
            lineHeight: 2,
            color: "#00000090",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 5,
          }}
        >
          Presented in this radar plot is a comparison of the performance
          metrics of the selected rPET resins:{" "}
          {inputData?.materialInfo?.resins.join(",")} (0.791 IV) and{" "}
          {inputData?.materialInfo?.reference_resin[0]} (0.793 IV) compared to
          the PepsiCo GPPS values.
        </Text>
        <View
          style={{
            marginTop: 0,
            marginBottom: 10,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {radialGraph && (
            <Image
              style={{
                width: "100%", // Ensure it takes up the full width of its container
                height: "auto", // Automatically scale the height to preserve aspect ratio\
                transform: "scale(1.3)", // Scale the image by 1.3 times (adjust as needed)
                transformOrigin: "center", // Scale from the centertransform: "scale(1.3)", // Scale the image by 1.3 times (adjust as needed)
                objectFit: "contain", // Ensure the image fits within its container without cropping
              }}
              src={radialGraph}
            />
          )}
        </View>

        <Text
          style={{
            fontSize: 10,
            marginBottom: 10,
            lineHeight: 2,
            color: "#00000090",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 5,
          }}
        >
          Shown below are the metrics for Empty Top Load (ETL), Filled Top Load
          (FTL), Thermal Stability, Burst Pressure and Burst Volume for GPPS
          (shown in grey) and for the selected rPET resins:{" "}
          <DarkText
            text={performanceData
              ?.filter((item: any) => item.Resin !== "GPPS")
              ?.map((resin: any) => resin.Resin)
              ?.join(", ")}
          />{" "}
          colour coded by safety factor.
        </Text>
        <View
          style={{
            marginTop: 40,
            marginBottom: 30,
            width: "100%",
            height: 250,
          }}
        >
          {performanceMetrics && (
            <Image
              style={{
                width: "100%", // Make the image scale to the width of the container
                height: "auto", // Adjust the height automatically to maintain aspect ratio
                objectFit: "contain", // Ensure the aspect ratio is preserved
                transform: "scale(1.3)", // Scale the image by 1.3 times (adjust as needed)
                transformOrigin: "center", // Scale from the center
              }}
              src={performanceMetrics}
            />
          )}
        </View>
      </Page>

      <Page size="A4" style={{ padding: "30px 60px" }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            borderTop: "1px solid #000",
            borderBottom: "1px solid #000",
            fontSize: 10,
            height: "35px",
            fontWeight: "bold",
          }}
        >
          <Text
            style={{
              flex: 1,
              paddingTop: 10,
              borderRight: "1px solid #000",
              borderLeft: "1px solid #000",
              textAlign: "center",
              color: "grey",
            }}
          >
            <DarkText header text="Resins" />
          </Text>
          <Text
            style={{
              flex: 1,
              paddingTop: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
              color: "grey",
            }}
          >
            <DarkText header text="ETL" />
          </Text>
          <Text
            style={{
              flex: 1,
              paddingTop: 10,
              borderRight: "1px solid #000",
              textAlign: "center",
              color: "grey",
            }}
          >
            <DarkText header text="FTL" />
          </Text>
          <Text
            style={{
              flex: 1,
              paddingTop: 10,

              borderRight: "1px solid #000",
              textAlign: "center",
              color: "grey",
            }}
          >
            <DarkText header text="TS" />
          </Text>
          <Text
            style={{
              flex: 1,
              paddingTop: 5,

              borderRight: "1px solid #000",
              textAlign: "center",
              color: "grey",
            }}
          >
            <DarkText header text="Burst\nPressure" />
          </Text>
          <Text
            style={{
              flex: 1,
              paddingTop: 5,
              borderRight: "1px solid #000",
              textAlign: "center",
              color: "grey",
            }}
          >
            <DarkText header text="Burst\nVolume" />
          </Text>
        </View>

        {performanceData?.length > 0 &&
          performanceData
            ?.filter((item: any) => item.Resin !== "GPPS")
            ?.map((resin: any, i: number) => {
              const referenceData = performanceData.filter(
                (item: any) =>
                  item.Resin == inputData?.materialInfo?.reference_resin[0]
              )[0];

              return (
                <View
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    borderBottom: "1px solid #000",
                    fontSize: 10,
                    height: "35px",
                    fontWeight: "bold",
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      padding: 5,
                      paddingTop: 10,
                      borderRight: "1px solid #000",
                      borderLeft: "1px solid #000",
                      textAlign: "center",
                      fontSize: 8,
                    }}
                  >
                    <DarkText smallFont text={resin.Resin} />
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      padding: 5,
                      paddingTop: 10,
                      borderRight: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    <DarkText
                      text={
                        resin.Resin ===
                        inputData?.materialInfo?.reference_resin[0]
                          ? "100%"
                          : resin?.ETL && referenceData?.ETL
                          ? ((referenceData.ETL / resin.ETL) * 100)
                              .toFixed(2)
                              .toString() + "%"
                          : "N/A" // Provide a fallback if the values are invalid
                      }
                    />
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      padding: 5,
                      paddingTop: 10,
                      borderRight: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    <DarkText
                      text={
                        resin.Resin ===
                        inputData?.materialInfo?.reference_resin[0]
                          ? "100%"
                          : resin?.FTL && referenceData?.FTL
                          ? ((referenceData?.FTL / resin?.FTL) * 100)
                              ?.toFixed(2)
                              ?.toString() + "%"
                          : "N/A"
                      }
                    />
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      padding: 5,
                      paddingTop: 10,
                      borderRight: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    <DarkText
                      text={
                        resin.Resin ===
                        inputData?.materialInfo?.reference_resin[0]
                          ? "100%"
                          : resin?.ThermalStability &&
                            referenceData?.ThermalStability
                          ? (
                              (referenceData?.ThermalStability /
                                resin?.ThermalStability) *
                              100
                            )
                              ?.toFixed(2)
                              ?.toString() + "%"
                          : "N/A"
                      }
                    />
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      padding: 5,
                      paddingTop: 10,
                      borderRight: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    <DarkText
                      text={
                        resin.Resin ===
                        inputData?.materialInfo?.reference_resin[0]
                          ? "100%"
                          : resin?.Burst && referenceData?.Burst
                          ? ((referenceData?.Burst / resin?.Burst) * 100)
                              ?.toFixed(2)
                              ?.toString() + "%"
                          : "N/A"
                      }
                    />
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      padding: 5,
                      paddingTop: 10,
                      borderRight: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    <DarkText
                      text={
                        resin.Resin ===
                        inputData?.materialInfo?.reference_resin[0]
                          ? "100%"
                          : resin?.BurstVolume && referenceData?.BurstVolume
                          ? (
                              (referenceData?.BurstVolume /
                                resin?.BurstVolume) *
                              100
                            )
                              ?.toFixed(2)
                              ?.toString() + "%"
                          : "N/A"
                      }
                    />
                  </Text>
                </View>
              );
            })}
      </Page>

      {csvData?.length > 0 && (
        <Page size="A4" style={{ padding: "30px 60px" }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            DAK - SC
          </Text>
          <View style={styles.Divider} />

          {/* Main Header */}
          <View
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "row",
              border: "1px solid #000",
              fontSize: 10,
              marginTop: 30,
              height: "35px",
            }}
          >
            <Text
              style={{
                flex: 1,
                padding: 10,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              <DarkText header text="BVF Data Collection" />
            </Text>
          </View>

          {/* Sub Headers */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              borderBottom: "1px solid #000",
              borderLeft: "1px solid #000",
              fontSize: 10,
              height: "35px",
              fontWeight: "bold",
            }}
          >
            <Text
              style={{
                flex: 4,
                padding: 5,
                borderRight: "1px solid #000",
                textAlign: "center",
              }}
            >
              <DarkText header text="BVF Section Weights (g)" />
            </Text>
            <Text
              style={{
                flex: 5,
                padding: 5,
                textAlign: "center",
                borderRight: "1px solid #000",
              }}
            >
              <DarkText header text="Predicted Performance" />
            </Text>
          </View>

          {/* Units Row */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              borderBottom: "1px solid #000",
              borderLeft: "1px solid #000",
              fontSize: 10,
              height: "35px",
            }}
          >
            <Text style={styles.unitCell}>
              <DarkText header text="(g)" />
            </Text>
            <Text style={styles.unitCell}>
              <DarkText header text="(g)" />
            </Text>
            <Text style={styles.unitCell}>
              <DarkText header text="(g)" />
            </Text>
            <Text style={styles.unitCell}>
              <DarkText header text="(g)" />
            </Text>
            <Text style={styles.unitCell}>
              <DarkText header text="(lbf)" />
            </Text>
            <Text style={styles.unitCell}>
              <DarkText header text="(lbf)" />
            </Text>
            <Text style={styles.unitCell}>
              <DarkText header text="(%)" />
            </Text>
            <Text style={styles.unitCell}>
              <DarkText header text="(psi)" />
            </Text>
            <Text style={styles.unitCell}>
              <DarkText header text="(%)" />
            </Text>
          </View>

          {/* Column Headers */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              borderBottom: "1px solid #000",
              borderLeft: "1px solid #000",
              fontSize: 10,
              height: "35px",
              fontWeight: "bold",
            }}
          >
            <Text style={styles.headerCell}>
              <DarkText header text="Shoulder" />
            </Text>
            <Text style={styles.headerCell}>
              <DarkText header text="Label" />
            </Text>
            <Text style={styles.headerCell}>
              <DarkText header text="Grip" />
            </Text>
            <Text style={styles.headerCell}>
              <DarkText header text="Base" />
            </Text>
            <Text style={styles.headerCell}>
              <DarkText header text="ETL" />
            </Text>
            <Text style={styles.headerCell}>
              <DarkText header text="FTL" />
            </Text>
            <Text style={styles.headerCell}>
              <DarkText header text="TS" />
            </Text>
            <Text style={styles.headerCell}>
              <DarkText header text="Burst\nPressure" />
            </Text>
            <Text style={styles.headerCell}>
              <DarkText header text="Burst\nVolume" />
            </Text>
          </View>

          {/* Data Rows */}
          {graphData?.whatIfParameters?.map((row: any, index: number) => {
            const performanceMetrics = categoriesColors?.find(
              (item: any) => item?.Resin == row?.Resin
            );
            console.log("performanceMetrics: ", performanceMetrics);

            return (
              <View
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  borderBottom: "1px solid #000",
                  borderLeft: "1px solid #000",
                  fontSize: 10,
                  height: "35px",
                }}
              >
                {row["section-weight"]?.map((value: number, i: number) => (
                  <Text
                    key={i}
                    // key={cellIndex}
                    style={{
                      flex: 1,
                      padding: 10,
                      borderRight: "1px solid #000",
                      textAlign: "center",
                      color: "#000",
                      // backgroundColor:
                      //   index === 4
                      //     ? "#FFD700" // ETL column #000
                      //     : index === 6
                      //     ? "#FF0000" // TS column red
                      //     : index === 8
                      //     ? "#FF0000" // Burst Volume column red
                      //     : "transparent",
                    }}
                  >
                    {value}
                  </Text>
                ))}
                <Text
                  // key={cellIndex}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRight: "1px solid #000",
                    textAlign: "center",
                    color: "#000",
                    backgroundColor: performanceMetrics?.ETLColorCategory,
                    // backgroundColor:{performanceMetrics.E}
                    // backgroundColor:
                    //   index === 4
                    //     ? "#FFD700" // ETL column #000
                    //     : index === 6
                    //     ? "#FF0000" // TS column red
                    //     : index === 8
                    //     ? "#FF0000" // Burst Volume column red
                    //     : "transparent",
                  }}
                >
                  {performanceMetrics?.ETL?.toFixed(2)}
                </Text>
                <Text
                  // key={cellIndex}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRight: "1px solid #000",
                    textAlign: "center",
                    color: "#000",
                    backgroundColor: performanceMetrics?.FTLColorCategory,
                    // backgroundColor:
                    //   index === 4
                    //     ? "#FFD700" // ETL column #000
                    //     : index === 6
                    //     ? "#FF0000" // TS column red
                    //     : index === 8
                    //     ? "#FF0000" // Burst Volume column red
                    //     : "transparent",
                  }}
                >
                  {performanceMetrics?.FTL?.toFixed(2)}
                </Text>
                <Text
                  // key={cellIndex}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRight: "1px solid #000",
                    textAlign: "center",
                    color: "#000",
                    backgroundColor: performanceMetrics?.thermalStabilityColor,
                    // backgroundColor:
                    //   index === 4
                    //     ? "#FFD700" // ETL column #000
                    //     : index === 6
                    //     ? "#FF0000" // TS column red
                    //     : index === 8
                    //     ? "#FF0000" // Burst Volume column red
                    //     : "transparent",
                  }}
                >
                  {performanceMetrics?.ThermalStability?.toFixed(2)}
                </Text>
                <Text
                  // key={cellIndex}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRight: "1px solid #000",
                    textAlign: "center",
                    color: "#000",
                    backgroundColor: performanceMetrics?.BurstColorCategory,
                    // backgroundColor:
                    //   index === 4
                    //     ? "#FFD700" // ETL column #000
                    //     : index === 6
                    //     ? "#FF0000" // TS column red
                    //     : index === 8
                    //     ? "#FF0000" // Burst Volume column red
                    //     : "transparent",
                  }}
                >
                  {performanceMetrics?.Burst?.toFixed(2)}
                </Text>
                <Text
                  // key={cellIndex}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRight: "1px solid #000",
                    textAlign: "center",
                    color: "#000",
                    backgroundColor: performanceMetrics?.BurstVolumeColor,
                    // backgroundColor:
                    //   index === 4
                    //     ? "#FFD700" // ETL column #000
                    //     : index === 6
                    //     ? "#FF0000" // TS column red
                    //     : index === 8
                    //     ? "#FF0000" // Burst Volume column red
                    //     : "transparent",
                  }}
                >
                  {performanceMetrics?.BurstVolume?.toFixed(2)}
                </Text>
              </View>
            );
          })}
        </Page>
      )}
    </Document>
  );
};

export default PDFDocument;

const DarkText = ({
  text,
  smallFont,
  header,
}: {
  text: string | number;
  smallFont?: boolean;
  header?: boolean;
}) => {
  if (typeof text !== "string") return null; // Ensure text is a string before proceeding

  // Format the text inline
  const formattedText = text.split("\\n").join("\n");

  return (
    <Text
      style={{
        color: header ? "grey" : "#000",
        paddingTop: header ? 10 : undefined,
        marginLeft: 5,
        marginRight: 5,
        fontSize: smallFont ? 8 : 10,
      }}
    >
      {formattedText}
    </Text>
  );
};
