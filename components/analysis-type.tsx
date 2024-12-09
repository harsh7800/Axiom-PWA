/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FormControl, FormField, FormItem } from "./ui/form";
import { Checkbox } from "./ui/checkbox";

const AnalysisType = ({
  control,
  getValues,
}: {
  control: any;
  getValues: (e?: string) => boolean;
}) => {
  return (
    <div className=" w-[95%] border border-states-disabled rounded-2xl ">
      <h1 className="semi-bold-16 border-b px-5 py-3 bg-states-disabled text-left rounded-t-2xl">
        Analysis Type
      </h1>
      <div className="px-5 py-8 flex-center flex-col sm:flex-row justify-between lg:justify-start gap-5 sm:gap-10">
        <FormField
          control={control}
          name="analysisType.resinComparison"
          render={({ field }) => {
            const ischecked = getValues("analysisType.resinComparison");
            return (
              <FormItem className="space-y-0 w-full ">
                <FormControl>
                  <div className="flex items-center sm:justify-center lg:justify-start gap-2">
                    <Checkbox
                      checked={ischecked}
                      id="resinComparison"
                      onCheckedChange={(value: boolean) => {
                        field.onChange(value);
                      }}
                    />
                    <label
                      htmlFor="resinComparison"
                      className="font-semibold text-md text-[#555765] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                    >
                      Resin Comparision
                    </label>
                  </div>
                </FormControl>
              </FormItem>
            );
          }}
        />

        <FormField
          control={control}
          name="analysisType.performanceModel"
          render={({ field }) => {
            const ischecked = getValues("analysisType.performanceModel");

            return (
              <FormItem className="space-y-0  w-full">
                <FormControl>
                  <div className="flex items-center sm:justify-center lg:justify-start gap-2">
                    <Checkbox
                      id="performanceModel"
                      checked={ischecked}
                      onCheckedChange={(value: boolean) => {
                        field.onChange(value);
                      }}
                    />
                    <label
                      htmlFor="performanceModel"
                      className="font-semibold text-md text-[#555765] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                    >
                      Performance Model
                    </label>
                  </div>
                </FormControl>
              </FormItem>
            );
          }}
        />

        <FormField
          control={control}
          name="analysisType.colourModel"
          render={({ field }) => {
            const ischecked = getValues("analysisType.colourModel");
            return (
              <FormItem className="space-y-0 w-full">
                <FormControl>
                  <div className="flex items-center sm:justify-center lg:justify-start gap-2">
                    <Checkbox
                      checked={ischecked}
                      id="colourModel"
                      onCheckedChange={(value: boolean) => {
                        field.onChange(value);
                      }}
                    />
                    <label
                      htmlFor="colourModel"
                      className="font-semibold text-md text-[#555765] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                    >
                      Colour Model
                    </label>
                  </div>
                </FormControl>
              </FormItem>
            );
          }}
        />
        <div className="w-full invisible"></div>
      </div>
    </div>
  );
};

export default AnalysisType;
