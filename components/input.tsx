/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGraphPlotData, useInputFormData } from "@/store/zustand-store";
import { Form } from "./ui/form";
// import sample from "@/dataOut.json";
import { toast } from "sonner";
import AnalysisType from "./analysis-type";
import MaterialInfo from "./material-info";
import PreformAndCeeep from "./preform-creep";
import Footer from "./footer";
import { inputformSchema } from "@/app/schema/inputForm.schema";
import { InputDetailsFormValuesType } from "@/types/inputformtype";
import BottleMeasurement from "./bottle-measurements";
import ReferenceImg from "./reference-img";
// import { useGraphPlotDataFetcher } from "@/helpers/getGraphPlotData";
import chartData from "@/sample.json";
const InputComp = ({ data }: { data: any }) => {
  const router = useRouter();
  const { inputData } = useInputFormData((state) => state);
  const { updateGraphData } = useGraphPlotData((state) => state);
  const [isPending] = useTransition();

  const inputForm = useForm<InputDetailsFormValuesType>({
    resolver: zodResolver(inputformSchema),
    mode: "onChange",
    disabled: isPending,
    defaultValues: {
      analysisType: {
        resinComparison: true,
        performanceModel: true,
        colourModel: true,
      },
      materialInfo: {
        bottle: inputData.materialInfo.bottle ?? "",
        preform: inputData.materialInfo.preform ?? "",
        resins: inputData.materialInfo.resins ?? [],
        location: inputData.materialInfo.location ?? "",
        machine: inputData.materialInfo.machine ?? "",
        stretchRodSpeed: "1.3",
        massFlowRate: "20",
      },
      bottleMeasurement: {
        sectionWeights: { shoulder: "", label: "", grip: "", base: "" },
        thickness: { t1: "", t2: "", t3: "", t4: "" },
      },
      preformColor: { l: "", a: "", b: "", haze: "" },
      creepParameters: { gasVolume: "" },
    },
    shouldUnregister: true,
  });

  const {
    control,
    getValues,
    setValue,
    formState: { isValid, errors },
    handleSubmit,
    reset,
  } = inputForm;

  useEffect(() => {
    if (inputData) {
      reset({
        analysisType: {
          resinComparison: inputData?.analysisType?.resinComparison ?? true,
          performanceModel: inputData?.analysisType?.performanceModel ?? true,
          colourModel: inputData?.analysisType?.colourModel ?? true,
        },
        materialInfo: {
          bottle: inputData?.materialInfo?.bottle,
          preform: inputData?.materialInfo?.preform,
          resins: inputData?.materialInfo?.resins,
          location: inputData?.materialInfo?.location,
          machine: inputData?.materialInfo?.machine,
          stretchRodSpeed: inputData?.materialInfo?.stretchRodSpeed ?? "1.3",
          massFlowRate: inputData?.materialInfo?.massFlowRate ?? "20",
        },
        bottleMeasurement: {
          sectionWeights: {
            shoulder:
              inputData?.bottleMeasurement?.sectionWeights?.shoulder ?? "",
            label: inputData?.bottleMeasurement?.sectionWeights?.label ?? "",
            grip: inputData?.bottleMeasurement?.sectionWeights?.grip ?? "",
            base: inputData?.bottleMeasurement?.sectionWeights?.base ?? "",
          },
          thickness: {
            t1: inputData?.bottleMeasurement?.thickness?.t1 ?? "",
            t2: inputData?.bottleMeasurement?.thickness?.t2 ?? "",
            t3: inputData?.bottleMeasurement?.thickness?.t3 ?? "",
            t4: inputData?.bottleMeasurement?.thickness?.t4 ?? "",
          },
        },
        preformColor: {
          l: inputData?.preformColor?.l ?? "",
          a: inputData?.preformColor?.a ?? "",
          b: inputData?.preformColor?.b ?? "",
          haze: inputData?.preformColor?.haze ?? "",
        },
        creepParameters: {
          gasVolume: inputData?.creepParameters?.gasVolume ?? "",
        },
      });
    }
  }, [inputData, reset]);

  console.log(errors);

  // const onSubmit = useCallback(
  //   async (formData: InputDetailsFormValuesType) => {
  //     StartTransition(async () => {
  //       const sectionWeight = [
  //         Number(formData.bottleMeasurement.sectionWeights.shoulder),
  //         Number(formData.bottleMeasurement.sectionWeights.label),
  //         Number(formData.bottleMeasurement.sectionWeights.grip),
  //         Number(formData.bottleMeasurement.sectionWeights.base),
  //       ];

  //       const thicknessData = [
  //         Number(formData.bottleMeasurement.thickness.t1),
  //         Number(formData.bottleMeasurement.thickness.t2),
  //         Number(formData.bottleMeasurement.thickness.t3),
  //         Number(formData.bottleMeasurement.thickness.t4),
  //       ];

  //       const data = {
  //         analysisType: {
  //           resinComparision: formData.analysisType.resinComparison,
  //           performanceModel: formData.analysisType.performanceModel,
  //           colorModel: formData.analysisType.colourModel,
  //         },
  //         bottle: formData.materialInfo.bottle,
  //         preform: formData.materialInfo.preform,
  //         resinList: [
  //           ...formData.materialInfo.reference_resin,
  //           ...formData.materialInfo.resins,
  //         ],
  //         sectionWeight: sectionWeight,
  //         thicknessData: thicknessData,
  //         gasVolume: Number(formData.creepParameters.gasVolume),
  //         location: formData.materialInfo.location,
  //         machine: formData.materialInfo.machine,
  //         stretchRodSpeed: Number(formData.materialInfo.stretchRodSpeed),
  //         massFlowRate: Number(formData.materialInfo.massFlowRate),
  //       };

  //       const responseText = await getGraphPlotData(data);
  //       if (responseText) {
  //         // // console.log(responseText);
  //         updateInputData(formData);
  //         updateGraphData(responseText);
  //         router.push("/chart-model?from=new-project");
  //       } else {
  //         toast.error("Response is Required For Plotting Graphs");
  //       }
  //     });
  //   },
  //   // eslint-disable-next-line
  //   [data]
  // );

  const onSubmit = () => {
    updateGraphData(chartData);
    router.push("/chart-model?from=new-project");
    toast.success("Charts Generated");
  };

  return (
    <Form {...inputForm}>
      <form
        // onSubmit={handleSubmit(onSubmit)}
        onSubmit={(e) => e.preventDefault()}
        className="min-w-[320px] w-full flex flex-col py-10 items-center space-y-10"
      >
        <AnalysisType getValues={getValues} control={control} />

        <MaterialInfo
          setValue={setValue}
          data={data}
          control={control}
          getValues={getValues}
        />

        <div className="w-[95%] flex flex-col-reverse md:flex-row gap-10 justify-between mt-10">
          <BottleMeasurement
            control={control}
            getValues={getValues}
            performanceModel={
              getValues("analysisType.performanceModel") || false
            }
          />

          <ReferenceImg
            align={false}
            bottle_design={getValues("materialInfo.bottle")}
          />
        </div>

        <PreformAndCeeep control={control} getValues={getValues} />

        <Footer handleSubmit={handleSubmit(onSubmit)} disabled={!isValid} />
      </form>
    </Form>
  );
};

export default InputComp;
