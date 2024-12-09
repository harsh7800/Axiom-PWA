/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

interface InputDetailsFormValuesType {
  analysisType: {
    resinComparison?: boolean;
    performanceModel?: boolean;
    colourModel?: boolean;
  };
  materialInfo: {
    bottle: string | undefined;
    preform: string | undefined;
    resins: string[];
    reference_resin: string[];
    location: string | undefined;
    machine: string | undefined;
    stretchRodSpeed: string | undefined;
    massFlowRate: string | undefined;
  };
  bottleMeasurement: {
    sectionWeights: {
      shoulder: string | undefined;
      label: string | undefined;
      grip: string | undefined;
      base: string | undefined;
    };
    thickness: {
      t1: string | undefined;
      t2: string | undefined;
      t3: string | undefined;
      t4: string | undefined;
    };
  };
  preformColor: {
    l: string | undefined;
    a: string | undefined;
    b: string | undefined;
    haze: string | undefined;
  };
  creepParameters: {
    gasVolume: string | undefined;
  };
}

const PreformAndCeeep = ({
  control,
  getValues,
}: {
  control: any;
  getValues: (e?: string) => InputDetailsFormValuesType;
}) => {
  const isPerformanceModelEnabled = getValues("analysisType.performanceModel");
  const isColourModelEnabled = getValues("analysisType.colourModel");

  return (
    <div className="w-[95%] flex flex-col md:flex-row gap-10 mb-4">
      {/* //------Preform Colour -------*/}

      <div className="w-full md:w-1/2 space-y-5 border border-states-disabled pb-5 rounded-2xl">
        <h1 className="semi-bold-16 text-text-2 border-b px-5 py-3 bg-states-disabled text-left rounded-t-2xl whitespace-nowrap">
          Preform Colour
        </h1>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 justify-between px-5">
          <FormField
            disabled={!isColourModelEnabled}
            control={control}
            name="preformColor.l"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="font-semibold text-md text-[#555765]">
                    L
                  </FormLabel>
                  <FormControl
                    className={cn(
                      "relative space-y-2 rounded-[8px] ",
                      !isColourModelEnabled && `bg-states-disabled`
                    )}
                  >
                    <div className="relative space-y-2">
                      <Input
                        inputMode="numeric"
                        type="text"
                        {...field}
                        placeholder="Value"
                        className="input border border-border-1 rounded-2xl "
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            disabled={!isColourModelEnabled}
            control={control}
            name="preformColor.a"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="font-semibold text-md text-[#555765]">
                    a
                  </FormLabel>
                  <FormControl
                    className={cn(
                      "relative space-y-2 rounded-[8px] ",
                      !isColourModelEnabled && `bg-states-disabled`
                    )}
                  >
                    <div className="relative space-y-2">
                      <Input
                        inputMode="numeric"
                        type="text"
                        {...field}
                        placeholder="Value"
                        className="input border border-border-1 rounded-2xl "
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            disabled={!isColourModelEnabled}
            control={control}
            name="preformColor.b"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="font-semibold text-md text-[#555765]">
                    b
                  </FormLabel>
                  <FormControl
                    className={cn(
                      "relative space-y-2 rounded-[8px] ",
                      !isColourModelEnabled && `bg-states-disabled`
                    )}
                  >
                    <div className="relative space-y-2">
                      <Input
                        inputMode="numeric"
                        type="text"
                        {...field}
                        placeholder="Value"
                        className="input border border-border-1 rounded-2xl "
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            disabled={!isColourModelEnabled}
            control={control}
            name="preformColor.haze"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="font-semibold text-md text-[#555765]">
                    Haze
                  </FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        "relative space-y-2 rounded-[8px] ",
                        !isColourModelEnabled && `bg-states-disabled`
                      )}
                    >
                      <Input
                        {...field}
                        inputMode="numeric"
                        type="text"
                        placeholder="Value"
                        className="input border border-border-1 rounded-2xl "
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
      </div>

      {/*--------- Creep Parameters------- */}
      <div className="w-full md:w-1/2 space-y-5 border border-states-disabled pb-5 rounded-2xl">
        <h1 className="semi-bold-16 text-text-2 border-b px-5 py-3 bg-states-disabled text-left rounded-t-2xl whitespace-nowrap">
          Creep Parameters
        </h1>

        <FormField
          disabled={!isPerformanceModelEnabled}
          control={control}
          name="creepParameters.gasVolume"
          render={({ field }) => {
            return (
              <FormItem className="w-full sm:w-1/2 px-5 rounded-2xl">
                <FormLabel className="font-semibold text-md text-[#555765]">
                  Gas Volume
                </FormLabel>
                <FormControl>
                  <div
                    className={cn(
                      "rounded-[8px]",
                      !isPerformanceModelEnabled && `bg-states-disabled `
                    )}
                  >
                    <Input
                      {...field}
                      id="gasVolume"
                      inputMode="numeric"
                      type="text"
                      placeholder="Value"
                      className="input border border-border-1 rounded-2xl "
                    />
                    {/* <p className="absolute bottom-2 right-2 regular-14 text-placeholder">
                      mm
                    </p> */}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
    </div>
  );
};

export default PreformAndCeeep;
