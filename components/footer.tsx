/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { FaArrowRightLong } from "react-icons/fa6";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { useSearchParams } from "next/navigation";
import { useInputFormData } from "@/store/zustand-store";
import { CreateProject } from "@/helpers/create-project";
import { EditProject } from "@/helpers/edit-project";
import { toast } from "sonner";
import { readUser } from "@/helpers/get-user-details";
import DownloadReport from "./download-report";

interface NavigatePropType {
  disabled?: boolean;
  handleSubmit?: () => void;
  cache?: any;
  isPending?: boolean;
}

const Footer: React.FC<NavigatePropType> = ({
  disabled,
  handleSubmit,
  isPending,
}) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("from");
  const id = searchParams.get("id");
  const router = useRouter();
  const location = usePathname();
  const [userName, setUserName] = useState("");
  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    async function getUserName() {
      const {
        data: { user },
      } = await readUser();
      setUserName(user?.user_metadata?.first_name);
    }
    getUserName();
  }, []);

  //funtion to submit & update the store for the inputData
  const { inputData, clearForm } = useInputFormData(
    useShallow((state) => state)
  );

  const handleClick = () => {
    startTransition(() => {
      if (location === "/chart-model") {
        handleFinish();
        // updateIsGenerating(false);
      } else {
        handleSubmit?.();
      }
      // cache = {};
    });
  };

  const newProject = {
    bottle: inputData.materialInfo.bottle || "",
    preform: inputData.materialInfo.preform || "",
    resins: [
      ...(inputData.materialInfo.reference_resin || []), // Fallback to an empty array
      ...(inputData.materialInfo.resins || []), // Fallback to an empty array
    ],
    created_by: userName,
    inputs: { inputData },
  };

  const showErrorToast = (description: string) => {
    router.push("/");
    toast.error(description);
  };

  const showSuccessToast = (description: string) => {
    toast.success(description);
  };

  const handleFinish = async () => {
    let res;

    try {
      if (search === "new-project") {
        res = await CreateProject(newProject);
      } else if (search === "edit-project") {
        if (id) {
          res = await EditProject(newProject, id);
        } else {
          showErrorToast("Missing Project ID");
          return;
        }
      } else if (search === "clone-project") {
        // // console.log(search);
        res = await CreateProject(newProject);
      } else {
        showErrorToast("Something Went Wrong. Try Again.");
        return;
      }

      if (res) {
        router.push("/");
        showSuccessToast(
          search === "new-project" || search === "clone-project"
            ? "Project Creation Successful."
            : "Project Edited Successfully."
        );
      } else {
        showErrorToast("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.log(error);
      showErrorToast("An unexpected error occurred. Please try again.");
    } finally {
      // updateGraphData({});
      clearForm();
      router.refresh();
    }
  };

  // const downloadDataAndCharts = async () => {
  //   // Download JSON data
  //   const jsonData = inputData;
  //   const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], {
  //     type: "application/json",
  //   });
  //   saveAs(jsonBlob, "data.json");

  //   // List of chart IDs to download

  //   // Download chart images
  //   for (const chartId of chartIds) {
  //     await downloadSVG(chartId);
  //   }
  // };

  // async function DownloadPDF() {
  //   DownloadTransition(async () => {
  //     let { success } = await generatePDFWithChartsAndData(
  //       // chartIds,
  //       inputData,
  //       refs
  //       // graphData
  //     );
  //     if (success) {
  //       toast({
  //         className: cn(
  //           "bottom-[calc(100%-85%)] left-5 hidden fixed w-[320px] bg-states-success text-white rounded-[8px] py-4 text-lg",
  //           location == "/chart-model" && "flex"
  //         ),
  //         icon: <CircleCheckBigIcon />,
  //         description: "Proposal downloaded successfully.",
  //       });
  //     } else {
  //       toast({
  //         className: cn(
  //           "bottom-[calc(100%-85%)] left-5 hidden fixed w-[320px] bg-states-error text-white rounded-[8px] py-4 text-lg",
  //           location == "/chart-model" && "flex"
  //         ),
  //         icon: <AlertTriangle />,
  //         description: "Error Downloading Proposal.",
  //       });
  //     }
  //   });
  // }

  const handleBackButton = () => {
    if (location === "/chart-model") {
      router.back();
      // updateIsGenerating(false);
    } else {
      clearForm();
      router.push("/");
    }
  };

  return (
    <div
      className={cn(
        "w-full h-fit sticky bottom-0 z-[1000] bg-white grid navigation-shadow sm:flex space-y-3 sm:space-y-0 sm:gap-5 sm:justify-end sm:items-center p-5 sm:p-8",
        location == "/chart-model" && "flex gap-4 flex-wrap space-y-0"
      )}
    >
      {location === "/chart-model" && (
        <div className="block sm:hidden w-full sm:w-fit">
          <DownloadReport />
        </div>
      )}

      <div className="w-full sm:w-fit gap-2 flex items-center">
        <Button
          className={cn(
            "w-full sm:w-fit bg-blue text-white hover:bg-white hover:text-blue hover:border-blue font-bold sm:font-semibold text-lg border-2 border-blue rounded-[8px] px-10",
            location === "/new-project" && "text-placeholder"
          )}
          onClick={handleBackButton}
        >
          Back
        </Button>

        {location === "/chart-model" && (
          <div className="hidden sm:block">
            <DownloadReport />
          </div>
        )}

        <Button
          // disabled={disabled || isPending}
          type="submit"
          onClick={handleClick}
          className={cn(
            "w-full sm:w-fit  bg-blue text-white hover:bg-white hover:text-blue hover:border-blue font-bold sm:font-semibold text-lg border-2 border-blue rounded-[8px] px-10"
            // (disabled || isPending) && "text-blue"
          )}
        >
          {isLoading && (
            <Loader2
              // color="#fff"
              className={cn(
                "animate-spin",
                (disabled || isPending) && "text-blue"
              )}
              size={20}
            />
          )}
          &nbsp;
          {location == "/chart-model" ? "Finish" : "Next"} &nbsp;
          {!isLoading && (
            <FaArrowRightLong
              className={cn(
                "block",
                location == "/chart-model" && "hidden",
                (disabled || isPending) && "text-blue"
              )}
              // color="#fff"
            />
          )}
        </Button>
      </div>
    </div>
  );
};

export default Footer;
