/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { MultipleSelect } from "./multi-select";
import LabelTooltip from "./label-tooltip";
import { InputDetailsFormValuesType } from "@/types/inputformtype";
import { useInputFormData } from "@/store/zustand-store";

const MaterialInfo = ({
  control,
  getValues,
  data,
  setValue,
}: {
  control: any;
  data: any;
  getValues: (e?: string) => InputDetailsFormValuesType;
  setValue: any;
}) => {
  const inputData = useInputFormData((state) => state.inputData);
  const isPerformanceModelEnabled = getValues("analysisType.performanceModel");
  const isResinComparsonEnabled = getValues("analysisType.resinComparison");

  return (
    <div className=" grid grid-cols-1 w-[95%] border border-states-disabled rounded-2xl space-y-0 pb-5">
      <h1 className="semi-bold-16 border-b px-5 py-3 bg-states-disabled text-left rounded-t-2xl">
        Material Information
      </h1>

      <div className=" space-y-5 sm:space-y-0 w-full p-5 block sm:flex flex-wrap md:flex-nowrap gap-y-2 gap-x-5 lg:gap-10 items-center">
        <FormField
          control={control}
          name="materialInfo.bottle"
          render={({ field }) => {
            return (
              <FormItem className="space-y-2 w-full truncate">
                <FormLabel className="font-semibold text-label select-none text-md">
                  Bottle
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} {...field}>
                    <SelectTrigger
                      className={cn(
                        "w-full h-[49px] rounded-[8px] border-border-1 regular-14 text-black select-none"
                      )}
                    >
                      <SelectValue
                        placeholder="Select"
                        className="text-black font-semibold sm:text-placeholder"
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-[8px] text-placeholder">
                      {data?.bottles?.map(
                        (item: { id: string; bottle_design: string }) => {
                          const selected = getValues().materialInfo.bottle;
                          return (
                            <SelectItem
                              key={item.id}
                              value={item.bottle_design}
                              className={cn("capitalize text-placeholder")}
                              style={{
                                background:
                                  selected === item.bottle_design
                                    ? "#EDF5FF"
                                    : "#fff",
                              }}
                            >
                              {item.bottle_design}
                            </SelectItem>
                          );
                        }
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={control}
          name="materialInfo.preform"
          render={({ field }) => (
            <FormItem className="space-y-2 w-full">
              <FormLabel className="font-semibold text-label select-none text-md">
                Preform
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full h-[49px] rounded-[8px] border-border-1 regular-14 text-black select-none"
                    )}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-[8px] p-0">
                    {data?.preforms?.map(
                      (item: { id: string; preform_name: string }) => {
                        const selected = getValues().materialInfo.preform;
                        return (
                          <SelectItem
                            key={item.id}
                            value={item.preform_name}
                            className={cn("capitalize text-placeholder")}
                            style={{
                              background:
                                selected === item.preform_name
                                  ? "#EDF5FF"
                                  : "#fff",
                            }}
                          >
                            {item.preform_name}
                          </SelectItem>
                        );
                      }
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={!isResinComparsonEnabled}
          control={control}
          name="materialInfo.massFlowRate"
          render={({ field }) => {
            return (
              <FormItem className="space-y-2 w-full">
                <FormLabel className="font-semibold flex items-center gap-1 text-label select-none text-md">
                  Mass Flow Rate{" "}
                  <span>
                    <LabelTooltip content="Rate of air entering preform during SBM, allowable range 5-20 g/s" />
                  </span>
                </FormLabel>
                <FormControl>
                  <div
                    className={cn(
                      "relative space-y-2 rounded-[8px] ",
                      !isResinComparsonEnabled && `bg-states-disabled`
                    )}
                  >
                    <Input
                      {...field}
                      inputMode="numeric"
                      // defaultValue="20"
                      type="text"
                      placeholder="Enter Value"
                      className="input h-[49px] border border-border-1 rounded-2xl"
                    />
                    <p className="absolute bottom-3 right-2 regular-14 text-placeholder">
                      g/s
                    </p>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          disabled={!isResinComparsonEnabled}
          control={control}
          name="materialInfo.stretchRodSpeed"
          render={({ field }) => {
            return (
              <FormItem className="space-y-2  w-full">
                <FormLabel className="font-semibold flex items-center gap-1 text-label select-none text-md">
                  Stretch Rod Speed
                  <span>
                    <LabelTooltip content="Dependant on bottle production rate, allowable range 1-2 m/s" />
                  </span>
                </FormLabel>
                <FormControl>
                  <div
                    className={cn(
                      "relative space-y-2 rounded-[8px] ",
                      !isResinComparsonEnabled && `bg-states-disabled`
                    )}
                  >
                    <Input
                      inputMode="numeric"
                      type="text"
                      defaultValue="1.3"
                      {...field}
                      placeholder="Enter Value"
                      className="input h-[49px] border border-border-1 rounded-2xl "
                    />
                    <p className="absolute bottom-3 right-2 regular-14 text-placeholder">
                      m/s
                    </p>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>

      <div className="space-y-5 sm:space-y-0 w-full px-5 block md:flex gap-5 lg:gap-10">
        <FormField
          disabled={!isPerformanceModelEnabled && !isResinComparsonEnabled}
          control={control}
          name="materialInfo.location"
          render={({ field }) => {
            return (
              <FormItem className="space-y-2 w-full md:w-1/4">
                <FormLabel className="font-semibold flex items-center gap-1 text-label select-none text-md">
                  Location{" "}
                  {/* <span>
                    <LabelTooltip content="This is Location" />
                  </span> */}
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);

                      // Find the selected location's data
                      const locationData = data.locations?.find(
                        (location: any) => location.location === value
                      );

                      if (locationData) {
                        // Update the massFlowRate value in the form
                        setValue(
                          "materialInfo.massFlowRate",
                          locationData.massFlowRate
                        );
                        setValue(
                          "materialInfo.stretchRodSpeed",
                          locationData.SRS
                        );
                      }
                    }}
                    {...field}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full h-[49px] rounded-[8px] border-border-1 regular-14 text-black select-none",
                        !isPerformanceModelEnabled &&
                          !isResinComparsonEnabled &&
                          "bg-states-disabled border-border-0"
                      )}
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-[8px] ">
                      {data.locations?.map(
                        (item: { id: string; location: string }) => {
                          const selected = getValues().materialInfo.location;
                          return (
                            <SelectItem
                              key={item.id}
                              value={item.location}
                              className={cn("capitalize text-placeholder")}
                              style={{
                                background:
                                  selected === item.location
                                    ? "#EDF5FF"
                                    : "#fff",
                              }}
                            >
                              {item.location}
                            </SelectItem>
                          );
                        }
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          disabled={!isPerformanceModelEnabled && !isResinComparsonEnabled}
          control={control}
          name="materialInfo.machine"
          render={({ field }) => {
            return (
              <FormItem className="space-y-2  w-full md:w-1/4">
                <FormLabel className="font-semibold flex items-center gap-1 text-label select-none text-md">
                  Machine{" "}
                  {/* <span>
                    <LabelTooltip content="This is Machine" />
                  </span> */}
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);

                      // Find the selected location's data
                      const locationData = data.locations.find(
                        (location: any) => location.machine === value
                      );

                      if (locationData) {
                        // Update the massFlowRate value in the form
                        setValue(
                          "materialInfo.massFlowRate",
                          locationData.massFlowRate
                        );
                        setValue(
                          "materialInfo.stretchRodSpeed",
                          locationData.SRS
                        );
                      }
                    }}
                    {...field}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full h-[49px] rounded-[8px] border-border-1 regular-14 text-black select-none",
                        !isPerformanceModelEnabled &&
                          !isResinComparsonEnabled &&
                          "bg-states-disabled border-border-0"
                      )}
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-[8px] ">
                      {data?.locations?.map(
                        (item: { id: string; machine: string }) => {
                          const selected = getValues().materialInfo.machine;
                          return (
                            <SelectItem
                              key={item.id}
                              value={item.machine}
                              className={cn("capitalize text-placeholder")}
                              style={{
                                background:
                                  selected === item.machine
                                    ? "#EDF5FF"
                                    : "#fff",
                              }}
                            >
                              {item.machine}
                            </SelectItem>
                          );
                        }
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={control}
          name="materialInfo.reference_resin"
          render={({ field }) => {
            return (
              <FormItem className="space-y-2 w-full md:w-1/4 truncate">
                <FormLabel className="font-semibold text-label select-none text-md">
                  Reference Resin
                </FormLabel>
                <FormControl>
                  <MultipleSelect
                    maxSelectLimit={1}
                    value={
                      field.value ||
                      inputData?.materialInfo?.reference_resin ||
                      [] // Default to an empty array
                    }
                    data={data?.resins?.filter((item: any) => {
                      // Filter out selected comparison resins
                      const selectedComparisonResins =
                        getValues()?.materialInfo?.resins?.map(
                          (resin: string) => resin.toLowerCase()
                        ) || [];
                      return !selectedComparisonResins.includes(
                        item.resin_name.toLowerCase()
                      );
                    })}
                    onChange={field.onChange} // Pass the onChange handler
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={control}
          name="materialInfo.resins"
          render={({ field }) => {
            return (
              <FormItem className="space-y-2 w-full md:w-1/4 truncate">
                <FormLabel className="font-semibold text-label select-none text-md">
                  Resins
                </FormLabel>
                <FormControl>
                  <MultipleSelect
                    maxSelectLimit={2}
                    value={field.value || inputData?.materialInfo?.resins || []}
                    data={data?.resins?.filter((item: any) => {
                      // Filter out selected reference resin
                      const selectedReferenceResin =
                        getValues()?.materialInfo?.reference_resin?.[0]?.toLowerCase() ||
                        "";
                      return (
                        item.resin_name.toLowerCase() !== selectedReferenceResin
                      );
                    })}
                    onChange={field.onChange} // Pass the onChange handler
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>

      {/* <div className="w-full px-5 pb-5 block md:hidden truncate">
        <FormField
          control={control}
          name="materialInfo.resins"
          render={({ field }) => {
            return (
              <FormItem className="space-y-2">
                <FormLabel className="font-semibold text-label select-none text-md">
                  Resins
                </FormLabel>
                <FormControl>
                  <MultipleSelect
                    value={field.value || inputData?.materialInfo?.resins}
                    data={data.resins}
                    onChange={field.onChange} // Pass the onChange handler
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div> */}
    </div>
  );
};

export default MaterialInfo;
