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
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { InputDetailsFormValuesType } from "@/types/inputformtype";
import { useInputFormData } from "@/store/zustand-store";
import CsvUploader from "./template-uploader";

const BottleMeasurement = ({
  control,
  getValues,
  fullSize,
  performanceModel,
  isLoading,
  onSubmit,
}: {
  control: any;
  getValues: (e?: string) => InputDetailsFormValuesType;
  fullSize?: boolean;
  performanceModel: boolean;
  isLoading?: boolean;
  onSubmit?: any;
}) => {
  const { inputData } = useInputFormData((state) => state);
  // // // console.log(getValues().bottleMeasurement.sectionWeights);
  const sectionWeights = getValues("bottleMeasurement.sectionWeights");
  const weights = Object.values(sectionWeights ?? {}).map((weight) =>
    parseFloat(weight || "0")
  );
  const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);

  const preformValue = parseFloat(
    getValues()?.materialInfo?.preform?.match(/_(\d+(\.\d+)?)$/)?.[1] ||
      inputData.materialInfo.preform?.match(/_(\d+(\.\d+)?)$/)?.[1] ||
      "0"
  );
  const isValid =
    totalWeight >= preformValue - 0.3 && totalWeight <= preformValue + 0.3;
  return (
    <div
      className={cn(
        " space-y-5 w-full border border-states-disabled md:w-1/2  rounded-2xl pb-5",
        fullSize && "md:w-full"
      )}
    >
      <h1 className="semi-bold-16 text-text-2 border-b px-5 py-3 bg-states-disabled text-left rounded-t-2xl">
        Bottle Measurement
      </h1>
      <div className="flex flex-col sm:flex-row justify-between px-5 gap-5 lg:gap-10">
        {/* --------//Section Weights (g)----- */}
        <div className="w-full md:w-1/2 space-y-5">
          <h2 className="semi-bold-16 text-[#555765] whitespace-nowrap text-left">
            Section Weights (g)
          </h2>

          <FormField
            disabled={!performanceModel}
            control={control}
            name="bottleMeasurement.sectionWeights.shoulder"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="font-semibold text-md text-[#555765]">
                    Shoulder
                  </FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        "relative space-y-2 rounded-[8px] ",
                        !performanceModel && `bg-states-disabled`
                      )}
                    >
                      <Input
                        inputMode="numeric"
                        type="text"
                        {...field}
                        placeholder="Enter Value"
                        className="input border border-border-1 rounded-2xl "
                      />
                      <p className="absolute bottom-2 right-2 regular-14 text-placeholder">
                        g
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            disabled={!performanceModel}
            control={control}
            name="bottleMeasurement.sectionWeights.label"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="font-semibold text-md text-[#555765]">
                    Label
                  </FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        "relative space-y-2 rounded-[8px] ",
                        !performanceModel && `bg-states-disabled`
                      )}
                    >
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter Value"
                        className="input border border-border-1 rounded-2xl "
                      />
                      <p className="absolute bottom-2 right-2 regular-14 text-placeholder">
                        g
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            disabled={!performanceModel}
            control={control}
            name="bottleMeasurement.sectionWeights.grip"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="font-semibold text-md text-[#555765]">
                    Grip
                  </FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        "relative space-y-2 rounded-[8px] ",
                        !performanceModel && `bg-states-disabled`
                      )}
                    >
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter Value"
                        className="input border border-border-1 rounded-2xl "
                      />
                      <p className="absolute bottom-2 right-2 regular-14 text-placeholder">
                        g
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            disabled={!performanceModel}
            control={control}
            name="bottleMeasurement.sectionWeights.base"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="font-semibold text-md text-[#555765]">
                    Base
                  </FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        "relative space-y-2 rounded-[8px] ",
                        !performanceModel && `bg-states-disabled`
                      )}
                    >
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter Value"
                        className="input border border-border-1 rounded-2xl "
                      />
                      <p className="absolute bottom-2 right-2 regular-14 text-placeholder">
                        g
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        {/* --------//Thickness (mm)----- */}
        <div className="w-full md:w-1/2 space-y-5 ">
          <h2 className="semi-bold-16 text-[#555765] whitespace-nowrap text-left">
            Thickness (mm){" "}
            {/* <span>
              <Badge className="w-fit text-white bg-blue border border-blue text-sm">
                Optional
              </Badge>
            </span> */}
          </h2>

          <FormField
            disabled={!performanceModel}
            control={control}
            name="bottleMeasurement.thickness.t1"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="font-semibold text-md text-[#555765]">
                    T1{" "}
                  </FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        "relative space-y-2 rounded-[8px] ",
                        !performanceModel && `bg-states-disabled`
                      )}
                    >
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter Value"
                        className="input border border-border-1 rounded-2xl "
                      />
                      <p className="absolute bottom-2 right-2 regular-14 text-placeholder">
                        mm
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage className="text-states-error"></FormMessage>
                </FormItem>
              );
            }}
          />

          <FormField
            disabled={!performanceModel}
            control={control}
            name="bottleMeasurement.thickness.t2"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="font-semibold text-md text-[#555765]">
                    T2
                  </FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        "relative space-y-2 rounded-[8px] ",
                        !performanceModel && `bg-states-disabled`
                      )}
                    >
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter Value"
                        className="input border border-border-1 rounded-2xl "
                      />
                      <p className="absolute bottom-2 right-2 regular-14 text-placeholder">
                        mm
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            disabled={!performanceModel}
            control={control}
            name="bottleMeasurement.thickness.t3"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="font-semibold text-md text-[#555765]">
                    T3
                  </FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        "relative space-y-2 rounded-[8px] ",
                        !performanceModel && `bg-states-disabled`
                      )}
                    >
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter Value"
                        className="input border border-border-1 rounded-2xl "
                      />
                      <p className="absolute bottom-2 right-2 regular-14 text-placeholder">
                        mm
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            disabled={!performanceModel}
            control={control}
            name="bottleMeasurement.thickness.t4"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="font-semibold text-md text-[#555765]">
                    T4
                  </FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        "relative space-y-2 rounded-[8px] ",
                        !performanceModel && `bg-states-disabled`
                      )}
                    >
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter Value"
                        className="input border border-border-1 rounded-2xl "
                      />
                      <p className="absolute bottom-2 right-2 regular-14 text-placeholder">
                        mm
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
      </div>
      {fullSize && (
        <div className="w-full">
          <Button
            disabled={isLoading}
            onClick={onSubmit}
            type="submit"
            className="bg-blue ml-5 text-white p-3 rounded-[5px] hover:bg-blue hover:opacity-70 transition-all"
          >
            {isLoading && <Loader2 className="animate-spin mr-3" size={20} />}
            {!isLoading ? " Re Compute" : "Re Computing..."}
          </Button>
        </div>
      )}

      {!fullSize && <CsvUploader />}
      {performanceModel && !isValid && (
        <p className="semi-bold-14 text-states-error text-left pl-5">
          The total of section weights must be within +0.3 or -0.3 of selected
          preform weights.
        </p>
      )}
    </div>
  );
};

export default BottleMeasurement;
